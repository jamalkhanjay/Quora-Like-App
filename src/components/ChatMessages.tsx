import React, { Suspense } from "react";
import ListMessages from "./ListMessages";

const ChatMessages = () => {
  return (
    <Suspense fallback={"Loading..."}>
      <ListMessages />
    </Suspense>
  );
};

export default ChatMessages;
