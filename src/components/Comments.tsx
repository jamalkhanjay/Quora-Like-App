"use client";

import { addComment, fetchComments } from "@/lib/supabaseMethods";
import { clientStore } from "@/stores/clientStore";
import { commentStore } from "@/stores/commentStore";
import { Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";

const Comments = (props: any) => {
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

  // console.log("Single Post ", singlePostComments);

  return (
    <div className="flex flex-col gap-4 text-white w-full border border-gray-400 p-4 rounded-xl">
      <h3 className="font-bold text-2xl">Comments</h3>
      {/* <div> */}
      {comments?.map((cmnt, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center gap-2">
            <Avatar
              src={cmnt.user_image}
              name={cmnt.commented_by}
            />
            <h2 className="font-bold">{cmnt.commented_by}</h2>
            <span className="text-sm text-gray-400">{cmnt.created_at.split("T")[0]}</span>
          </div>
          <div className="ml-12">{cmnt.contents}</div>
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
