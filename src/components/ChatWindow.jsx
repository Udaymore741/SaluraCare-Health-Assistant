import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

/**
 * ChatWindow Component
 * 
 * Displays conversation history in a scrollable container with auto-scroll functionality.
 * Shows typing indicator when chatbot is processing.
 * 
 * @param {Object} props
 * @param {Array<ChatMessage>} props.messages - Array of message objects to display
 * @param {boolean} props.isTyping - Whether to show typing indicator
 */
function ChatWindow({ messages, isTyping }) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message when messages update or typing indicator appears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
      {/* Render all messages in chronological order */}
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          sender={message.sender}
          riskLevel={message.riskLevel}
        />
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex justify-start mb-4">
          <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Invisible element for auto-scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatWindow;
