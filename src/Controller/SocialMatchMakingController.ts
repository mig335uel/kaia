import { supabase } from "@/lib/supabase";
import { buscarChat, cancelarBusqueda } from "@/Service/TextSocialMatchmakingService";

export class SocialMatchMakingController {
    /**
     * Cancelar la búsqueda cuando el usuario se sale o le da al botón.
     */
    async cancelarBusqueda(): Promise<void> {
        const {
            data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (currentUser != null) {
            await cancelarBusqueda(currentUser.id);
            console.log("Búsqueda cancelada para el usuario", currentUser.id);
        }
    }

    /**
     * Iniciar la búsqueda desde la UI.
     * Replica la lógica del TextMatchmakingcontroller de Flutter:
     * 1. Obtiene preferencias del usuario
     * 2. Obtiene género y fecha de nacimiento
     * 3. Calcula la edad
     * 4. Llama al service con todos los datos
     */
    async iniciarBusqueda(onMatchFound: (chatId: string) => void): Promise<void> {
        const {
            data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (currentUser == null) return;

        try {
            // 1. Obtener las preferencias
            const { data: prefResponse, error: prefError } = await supabase
                .from("user_preferences")
                .select("*")
                .eq("user_id", currentUser.id)
                .maybeSingle();

            if (prefError || prefResponse == null) {
                console.error("Error: El usuario no tiene preferencias creadas.", prefError);
                return;
            }

            // 2. Obtener datos del usuario (género y fecha de nacimiento)
            const { data: userResponse, error: userError } = await supabase
                .from("users")
                .select("gender, birth_date")
                .eq("id", currentUser.id)
                .maybeSingle();

            if (userError || userResponse == null) {
                console.error("Error: No se encontraron datos del usuario.", userError);
                return;
            }

            // Calcular edad aproximada
            const birthDate = new Date(userResponse.birth_date);
            const myAge = new Date().getFullYear() - birthDate.getFullYear();

            await buscarChat({
                miUserId: currentUser.id,
                miPreferenceId: prefResponse.id,
                myGender: userResponse.gender,
                myPrefGender: prefResponse.genderFeed,
                myAge,
                myMinAge: prefResponse.min_age_range,
                myMaxAge: prefResponse.max_age_range,
                onMatchFound,
            });
        } catch (e) {
            console.error("Error obteniendo datos para el match:", e);
        }
    }
}