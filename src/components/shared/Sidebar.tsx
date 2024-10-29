import supabaseClient from "@/services/supabase";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import AddNewPost from "../AddNewPost";
import WebcamRecording from "../WebcamRecording";
import { IoMdVideocam } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import { SiGooglemessages } from "react-icons/si";

const Sidebar = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWebCamModalOpen, setIsWebCamModalOpen] = useState(false);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const signMeOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      throw error;
    }
    router.push("/signin");
  };

  const handleNewPostModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleRecording = () => {
    setIsWebCamModalOpen(!isWebCamModalOpen);
  };

  return (
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="absolute inline-flex items-center p-2 mt-2 ms-3 text-sm text-orange-500 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:text-orange-600 dark:hover:bg-gray-300 dark:focus:ring-gray-300"
        onClick={() => setIsOpenSidebar(!isOpenSidebar)}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen ${
          isOpenSidebar ? "block" : "hidden"
        } transition-transform translate-x-0 bg-gray-300 dark:bg-gray-300 border-r border-gray-400`}
        aria-label="Sidebar"
      >
        <ImCancelCircle
          size={30}
          className="absolute right-0 text-orange-700 m-2 cursor-pointer hover:text-orange-800"
          onClick={() => setIsOpenSidebar(!isOpenSidebar)}
        />
        <div className="h-full flex flex-col justify-between px-3 py-4 overflow-y-auto pt-12">
          <ul className="space-y-2 font-medium">
            <li onClick={handleNewPostModal} className="cursor-pointer">
              <a className="flex items-center p-2 text-red-600 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-400 group">
                <FaPlus className="text-red-600" />
                <span className="ms-2 text-red-600 text-xl">Add new Post</span>
              </a>
            </li>
            <li onClick={handleRecording} className="cursor-pointer">
              <a className="flex items-center p-2 text-red-600 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-400 group">
                <IoMdVideocam className="text-red-600 text-xl" />
                <span className="ms-2 text-red-600 text-xl">Record Video</span>
              </a>
            </li>
            <li onClick={() => router.push("/")} className="cursor-pointer">
              <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-400 group">
                <IoHome className="text-red-600 text-xl" />
                <span className="flex-1 ms-2 whitespace-nowrap text-red-600 text-xl">
                  Feed
                </span>
              </a>
            </li>
            <li onClick={() => router.push("/messages")} className="cursor-pointer">
              <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-400 group">
                <SiGooglemessages className="text-red-600 text-xl" />
                <span className="flex-1 ms-2 whitespace-nowrap text-red-600 text-xl">
                  Messages
                </span>
                
              </a>
            </li>
            <li onClick={() => router.push("/chat")} className="cursor-pointer">
              <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-400 group">
                <SiGooglemessages className="text-red-600 text-xl" />
                <span className="flex-1 ms-2 whitespace-nowrap text-red-600 text-xl">
                  Chat
                </span>
                
              </a>
            </li>
          </ul>
          <div className="w-full">
            <button
              className="flex w-full items-center p-2 text-gray-200 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-400 group"
              onClick={signMeOut}
            >
              {/* <Toaster toastOptions={{ duration: 7000 }} /> */}
              <GoSignOut className="text-red-600 text-xl" />
              <span className="ms-2 text-red-600 text-xl">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {isModalOpen && (
        <AddNewPost isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
      {isWebCamModalOpen && (
        <WebcamRecording
          isWebCamModalOpen={isWebCamModalOpen}
          setIsWebCamModalOpen={setIsWebCamModalOpen}
        />
      )}
    </div>
  );
};

export default Sidebar;
