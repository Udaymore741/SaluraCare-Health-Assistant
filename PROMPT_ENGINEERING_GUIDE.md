# Prompt Engineering Guide - SaluraCare Health Assistant

## Overview

This guide explains the improved AI prompt system for the SaluraCare Health Assistant. The enhanced prompts produce more empathetic, accurate, and contextually appropriate responses.

## What Changed

### Before (Simple Prompt)
```javascript
const prompt = `You are a compassionate health assistant. 
Enhance this response: ${baseResponse}
Keep it concise and add emoji.`;
```

### After (Enhanced Prompt)
```javascript
const prompt = `You are SaluraCare, a compassionate and professional health assistant AI.

CONTEXT:
- Patient Age: ${context.age} years old
- Reported Symptoms: ${context.symptoms}
- Symptom Duration: ${context.duration} days

ORIGINAL ASSESSMENT:
${baseResponse}

YOUR TASK:
Transform the above assessment into a warm, empathetic response that:
1. Acknowledges the patient's concern
2. Maintains exact same risk level
3. Uses clear, accessible language
... (detailed instructions)
`;
```

## Key Improvements

### 1. **Clear Role Definition**
```javascript
"You are SaluraCare, a compassionate and professional health assistant AI."
```
- Gives the AI a specific identity
- Sets expectations for tone and behavior
- Creates consistency across responses

### 2. **Structured Context**
```javascript
CONTEXT:
- Patient Age: 45 years old
- Reported Symptoms: chest pain
- Symptom Duration: 1 days
```
- Provides clear patient information
- Helps AI understand severity
- Enables personalized responses

### 3. **Explicit Task Instructions**
```javascript
YOUR TASK:
Transform the above assessment into a warm, empathetic response that:
1. Acknowledges the patient's concern
2. Maintains the exact same risk level
...
```
- Numbered list of requirements
- Clear expectations
- Prevents AI from deviating

### 4. **Risk-Specific Tone Guidance**
```javascript
5. Includes appropriate emotional tone:
   - HIGH risk: Urgent but calm, emphasize immediate action
   - MEDIUM risk: Concerned but reassuring, encourage timely action
   - LOW risk: Supportive and reassuring, provide comfort
```
- Adapts tone to urgency
- Maintains appropriate emotional response
- Balances empathy with action

### 5. **Safety Guidelines**
```javascript
IMPORTANT GUIDELINES:
- Do NOT add new medical information or diagnosis
- Do NOT contradict the original risk level
- Do NOT use overly technical medical terms
- DO maintain a balance between empathy and professionalism
```
- Prevents hallucination
- Maintains medical accuracy
- Ensures consistency

## Advanced Features

### Configurable Options

The enhanced `enhanceResponse()` function now accepts options:

```javascript
await enhanceResponse(baseResponse, context, {
  tone: 'empathetic',      // 'professional', 'friendly', 'empathetic'
  includeEmoji: true,      // true or false
  maxSentences: 4          // 1-10
});
```

#### Tone Options

**1. Empathetic (Default)**
```javascript
tone: 'empathetic'
```
- Shows deep understanding and compassion
- Acknowledges emotions
- Provides reassurance
- Example: "I understand this must be concerning for you. 😟"

**2. Professional**
```javascript
tone: 'professional'
```
- Uses formal, clinical language
- Focuses on facts and guidance
- Maintains approachability
- Example: "Based on your symptoms, I recommend immediate medical evaluation."

**3. Friendly**
```javascript
tone: 'friendly'
```
- Warm, conversational language
- Supportive and encouraging
- Like speaking to a friend
- Example: "Thanks for sharing that with me! Let's figure this out together. 💙"

### Usage Examples

#### Example 1: High Risk with Empathetic Tone
```javascript
const context = {
  age: 45,
  symptoms: 'chest pain and shortness of breath',
  duration: 1
};

const enhanced = await enhanceResponse(
  baseResponse, 
  context, 
  { tone: 'empathetic', includeEmoji: true }
);

// Output:
// "I understand this must be very concerning for you. 😟 Given your symptoms 
// of chest pain and breathing difficulties, I strongly recommend seeking 
// immediate emergency care. Your health and safety are the priority - please 
// don't delay getting professional medical evaluation. 🏥"
```

#### Example 2: Medium Risk with Professional Tone
```javascript
const context = {
  age: 30,
  symptoms: 'fever and headache',
  duration: 5
};

const enhanced = await enhanceResponse(
  baseResponse, 
  context, 
  { tone: 'professional', includeEmoji: false }
);

// Output:
// "Based on your reported symptoms of fever lasting 5 days, I recommend 
// scheduling a lab test or medical consultation within the next 24-48 hours. 
// This duration warrants professional evaluation to determine the underlying 
// cause and appropriate treatment."
```

#### Example 3: Low Risk with Friendly Tone
```javascript
const context = {
  age: 25,
  symptoms: 'mild cough',
  duration: 2
};

const enhanced = await enhanceResponse(
  baseResponse, 
  context, 
  { tone: 'friendly', includeEmoji: true, maxSentences: 3 }
);

// Output:
// "Thanks for checking in about your cough! 😊 It sounds like something 
// manageable with some home care or a quick pharmacy visit. Keep an eye 
// on it, and if things get worse, don't hesitate to reach out to a doctor! 💊"
```

## Additional AI Functions

### 1. Enhanced Questions
Make conversation flow more naturally:

```javascript
import { enhanceQuestion } from './services/aiService';

const question = "What is your age?";
const enhanced = await enhanceQuestion(question);

// Output: "I'd like to start by learning a bit about you. What's your age? 😊"
```

### 2. Acknowledgment Messages
Show empathy when receiving input:

```javascript
import { generateAcknowledgment } from './services/aiService';

const ack = await generateAcknowledgment("chest pain", "symptoms");

// Output: "Thank you for sharing that - I know it can be difficult to talk 
// about concerning symptoms. 💙"
```

## Prompt Templates

Pre-defined templates for different scenarios:

```javascript
import { PROMPT_TEMPLATES } from './services/aiService';

// Use templates in your prompts
const prompt = `${PROMPT_TEMPLATES.highRisk}

User symptoms: ${symptoms}
...`;
```

### Available Templates

1. **highRisk** - Urgent but calm guidance
2. **mediumRisk** - Concerned but reassuring
3. **lowRisk** - Supportive and comforting
4. **empathetic** - Deep understanding phrases
5. **professional** - Clinical language examples
6. **friendly** - Conversational phrases

## Best Practices

### ✅ DO

1. **Be Specific**
   ```javascript
   // Good
   "Maintain the exact same risk level: HIGH"
   
   // Bad
   "Keep the risk level"
   ```

2. **Provide Context**
   ```javascript
   // Good
   "Patient Age: 45 years old, Symptoms: chest pain"
   
   // Bad
   "Age: 45, Symptoms: chest pain"
   ```

3. **Use Numbered Lists**
   ```javascript
   // Good
   "1. Acknowledge concern
    2. Maintain risk level
    3. Use clear language"
   
   // Bad
   "Acknowledge concern, maintain risk level, use clear language"
   ```

4. **Include Examples**
   ```javascript
   // Good
   "HIGH risk: Urgent but calm, emphasize immediate action"
   
   // Bad
   "Adjust tone based on risk"
   ```

### ❌ DON'T

1. **Don't Be Vague**
   ```javascript
   // Bad
   "Make it better"
   
   // Good
   "Transform into a warm, empathetic response"
   ```

2. **Don't Overload**
   ```javascript
   // Bad
   "Do 20 different things in one response"
   
   // Good
   "Focus on 5-7 key requirements"
   ```

3. **Don't Assume**
   ```javascript
   // Bad
   "Enhance the response appropriately"
   
   // Good
   "Enhance by adding empathy while maintaining medical accuracy"
   ```

## Testing Your Prompts

### Test Different Scenarios

```javascript
// Test 1: High Risk
const test1 = await enhanceResponse(
  "HIGH risk - Emergency Care",
  { age: 45, symptoms: "chest pain", duration: 1 }
);
console.log("High Risk:", test1);

// Test 2: Medium Risk
const test2 = await enhanceResponse(
  "MEDIUM risk - Lab Test",
  { age: 30, symptoms: "fever", duration: 5 }
);
console.log("Medium Risk:", test2);

// Test 3: Low Risk
const test3 = await enhanceResponse(
  "LOW risk - Home Care",
  { age: 25, symptoms: "cough", duration: 2 }
);
console.log("Low Risk:", test3);
```

### Evaluate Response Quality

Check for:
- ✅ Maintains original risk level
- ✅ Appropriate emotional tone
- ✅ Clear actionable guidance
- ✅ Concise (3-4 sentences)
- ✅ Includes emoji (if enabled)
- ✅ No medical jargon
- ✅ No new diagnosis

## Customizing Prompts

### Modify the Main Prompt

Edit `src/services/aiService.js`:

```javascript
const prompt = `You are SaluraCare...

// Add your custom instructions here
ADDITIONAL REQUIREMENTS:
- Always mention SaluraCare by name
- Include a call-to-action
- Reference our 24/7 support line

YOUR TASK:
...`;
```

### Add New Tone Options

```javascript
const toneInstructions = {
  professional: '...',
  friendly: '...',
  empathetic: '...',
  // Add new tone
  urgent: 'Use direct, action-oriented language. Focus on immediate steps.',
  casual: 'Use very relaxed, informal language. Be conversational and light.'
};
```

### Create Custom Functions

```javascript
export async function generateFollowUp(previousResponse, userReaction) {
  const prompt = `Based on this previous response:
  ${previousResponse}
  
  And the user's reaction:
  ${userReaction}
  
  Generate an appropriate follow-up message...`;
  
  return await callGemini(prompt);
}
```

## Performance Tips

### 1. Cache Common Responses
```javascript
const responseCache = new Map();

export async function enhanceResponseCached(baseResponse, context) {
  const cacheKey = `${baseResponse}-${JSON.stringify(context)}`;
  
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }
  
  const enhanced = await enhanceResponse(baseResponse, context);
  responseCache.set(cacheKey, enhanced);
  return enhanced;
}
```

### 2. Batch Requests
```javascript
export async function enhanceMultiple(requests) {
  return await Promise.all(
    requests.map(({ baseResponse, context }) => 
      enhanceResponse(baseResponse, context)
    )
  );
}
```

### 3. Timeout Handling
```javascript
export async function enhanceResponseWithTimeout(baseResponse, context, timeout = 5000) {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), timeout)
  );
  
  try {
    return await Promise.race([
      enhanceResponse(baseResponse, context),
      timeoutPromise
    ]);
  } catch (error) {
    console.error('Enhancement timeout, using base response');
    return baseResponse;
  }
}
```

## Troubleshooting

### Issue: Responses are too long
**Solution**: Reduce `maxSentences` parameter
```javascript
enhanceResponse(baseResponse, context, { maxSentences: 2 })
```

### Issue: Tone is inconsistent
**Solution**: Be more explicit in tone instructions
```javascript
const toneInstructions = {
  empathetic: 'ALWAYS start with "I understand..." and use supportive language'
};
```

### Issue: AI adds medical diagnosis
**Solution**: Strengthen safety guidelines
```javascript
CRITICAL RULES:
- NEVER provide medical diagnosis
- NEVER add new medical information
- ONLY enhance the existing assessment
```

### Issue: Responses lack personality
**Solution**: Add personality examples
```javascript
PERSONALITY TRAITS:
- Warm and caring like a nurse
- Professional like a doctor
- Accessible like a friend
```

## Next Steps

1. ✅ Test the improved prompts with various scenarios
2. ✅ Experiment with different tone options
3. ✅ Monitor response quality and user feedback
4. 🔄 Iterate on prompts based on results
5. 🔄 Add custom functions for specific use cases

---

**Remember**: Good prompts are:
- **Clear** - Specific instructions
- **Structured** - Organized format
- **Contextual** - Relevant information
- **Safe** - Guardrails and guidelines
- **Testable** - Measurable outcomes

Happy prompt engineering! 🚀
