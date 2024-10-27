import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface Data {
  uuid: string;
  created_at: string;
  post_title: string;
  description: string;
  user_id: string,
  post_added_by: string,
  post_img_url: string,
  user_image: string,
  post_videos_url: string,
  votes: [],
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
