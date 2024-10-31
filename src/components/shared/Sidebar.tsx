import supabaseClient from "@/services/supabase";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import AddNewPost from "../AddNewPost";
import WebcamRecording from "../WebcamRecording";
import { IoMdVideocam } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { SiGooglemessages } from "react-icons/si";
import { useSidebarStore } from "@/stores/sidebarStore";
import { BsQuora } from "react-icons/bs";
import { FoldHorizontal, UnfoldHorizontal } from "lucide-react";
import { BiSolidMessageCheck } from "react-icons/bi";

const Sidebar = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWebCamModalOpen, setIsWebCamModalOpen] = useState(false);

  const { isOpen, toggle } = useSidebarStore();

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
      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 h-full flex flex-col gap-4 justify-center bg-gray-300 text-white transform ${
          isOpen ? "translate-x-0 w-60" : "-translate-x-0 w-20"
        } transition-transform duration-200 ease-in-out`}
        aria-label="Sidebar"
      >
        <div className="h-[10%] flex justify-center items-center px-4">
          <BsQuora
            size={"50"}
            color="#c40404"
            onClick={() => router.push("/")}
            className="cursor-pointer h-12"
          />
        </div>
        <div className="text-orange-700 hover:text-orange-800 cursor-pointer flex justify-center">
          {!isOpen ? (
            <UnfoldHorizontal onClick={toggle} size={30} />
          ) : (
            <FoldHorizontal onClick={toggle} size={30} />
          )}
        </div>

        <div className="h-[90%] py-4 px-4 flex flex-col items-start justify-between overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li onClick={handleNewPostModal} className="cursor-pointer h-12">
              <a className="flex items-center p-2 text-red-600 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-400 group">
                <FaPlus className="text-red-600 text-2xl" />
                <span
                  className={`ms-2 text-red-600 ${
                    isOpen ? "" : "hidden"
                  } text-xl`}
                >
                  Add new Post
                </span>
              </a>
            </li>
            <li onClick={handleRecording} className="cursor-pointer h-12">
              <a className="flex items-center  p-2 text-red-600 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-400 group">
                <IoMdVideocam className="text-red-600 text-2xl" />
                <span
                  className={`ms-2 text-red-600 ${
                    isOpen ? "" : "hidden"
                  } text-xl`}
                >
                  Record Video
                </span>
              </a>
            </li>
            <li onClick={() => router.push("/")} className="cursor-pointer h-12">
              <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-400 group">
                <IoHome className="text-red-600 text-2xl" />
                <span
                  className={`ms-2 text-red-600 ${
                    isOpen ? "" : "hidden"
                  } text-xl`}
                >
                  Feed
                </span>
              </a>
            </li>
            <li
              onClick={() => router.push("/messages")}
              className="cursor-pointer h-12"
            >
              <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-400 group">
                <SiGooglemessages className="text-red-600 text-2xl" />
                <span
                  className={`ms-2 text-red-600 ${
                    isOpen ? "" : "hidden"
                  } text-xl`}
                >
                  Messages
                </span>
              </a>
            </li>
            <li onClick={() => router.push("/chat")} className="cursor-pointer h-12">
              <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-400 group">
                <BiSolidMessageCheck className="text-red-600 text-2xl" />
                <span
                  className={`ms-2 text-red-600 ${
                    isOpen ? "" : "hidden"
                  } text-xl`}
                >
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
              <GoSignOut className="text-red-600 text-2xl" />
              <span
                className={`ms-2 text-red-600 font-bold ${
                  isOpen ? "" : "hidden"
                } text-xl`}
              >
                Sign Out
              </span>
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
