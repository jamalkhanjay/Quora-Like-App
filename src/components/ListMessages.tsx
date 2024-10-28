"use client";

import { fetchMessages } from "@/lib/supabaseMethods";
import supabaseClient from "@/services/supabase";
import { Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const ListMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchingMessages = async () => {
      const msgs = await fetchMessages();
      setMessages(msgs);
    };
    fetchingMessages();
  }, []);
  console.log("Messages are ", messages);

  //   For broadcasting
  useEffect(() => {
    const channel = supabaseClient
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          console.log("Change received!", payload);
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe();

    //   Unsubscribe the channel
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col p-5 w-full overflow-y-auto">
      <div className="flex-1"></div>
      <div className="space-y-5">
        {messages.map((value, index) => (
          <div className="flex gap-2" key={index}>
            {/* <div className="h-10 w-10 bg-green-500 rounded-full"></div> */}
            <Avatar
              className="w-10 h-10 rounded-full bg-gray-600"
              src={value.user_image}
              name={value.user_name}
            />
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <h1 className="font-bold ">{value.user_name}</h1>
                <h1 className="text-sm text-gray-400">
                  {value.created_at.split("T")[0]}
                </h1>
              </div>
              <p className="text-black-300">{value.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListMessages;
