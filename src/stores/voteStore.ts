import { create } from "zustand";

interface VoteData {
  vote_type: boolean;
  post_id: string;
  user_id: string;
  vote_count: number;
}

interface VoteStore {
  upvotes: VoteData[];
  setUpvotes: (upvotes: VoteData[]) => void;
}

export const voteStore = create<VoteStore>((set) => ({
  upvotes: [],
  setUpvotes: (upvotes) => set({ upvotes }),
}));
