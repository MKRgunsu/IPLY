export interface IdeaData {
  title: string;
  problem: string;      // 해결하려는 과제
  solution: string;     // 해결 수단
  effect: string;       // 발명의 효과
  files?: FileList | null;
  fileName?: string;
  updatedAt: string;
}

export interface ConsultationOption {
  type: 'chat' | 'phone' | 'visit';
  price: number;
  duration: number; // minutes
}

export interface Attorney {
  id: string;
  name: string;
  firm: string;
  specialty: string[];
  career: string[]; // 이력사항
  imageUrl: string;
  status: 'online' | 'offline';
  rating: number;
  reviewCount: number;
  consultationOptions: ConsultationOption[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'attorney' | 'ai';
  text: string;
  timestamp: number;
}

export interface ChatSession {
  attorneyId: string;
  messages: ChatMessage[];
}