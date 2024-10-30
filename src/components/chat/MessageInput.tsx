"use client";

import { useState, useRef } from "react";
import { Paperclip, Send, X } from "lucide-react";
import supabaseClient from "@/services/supabase";

interface User {
  id: string;
  username: string;
  avatar_url?: string | null;
}

interface MessageInputProps {
  currentUser: User;
  chatId: number;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  currentUser,
  chatId,
}) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = message.trim();
    if (!messageText || sending) return;

    try {
      setSending(true);
      // First, send the message
      const { error: messageError } = await supabaseClient
        .from("messages")
        .insert({
          chat_id: chatId,
          sender_id: currentUser.id,
          content: messageText,
        });

      if (messageError) throw messageError;

      // Then update the chat's last_message_at
      //   const { error: chatError } = await supabaseClient
      //     .from("chats")
      //     .update({ last_message_at: new Date().toISOString() })
      //     .eq("id", chatId);

      //   if (chatError) throw chatError;

      // Clear the input only after successful send
      setMessage("");

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as any);
    }
  };

  return (
    <form onSubmit={sendMessage} className="p-4 border-t bg-white">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          title="Attach file"
        >
          <Paperclip size={20} />
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          disabled={sending}
        />

        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          {sending ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </form>
  );
};
