"use client";

import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { addPost } from "@/lib/supabaseMethods";
import { clientStore } from "@/stores/clientStore";
import React, { useRef, useState } from "react";
import Auth from "../Auth";
import toast, { Toaster } from "react-hot-toast";
// import { Image } from "@chakra-ui/react";
import upload_placeholder from "@/assets/upload_placeholder.jpg";
import Image from "next/image";
import supabaseClient from "@/services/supabase";

const AddPost = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>("");
  // const [newImageUrl, setNewImageUrl] = useState("");
  const [imageId, setImageId] = useState<number>(0);
  const [fileSelect, setFileSelect] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { session } = clientStore();

  const userId = session?.user.id;
  const userName = session?.user.user_metadata.userName;
  const profileImgUrl = session?.user.user_metadata.avatar_url;

  const notify = () => toast.success("Post Added Successfully");

  
  let newImageUrl:string = "" ;

  const handleSubmit = async () => {
    try {
      if (fileSelect) {
        const fileExt = fileSelect.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;

        setImageId(imageId + 1)
            // storing the file in storage bucket
        const { error } = await supabaseClient.storage
          .from("post_images")
          .upload(`${imageId}/${fileName}`, fileSelect);

        if (error) throw error;

        // Retriving the public image URL from storage bucket
        const { data } = supabaseClient.storage
          .from("post_images")
          .getPublicUrl(`${imageId}/${fileName}`);
          newImageUrl = data.publicUrl;
      }

      const { isPostAdded, error } = await addPost(
        title,
        description,
        userId,
        userName,
        newImageUrl,
        profileImgUrl
      );

      if (error) {
        console.log("Error while adding post data", error.message);
      }

      if (isPostAdded) {
        notify();
        setPreviewImageUrl(null);
        setFileSelect(null);
        // setNewImageUrl("");
        setTitle("");
        setDescription("");
      }
    } catch (error: any) {
      console.log("Error is detected");
    }
  };

  const handlePostImage = () => {
    fileInputRef.current?.click();
  };

  // Handle image upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 1- To get a single image
    const file = event.target.files?.[0];
    if (!file) return;

    setFileSelect(file);

    // 2- Store the temp url
    const previewUrl = URL.createObjectURL(file);
    console.log("Preview Url when first image is uploaded", previewUrl)
    // 3 - Stored in state
    setPreviewImageUrl(previewUrl);
  };

  return (
    <>
      <Auth />
      <Header />
      <Sidebar />
      <div className="ml-64 mt-16 flex flex-col justify-center items-center">
        <div className="w-[80%] space-y-5 bg-gray-400 p-16 rounded-xl">
          <div>
            <h1 className="text-2xl font-bold">Add New Post</h1>
          </div>
          {/* Image to upload */}
          <div className="flex flex-col gap-1 justify-center items-center rounded-md">
            <Image
              src={previewImageUrl || upload_placeholder}
              alt="Upload a post"
              height={"250"}
              width={"250"}
              className="rounded-xl"
              onClick={handlePostImage}
            />
            <input
              className="w-52"
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              accept="image/*"
            />
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
            disabled={!title && !description && !fileSelect}
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
