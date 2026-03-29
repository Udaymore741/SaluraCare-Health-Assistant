# SaluraCare Health Assistant 🏥

A web-based health monitoring chatbot that provides preliminary health risk assessment through conversational interaction, enhanced with Google Gemini AI for detailed, personalized responses.

## Features

- Conversational health data collection (age → symptoms → duration)
- Rule-based symptom analysis with LOW / MEDIUM / HIGH risk classification
- AI-enhanced responses powered by Google Gemini
- Markdown-formatted responses with bold text and bullet points
- Healthcare service recommendations per risk level
- Typing indicator for natural conversation feel
- Restart chat functionality
- Modern React UI with Tailwind CSS

## AI Integration

This app uses the **Google Gemini API** (`gemini-2.5-flash` model) to enhance the final health assessment response.

### How it works

1. The rule-based `healthAnalyzer.js` determines the risk level (LOW / MEDIUM / HIGH)
2. A base recommendation message is generated
3. `aiService.js` sends the base response + patient context (age, symptoms, duration) to Gemini
4. Gemini returns a detailed, empathetic, well-formatted response mentioning the user's specific symptoms and actionable advice
5. If the AI call fails, the base response is shown as fallback

### Setup

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

> The `.env` file is excluded from git to protect your API key.

## Getting Started

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── ChatWindow.jsx      # Scrollable message display
│   ├── InputBox.jsx        # User text input
│   └── MessageBubble.jsx   # Individual message with markdown support
├── logic/
│   ├── healthAnalyzer.js   # Risk classification logic
│   └── conversationController.js  # Conversation flow management
├── services/
│   └── aiService.js        # Google Gemini API integration
└── test/
    └── setup.js
```

## Risk Level Classification

| Risk Level | Condition | Recommendation |
|------------|-----------|----------------|
| 🔴 HIGH | Chest pain / Breathing issues | Doctor Consultation / Emergency Care |
| 🟡 MEDIUM | Fever lasting more than 3 days | Lab Test Booking |
| 🟢 LOW | All other symptoms | Pharmacy / Home Care Advice |

## Technology Stack

- React 18 + Vite
- Tailwind CSS
- Google Gemini AI (`@google/genai`)
- react-markdown (response formatting)
- Vitest + React Testing Library
- fast-check (property-based testing)

## Medical Disclaimer

This chatbot provides general guidance and is not a medical professional. Always consult with qualified healthcare providers for medical advice.
