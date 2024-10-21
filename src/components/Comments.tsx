"use client";

import { addComment, fetchComments } from "@/lib/supabaseMethods";
import { clientStore } from "@/stores/clientStore";
import { commentStore } from "@/stores/commentStore";
import React, { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";

const Comments = (props: any) => {
  const [comment, setComment] = useState("");

  const { session } = clientStore();

  const { comments, setComments } = commentStore();

  // let fetched: any[] = [] |;

  const userID = session?.user.id;
  const commentedBy = session?.user.user_metadata.userName;

  const sumbitComment = async () => {
    await addComment(props.postID, userID, comment, commentedBy);
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

  // console.log("Single Post ", singlePostComments);

  return (
    <div className="flex flex-col gap-4 text-white w-full border border-gray-400 p-4 rounded-xl">
      <h3 className="font-bold text-2xl">Comments</h3>
      {/* <div> */}
      {comments?.map((comment, index) => (
        <div key={index}>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-black"></div>
            <h2 className="font-bold">{comment.commented_by}</h2>
          </div>
          <div className="ml-10">{comment.contents}</div>
        </div>
      ))}
      {/* </div> */}

      <div className="flex items-center justify-between gap-2 bg-gray-300 w-full p-2 rounded-md">
        <input
          className="bg-gray-300 w-full text-black p-1"
          placeholder="Enter new Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={sumbitComment}
          disabled={!comment}
          className="disabled:cursor-not-allowed cursor-pointer"
        >
          <FiSend className="text-black cursor-pointer disabled:text-gray-500  hover:text-gray-800 text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Comments;
