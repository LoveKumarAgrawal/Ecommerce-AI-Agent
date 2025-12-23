# AI Live Chat Agent - Frontend

This is the frontend React application for the AI Live Chat Agent. It provides a modern, responsive chat interface for customers to interact with an AI-powered support agent.

## 🚀 Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS (custom design)
- **State Management**: React Hooks

## 📋 Features

- ✅ Real-time chat interface with user and AI messages
- ✅ Auto-scroll to latest messages
- ✅ "Agent is typing..." indicator
- ✅ Session persistence using localStorage
- ✅ Conversation history loading on page reload
- ✅ Input validation (empty/long messages)
- ✅ Error handling with user-friendly messages
- ✅ Disabled send button during request
- ✅ Responsive design for mobile and desktop
- ✅ New chat functionality to start fresh conversations

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ or Bun installed
- Backend server running (see backend README)

### Installation

1. Navigate to the frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
# or
bun install
```

3. Configure environment:
```powershell
Copy-Item .env.example .env
```

The `.env` file should contain:
```env
VITE_API_URL=http://localhost:3000
```

### Running the Application

**Development mode:**
```powershell
npm run dev
# or
bun run dev
```

**Build for production:**
```powershell
npm run build
# or
bun run build
```

**Preview production build:**
```powershell
npm run preview
# or
bun run preview
```

The application will be available at `http://localhost:5173`

## 🎨 User Interface

### Chat Components

1. **Header**
   - App title and description
   - "New Chat" button to start fresh conversations

2. **Welcome Screen**
   - Displayed when no messages yet
   - Suggests sample questions to ask

3. **Message List**
   - Scrollable message history
   - User messages (right-aligned, purple gradient)
   - AI messages (left-aligned, white background)
   - Timestamps for each message
   - Auto-scroll to newest message

4. **Typing Indicator**
   - Animated dots shown while AI is generating response

5. **Input Area**
   - Text input with 2000 character limit
   - Send button (disabled when empty or loading)
   - Enter key to send message

6. **Error Banner**
   - Slides down from top when errors occur
   - Dismissible with close button
   - User-friendly error messages

## 💡 Usage

### Starting a Conversation

1. Open the app in your browser
2. Type a question in the input box (e.g., "What's your shipping policy?")
3. Press Enter or click the send button
4. Wait for the AI response (typing indicator will show)
5. Continue the conversation naturally

### Sample Questions

Try asking:
- "What's your shipping policy?"
- "Do you ship internationally?"
- "How do I return an item?"
- "What are your support hours?"
- "What payment methods do you accept?"

### Session Management

- Conversations are automatically saved to localStorage
- Reload the page to continue your previous conversation
- Click "New Chat" to start a fresh conversation
- Each conversation has a unique session ID

## 🔧 API Integration

The frontend communicates with the backend via REST API:

### Send Message
```typescript
apiService.sendMessage(message: string, sessionId?: string)
  .then(response => {
    // response.reply - AI response text
    // response.sessionId - session identifier
  })
```

### Get History
```typescript
apiService.getHistory(sessionId: string)
  .then(response => {
    // response.messages - array of messages
  })
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api.ts           # API service for backend communication
│   ├── Chat.tsx         # Main chat component
│   ├── Chat.css         # Chat component styles
│   ├── App.tsx          # Root component
│   ├── App.css          # Global app styles
│   ├── index.css        # Base styles
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## 🎨 Styling

The application uses a modern, clean design with:
- Purple gradient theme (#667eea to #764ba2)
- Smooth animations and transitions
- Message bubbles with shadows
- Responsive layout for all screen sizes
- Custom scrollbar styling
- Accessible color contrasts

## 🛡️ Error Handling

The frontend handles various error scenarios:
- ✅ Empty messages (client-side validation)
- ✅ Messages over 2000 characters
- ✅ Backend connection failures
- ✅ API errors from LLM service
- ✅ Network timeouts
- ✅ Invalid server responses

All errors display user-friendly messages in the error banner.

## 📱 Responsive Design

The chat interface adapts to different screen sizes:
- **Desktop**: Full-width chat (max 900px) with spacious layout
- **Tablet**: Adjusted padding and message widths
- **Mobile**: Optimized for small screens with touch-friendly buttons

## 🔒 Data Privacy

- Session IDs stored in localStorage (client-side only)
- No personal data collected
- Messages sent to backend are persisted in SQLite database
- Clear localStorage to remove all local data

## 🧪 Testing Scenarios

Test the following:

1. **Normal Flow**
   - Send a message and receive response
   - Continue multi-turn conversation
   - Reload page to verify history loads

2. **Edge Cases**
   - Try sending empty message (should be prevented)
   - Send very long message (>2000 chars, should show error)
   - Send message while backend is offline (should show connection error)
   - Click send button repeatedly (should handle gracefully)

3. **UI/UX**
   - Check auto-scroll behavior
   - Verify typing indicator appears
   - Test "New Chat" button
   - Try resizing browser window
   - Test on mobile device

## ⚡ Performance

- Vite for fast development and builds
- Lazy loading of chat history
- Optimized re-renders with React hooks
- Smooth animations with CSS transitions
- Minimal bundle size

## 🎯 Future Enhancements

Possible improvements:
- Markdown support in messages
- File upload capability
- Voice input/output
- Multi-language support
- Dark mode toggle
- Chat export functionality
- Emoji picker
- Read receipts
