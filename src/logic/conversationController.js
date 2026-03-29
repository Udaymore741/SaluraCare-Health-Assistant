/**
 * Conversation Controller Module
 * Manages the conversational flow and input validation for the health assistant chatbot
 */

// Conversation step constants
export const CONVERSATION_STEPS = {
  DISCLAIMER: 'DISCLAIMER',
  ASK_AGE: 'ASK_AGE',
  ASK_SYMPTOMS: 'ASK_SYMPTOMS',
  ASK_DURATION: 'ASK_DURATION',
  ANALYZE: 'ANALYZE',
  COMPLETE: 'COMPLETE'
};

/**
 * Determines the next conversation step
 * @param {string} currentStep - Current step in conversation
 * @param {Object} symptomData - Collected data so far
 * @returns {string} - Next chatbot prompt message
 */
export function getNextPrompt(currentStep, symptomData) {
  switch (currentStep) {
    case CONVERSATION_STEPS.DISCLAIMER:
      return "⚕️ Welcome to SaluraCare Health Assistant! This chatbot provides general guidance and is not a medical professional. Let's begin by collecting some information.";
    
    case CONVERSATION_STEPS.ASK_AGE:
      return "📋 Please enter your age:";
    
    case CONVERSATION_STEPS.ASK_SYMPTOMS:
      return "🩺 Please describe your symptoms:";
    
    case CONVERSATION_STEPS.ASK_DURATION:
      return "📅 How many days have you been experiencing these symptoms?";
    
    case CONVERSATION_STEPS.ANALYZE:
      return "🔍 Analyzing your symptoms...";
    
    case CONVERSATION_STEPS.COMPLETE:
      return "✅ Thank you for using SaluraCare Health Assistant. Click 'Restart Chat' to begin a new session.";
    
    default:
      return "I'm here to help. Let's start over.";
  }
}

/**
 * Validates input based on expected data type
 * @param {string} input - User input text
 * @param {string} expectedType - 'age', 'symptoms', or 'duration'
 * @returns {Object} - ValidationResult with isValid, errorMessage, and parsedValue
 */
export function validateInput(input, expectedType) {
  const trimmedInput = input.trim();

  switch (expectedType) {
    case 'age': {
      // Check if input is numeric
      const ageValue = Number(trimmedInput);
      
      if (isNaN(ageValue) || trimmedInput === '') {
        return {
          isValid: false,
          errorMessage: "Please enter a valid age as a number"
        };
      }
      
      // Check if age is positive
      if (ageValue <= 0 || !Number.isInteger(ageValue)) {
        return {
          isValid: false,
          errorMessage: "Please enter a valid age greater than 0"
        };
      }
      
      return {
        isValid: true,
        parsedValue: ageValue
      };
    }

    case 'duration': {
      // Check if input is numeric
      const durationValue = Number(trimmedInput);
      
      if (isNaN(durationValue) || trimmedInput === '') {
        return {
          isValid: false,
          errorMessage: "Please enter the number of days"
        };
      }
      
      // Check if duration is non-negative
      if (durationValue < 0 || !Number.isInteger(durationValue)) {
        return {
          isValid: false,
          errorMessage: "Duration must be 0 or more days"
        };
      }
      
      return {
        isValid: true,
        parsedValue: durationValue
      };
    }

    case 'symptoms': {
      // Check if symptoms is non-empty
      if (trimmedInput === '') {
        return {
          isValid: false,
          errorMessage: "Please describe your symptoms"
        };
      }
      
      return {
        isValid: true,
        parsedValue: trimmedInput
      };
    }

    default:
      return {
        isValid: false,
        errorMessage: "Invalid input type"
      };
  }
}

/**
 * Processes user input for current step
 * @param {string} userInput - User's message text
 * @param {string} currentStep - Current step in conversation
 * @returns {Object} - ProcessedInput with isValid, value, and errorMessage
 */
export function processUserInput(userInput, currentStep) {
  switch (currentStep) {
    case CONVERSATION_STEPS.ASK_AGE: {
      const validation = validateInput(userInput, 'age');
      return {
        isValid: validation.isValid,
        value: validation.parsedValue,
        errorMessage: validation.errorMessage
      };
    }

    case CONVERSATION_STEPS.ASK_SYMPTOMS: {
      const validation = validateInput(userInput, 'symptoms');
      return {
        isValid: validation.isValid,
        value: validation.parsedValue,
        errorMessage: validation.errorMessage
      };
    }

    case CONVERSATION_STEPS.ASK_DURATION: {
      const validation = validateInput(userInput, 'duration');
      return {
        isValid: validation.isValid,
        value: validation.parsedValue,
        errorMessage: validation.errorMessage
      };
    }

    default:
      return {
        isValid: true,
        value: userInput
      };
  }
}
