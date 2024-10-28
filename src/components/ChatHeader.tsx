import React from "react";

const ChatHeader = () => {
  return (
    <div className="h-20">
      <div className="p-5 border-b flex flex-col h-full">
          <h1 className="text-xl font-bold">Daily Chat</h1>
        {/* <div className="flex gap-1 items-center"> */}
          {/* <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div> */}
          {/* <h1 className="text-sm text-gray-400">2 online</h1> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default ChatHeader;
