import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface Data {
  id: number;
  created_at: string;
  post_title: string;
  description: string;
  votes: number;
  comments: number;
}

interface clientStore {
  session: Session | null;
  setSession: (session: Session | null) => void;
  userData: Data[];
  setUserData: (userData: Data[]) => void;
}

export const clientStore = create<clientStore>((set) => ({
  session: null,
  setSession: (session: Session | null) => set({ session }),
  userData: [],
  setUserData: (userData) => set({ userData }),
}));
