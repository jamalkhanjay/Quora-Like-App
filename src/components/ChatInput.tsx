"use client";
import { insertMessage } from "@/lib/supabaseMethods";
import { clientStore } from "@/stores/clientStore";
import React from "react";
import { FiSend } from "react-icons/fi";


const ChatInput = () => {
  const { session } = clientStore();
  const userName = session?.user.user_metadata.userName;
  const userImage = session?.user.user_metadata.avatar_url;

  const handleSendMessage = async (text: string) => {
    // alert(text);
    // call to supabase
    await insertMessage(text, userName, userImage);
  };

  return (
    <div className="w-full p-5 border-t flex gap-4 items-center">
      <input
        className="w-full p-3 bg-gray-200 rounded-lg"
        placeholder="Send message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(e.currentTarget.value);
            // clear input
            e.currentTarget.value = "";
          }
        }}
      />
      <FiSend className="text-red-700 cursor-pointer disabled:text-gray-500  hover:text-red-900 text-3xl" />
    </div>
  );
};

export default ChatInput;
