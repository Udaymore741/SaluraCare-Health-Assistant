import { useState, useEffect, useRef } from 'react';
import { CONVERSATION_STEPS, getNextPrompt, processUserInput } from './logic/conversationController';
import { analyzeRisk, getRecommendation } from './logic/healthAnalyzer';
import { enhanceResponse } from './services/aiService';
import ChatWindow from './components/ChatWindow';
import InputBox from './components/InputBox';

function App() {
  // State management
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(CONVERSATION_STEPS.ASK_AGE);
  const [symptomData, setSymptomData] = useState({
    age: null,
    symptoms: null,
    duration: null
  });
  const [isTyping, setIsTyping] = useState(false);
  const initialized = useRef(false);

  // Initialize with medical disclaimer on component mount (ref prevents StrictMode double-run)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    addBotMessage(getNextPrompt(CONVERSATION_STEPS.DISCLAIMER));
    setTimeout(() => {
      addBotMessage(getNextPrompt(CONVERSATION_STEPS.ASK_AGE));
    }, 1000);
  }, []);

  /**
   * Helper function to add bot messages with typing simulation
   * @param {string} text - Message text
   * @param {string} riskLevel - Optional risk level for final message
   */
  const addBotMessage = (text, riskLevel = null) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const newMessage = {
        id: `${Date.now()}-${Math.random()}`,
        text,
        sender: 'bot',
        timestamp: new Date(),
        riskLevel
      };
      
      // Maintain state immutability by creating new array
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setIsTyping(false);
    }, 800);
  };

  /**
   * Processes user input and manages conversation flow
   * @param {string} userInput - User's message text
   */
  const handleUserMessage = (userInput) => {
    if (!userInput.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: `${Date.now()}-${Math.random()}`,
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Process input based on current step
    const processed = processUserInput(userInput, currentStep);

    if (!processed.isValid) {
      // Show error message and stay at current step
      addBotMessage(`❌ ${processed.errorMessage}`);
      return;
    }

    // Update symptom data based on current step
    switch (currentStep) {
      case CONVERSATION_STEPS.ASK_AGE:
        setSymptomData(prev => ({ ...prev, age: processed.value }));
        setCurrentStep(CONVERSATION_STEPS.ASK_SYMPTOMS);
        addBotMessage(getNextPrompt(CONVERSATION_STEPS.ASK_SYMPTOMS));
        break;

      case CONVERSATION_STEPS.ASK_SYMPTOMS:
        setSymptomData(prev => ({ ...prev, symptoms: processed.value }));
        setCurrentStep(CONVERSATION_STEPS.ASK_DURATION);
        addBotMessage(getNextPrompt(CONVERSATION_STEPS.ASK_DURATION));
        break;

      case CONVERSATION_STEPS.ASK_DURATION:
        // All data collected, perform analysis
        const updatedSymptomData = { ...symptomData, duration: processed.value };
        setSymptomData(updatedSymptomData);
        setCurrentStep(CONVERSATION_STEPS.ANALYZE);
        
        // Show analyzing message
        addBotMessage(getNextPrompt(CONVERSATION_STEPS.ANALYZE));
        
        // Perform risk analysis and show recommendation with AI enhancement
        setTimeout(async () => {
          const riskLevel = analyzeRisk(updatedSymptomData);
          const recommendation = getRecommendation(riskLevel);
          
          const baseRecommendationMessage = `📊 **Risk Assessment Complete**\n\n` +
            `Risk Level: **${riskLevel}**\n\n` +
            `Recommendation: ${recommendation}\n\n` +
            `${getRiskLevelMessage(riskLevel)}`;
          
          // Try to enhance with AI
          try {
            const enhancedMessage = await enhanceResponse(baseRecommendationMessage, updatedSymptomData);
            addBotMessage(enhancedMessage, riskLevel);
          } catch (error) {
            console.error('AI enhancement failed, using base message:', error);
            addBotMessage(baseRecommendationMessage, riskLevel);
          }
          
          setCurrentStep(CONVERSATION_STEPS.COMPLETE);
        }, 1500);
        break;

      default:
        break;
    }
  };

  /**
   * Gets contextual message based on risk level
   * @param {string} riskLevel - Risk level classification
   * @returns {string} - Contextual message
   */
  const getRiskLevelMessage = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH':
        return '⚠️ Please seek immediate medical attention. Your symptoms require urgent evaluation by a healthcare professional.';
      case 'MEDIUM':
        return '⚕️ We recommend scheduling a lab test or doctor consultation soon to properly evaluate your condition.';
      case 'LOW':
        return '💊 Your symptoms appear manageable with home care or pharmacy consultation. Monitor your condition and seek medical help if symptoms worsen.';
      default:
        return '';
    }
  };

  /**
   * Restarts the chat session
   */
  const handleRestart = () => {
    setMessages([]);
    setSymptomData({ age: null, symptoms: null, duration: null });
    setCurrentStep(CONVERSATION_STEPS.ASK_AGE);
    setIsTyping(false);

    addBotMessage(getNextPrompt(CONVERSATION_STEPS.DISCLAIMER));
    setTimeout(() => {
      addBotMessage(getNextPrompt(CONVERSATION_STEPS.ASK_AGE));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">
            SaluraCare Health Assistant 🏥
          </h1>
        </div>

        {/* Chat Window */}
        <ChatWindow messages={messages} isTyping={isTyping} />

        {/* Input Box */}
        <InputBox
          onSend={handleUserMessage}
          disabled={currentStep === CONVERSATION_STEPS.COMPLETE || isTyping}
          placeholder={
            currentStep === CONVERSATION_STEPS.COMPLETE
              ? 'Chat completed. Click restart to begin again.'
              : 'Type your message...'
          }
        />
        
        {/* Restart Button */}
        {currentStep === CONVERSATION_STEPS.COMPLETE && (
          <div className="border-t p-4 bg-white">
            <button
              onClick={handleRestart}
              className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              🔄 Restart Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
