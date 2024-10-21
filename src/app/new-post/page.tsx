"use client";

import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { addPost } from "@/lib/supabaseMethods";
import { clientStore } from "@/stores/clientStore";
import React, { useState } from "react";
import Auth from "../Auth";
import toast, { Toaster } from "react-hot-toast";

const AddPost = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const { session } = clientStore();

  const userId = session?.user.id;
  const userName = session?.user.user_metadata.userName;

  const notify = () => toast.success("Post Added Successfully");

  const handleSubmit = async () => {
    await addPost(title, description, userId, userName);
    notify();
    setTitle("");
    setDescription("");
  };

  return (
    <>
      <Auth />
      <Header />
      <Sidebar />
      <div className="ml-64 mt-16 flex flex-col justify-center items-center">
        <div className="w-[80%] mt-5 space-y-5 bg-gray-400 p-16 rounded-xl">
          <div className="tex">
            <h1 className="text-2xl font-bold">Add New Post</h1>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Post Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              id="small-input"
              placeholder="Enter Title"
              required
              className="block w-full p-2 text-white border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          {/* <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
            Base input
          </label>
          <input
            type="text"
            id="base-input"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div> */}

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              id="large-input"
              placeholder="Write some description"
              required
              className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <button
            className="cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-600 bg-gray-900 text-white px-4 py-2 rounded-md"
            disabled={!title && !description}
            onClick={handleSubmit}
          >
            Submit
            <Toaster />
          </button>
        </div>
      </div>
    </>
  );
};

export default AddPost;
