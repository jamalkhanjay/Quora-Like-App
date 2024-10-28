"use client";

import React from "react";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import supabaseClient from "@/services/supabase";
import { useRouter } from "next/navigation";
import { clientStore } from "@/stores/clientStore";
import upload_placeholder from "@/assets/upload_placeholder.jpg";
import logo_image from "@/assets/logo-image.png";
import { Avatar } from "@chakra-ui/react";
import Image from "next/image";

const Header = () => {
  const { session } = clientStore();
  const router = useRouter();

  const signMeOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      throw error;
    }
    router.push("/signin");
  };

  return (
    <Disclosure
      as="nav"
      className="bg-gray-300 dark:bg-gray-300 shadow border-b border-b-gray-400"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <Image
            src={logo_image}
            alt="Quora Logo"
            className="object-cover cursor-pointer"
            width={100}
            onClick={() => router.push("/")}
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="text-red-600 text-xl font-bold">
              {session?.user.user_metadata.userName}
            </div>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <Avatar
                    name={session?.user.user_metadata.userName}
                    src={
                      session?.user.user_metadata.avatar_url ||
                      upload_placeholder
                    }
                    className="h-8 w-8 rounded-full bg-red-600 text-white"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <button
                    className="w-full block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                    onClick={() => router.push("/profile")}
                  >
                    Profile
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    className="w-full block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                    onClick={signMeOut}
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
};

export default Header;
