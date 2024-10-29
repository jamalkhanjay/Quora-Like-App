import React from "react";

const ChatConversation = ({ params }: { params: { chatUserId: number } }) => {
  return <div className="ml-16">{params.chatUserId}</div>;
};

export default ChatConversation;
