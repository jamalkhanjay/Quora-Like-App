import { create } from "zustand";

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface UserProfileStore {
  user: UserProfile; 
  setUser: (user: UserProfile) => void; 
}

export const userProfileStore = create<UserProfileStore>((set) => ({
  user: {} as UserProfile, 
  setUser: (user) => set({ user }),
}));
