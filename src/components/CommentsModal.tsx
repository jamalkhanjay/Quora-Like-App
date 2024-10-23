"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { addComment, fetchComments } from "@/lib/supabaseMethods";
import { clientStore } from "@/stores/clientStore";
import { commentStore } from "@/stores/commentStore";
import { Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";

export default function CommentsModal(props: any) {
  const [open, setOpen] = useState(true);
  const [comment, setComment] = useState("");

  const { session } = clientStore();

  const { comments, setComments } = commentStore();

  // let fetched: any[] = [] |;

  const userID = session?.user.id;
  const commentedBy = session?.user.user_metadata.userName;
  const profileImgUrl = session?.user.user_metadata.avatar_url;

  const sumbitComment = async () => {
    await addComment(props.postID, userID, comment, commentedBy, profileImgUrl);
    setComment("");
  };

  useEffect(() => {
    const fetchingComments = async () => {
      const fetched = await fetchComments(props.postID);
      setComments(fetched || []);
      console.log("fetched comments - ", comments);
    };
    fetchingComments();
  }, []);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform h-[70vh] p-4 w-[50%] flex flex-col justify-between overflow-hidden rounded-lg bg-gray-200 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex flex-col gap-4 text-black w-full rounded-xl">
              <h3 className="font-bold text-2xl">Comments</h3>
              {/* <div> */}
              {comments?.map((cmnt, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Avatar src={cmnt.user_image} name={cmnt.commented_by} />
                    <h2 className="font-bold">{cmnt.commented_by}</h2>
                    <span className="text-sm text-gray-400">
                      {cmnt.created_at.split("T")[0]}
                    </span>
                  </div>
                  <div className="ml-12">{cmnt.contents}</div>
                </div>
              ))}
              {/* </div> */}

              <div className="fixed bottom-0 left-0 right-0 bg-gray-500 w-full p-2 rounded-md">
                <div className="flex items-center justify-between gap-2">
                  <input
                    className="bg-gray-500 w-full text-white p-1"
                    placeholder="Enter new Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    onClick={sumbitComment}
                    disabled={!comment}
                    className="disabled:cursor-not-allowed cursor-pointer"
                  >
                    <FiSend className="text-white cursor-pointer disabled:text-gray-500  hover:text-gray-800 text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
