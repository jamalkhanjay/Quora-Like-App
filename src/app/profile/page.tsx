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
import withAuth from "@/components/HOC/withAuth";

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("The error is here", error.message);
        toast({
          title: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      } else {
        console.log("An unknown error occurred");
      }
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <VStack py={"6"} bgColor={"gray.200"}>
        <VStack
          spacing={"10"}
          w={"90%"}
          py={"20"}
          textColor={"red.500"}
          rounded={"2xl"}
        >
          <Heading>Profile</Heading>
          <VStack position={"relative"}>
            <Avatar size="2xl" src={previewAvatarUrl || avatarUrl} />
            <IconButton
              position={"absolute"}
              bottom={"0"}
              right={"0"}
              icon={<MdEditSquare />}
              colorScheme="red"
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
                bgColor={"white"}
                _hover={{ bgColor: "none" }}
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
                bgColor={"white"}
                _hover={{ bgColor: "none" }}
                size="lg"
                variant="filled"
              />
            </HStack>

            <Button
              onClick={handleUpdateCredentials}
              // isLoading={isUserUpdating}
              // isDisabled={!isDirty && !selectedFile && !updatePassword.trim()}
              size="lg"
              variant="solid"
              // colorScheme=""
              bgColor={"red.600"}
              _hover={{ bgColor: "red.700" }}
              color={"white"}
              w={"30%"}
              mt={"5"}
              disabled={!updateName}
            >
              Save
            </Button>
          </VStack>
        </VStack>
      </VStack>
    </>
  );
};

export default withAuth(Profile);
