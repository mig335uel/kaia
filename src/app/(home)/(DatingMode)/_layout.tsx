import { Stack } from "expo-router/build/stack";




export default function DatingModeLayout(){
    return (
      <Stack screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
      </Stack>  
    );


    
}