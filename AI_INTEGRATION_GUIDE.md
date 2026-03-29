# AI Integration Guide - SaluraCare Health Assistant

## Overview

The SaluraCare Health Assistant now includes **Google Gemini AI integration** to enhance chatbot responses with more empathetic, personalized, and context-aware messages while maintaining medical accuracy.

## Features

✅ **AI-Enhanced Responses**: Final health recommendations are enhanced by Gemini AI
✅ **Fallback Mechanism**: If AI fails, the app uses rule-based responses
✅ **Context-Aware**: AI considers user's age, symptoms, and duration
✅ **Empathetic Communication**: AI adds compassionate language to responses
✅ **Medical Accuracy**: AI maintains the original risk assessment and recommendations

## How It Works

### 1. Rule-Based Analysis (Core Logic)
The app first performs rule-based health risk analysis:
- **HIGH Risk**: Chest pain or breathing issues → Emergency Care
- **MEDIUM Risk**: Fever > 3 days → Lab Test Booking
- **LOW Risk**: Other symptoms → Pharmacy/Home Care

### 2. AI Enhancement (Gemini Integration)
After the rule-based analysis, the response is enhanced by Gemini AI to:
- Add empathetic and supportive language
- Provide reassurance while maintaining urgency
- Include relevant emoji for better UX
- Keep responses concise (2-3 sentences)

### 3. Fallback Safety
If AI enhancement fails (network issues, API errors), the app automatically falls back to the base rule-based response.

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the API Key

**Option A: Using Environment Variable (Recommended)**

1. Create a `.env` file in the project root:
   ```bash
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

2. Restart the development server:
   ```bash
   npm run dev
   ```

**Option B: Direct Configuration**

The API key is already configured in `src/services/aiService.js`:
```javascript
const GEMINI_API_KEY = "AIzaSyAjEWmTsruGc3Mzm_2VNzOc6l89DwX-EKo";
```

### 3. Install Dependencies

The required package is already installed:
```bash
npm install @google/genai
```

## Code Structure

### AI Service Module (`src/services/aiService.js`)

```javascript
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Enhance responses with AI
export async function enhanceResponse(baseResponse, context) {
  // Creates prompt with medical context
  // Calls Gemini API
  // Returns enhanced response or falls back to base response
}

// Call Gemini API
export async function callGemini(prompt) {
  // Sends prompt to Gemini 2.0 Flash model
  // Handles errors gracefully
}
```

### App Integration (`src/App.jsx`)

```javascript
import { enhanceResponse } from './services/aiService';

// In the analysis step:
const riskLevel = analyzeRisk(updatedSymptomData);
const recommendation = getRecommendation(riskLevel);

// Create base message
const baseMessage = `Risk Level: ${riskLevel}\nRecommendation: ${recommendation}`;

// Enhance with AI
const enhancedMessage = await enhanceResponse(baseMessage, updatedSymptomData);
addBotMessage(enhancedMessage, riskLevel);
```

## Testing the AI Integration

### Test Case 1: High Risk Symptoms
1. Start the chatbot
2. Enter age: `45`
3. Enter symptoms: `chest pain and shortness of breath`
4. Enter duration: `1`
5. **Expected**: AI-enhanced response with urgent care recommendation

### Test Case 2: Medium Risk Symptoms
1. Start the chatbot
2. Enter age: `30`
3. Enter symptoms: `fever and headache`
4. Enter duration: `5`
5. **Expected**: AI-enhanced response with lab test recommendation

### Test Case 3: Low Risk Symptoms
1. Start the chatbot
2. Enter age: `25`
3. Enter symptoms: `mild cough`
4. Enter duration: `2`
5. **Expected**: AI-enhanced response with home care advice

## API Usage and Limits

### Gemini API Free Tier
- **Rate Limit**: 15 requests per minute
- **Daily Limit**: 1,500 requests per day
- **Model**: gemini-2.0-flash-exp (fast and efficient)

### Cost Optimization
- AI enhancement only runs once per chat session (at final recommendation)
- Fallback to rule-based responses if API fails
- No AI calls for intermediate conversation steps

## Troubleshooting

### Issue: "API key not valid"
**Solution**: Check that your API key is correctly set in `.env` or `aiService.js`

### Issue: "Quota exceeded"
**Solution**: You've hit the free tier limit. Wait for the quota to reset or upgrade your plan.

### Issue: AI responses not showing
**Solution**: 
1. Check browser console for errors
2. Verify internet connection
3. Ensure the API key is valid
4. The app will automatically fall back to base responses

### Issue: Slow responses
**Solution**: 
- Gemini API typically responds in 1-2 seconds
- Check your internet connection
- The app shows a "typing" indicator while waiting

## Security Best Practices

### ⚠️ Important Security Notes

1. **Never commit API keys to Git**:
   ```bash
   # Add to .gitignore
   .env
   ```

2. **Use environment variables in production**:
   ```javascript
   const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
   ```

3. **Rotate API keys regularly**:
   - Generate new keys periodically
   - Revoke old keys from Google AI Studio

4. **Monitor API usage**:
   - Check usage in Google AI Studio dashboard
   - Set up alerts for unusual activity

## Advanced Customization

### Modify AI Prompt

Edit the prompt in `src/services/aiService.js`:

```javascript
const prompt = `You are a compassionate health assistant...

Your custom instructions here...

Enhanced response:`;
```

### Change AI Model

Update the model in `callGemini()`:

```javascript
const response = await ai.models.generateContent({
  model: "gemini-2.0-flash-exp", // or "gemini-pro"
  contents: prompt,
});
```

### Disable AI Enhancement

To disable AI and use only rule-based responses:

```javascript
// In App.jsx, replace:
const enhancedMessage = await enhanceResponse(baseMessage, updatedSymptomData);

// With:
const enhancedMessage = baseMessage;
```

## Why This Command Runs: `npm test -- --run --reporter=verbose`

This command is used to run tests in **non-watch mode** with detailed output:

- `npm test`: Runs the test suite using Vitest
- `--run`: Executes tests once and exits (no watch mode)
- `--reporter=verbose`: Shows detailed test results with full output

**When it runs**:
- During checkpoint tasks (Task 5, 9, 13)
- To verify business logic and UI components
- Before final deployment

**Why it's important**:
- Ensures all correctness properties are validated
- Catches bugs before they reach production
- Verifies AI integration doesn't break existing functionality

## Next Steps

1. ✅ AI integration is complete and working
2. ✅ Test the chatbot with various symptoms
3. ✅ Monitor API usage in Google AI Studio
4. 🔄 Consider adding more AI features:
   - AI-powered symptom suggestions
   - Multi-language support
   - Voice input/output
   - Personalized health tips

## Support

For issues or questions:
- Check the [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- Review error messages in browser console
- Test with the fallback mechanism (base responses)

---

**Congratulations!** 🎉 Your SaluraCare Health Assistant now has AI-powered responses using Google Gemini!
