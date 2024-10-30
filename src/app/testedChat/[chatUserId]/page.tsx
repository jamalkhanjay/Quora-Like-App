"use client";

import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { retrieveMessages, updateColumn } from "@/lib/supabaseMethods";
import { clientStore } from "@/stores/clientStore";
import { useSidebarStore } from "@/stores/sidebarStore";
import React, { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";

const ChatConversation = ({ params }: { params: { chatUserId: number } }) => {
  const [messageContent, setMessageContent] = useState("");
  // const [existingData, setExistingData] = useState([]);

  let existingData: any[] = [];

  const { session } = clientStore();
  const { isOpen } = useSidebarStore();

  // UUID from the current user session
  const currentUserId = session?.user.id;

  // fetch the message array first
  useEffect(() => {
    const fetchMessageArray = async () => {
      const data = await retrieveMessages(params.chatUserId);
      // setExistingData(data);
      existingData = data;
      console.log("existing", existingData);
    };
    fetchMessageArray();
  }, []);

  // Object as a json which will store in message column as an array
  const newMessage = {
    senderId: currentUserId,
    content: messageContent,
  };
  
  // Appending to existing array
  const dataToBeSent = Array.isArray(existingData)
    ? [...existingData, newMessage] 
    : [newMessage];

  // Send a message
  const sendMessage = async () => {
    await updateColumn(dataToBeSent, params.chatUserId);
  };

  const handleEnterKey = (e: any) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleMessage = (e: any) => {
    setMessageContent(e.target.value);
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className={`relative ${isOpen ? "ml-64" : "ml-32"} w-[90%]`}>
        {/* Header */}
        <div className="h-20">
          <div className="p-5 border-b flex flex-col h-full">
            <h1 className="text-xl font-bold">
              Messages of ID {params.chatUserId}
            </h1>
          </div>
        </div>

        {/* Messages - chat area */}
        <div className="flex-1 flex flex-col p-5 w-full h-[calc(100vh-10rem) overflow-y-auto">
          <div className="flex-1"></div>
          <div className="space-y-5">Hi</div>
        </div>

        {/* text input and send */}
        <div className="fixed bottom-0 w-[90%] p-5 border-t flex gap-4 items-center">
          <input
            className="w-full p-3 bg-gray-200 rounded-lg"
            placeholder="Send message"
            value={messageContent}
            onChange={(e) => handleMessage(e)}
            onKeyDown={(e) => handleEnterKey(e)}
          />
          <FiSend
            className="text-red-700 cursor-pointer disabled:text-gray-500 hover:text-red-900 text-3xl"
            onClick={sendMessage}
          />
        </div>
      </div>
    </>
  );
};

export default ChatConversation;
