import { Timestamp } from 'firebase/firestore';

export interface Chat {
  id: string; // ID del documento: userA_userB

  users: string[];
  createdAt?: Timestamp;
  createdAtEpoch: number;

  lastMessage: string;
  lastMessageTime?: Timestamp;

  isPermanent: boolean;
  likes: Record<string, boolean>;
}

export interface Message {
  id: string; // ID automático del documento

  senderId: string;
  text: string;
  timestamp?: Timestamp;
}