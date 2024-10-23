"use client";

import CommentsModal from "@/components/CommentsModal";
import { fetchSpecificUsers, manageVotes } from "@/lib/supabaseMethods";
import { clientStore } from "@/stores/clientStore";
import { Avatar } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import Auth from "../Auth";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";

const SpecificUser = ({ params }: { params: { userId: string } }) => {
  const [userPosts, setUserPosts] = useState<any[] | undefined>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [postID, setPostID] = useState("");

  const { setUserData, userData, session } = clientStore();

  console.log("The user id is", params.userId);

  useEffect(() => {
    const postsData = async () => {
      const user = await fetchSpecificUsers(params.userId);
      setUserPosts(user);
    };
    postsData();
  }, []);

  console.log("user posts are ", userPosts);

  // ----- * A Toast for notifying a user * -----------
  const duplicateVote = () =>
    toast.error("You have already voted for this post");
  const voteAdded = () => toast.success("Your vote has been recorded");
  const voteRemoved = () => toast.success("Your vote has been removed");
  const errorAddingVote = () => toast.error("Error while adding vote");

  const handleVotes = async (post_id: string, remove: boolean = false) => {
    const userId = session?.user.id;

    if (!userId) {
      console.log("No user found. Cannot upvote");
      return;
    }

    const vote = await manageVotes(post_id, userId, remove);

    // Toaster
    if (vote === "23505") {
      duplicateVote();
    } else if (vote) {
      voteAdded();
    } else if (!vote) {
      voteRemoved();
    } else {
      errorAddingVote();
    }
  };

  // Handling Comments
  const handleModal = (postID: string) => {
    setPostID(postID);
    setIsShowing(!isShowing);
  };

  return (
    <>
      <Auth />
      <Header />
      <Sidebar />
      <div className="w-full flex flex-col items-center bg-black">
        {userPosts?.map((post) => (
          <div
            className="ml-64 my-4 w-[60%] flex flex-col items-center gap-5 p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-950"
            key={post.uuid}
          >
            <div className="flex gap-5 items-center w-full">
              <div className="w-full space-y-4">
                {/* User name, time and Image of post */}
                <div className="flex items-center gap-2 mb-4 text-white">
                  <Link
                    href={`${post.user_id}`}
                    className="flex gap-2 items-center"
                  >
                    <Avatar src={post.user_image} name={post.post_added_by} />
                    <h5 className="text-xl font-bold tracking-tight text-orange-900 dark:text-orange-600">
                      {post.post_added_by}
                    </h5>
                  </Link>
                  <p className="text-sm text-gray-400">
                    {post.created_at.split(".")[0]}
                  </p>
                </div>

                {/* Post Image */}
                {post.post_img_url && (
                  <img
                    className="text-xs bg-black w-full h-96 object-cover rounded-xl"
                    src={post.post_img_url}
                    alt="user"
                    // width={"200"}
                    // height={"200"}
                  />
                )}

                <div>
                  <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-200">
                    {post.post_title}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                    {post.description}
                  </p>
                </div>

                {/* Comments section Upvote - Down vote container */}
                <div className="flex gap-5">
                  <div className="flex gap-2 text-white items-center">
                    <button
                      onClick={() => handleVotes(post.uuid)}
                      className={`flex gap-2 items-center px-3 py-3 text-sm font-medium text-center 
                      text-white bg-orange-800 rounded-lg hover:bg-orange-900`}
                    >
                      <GoArrowUp />
                    </button>
                    <Toaster />
                    <span>{post?.votes?.length}</span>

                    <button
                      className={`flex gap-2 items-center px-3 py-3 text-sm font-medium text-center 
                      text-white
                     bg-orange-800 rounded-lg hover:bg-orange-900`}
                      onClick={() => handleVotes(post.uuid, true)}
                    >
                      <GoArrowDown />
                    </button>
                  </div>
                  <button
                    onClick={() => handleModal(post.uuid)}
                    className="flex gap-2 w-fit items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-orange-800 dark:hover:bg-orange-900 dark:focus:ring-orange-950"
                  >
                    Comments
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {isShowing && postID === post.uuid && (
              <CommentsModal postID={post.uuid} />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default SpecificUser;
