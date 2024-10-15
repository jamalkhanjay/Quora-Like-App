import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface clientStore {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export const clientStore = create<clientStore>((set) => ({
  session: null,
  setSession: (session: Session | null) => set({ session }),
}));
