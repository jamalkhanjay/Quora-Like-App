"use client";

import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { retrieveUsers } from "@/lib/supabaseMethods";
import supabaseClient from "@/services/supabase";
import { clientStore } from "@/stores/clientStore";
import { useSidebarStore } from "@/stores/sidebarStore";
import { Avatar } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Users {
  id: number;
  user_name: string;
  user_image: string;
}

const Chat = () => {
  const [users, setUsers] = useState<Users[] | undefined>();
  const router = useRouter();

  const { session } = clientStore();
  const { isOpen } = useSidebarStore();

  const currentUserId = session?.user.id;
  const userName = session?.user.user_metadata.userName;

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await retrieveUsers(userName);
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  const hanldePrivateChat = async (chatUserId: number) => {
    // If no conversation created , create one

    const { error } = await supabaseClient
      .from("conversation")
      .insert({ current_user_id: currentUserId, user2_id: chatUserId });
    router.push(`/chat/${chatUserId}`);

    if (error) {
      console.log("Error while fetching data");
      router.push(`/chat/${chatUserId}`);
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className={`h-[90vh] w-1/4 overflow-y-auto py-4 border-r duration-300 ease-in-out ${
          isOpen ? "ml-64" : "ml-16"
        }`}>
        {users?.map((value) => (
          <div
            key={value.id}
            className="flex items-center gap-2 border-b py-2 pl-2 cursor-pointer hover:bg-gray-200"
            onClick={() => hanldePrivateChat(value.id)}
          >
            <Avatar src={value.user_image} name={value.user_name} />
            <h1>{value.user_name}</h1>
          </div>
        ))}
      </div>
    </>
  );
};

export default Chat;
