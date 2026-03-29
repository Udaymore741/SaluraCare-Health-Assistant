import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI client with API key from environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAjEWmTsruGc3Mzm_2VNzOc6l89DwX-EKo";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Enhances chatbot response with AI-generated content using Gemini
 */
export async function enhanceResponse(baseResponse, context, options = {}) {
  try {
    console.log('🤖 AI Enhancement Starting...');
    console.log('Base Response:', baseResponse);
    console.log('Context:', context);
    
    const {
      tone = 'empathetic',
      includeEmoji = true,
      maxSentences = 7
    } = options;

    const toneInstructions = {
      professional: 'Use formal, clinical language while remaining approachable. Focus on facts and clear guidance.',
      friendly: 'Use warm, conversational language as if speaking to a friend. Be supportive and encouraging.',
      empathetic: 'Show deep understanding and compassion. Acknowledge emotions and provide reassurance.'
    };

    const emojiInstruction = includeEmoji 
      ? 'Add 2-3 relevant medical/health emoji appropriately throughout the response' 
      : 'Keep response text-only without emoji';

    const promptText = `You are SaluraCare, a compassionate health assistant AI.

CONTEXT:
- Patient Age: ${context.age || 'Not provided'} years
- Symptoms: ${context.symptoms || 'Not provided'}
- Duration: ${context.duration || 'Not provided'} days

ORIGINAL ASSESSMENT:
${baseResponse}

TONE: ${tone.toUpperCase()}
${toneInstructions[tone] || toneInstructions.empathetic}

YOUR TASK:
Create a comprehensive, well-formatted response (5-7 sentences) that:

1. Acknowledges their SPECIFIC symptoms (e.g., "your mild cough" or "your fever and headache")
2. Explains WHY this risk level was assigned based on symptoms and duration
3. Maintains the EXACT same risk level and recommendation
4. Provides DETAILED actionable advice:
   - HIGH risk: Immediate steps, what to expect at ER
   - MEDIUM risk: Timeline for care, tests needed, monitoring
   - LOW risk: Home remedies (rest, hydration, OTC meds), self-care tips, when to escalate
5. ${emojiInstruction}

FORMATTING REQUIREMENTS (VERY IMPORTANT):
- Use **bold** for key terms like risk levels, recommendations, and important actions
- Add TWO line breaks between paragraphs (use double newlines: \n\n)
- Structure with clear sections separated by blank lines:
  * Opening: Acknowledge symptoms with empathy
  * Risk Assessment: Explain the **RISK LEVEL** clearly
  * Recommendation: State the main **RECOMMENDATION** in bold
  * Action Steps: Provide specific tips (use bullet points with • or numbered list)
  * Closing: Reassurance and when to seek help

EXAMPLE FORMAT:
Thank you for sharing about your [symptom]. I understand this must be [emotion]. 😊

Based on your symptoms lasting [duration] days, this indicates a **[RISK LEVEL]** risk level. [Brief explanation why].

**Recommendation:** [Main recommendation in bold]

Here's what you can do:

• [Action 1]

• [Action 2]  

• [Action 3]

Please monitor your symptoms and seek medical help if [escalation conditions]. We're here to support you! 💙

CRITICAL RULES:
- ALWAYS use **bold** for risk level and recommendation
- ALWAYS add TWO line breaks (\n\n) between paragraphs for better spacing
- ALWAYS add blank lines before and after bullet lists
- ALWAYS mention their exact symptoms
- ALWAYS include practical recommendations
- NEVER add new diagnosis
- NEVER contradict risk level
- Make it detailed, well-formatted, and easy to read

Enhanced Response:`;

    console.log('📝 Sending prompt to Gemini...');
    const response = await callGemini(promptText);
    
    console.log('✅ AI Response received:', response);
    
    if (!response || response.trim() === '') {
      console.warn('⚠️ Empty AI response, using base response');
      return baseResponse;
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error enhancing response:', error);
    return baseResponse;
  }
}

/**
 * Calls Google Gemini API
 */
export async function callGemini(prompt) {
  try {
    console.log('🔄 Calling Gemini API...');
    
    // Use gemini-2.5-flash as shown in the API reference
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const text = response.text || '';
    console.log('📨 Gemini API Response Length:', text.length, 'characters');
    console.log('📨 Response preview:', text.substring(0, 150) + '...');
    
    return text;
  } catch (error) {
    console.error('❌ Gemini API error:', error);
    console.error('Error details:', error.message);
    
    if (error.message?.includes('API key')) {
      console.error('⚠️ Invalid or missing Gemini API key');
    } else if (error.message?.includes('quota')) {
      console.error('⚠️ Gemini API quota exceeded');
    } else if (error.message?.includes('not found')) {
      console.error('⚠️ Model not found. Available models: gemini-2.5-flash, gemini-1.5-flash, gemini-pro');
    }
    
    return '';
  }
}

/**
 * Placeholder for OpenAI integration
 */
export async function callOpenAI(prompt) {
  console.log('OpenAI integration not yet implemented');
  return '';
}
