export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  latestScore?: number;
  vibeCheck?: string;
  createdAt: any;
  updatedAt: any;
}

export interface CreditAnalysis {
  id?: string;
  uid: string;
  score: number;
  vibeCheck: string;
  greenFlags: string[];
  redFlags: string[];
  rawInput: string;
  createdAt: any;
}
