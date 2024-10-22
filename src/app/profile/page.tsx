"use client";

import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { clientStore } from "@/stores/clientStore";
import {
  Avatar,
  Button,
  Heading,
  HStack,
  IconButton,
  useToast,
  Text,
  Input,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { MdEditSquare } from "react-icons/md";
import upload_placeholder from "@/assets/upload_placeholder.jpg";
import { updateCredentials } from "@/lib/supabaseMethods";
import supabaseClient from "@/services/supabase";

const Profile = () => {
  const [updateName, setUpdateName] = useState("");
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [fileSelect, setFileSelect] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { session } = clientStore();

  const toast = useToast();

  // Whenever this component mounts the or the session changes these two state will re-render
  useEffect(() => {
    if (session) {
      setUpdateName(session.user.user_metadata.userName);
      setAvatarUrl(session.user.user_metadata.avatar_url || upload_placeholder);
    }
  }, [session]);

  // when icon button clicked the input field will also be clicked
  const handleProfileImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Accessing the first element from files
    const file = event.target.files?.[0];
    if (!file) return;

    setFileSelect(file);

    // Storing the temp Url in previewURL var
    const previewUrl = URL.createObjectURL(file);
    setPreviewAvatarUrl(previewUrl);
  };

  // Handling the data which is changed or modified
  const handleUpdateCredentials = async () => {
    try {
      if (updateName.trim()) {
        // setIsUserUpdating(true);
        let newAvatarUrl = avatarUrl;

        // Handle file upload if a new file is selected
        if (fileSelect) {
          // Extracting image extention to store it with random uniqute name
          const fileExt = fileSelect.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;

          // Store the file in bucket
          const { error } = await supabaseClient.storage
            .from("avatars")
            .upload(`${session?.user.id}/${fileName}`, fileSelect);

          if (error) throw error;

          // retriveing the public url
          const { data: publicUrlData } = supabaseClient.storage
            .from("avatars")
            .getPublicUrl(`${session?.user.id}/${fileName}`);
          newAvatarUrl = publicUrlData.publicUrl;
        }

        const { isUserUpdated, error } = await updateCredentials(
          updateName,
          // updatePassword,
          newAvatarUrl
        );

        if (error) {
          console.log("Error while updating credentials", error.message);
        }

        // If true
        if (isUserUpdated) {
          console.log("User updated exec");
          setAvatarUrl(newAvatarUrl);
          setPreviewAvatarUrl(null);
          setFileSelect(null);
        }
      } else {
        toast({
          title: "Name cannot be empty",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error: any) {
      console.log("The error is here");
      toast({
        title: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    }
  };
  // finally {
  //   setIsUserUpdating(false);
  // }

  return (
    <>
      <Header />
      <Sidebar />
      <VStack m={"10"}>
        <Heading>Profile</Heading>
        <VStack position={"relative"}>
          <Avatar size="2xl" src={previewAvatarUrl || avatarUrl} />
          <IconButton
            position={"absolute"}
            bottom={"0"}
            right={"0"}
            icon={<MdEditSquare />}
            colorScheme="teal"
            border={"3px solid white"}
            aria-label="Change Profile image"
            onClick={handleProfileImage}
          />
        </VStack>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />

        <VStack w={"50%"} gap={3} align={"center"}>
          <HStack w={"full"}>
            <Text w={["25%", "25%", "15%"]} fontWeight={"bold"}>
              Email:
            </Text>
            <Input
              type="email"
              value={session?.user.email}
              w={["80%", "80%", "85%"]}
              placeholder="Email"
              size="lg"
              variant="filled"
              disabled
            />
          </HStack>

          <HStack w={"full"}>
            <Text w={["25%", "25%", "15%"]} fontWeight={"bold"}>
              Name:
            </Text>
            <Input
              onChange={(e) => setUpdateName(e.target.value)}
              w={["80%", "80%", "85%"]}
              type="text"
              placeholder="Name"
              value={updateName}
              size="lg"
              variant="filled"
            />
          </HStack>

          {/* <HStack w={"full"}>
            <Text w={["25%", "25%", "15%"]} fontWeight={"bold"}>
              Password:
            </Text>
            <Input
              // onChange={(e) => setUpdatePassword(e.target.value)}
              w={["80%", "80%", "85%"]}
              type="password"
              placeholder="Password"
              size="lg"
              variant="filled"
            />
          </HStack> */}

          <Button
            onClick={handleUpdateCredentials}
            // isLoading={isUserUpdating}
            // isDisabled={!isDirty && !selectedFile && !updatePassword.trim()}
            size="lg"
            variant="solid"
            // colorScheme=""
            bgColor={"gray.600"}
            _hover={{ bgColor: "gray.900" }}
            color={"white"}
            w={"30%"}
            mt={"5"}
          >
            Save
          </Button>
        </VStack>
      </VStack>
    </>
  );

  // return (
  //    <h1>Hello</h1>
  // )
};

export default Profile;
