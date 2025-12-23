# AI Live Chat Agent - Backend

This is the backend service for the AI Live Chat Agent application. It provides REST API endpoints for real-time customer support powered by Google Gemini AI.

## 🚀 Tech Stack

- **Runtime**: Bun (fast all-in-one JavaScript runtime)
- **Framework**: Express.js
- **Language**: TypeScript
- **LLM**: Google Gemini API (@google/genai)
- **Database**: SQLite (Bun's built-in bun:sqlite)
- **Validation**: Zod
- **API**: REST with JSON

## 📋 Features

- ✅ Real-time AI chat responses using Google Gemini
- ✅ Persistent conversation storage with SQLite
- ✅ Session management for conversation continuity
- ✅ **Robust input validation using Zod schemas**
- ✅ **Comprehensive error handling (never crashes on bad input)**
- ✅ CORS support for frontend integration
- ✅ FAQ knowledge base for fictional e-commerce store
- ✅ Express.js middleware architecture
- ✅ Request logging and error tracking

## 🛠️ Setup Instructions

### Prerequisites

- [Bun](https://bun.sh/) installed (v1.0+)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Navigate to the backend directory:
```powershell
cd backend
```

2. Install dependencies:
```powershell
bun install
```

3. Create environment configuration:
```powershell
Copy-Item .env.example .env
```

4. Edit `.env` and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Running the Server

**Development mode (with hot reload):**
```powershell
bun run dev
```

**Production mode:**
```powershell
bun start
```

The server will start at `http://localhost:3000`

## 📡 API Endpoints

### 1. Send Chat Message
**POST** `/chat/message`

Send a user message and receive an AI-generated reply.

**Request Body:**
```json
{
  "message": "What's your shipping policy?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "reply": "We offer free shipping on orders over $50...",
  "sessionId": "uuid-of-session"
}
```

**Error Response:**
```json
{
  "error": "Message cannot be empty"
}
```

### 2. Get Conversation History
**GET** `/chat/history/:sessionId`

Retrieve all messages from a specific conversation.

**Response:**
```json
{
  "sessionId": "uuid-of-session",
  "messages": [
    {
      "id": "msg-uuid",
      "conversationId": "session-uuid",
      "sender": "user",
      "text": "What's your return policy?",
      "timestamp": 1703347200000
    },
    {
      "id": "msg-uuid-2",
      "conversationId": "session-uuid",
      "sender": "ai",
      "text": "We have a 30-day return window...",
      "timestamp": 1703347201000
    }
  ]
}
```

### 3. Health Check
**GET** `/health`

Check if the server and LLM service are operational.

**Response:**
```json
{
  "status": "ok",
  "llmEnabled": true,
  "timestamp": 1703347200000
}
```

## 🗄️ Database Schema

### Conversations Table
```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  createdAt INTEGER NOT NULL
)
```

### Messages Table
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversationId TEXT NOT NULL,
  sender TEXT NOT NULL CHECK(sender IN ('user', 'ai')),
  text TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (conversationId) REFERENCES conversations(id)
)
```

## 🤖 LLM Integration

The backend uses Google Gemini (`gemini-pro` model) with the following configuration:

- **Max Tokens**: 500 (for cost control)
- **Temperature**: 0.7 (balanced creativity/consistency)
- **Context Window**: Last 10 messages
- **System Prompt**: Includes FAQ knowledge base about TechStyle Store

### FAQ Knowledge Base

The AI agent has built-in knowledge about:
- Shipping policies (free over $50, standard/express options)
- Return & refund policies (30-day window)
- Support hours (Mon-Fri 9AM-6PM EST)
- Payment methods (cards, PayPal, Apple/Google Pay)
- International shipping availability

## 🛡️ Error Handling

The backend handles:
- ✅ Empty or invalid messages (Zod validation)
- ✅ Messages exceeding max length (2000 chars)
- ✅ Malformed JSON requests
- ✅ Invalid UUIDs for session IDs
- ✅ Missing required fields
- ✅ Type mismatches (string vs number, etc.)
- ✅ Invalid API keys
- ✅ Rate limiting from LLM provider
- ✅ Network timeouts
- ✅ Database errors
- ✅ **Backend never crashes** - all errors are caught and returned gracefully

All errors return appropriate HTTP status codes and user-friendly messages.

### Robustness Features

1. **Zod Schema Validation**: Every request is validated against strict TypeScript schemas
2. **Async Error Handling**: All async routes wrapped in error handlers
3. **Global Error Handler**: Catches any unhandled errors
4. **Input Sanitization**: Automatic trimming and length validation
5. **Graceful Degradation**: System continues working even if LLM fails

## 📁 Project Structure

```
backend/
├── index.ts          # Main Express server and API routes
├── database.ts       # SQLite database service (bun:sqlite)
├── llm.ts           # Google Gemini LLM service (@google/genai)
├── validation.ts    # Zod schemas for request validation
├── package.json     # Dependencies and scripts
├── tsconfig.json    # TypeScript configuration
├── .env.example     # Environment template
└── chat.db          # SQLite database (auto-generated)
```

## 🔒 Security Notes

- Never commit `.env` file with actual API keys
- API keys are loaded from environment variables only
- Input validation prevents injection attacks
- CORS is configured to accept requests only from the frontend URL
- Message length is capped to prevent abuse

## 🧪 Testing Tips

Test with various inputs:
- Empty messages (should reject)
- Very long messages (>2000 chars, should reject)
- Normal questions about shipping, returns, etc.
- Multiple messages in sequence (tests conversation context)
- Invalid session IDs (should create new conversation)

## 📝 Notes

- Database file (`chat.db`) is created automatically on first run
- Conversations persist across server restarts
- Each conversation has a unique UUID
- Message timestamps are in Unix milliseconds

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.3. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
