"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { addPost } from "@/lib/supabaseMethods";
import { clientStore } from "@/stores/clientStore";
import React, {
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import upload_placeholder from "@/assets/upload_placeholder.jpg";
import Image from "next/image";
import supabaseClient from "@/services/supabase";

export default function AddNewPost({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
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
  console.log("profile img url", profileImgUrl);

  const toastInfo = () => toast.success("Post Successfully added!");

  let newImageUrl: string = "";

  const handleSubmit = async () => {
    try {
      if (fileSelect) {
        const fileExt = fileSelect.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;

        setImageId(imageId + 1);
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
        toastInfo();
        setPreviewImageUrl(null);
        setFileSelect(null);
        setTitle("");
        setDescription("");
      }
    } catch (error) {
      console.log("Error is detected", error);
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
    console.log("Preview Url when first image is uploaded", previewUrl);
    // 3 - Stored in state
    setPreviewImageUrl(previewUrl);
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={setIsModalOpen}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform h-[90vh] w-[50%] p-4 flex flex-col justify-between overflow-hidden rounded-lg bg-gray-100 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8  data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="my-10 flex flex-col justify-center items-center">
              <div className="w-[90%] space-y-5 text-red-600 rounded-xl">
                <div>
                  <h1 className="text-2xl font-bold">Add New Post</h1>
                </div>

                {/* Image to upload and video*/}
                <div className="flex justify-around items-center rounded-md">
                  <div className="flex flex-col gap-2">
                    <Image
                      src={previewImageUrl || upload_placeholder}
                      alt="Upload a post"
                      height={"100"}
                      width={"100"}
                      className="rounded-xl"
                      onClick={handlePostImage}
                    />
                    <input
                      className="w-52"
                      size={2}
                      type="file"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      accept="image/*"
                      // style={{display: "none"}}
                    />

                  </div>
                </div>

                {/* Post Title and input */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-red-600 dark:text-red-600">
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

                {/* Description */}
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-red-600 dark:text-red-600">
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

                {/* Submit button */}
                <div className="w-full text-center">
                  <button
                    className="cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-600 bg-red-700 text-white px-4 py-2 rounded-md"
                    disabled={!title && !description && !fileSelect}
                    onClick={handleSubmit}
                  >
                    Submit
                    <Toaster />
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
