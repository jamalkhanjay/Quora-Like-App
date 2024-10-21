import { create } from "zustand";

interface CommentsData {
  contents: string;
  // post_id: string;
  // user_id: string;
  commented_by: string;
}

interface CommentStore {
  comments: CommentsData[];
  setComments: (comments: CommentsData[]) => void;
}

export const commentStore = create<CommentStore>((set) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
}));
