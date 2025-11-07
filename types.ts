
export enum Persona {
  ENGINEER = 'Engineer',
  DOCTOR = 'Doctor',
  CA_ASPIRANT = 'CA Aspirant',
  STUDENT = 'Student',
  PROGRAMMER = 'Programmer',
  LAWYER = 'Lawyer',
  SCIENTIST = 'Scientist',
  GENERAL = 'General Learner',
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  imageUrl?: string;
}

export interface PersonaOption {
    id: Persona;
    name: string;
    icon: React.ReactNode;
    color: string;
}

export interface ChatSession {
  id: string;
  title: string;
  persona: Persona;
  messages: Message[];
  timestamp: number;
  language: string;
}