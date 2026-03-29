import React, { useState } from 'react';

/**
 * InputBox Component
 * 
 * Captures user text input and handles submission via Enter key or button click.
 * Clears input after submission and can be disabled during processing.
 * 
 * @param {Object} props
 * @param {(text: string) => void} props.onSend - Callback when user submits message
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {string} props.placeholder - Placeholder text for input field
 */
function InputBox({ onSend, disabled, placeholder }) {
  const [inputText, setInputText] = useState('');

  // Handle input text change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Handle message submission
  const handleSubmit = () => {
    // Only submit if there's text and input is not disabled
    if (inputText.trim() && !disabled) {
      onSend(inputText.trim());
      setInputText(''); // Clear input after submission
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter behavior
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-300 bg-white p-4">
      <div className="flex space-x-2">
        {/* Text input field */}
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder={placeholder}
          className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          }`}
        />
        
        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={disabled || !inputText.trim()}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            disabled || !inputText.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default InputBox;
