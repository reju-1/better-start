"use client";

import { useState, useRef, useEffect } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

const AIChatting = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    // Initial welcome message from AI
    {
      id: 1,
      role: "assistant",
      content: {
        text: "Hello! I'm an **expert AI Legal Advisor specializing in business law and corporate** in Bangladesh. How can I help you with your projects today?",
        suggestions: ["Create a new project"],
      },
    },
  ]);
  const messagesEndRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: {
          text: "Hello! I'm an **expert AI Legal Advisor specializing in business law and corporate** in Bangladesh. How can I help you with your projects today?",
          suggestions: ["Create a new project"],
        },
      },
    ]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for larger screens */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={toggleSidebar}
        onNewChat={handleNewChat}
      />

      {/* Main content */}
      <div className="relative flex-1 flex flex-col h-full lg:pl-64">
        <ChatHeader onMenuClick={toggleSidebar} onNewChat={handleNewChat} />

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto py-6">
          <ChatMessageList messages={messages} />
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input area */}
        <div className="sticky bottom-0 w-full p-3 sm:py-4 bg-gray-50">
          <ChatInput
            onSendMessage={async (text) => {
              if (text.trim()) {
                // Add user message immediately
                setMessages([
                  ...messages,
                  {
                    id: Date.now(),
                    role: "user",
                    content: { text },
                  },
                ]);

                // Call FastAPI backend
                try {
                  const response = await fetch(
                    "http://127.0.0.1:8000/ai_tools/document/gemini/ask_Startup/",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                      },
                      body: JSON.stringify({ message: [text] }),
                    }
                  );
                  const data = await response.json();

                  // Assume the backend returns { "result": "AI response here" }
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: Date.now() + 1,
                      role: "assistant",
                      content: {
                        text:
                          data.answer || "Sorry, I couldn't get a response.",
                      },
                    },
                  ]);
                } catch (error) {
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: Date.now() + 2,
                      role: "assistant",
                      content: {
                        text: "There was an error connecting to the AI backend.",
                      },
                    },
                  ]);
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AIChatting;
