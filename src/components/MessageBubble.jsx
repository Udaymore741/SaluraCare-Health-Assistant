import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * MessageBubble Component
 * 
 * Renders individual chat messages with appropriate styling based on sender and risk level.
 * Supports markdown formatting for better readability.
 * 
 * @param {Object} props
 * @param {Object} props.message - Message object containing text, sender, timestamp
 * @param {'user' | 'bot'} props.sender - Determines styling and alignment
 * @param {'LOW' | 'MEDIUM' | 'HIGH'} [props.riskLevel] - Optional risk indicator for color coding
 */
function MessageBubble({ message, sender, riskLevel }) {
  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Determine risk level color classes
  const getRiskLevelColor = () => {
    if (!riskLevel) return '';
    
    switch (riskLevel) {
      case 'HIGH':
        return 'text-red-600 font-semibold';
      case 'MEDIUM':
        return 'text-yellow-600 font-semibold';
      case 'LOW':
        return 'text-green-600 font-semibold';
      default:
        return '';
    }
  };

  // Determine message bubble styling based on sender
  const isUser = sender === 'user';
  const bubbleClasses = isUser
    ? 'bg-blue-500 text-white ml-auto'
    : 'bg-gray-200 text-gray-800 mr-auto';

  const alignmentClasses = isUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${alignmentClasses} mb-4`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${bubbleClasses} shadow-md`}>
        {/* Message text with markdown support */}
        <div className="text-sm md:text-base">
          {sender === 'bot' ? (
            <ReactMarkdown
              components={{
                // Custom styling for markdown elements with better spacing
                p: ({node, ...props}) => <p className="mb-3 leading-relaxed last:mb-0" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                ul: ({node, ...props}) => <ul className="list-none ml-0 my-3 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal ml-5 my-3 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-3 mt-2" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2 mt-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-2 mt-1" {...props} />,
              }}
            >
              {message.text}
            </ReactMarkdown>
          ) : (
            <div className="whitespace-pre-wrap break-words">{message.text}</div>
          )}
        </div>
        
        {/* Risk level indicator (if present) */}
        {riskLevel && (
          <div className={`mt-3 pt-2 border-t ${isUser ? 'border-blue-400' : 'border-gray-300'}`}>
            <div className={`text-xs md:text-sm ${getRiskLevelColor()}`}>
              <strong>Risk Level:</strong> {riskLevel}
            </div>
          </div>
        )}
        
        {/* Timestamp */}
        <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
