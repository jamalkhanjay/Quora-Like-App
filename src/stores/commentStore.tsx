import { create } from "zustand";

interface CommentsData {
  contents: string;
  // post_id: string;
  created_at: string;
  commented_by: string;
  user_image: string,
}

interface CommentStore {
  comments: CommentsData[];
  setComments: (comments: CommentsData[]) => void;
}

export const commentStore = create<CommentStore>((set) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
}));
