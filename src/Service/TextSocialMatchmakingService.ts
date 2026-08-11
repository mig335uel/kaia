import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import firestore, { Timestamp } from "@react-native-firebase/firestore";

let matchChannel: RealtimeChannel | null = null;

/**
 * FUNCIÓN PRINCIPAL: Se ejecuta al pulsar el botón "Buscar"
 * Replica la lógica completa de buscarChat() del Flutter.
 */
export async function buscarChat(params: {
    miUserId: string;
    miPreferenceId: string;
    myGender: string;
    myPrefGender: string;
    myAge: number;
    myMinAge: number;
    myMaxAge: number;
    onMatchFound: (chatId: string) => void;
}): Promise<void> {
    const {
        miUserId,
        miPreferenceId,
        myGender,
        myPrefGender,
        myAge,
        myMinAge,
        myMaxAge,
        onMatchFound,
    } = params;

    try {
        // DEBUG: Ver exactamente qué le estamos mandando a Supabase
        console.log("=== DATOS ENVIADOS A SUPABASE ===");
        console.log("p_my_user_id:", miUserId);
        console.log("p_my_gender:", myGender);
        console.log("p_my_pref_gender:", myPrefGender);
        console.log("p_my_age:", myAge);
        console.log("p_my_min_age:", myMinAge);
        console.log("p_my_max_age:", myMaxAge);
        console.log("preference_id (para la cola):", miPreferenceId);
        console.log("=================================");

        // 1. Llamamos a la función SQL optimizada pasando TODOS los parámetros
        const { data: matchedUserId, error } = await supabase.rpc(
            "find_social_text_match",
            {
                p_my_user_id: miUserId,
                p_my_gender: myGender,
                p_my_pref_gender: myPrefGender,
                p_my_age: myAge,
                p_my_min_age: myMinAge,
                p_my_max_age: myMaxAge,
            }
        );

        if (error) {
            console.error("Error en RPC find_social_text_match:", error);
            return;
        }

        // DEBUG: Ver qué devuelve Supabase
        console.log("=== RESULTADO DE SUPABASE ===");
        console.log("matchedUserId:", matchedUserId, `(tipo: ${typeof matchedUserId})`);
        console.log("=============================");

        if (matchedUserId != null) {
            // ¡MATCH INSTANTÁNEO! Había alguien esperando que cumple los requisitos
            console.log("¡Match instantáneo! ID:", matchedUserId);

            const ids = [miUserId, matchedUserId.toString()].sort();
            const chatId = `${ids[0]}_${ids[1]}`;

            // 1.5 Crear el documento en Firestore antes de navegar
            await crearChatEnFirestore(chatId, miUserId, matchedUserId.toString());

            // Avisamos a la UI para que navegue
            onMatchFound(chatId);
        } else {
            // NO HAY MATCH INMEDIATO.
            console.log("No hay match inmediato. Insertando en cola y esperando...");

            // 2. Metemos al usuario en la cola de Supabase
            const { error: insertError } = await supabase
                .from("social_text_matchmaking")
                .upsert(
                    {
                        user_id: miUserId,
                        preference_id: miPreferenceId,
                    },
                    { onConflict: 'user_id' }
                );

            if (insertError) {
                console.error("Error insertando en cola:", insertError);
                return;
            }

            // 3. Activamos el socket para quedarnos esperando
            iniciarEscuchaDeMatch(miUserId, onMatchFound);
        }
    } catch (e) {
        console.error("Error buscando pareja:", e);
    }
}

/**
 * FUNCIÓN DE ESCUCHA (Cuando tú te quedas esperando en la cola)
 * Escucha UPDATEs en la fila del usuario para detectar cuando alguien hace match.
 */
function iniciarEscuchaDeMatch(
    miUserId: string,
    onMatchFound: (chatId: string) => void
): void {
    const channelName = `matchmaking_${miUserId}_${Date.now()}`;
    matchChannel = supabase
        .channel(channelName)
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "social_text_matchmaking",
                filter: `user_id=eq.${miUserId}`,
            },
            async (payload) => {
                const registroActualizado = payload.new as Record<string, unknown>;
                const matchedUserId = registroActualizado["matched_with"];

                if (matchedUserId != null) {
                    console.log(
                        "¡Alguien me encontró en la cola! ID del otro:",
                        matchedUserId
                    );

                    // 2. Cerramos el canal inmediatamente para no seguir escuchando
                    detenerEscucha();

                    // 3. Generamos el ID combinado para Firestore
                    const ids = [miUserId, matchedUserId.toString()].sort();
                    const chatId = `${ids[0]}_${ids[1]}`;

                    // 4. Creamos el documento en Firestore
                    await crearChatEnFirestore(chatId, miUserId, matchedUserId.toString());

                    // 5. Avisamos a la UI para navegar
                    onMatchFound(chatId);
                }
            }
        )
        .subscribe();
}

/**
 * Detiene la escucha del canal Realtime.
 */
function detenerEscucha(): void {
    if (matchChannel != null) {
        supabase.removeChannel(matchChannel);
        matchChannel = null;
    }
}

/**
 * Crea el documento de chat en Firestore con merge para evitar sobreescribir
 * si el otro usuario ya lo creó una fracción de segundo antes.
 */
async function crearChatEnFirestore(
    chatId: string,
    miUserId: string,
    matchedUserId: string
): Promise<void> {
    try {
        const docRef = firestore().collection("chats").doc(chatId);

        await docRef.set(
            {
                users: [miUserId, matchedUserId],
                createdAt: firestore.FieldValue.serverTimestamp(),
                createdAtEpoch: Date.now(),
                lastMessage: "",
                lastMessageTime: firestore.FieldValue.serverTimestamp(),
                // Datos para la mecánica de 5 minutos
                isPermanent: false,
                expireAt: Timestamp.now().toMillis() + 5 * 60 * 1000,
                likes: { [miUserId]: false, [matchedUserId]: false },
            },
            { merge: true }
        );

        console.log("Documento de chat creado en Firestore:", chatId);
    } catch (e) {
        console.error("Error al crear chat en Firestore:", e);
    }
}

/**
 * Cancela la búsqueda: detiene la escucha Realtime y elimina al usuario de la cola.
 */
export async function cancelarBusqueda(miUserId: string): Promise<void> {
    detenerEscucha();
    await supabase
        .from("social_text_matchmaking")
        .delete()
        .eq("user_id", miUserId);
}