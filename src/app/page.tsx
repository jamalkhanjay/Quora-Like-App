"use client";

import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { getAllData } from "@/lib/supabaseMethods";
import { clientStore } from "@/stores/clientStore";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  // console.log("session from home page is", session);
  const [loading, isLoading] = useState(false);

  const { setUserData, userData} = clientStore();
  // Checking the session
  // useEffect(() => {
  //   if (!session?.access_token) {
  //     console.log("running");
  //     router.push("/signin");
  //   }
  // }, []);

  useEffect(() => {
    const fetchingData = async () => {
      const fetchedData = await getAllData();
      if (fetchedData) {
        setUserData(fetchedData);
      }
    };
    fetchingData();
  }, []);

  

  return (
    <>
      <Header />
      <Sidebar />
      <div className="ml-64 flex flex-col gap-5 justify-center items-center mt-6">
        {userData?.map((item) => (
          <div
            className="w-[70%] p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-950"
            key={item.id}
          >
            {/* User name and time of post */}
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-gray-950 rounded-full"></div>
              <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item.post_added_by}</h5>
              <p>{item.time}</p>
            </div>
            
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {item.post_title}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {item.description}
            </p>

            {/* Comments and votes section area */}
            <div className="flex gap-10">
              <div className="flex gap-4">
                <button className="flex gap-2 items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-800 dark:hover:bg-gray-900 dark:focus:ring-gray-950">
                  Upvote - {item.votes}
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
                      d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                    />
                  </svg>
                </button>

                <button className="flex gap-2 items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-800 dark:hover:bg-gray-900 dark:focus:ring-gray-950">
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
                      d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                    />
                  </svg>
                </button>
              </div>

              <button className="flex gap-2 items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-800 dark:hover:bg-gray-900 dark:focus:ring-gray-950">
                Comments - {item.comments}
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
        ))}
      </div>
    </>
  );
}
