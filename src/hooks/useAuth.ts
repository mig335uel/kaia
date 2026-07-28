import { supabase } from "@/lib/supabase";
import { Profile } from "@/Types/Users";
import { useEffect, useState } from "react";



export default function useAuth() {
    const [user, setUser] = useState<Profile | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function getUser(userId: string) {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error) {
                console.log(error);
            }
            if (data && isMounted) {
                setUser(data);
            }
        }

        // Fetch initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user?.id) {
                getUser(session.user.id);
            }
        });

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user?.id) {
                    getUser(session.user.id);
                } else if (isMounted) {
                    setUser(null);
                }
            }
        );

        return () => {
            isMounted = false;
            authListener.subscription.unsubscribe();
        };
    }, []);

    return user;
}