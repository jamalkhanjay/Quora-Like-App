"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { addPost, getPostData } from "@/lib/supabaseMethods";
import { clientStore } from "@/stores/clientStore";
import React, {
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import supabaseClient from "@/services/supabase";
import Webcam from "react-webcam";

export default function WebcamRecording({
  isWebCamModalOpen,
  setIsWebCamModalOpen,
}: {
  isWebCamModalOpen: boolean;
  setIsWebCamModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // * For webcam start*
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isWebcamShowing, setIsWebcamShowing] = useState<boolean>(false);
  const [isCamOpen, setIsCamOpen] = useState<boolean>(false);
  // const [videoUrl, setVideoUrl] = useState<string>("");

  const { session } = clientStore();

  const userId = session?.user.id;
  const userName = session?.user.user_metadata.userName;
  const profileImgUrl = session?.user.user_metadata.avatar_url;

  const toastInfo = () => toast.success("Post Successfully added!");

  let newImageUrl: string = "";
  let videoUrl: string = "";

  const handleStartCaptureClick = useCallback(() => {
    if (webcamRef.current && webcamRef.current.stream) {
      console.log("1- capturing started")
      setCapturing(true);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    } else {
      console.error("Webcam stream is not available.");
    }
  }, [webcamRef, setCapturing]);

  const handleDataAvailable = useCallback(
    ({ data }: { data: Blob }) => {
      console.log("Data size is", data.size)
      if (data.size > 0) {
        console.log("2- Getting data from cam")
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current!.stop();
    uploadVideoToSupabase();
    setCapturing(false);
    setIsCamOpen(false);
  }, [mediaRecorderRef, setCapturing]);

  // Upload videos to URL
  const uploadVideoToSupabase = useCallback(async () => {
    console.log("2.5- Recorded chunks are- ", recordedChunks.length);
    if (recordedChunks.length) {
      console.log("3- chunks recorded")
      const blob = new Blob(recordedChunks, { type: "video/webm" });

      // Create a unique filename for the video
      const fileName = `recorded-video-${Date.now()}.webm`;

      // Upload to Supabase storage
      const { error } = await supabaseClient.storage
        .from("post_videos")
        .upload(fileName, blob, {
          contentType: "video/webm",
        });

      if (error) {
        console.error("Error uploading video:", error.message);
      }

      // retriving public url
      const { data } = supabaseClient.storage
        .from("post_images")
        .getPublicUrl(fileName);
      videoUrl = data.publicUrl;
      console.log("Video url is ", videoUrl);
    } else {
      console.log("Video is not recorded");
    }
  }, [recordedChunks]);

  // ***************************

  const handleSubmit = async () => {
    try {
      const { isPostAdded, error } = await addPost(
        title,
        description,
        userId,
        userName,
        newImageUrl,
        profileImgUrl,
        videoUrl,
      );

      if (error) {
        console.log("Error while adding post data", error.message);
      }

      if (isPostAdded) {
        // notify();
        toastInfo();
        setTitle("");
        setDescription("");
      }
    } catch (error: any) {
      console.log("Error is detected");
    }
  };

  const handleOpeningCam = () => {
    setIsCamOpen(!isCamOpen);
  };

  return (
    <Dialog
      open={isWebCamModalOpen}
      onClose={setIsWebCamModalOpen}
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
            className="relative overflow-y-auto transform h-[90vh] w-[50%] p-4 flex flex-col justify-between overflow-hidden rounded-lg bg-gray-100 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8  data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="my-10 flex flex-col justify-center items-center">
              <div className="w-[90%] space-y-5 text-red-600 rounded-xl">
                <div>
                  <h1 className="text-2xl font-bold">Add New Post</h1>
                </div>

                {/* Image to upload and video*/}
                <div className="flex justify-around  items-center rounded-md">
                  {/* Webcam recording functionality */}
                  <div className="flex flex-col gap-4">
                    {isCamOpen ? (
                      <Webcam
                        audio={true}
                        ref={webcamRef}
                        width={"500"}
                        height={"300"}
                        className="rounded-lg"
                      />
                    ) : (
                      <video width="500" height="500" controls className="rounded-md">
                        <source src={videoUrl} type="video/webm" />
                      </video>
                    )}

                    {/* Open camera button */}
                    {!isCamOpen ? (
                      <button
                        onClick={handleOpeningCam}
                        className="bg-red-600 text-white px-3 py-2 rounded-md"
                      >
                        Open Camera
                      </button>
                    ) : capturing ? (
                      <button
                        onClick={handleStopCaptureClick}
                        className="bg-red-600 text-white px-3 py-2 rounded-md"
                      >
                        Stop Recording
                      </button>
                    ) : (
                      <button
                        onClick={handleStartCaptureClick}
                        className="bg-red-600 text-white px-3 py-2 rounded-md"
                      >
                        Start Recording
                      </button>
                    )}
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
                    // disabled={!title && !description && !fileSelect}
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
