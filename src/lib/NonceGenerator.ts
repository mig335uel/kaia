import * as Crypto from 'expo-crypto';



export default function rawNonce (){

    return Crypto.randomUUID();
} 