"use client";
import { insertMessage } from "@/lib/supabaseMethods";
import { clientStore } from "@/stores/clientStore";
import React from "react";

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
    <div className="w-full p-5">
      <input
        className="w-full"
        placeholder="Send message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(e.currentTarget.value);
            // clear input
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};

export default ChatInput;
