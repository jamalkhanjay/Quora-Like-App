"use client";

import { addPost } from "@/lib/supabaseMethods";
import React, { useState } from "react";

const AddPost = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = async () => {
    await addPost(title, description);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-[80%] mt-5 space-y-5">
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
            className="block w-full p-2 text-white border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div>
          <button
            className="cursor-pointer bg-gray-900 text-white px-4 py-2 rounded-md"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
