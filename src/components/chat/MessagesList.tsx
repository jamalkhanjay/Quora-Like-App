"use client";

import React, { useEffect, useRef, useState } from "react";
import supabaseClient from "@/services/supabase";
// import { supabaseClient } from "@/lib/supabaseClient";

interface Message {
  id: number;
  sender_id: string;
  content: string;
  user_id: string;
  created_at: string;
}

interface User {
  id: string;
  username: string;
  avatar_url?: string | null;
}

interface MessageListProps {
  currentUser: User;
  chatId: number;
  otherUser: User;
}

export const MessageList: React.FC<MessageListProps> = ({
  currentUser,
  chatId,
  otherUser,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabaseClient
          .from("messages")
          .select("*")
          .eq("chat_id", chatId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [chatId]);

  // Subscribe to new messages
  useEffect(() => {
    if (!chatId) return;

    const channel = supabaseClient
      .channel(`chat:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        async (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [chatId, currentUser.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === currentUser.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender_id === currentUser.id
                  ? "bg-orange-600 text-white"
                  : "bg-orange-200"
              }`}
            >
              <div className="text-sm break-words">{message.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {messages.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          No messages yet. Start the conversation!
        </div>
      )}
    </div>
  );
};
