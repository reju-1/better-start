import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatMessage = ({ message }) => {
  const { role, content } = message;
  const isUser = role === "user";

  const renderSuggestions = () => {
    if (!content.suggestions || content.suggestions.length === 0) return null;

    return (
      <div className="mt-4 flex flex-wrap gap-2">
        {content.suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-3xl rounded-lg px-4 py-3 shadow-sm
          ${
            isUser
              ? "bg-purple-50 text-gray-800"
              : "bg-white border border-gray-100"
          }
        `}
      >
        <div className="flex items-start">
          {!isUser && (
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="text-sm">
              <Markdown remarkPlugins={[remarkGfm]}>{content.text}</Markdown>
            </div>

            {!isUser && renderSuggestions()}
          </div>

          {isUser && (
            <div className="flex-shrink-0 ml-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">U</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
