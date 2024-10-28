import React from "react";

const ChatHeader = () => {
  return (
    <div className="h-20">
      <div className="p5 border-b flex items-center justify-between h-full">
        <div>
          <h1 className="text-xl font-bold">Daily Chat</h1>
          <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
          <h1 className="text-sm text-gray-400">2 online</h1>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
