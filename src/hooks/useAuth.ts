import { supabase } from "@/lib/supabase";
import { Profile } from "@/Types/Users";
import { useEffect, useState } from "react";



export default function useAuth(){
    const [user, setUser] = useState<Profile>({ 
        id: '',
        name: '',
        last_name: '',
        username: '',
        email: '',
        gender: "Male",
        birth_date: '',
        profile_image: '',
        city: '',
        country: '',
    });
    useEffect(() => {
        async function getUser(){
            const {data, error} = await supabase.from('users').select('*').eq('id', (await supabase.auth.getSession()).data.session?.user?.id).single();
            
            if(!data && error){
                console.log(error);
            }
            if(data){
                setUser(data);
            }
        }
        getUser();
    }, []);
    return user as Profile;
}