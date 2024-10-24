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
import { PiEmpty } from "react-icons/pi";

const SpecificUser = ({ params }: { params: { userId: string } }) => {
  const [userPosts, setUserPosts] = useState<any[] | undefined>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [postID, setPostID] = useState("");
  const [loading, setLoading] = useState(false);

  const { session } = clientStore();

  console.log("The user id is", params.userId);

  useEffect(() => {
    const postsData = async () => {
      setLoading(true);
      const user = await fetchSpecificUsers(params.userId);
      setUserPosts(user);
      setLoading(false);
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
        {loading ? (
          // Loading
          <div
            role="status"
            className="h-[80vh] flex items-center justify-center"
          >
            <svg
              aria-hidden="true"
              className="w-20 h-20 text-gray-200 animate-spin dark:text-orange-600 fill-orange-200"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : userPosts?.length === 0 ? (
          <div className="w-full p-6 mb-4 text-xl flex text-orange-600 items-center justify-center gap-2">
            <PiEmpty />
            No Posts are added
          </div>
        ) : (
          userPosts?.map((post) => (
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
          ))
        )}
      </div>
    </>
  );
};

export default SpecificUser;
