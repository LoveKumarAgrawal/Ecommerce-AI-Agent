# 🤖 AI Live Chat Agent

A full-stack web application that simulates a customer support chat where an AI agent answers user questions using Google Gemini LLM. Built for e-commerce customer support with persistent conversation history.

## 📸 Demo

A modern chat interface where customers can ask questions about:
- Shipping policies
- Return & refund policies
- Support hours
- Payment methods
- International shipping
- And more!

## 🚀 Tech Stack

### Backend
- **Runtime**: Bun (Node.js compatible)
- **Framework**: Express.js
- **Language**: TypeScript
- **LLM**: Google Gemini API (@google/genai)
- **Database**: SQLite (Bun's built-in bun:sqlite)
- **Validation**: Zod
- **API**: REST with JSON

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State**: React Hooks

## ✨ Features

### Core Functionality
- ✅ Real-time AI-powered chat responses
- ✅ Persistent conversation storage
- ✅ Session management with conversation history
- ✅ Multi-turn contextual conversations
- ✅ FAQ knowledge base integration

### User Experience
- ✅ Clean, modern chat interface
- ✅ Auto-scroll to latest messages
- ✅ "Agent is typing..." indicator
- ✅ Message timestamps
- ✅ New chat functionality
- ✅ Responsive design (mobile & desktop)

### Robustness
- ✅ Input validation (empty/long messages)
- ✅ **Zod schema validation** - catches all malformed requests
- ✅ Comprehensive error handling
- ✅ LLM API error graceful degradation
- ✅ Network failure handling
- ✅ Rate limit protection
- ✅ No hardcoded secrets
- ✅ **Backend never crashes** - all errors caught and handled

## 🎯 Core User Flow

1. **User** opens the web app
2. **User** types a question (e.g., "What's your return policy?")
3. **Frontend** sends message to backend
4. **Backend**:
   - Persists the message to SQLite database
   - Retrieves conversation history
   - Calls Google Gemini API with context
   - Returns AI-generated reply
5. **Frontend** displays the AI response
6. Conversation continues with full context

## 🛠️ Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+) or [Node.js](https://nodejs.org/en) 18+ installed
- Google Gemini API key ([Get one free](https://makersuite.google.com/app/apikey))

### Step-by-Step Local Setup

#### 1. Clone the Repository

```powershell
# Clone or download the project
cd Ecommerce-AI-Agent
```

#### 2. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
bun install

# This will install:
# - @google/genai (Google Gemini SDK)
# - express (Web framework)
# - zod (Validation library)
# - cors (CORS middleware)
```

#### 3. Configure Backend Environment Variables

```powershell
# Copy the example environment file
mv .env.example .env

```

**Required Environment Variables** (in `backend/.env`):

```env
# REQUIRED: Your Google Gemini API Key
GEMINI_API_KEY=your_actual_api_key_here

# Server Configuration (optional, has defaults)
PORT=3000

# Frontend URL for CORS (optional, has default)
FRONTEND_URL=http://localhost:5173
```

**⚠️ Important**: Replace `your_actual_api_key_here` with your real Gemini API key!

#### 4. Database Setup (Automatic)

**No manual setup required!** The SQLite database is automatically created on first run.

The database schema includes:

**Conversations Table:**
```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,           -- UUID
  createdAt INTEGER NOT NULL     -- Unix timestamp
)
```

**Messages Table:**
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,                    -- UUID
  conversationId TEXT NOT NULL,           -- Foreign key
  sender TEXT NOT NULL CHECK(sender IN ('user', 'ai')),
  text TEXT NOT NULL,                     -- Message content
  timestamp INTEGER NOT NULL,             -- Unix timestamp
  FOREIGN KEY (conversationId) REFERENCES conversations(id)
)
```

**Database File Location**: `backend/chat.db` (auto-created)

**Migrations**: Not needed - schema is applied automatically on startup

**Seed Data**: Not needed - FAQ knowledge is embedded in the LLM prompt

#### 5. Start the Backend Server

```powershell
# From the backend directory
bun run dev
```

You should see:
```
LLM Service initialized successfully
Server running at http://localhost:3000
Accepting requests from: http://localhost:5173
Chat endpoint: POST http://localhost:3000/chat/message
History endpoint: GET http://localhost:3000/chat/history/:sessionId
```

**Keep this terminal open!**

#### 6. Frontend Setup (New Terminal)

```powershell
# Open a NEW PowerShell window
cd frontend

# Install dependencies
npm install
# OR if you prefer Bun:
bun install

# This will install:
# - react & react-dom
# - vite (build tool)
# - tailwindcss (styling)
# - TypeScript types
```

#### 7. Configure Frontend Environment Variables (Optional)

The frontend already has a `.env` file configured:

```env
# Backend API URL (default is correct for local development)
VITE_API_URL=http://localhost:3000
```

**No changes needed** unless you changed the backend PORT.

#### 8. Start the Frontend Development Server

```powershell
# From the frontend directory
npm run dev
# OR:
bun run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

#### 9. Open the Application

Open your browser and navigate to:
```
http://localhost:5173
```

#### 10. Test the Chat! 🎉

Try asking:
- "What's your shipping policy?"
- "Do you ship internationally?"
- "How do I return an item?"
- "What are your support hours?"

## 📁 Project Structure

```
Spur Assignment/
├── backend/
│   ├── index.ts          # Express server with REST API (routes, middleware, error handling)
│   ├── database.ts       # SQLite database service (bun:sqlite) - CRUD operations
│   ├── llm.ts            # Google Gemini LLM service - AI response generation
│   ├── validation.ts     # Zod validation schemas - type-safe request validation
│   ├── .env.example      # Environment variable template
│   ├── package.json      # Backend dependencies
│   └── chat.db           # SQLite database (auto-created on first run)
│
└── frontend/
    ├── src/
    │   ├── App.tsx       # Main application component
    │   ├── Chat.tsx      # Chat interface component (UI, state management)
    │   ├── api.ts        # Backend API client (HTTP requests)
    │   └── index.css     # Tailwind imports & custom animations
    ├── tailwind.config.js # Tailwind CSS configuration (custom keyframes)
    ├── .env              # Frontend environment variables (API URL)
    ├── package.json      # Frontend dependencies
    └── vite.config.ts    # Vite build configuration
```

## 🏗️ Architecture Overview

### System Design

This is a **3-tier monorepo architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (Frontend)                 │
│  React 19 + Vite + Tailwind CSS v4                          │
│  - Chat.tsx (UI Component)                                   │
│  - api.ts (HTTP Client)                                      │
│  - Handles: User input, rendering, error display            │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/JSON (REST API)
                     │ CORS configured
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVER LAYER (Backend)                    │
│  Bun Runtime + Express.js + TypeScript                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API ROUTES (index.ts)                              │   │
│  │  - POST /chat/message (send message)                │   │
│  │  - GET /chat/history/:sessionId (get conversation)  │   │
│  │  - GET /health (health check)                       │   │
│  └────────────┬────────────────────────────────────────┘   │
│               │                                              │
│  ┌────────────▼────────────────────────────────────────┐   │
│  │  VALIDATION LAYER (validation.ts)                   │   │
│  │  - Zod schemas for type-safe runtime validation     │   │
│  │  - Validates: message length, UUIDs, session IDs    │   │
│  └────────────┬────────────────────────────────────────┘   │
│               │                                              │
│  ┌────────────▼────────────────┬───────────────────────┐   │
│  │  SERVICE LAYER              │                       │   │
│  │  ┌──────────────────────┐   │  ┌─────────────────┐ │   │
│  │  │ database.ts          │   │  │ llm.ts          │ │   │
│  │  │ - SQLite operations  │   │  │ - Gemini API    │ │   │
│  │  │ - CRUD for messages  │   │  │ - Reply gen     │ │   │
│  │  └──────────────────────┘   │  └─────────────────┘ │   │
│  └─────────────────────────────┴───────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌──────────────────────┐    ┌──────────────────────────┐  │
│  │  SQLite Database     │    │  Google Gemini API       │  │
│  │  (chat.db)           │    │  (External Service)      │  │
│  │  - conversations     │    │  - gemini-2.0-flash-exp  │  │
│  │  - messages          │    │                          │  │
│  └──────────────────────┘    └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow Example

**User sends a message:**

1. **Frontend (Chat.tsx)**: User types "What's your shipping policy?" → `handleSendMessage()`
2. **API Client (api.ts)**: `POST /chat/message` with `{ sessionId, message, conversationHistory }`
3. **Express Router (index.ts)**: Receives request → calls `validateRequest()` middleware
4. **Validation (validation.ts)**: Zod schema validates message length (1-2000 chars), sessionId format
5. **Database Service (database.ts)**: 
   - Checks if conversation exists → creates if needed
   - Saves user message: `createMessage(conversationId, 'user', message)`
6. **LLM Service (llm.ts)**: 
   - Formats conversation history for Gemini
   - Sends to Gemini API with FAQ knowledge context
   - Receives AI response
7. **Database Service (database.ts)**: Saves AI response: `createMessage(conversationId, 'ai', reply)`
8. **Express Router**: Returns JSON: `{ reply, conversationId }`
9. **Frontend**: Displays AI message in chat UI

### Key Design Patterns

**1. Dependency Injection**: Services (`LLMService`, `DatabaseService`) are instantiated once and reused

**2. Middleware Pipeline**:
```
Request → CORS → Body Parser → Validation → Route Handler → Error Handler → Response
```

**3. Error Handling (4 Levels)**:
- **Request Level**: Zod validation errors (400 Bad Request)
- **Route Level**: try/catch in async handlers
- **Service Level**: Specific error types (LLM timeout, DB error)
- **Global Level**: Express error middleware catches all unhandled errors

**4. Type Safety**: TypeScript + Zod for compile-time AND runtime type checking

**5. Separation of Concerns**:
- `index.ts`: Routing & HTTP concerns only
- `validation.ts`: All validation logic isolated
- `database.ts`: All data access isolated
- `llm.ts`: All AI/LLM logic isolated

### Technology Choices

| Component | Technology | Why? |
|-----------|-----------|------|
| **Backend Runtime** | Bun | Fast, has built-in SQLite, native TypeScript |
| **Web Framework** | Express.js | Industry standard, middleware ecosystem |
| **Validation** | Zod | Type-safe runtime validation, great TypeScript integration |
| **Database** | SQLite (bun:sqlite) | Simple, file-based, no setup, Bun-native |
| **LLM Provider** | Google Gemini | Free tier, fast responses, good for demos |
| **Frontend Framework** | React 19 | Component-based, excellent ecosystem |
| **Build Tool** | Vite | Fast HMR, modern, great DX |
| **Styling** | Tailwind CSS v4 | Utility-first, rapid development, consistent design |

## 🔑 Environment Variables

### Backend Environment Variables (backend/.env)

| Variable | Required? | Default | Description |
|----------|-----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ **YES** | None | Your Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `PORT` | Optional | `3000` | Port number for the Express server |
| `FRONTEND_URL` | Optional | `http://localhost:5173` | Frontend URL for CORS configuration |

**Example backend/.env:**
```env
# REQUIRED: Get your API key from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSyD...your_actual_key_here

# Optional: Server configuration (defaults shown)
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables (frontend/.env)

| Variable | Required? | Default | Description |
|----------|-----------|---------|-------------|
| `VITE_API_URL` | Optional | `http://localhost:3000` | Backend API URL (must start with `VITE_` for Vite to expose it) |

**Example frontend/.env:**
```env
# Backend API URL (already configured correctly for local development)
VITE_API_URL=http://localhost:3000
```

**⚠️ Important Notes:**
- Frontend env vars MUST be prefixed with `VITE_` to be accessible in the browser
- Never commit `.env` files to git (they're in `.gitignore`)
- Use `.env.example` as a template for required variables
- Restart the dev server after changing environment variables

## 🤖 LLM Implementation Details

### Google Gemini Integration

**Model Used**: `gemini-2.0-flash-exp`
- **Why?**: Fast responses (< 2 seconds), good quality, generous free tier
- **Alternatives considered**: GPT-3.5-turbo (paid), Claude (limited free tier)

### Prompting Strategy

The LLM service uses a **system prompt + conversation history** approach:

**System Prompt (embedded in llm.ts):**
```typescript
const FAQ_KNOWLEDGE = `You are a helpful customer support agent for an e-commerce store...

Store Policies:
1. Shipping: Free shipping on orders over $50...
2. Returns: 30-day return window...
3. International: We ship worldwide...
4. Support Hours: Monday-Friday, 9 AM - 6 PM EST...
`;
```

**Conversation History Format:**
```typescript
{
  role: 'user' | 'model',  // 'model' for AI responses
  parts: [{ text: '...' }]
}
```

### How It Works (LLMService.generateReply):

1. **Prepare Context**: Convert DB messages to Gemini format
2. **Add System Knowledge**: Inject FAQ_KNOWLEDGE at the start
3. **Send to Gemini**: `model.generateContent({ contents: [...] })`
4. **Extract Response**: Parse response.text()
5. **Error Handling**: Catch rate limits, timeouts, invalid responses

**Example API Call:**
```typescript
const response = await this.model.generateContent({
  contents: [
    // System prompt first
    { role: 'user', parts: [{ text: FAQ_KNOWLEDGE }] },
    { role: 'model', parts: [{ text: 'Understood. How can I help?' }] },
    // Then conversation history
    { role: 'user', parts: [{ text: 'What is your shipping policy?' }] },
    // New message
    { role: 'user', parts: [{ text: userMessage }] }
  ]
});
```

### Conversation Memory

**How history is maintained:**
1. Frontend sends `conversationHistory` array with each request (last 10 messages)
2. Backend prepends system prompt before sending to Gemini
3. Database stores full conversation for persistence
4. Gemini uses full history for context-aware responses

**Why this approach?**
- ✅ Gemini gets full context for better responses
- ✅ No need to re-fetch from DB on every request
- ✅ Reduces DB load (only frontend → backend, not backend → DB)
- ⚠️ Trade-off: Larger request payloads (but negligible for text)

### Rate Limiting & Error Handling

**Gemini API Free Tier Limits:**
- 60 requests per minute
- 1,500 requests per day

**Implemented Safeguards:**
- Try/catch blocks in `llm.ts`
- Generic error messages for users ("Sorry, I'm having trouble...")
- Detailed error logs for debugging
- Zod validation prevents invalid inputs reaching the LLM

**Error Types Handled:**
```typescript
// Rate limit errors
catch (error) {
  if (error.message.includes('429')) {
    return 'Sorry, I'm experiencing high traffic...';
  }
}

// Timeout errors
if (!response?.text) {
  throw new Error('Empty response from LLM');
}
```

### FAQ Knowledge Base

The `FAQ_KNOWLEDGE` constant in `llm.ts` contains:
- Shipping policies (domestic + international)
- Return procedures
- Support hours
- Order tracking info
- Payment methods

**Why hardcoded instead of database?**
- ✅ Faster: No DB query on every request
- ✅ Simpler: No admin UI needed for small knowledge base
- ✅ Version controlled: Changes tracked in git
- ⚠️ Trade-off: Requires code deployment to update policies

**Future improvement**: Move to database table with admin UI for non-technical updates

## ⚖️ Trade-offs & Design Decisions

### What I Built & Why

#### ✅ Chose Bun Over Node.js
**Why**: Bun has built-in SQLite (`bun:sqlite`), faster startup, native TypeScript support
**Trade-off**: Less mature ecosystem than Node.js, some npm packages incompatible
**Impact**: Saved time on setup, but had to avoid packages like `better-sqlite3`

#### ✅ Chose Express.js Over Raw Bun HTTP
**Why**: Industry-standard middleware, better structure, easier error handling
**Trade-off**: Slightly more overhead than raw HTTP
**Impact**: Better maintainability, easier to onboard new developers

#### ✅ Chose SQLite Over PostgreSQL/MongoDB
**Why**: No setup, file-based, perfect for demo/small apps
**Trade-off**: Not suitable for production with multiple servers (file locking issues)
**Impact**: Zero database configuration, immediate dev experience

#### ✅ Hardcoded FAQ Knowledge in Code
**Why**: Faster (no DB queries), simpler for small knowledge base
**Trade-off**: Requires code deployment to update policies
**Impact**: Faster responses, but less flexibility for non-technical updates

#### ✅ Frontend Sends Conversation History
**Why**: Reduces backend DB queries, simplifies backend logic
**Trade-off**: Larger HTTP request payloads (but negligible for text)
**Impact**: Better performance, but client controls history length

#### ✅ Zod Validation Instead of Just TypeScript
**Why**: Runtime type safety (TypeScript only checks at compile time)
**Trade-off**: Extra dependency, slightly more verbose code
**Impact**: Prevents invalid data from reaching services, better error messages

#### ✅ Tailwind CSS Over Styled Components
**Why**: Faster development, consistent design system, no runtime CSS-in-JS
**Trade-off**: HTML looks cluttered with many class names
**Impact**: Rapid prototyping, smaller bundle size

### 🚀 If I Had More Time...

#### 1. **Authentication & User Accounts**
**Current**: No user authentication, sessionId is client-generated UUID
**Improvement**: 
- Add JWT-based auth
- User registration/login
- Associate conversations with user accounts
- Admin dashboard to view all conversations

**Impact**: Multi-user support, better security, conversation persistence across devices

#### 2. **Advanced RAG (Retrieval-Augmented Generation)**
**Current**: Hardcoded FAQ knowledge in system prompt
**Improvement**:
- Vector database (Pinecone/ChromaDB) for document embeddings
- Semantic search to retrieve relevant knowledge
- Dynamic knowledge base updates without code deployment
- Support for PDF/document ingestion

**Impact**: More accurate responses, ability to answer from large knowledge bases

#### 3. **Streaming Responses**
**Current**: User waits for full response before seeing anything
**Improvement**:
- Server-Sent Events (SSE) or WebSockets
- Stream Gemini responses token-by-token
- Show "typing..." effect with partial responses

**Impact**: Better UX, feels more conversational, reduces perceived latency

#### 4. **Conversation Analytics**
**Current**: No analytics or insights
**Improvement**:
- Track common questions
- Sentiment analysis on user messages
- Response time metrics
- Conversation success rate (did user get their answer?)
- Admin dashboard with charts

**Impact**: Data-driven improvements to FAQ, identify knowledge gaps

#### 5. **Multi-Language Support**
**Current**: English only
**Improvement**:
- Detect user language
- Translate FAQ knowledge dynamically
- Respond in user's language using Gemini's multilingual capabilities

**Impact**: Global customer base support

#### 6. **Conversation Summarization**
**Current**: No summaries, full history sent every time
**Improvement**:
- Auto-summarize conversations after 20+ messages
- Send summary instead of full history to Gemini
- Reduce token usage and improve response speed

**Impact**: Lower API costs, faster responses in long conversations

#### 7. **Caching Responses**
**Current**: Every similar question hits Gemini API
**Improvement**:
- Redis cache for common questions
- Cache responses for 24 hours
- Reduce API calls by ~70% for FAQs

**Impact**: Lower costs, faster responses, better rate limit handling

#### 8. **Testing & CI/CD**
**Current**: No automated tests
**Improvement**:
- Unit tests for services (database.ts, llm.ts)
- Integration tests for API endpoints
- E2E tests with Playwright
- GitHub Actions for automated testing
- Docker containers for easy deployment

**Impact**: Fewer bugs, confidence in refactoring, easier deployment

#### 9. **Rate Limiting on Backend**
**Current**: Only relies on Gemini API rate limits
**Improvement**:
- Express rate limiter middleware
- Per-IP or per-session rate limits
- Prevent abuse and spam

**Impact**: Better resource management, prevent API abuse

#### 10. **Better Error Messages**
**Current**: Generic "Something went wrong" for most errors
**Improvement**:
- Error codes (e.g., `ERR_RATE_LIMIT`, `ERR_INVALID_MESSAGE`)
- User-friendly messages with actionable steps
- Link to help docs or support contact

**Impact**: Better UX, easier debugging, reduced support burden

### 🎯 Known Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **No persistent sessions** | Conversations lost if sessionId is lost | Could implement browser localStorage backup |
| **No message edit/delete** | Can't fix typos or remove messages | Would need DELETE endpoint + UI buttons |
| **No file uploads** | Can't attach images/documents | Would need multipart form handling + storage |
| **Single conversation per session** | No conversation switching | Would need conversation list UI |
| **No typing indicators** | User doesn't know AI is "thinking" | Implemented basic CSS animation, but not real-time |
| **No read receipts** | No confirmation that message was received | Would need WebSocket or polling |



## 📡 API Endpoints

### POST /chat/message
Send a chat message and receive AI reply.

**Request:**
```json
{
  "message": "What's your return policy?",
  "sessionId": "optional-uuid",
  "conversationHistory": [
    { "sender": "user", "text": "Hello" },
    { "sender": "ai", "text": "Hi! How can I help?" }
  ]
}
```

**Response (Success - 200):**
```json
{
  "reply": "We offer a 30-day return window...",
  "conversationId": "uuid-of-conversation"
}
```

**Response (Error - 400):**
```json
{
  "error": "Message must be between 1 and 2000 characters"
}
```

**Validation Rules:**
- `message`: Required, 1-2000 characters
- `sessionId`: Optional, must be valid UUID if provided
- `conversationHistory`: Optional array of messages

---

### GET /chat/history/:sessionId
Retrieve conversation history for a session.

**URL Parameters:**
- `sessionId`: UUID of the conversation

**Response (Success - 200):**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "messages": [
    {
      "id": "msg-1",
      "sender": "user",
      "text": "What's your shipping policy?",
      "timestamp": 1703347200000
    },
    {
      "id": "msg-2",
      "sender": "ai",
      "text": "We offer free shipping on orders over $50...",
      "timestamp": 1703347205000
    }
  ]
}
```

**Response (Not Found - 404):**
```json
{
  "error": "Conversation not found"
}
```

---

### GET /health
Health check endpoint to verify server is running.

**Response (Success - 200):**
```json
{
  "status": "ok",
  "message": "AI Chat Agent is running"
}
```

## 📊 Data Model

### Database Schema (SQLite)

**Conversations Table:**
```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,           -- UUID v4 format
  createdAt INTEGER NOT NULL     -- Unix timestamp (milliseconds)
);
```

**Messages Table:**
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,                    -- UUID v4 format
  conversationId TEXT NOT NULL,           -- Foreign key to conversations.id
  sender TEXT NOT NULL CHECK(sender IN ('user', 'ai')),
  text TEXT NOT NULL,                     -- Message content (max 2000 chars validated)
  timestamp INTEGER NOT NULL,             -- Unix timestamp (milliseconds)
  FOREIGN KEY (conversationId) REFERENCES conversations(id)
);
```

**Indexes:**
- Primary keys on `id` columns (auto-indexed)
- Foreign key index on `messages.conversationId` (auto-created)

**Example Data:**
```json
// conversations table
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": 1703347200000
}

// messages table
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "sender": "user",
  "text": "What's your shipping policy?",
  "timestamp": 1703347205000
}
```

## 📝 Assignment Requirements Checklist

### Core Requirements ✅
- [x] Simple chat UI with scrollable messages
- [x] Clear user/AI message distinction (different colors + alignment)
- [x] Input box + send button (Enter key works too)
- [x] Auto-scroll to latest message
- [x] Disabled send button while loading
- [x] "Agent is typing..." indicator with animation

### Backend API ✅
- [x] TypeScript backend with Bun runtime
- [x] POST /chat/message endpoint
- [x] Accepts message + optional sessionId + conversationHistory
- [x] Returns reply + conversationId
- [x] Persists all messages to SQLite database
- [x] Associates messages with conversation sessions

### LLM Integration ✅
- [x] Real LLM API (Google Gemini via @google/genai)
- [x] API key via environment variables (GEMINI_API_KEY)
- [x] Wrapped in LLMService class
- [x] System prompt with FAQ knowledge context
- [x] Conversation history included in requests
- [x] Handles errors gracefully (rate limits, timeouts, invalid responses)
- [x] No hardcoded API keys

### FAQ / Knowledge Base ✅
- [x] Shipping policy included in FAQ_KNOWLEDGE
- [x] Return/refund policy included
- [x] Support hours included
- [x] International shipping info included
- [x] Payment methods included
- [x] AI answers FAQs reliably and consistently

### Data Persistence ✅
- [x] Conversations table with UUID primary key
- [x] Messages table with sender type ('user' | 'ai')
- [x] Loads conversation history via GET /chat/history/:sessionId
- [x] Works without authentication (sessionId is client-generated UUID)
- [x] Database auto-creates on first run

### Robustness ✅
- [x] Validates input with Zod schemas (empty/long messages rejected)
- [x] Handles very long messages (2000 char limit enforced)
- [x] Backend never crashes on bad input (global error handler)
- [x] LLM failures caught and shown to user with friendly message
- [x] No hardcoded secrets (all in .env files)
- [x] Graceful failure at every layer (request → route → service → global)
- [x] CORS configured for security
- [x] SQL injection prevention (parameterized queries)

### Bonus Features 🎉
- [x] Zod validation for type-safe runtime checks
- [x] Tailwind CSS v4 for modern styling
- [x] Custom animations (fade-in, typing indicator)
- [x] Mobile-responsive design
- [x] Comprehensive error handling at 4 levels
- [x] Health check endpoint for monitoring
- [x] Detailed README with setup, architecture, trade-offs

## 📄 License

This project is created for the Spur assignment demonstration.

## 👨‍💻 Development

Built with ❤️ using modern web technologies.

- Backend: Bun + TypeScript + SQLite + Google Gemini
- Frontend: React + TypeScript + Vite
- No external UI libraries - all custom CSS!

## 🙏 Acknowledgments

- Google Gemini for the powerful LLM API
- Bun for the blazing-fast runtime
- React & Vite for excellent DX
