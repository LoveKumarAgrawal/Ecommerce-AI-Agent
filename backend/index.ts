import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { db } from './database';
import LLMService from './llm';
import { randomUUID } from 'crypto';
import {
    ChatMessageRequestSchema,
    SessionIdParamSchema,
    validateRequest,
    type ChatMessageRequest,
    type ChatMessageResponse,
    type HealthCheckResponse,
    type ErrorResponse,
} from './validation';

// Load environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Initialize LLM service
let llmService: LLMService | null = null;

try {
    if (!GEMINI_API_KEY) {
        console.warn('WARNING: GEMINI_API_KEY not set in environment variables');
        console.warn('Please set it to enable AI responses');
    } else {
        llmService = new LLMService({ apiKey: GEMINI_API_KEY });
        console.log('LLM Service initialized successfully');
    }
} catch (error) {
    console.error('Failed to initialize LLM service:', error);
}

// Error handling middleware
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    const response: HealthCheckResponse = {
        status: 'ok',
        llmEnabled: llmService !== null,
        timestamp: Date.now(),
    };
    res.json(response);
});

// POST /chat/message - Send a message and get AI reply
app.post('/chat/message', asyncHandler(async (req: Request, res: Response) => {
    // Validate request body using Zod
    const validation = validateRequest(ChatMessageRequestSchema, req.body);

    if (!validation.success) {
        const errorResponse: ErrorResponse = {
            error: validation.error,
            timestamp: Date.now(),
        };
        return res.status(400).json(errorResponse);
    }

    const { message, sessionId: requestSessionId } = validation.data;

    // Get or create session
    let sessionId = requestSessionId || randomUUID();

    if (!db.conversationExists(sessionId)) {
        db.createConversation(sessionId);
        console.log(`📝 Created new conversation: ${sessionId}`);
    }

    // Save user message
    const userMessageId = randomUUID();
    db.createMessage(userMessageId, sessionId, 'user', message);

    // Generate AI reply
    let aiReply: string;

    if (!llmService) {
        aiReply = 'Sorry, the AI service is currently unavailable.';
    } else {
        try {
            const history = db.getConversationHistory(sessionId, 10);
            aiReply = await llmService.generateReply(history, message);
        } catch (error: any) {
            console.error('LLM Error:', error);
            aiReply = error.message || 'Sorry, I encountered an error. Please try again.';
        }
    }

    // Save AI reply
    const aiMessageId = randomUUID();
    db.createMessage(aiMessageId, sessionId, 'ai', aiReply);

    // Return response
    const response: ChatMessageResponse = {
        reply: aiReply,
        sessionId,
    };

    res.json(response);
}));

// GET /chat/history/:sessionId - Get conversation history
app.get('/chat/history/:sessionId', asyncHandler(async (req: Request, res: Response) => {
    // Validate session ID parameter
    const validation = validateRequest(SessionIdParamSchema, { sessionId: req.params.sessionId });

    if (!validation.success) {
        const errorResponse: ErrorResponse = {
            error: validation.error,
            timestamp: Date.now(),
        };
        return res.status(400).json(errorResponse);
    }

    const { sessionId } = validation.data;

    if (!db.conversationExists(sessionId)) {
        const errorResponse: ErrorResponse = {
            error: 'Conversation not found',
            timestamp: Date.now(),
        };
        return res.status(404).json(errorResponse);
    }

    const messages = db.getMessages(sessionId);

    res.json({
        messages,
        sessionId,
    });
}));

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
    const errorResponse: ErrorResponse = {
        error: 'Not found',
        timestamp: Date.now(),
    };
    res.status(404).json(errorResponse);
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', error);

    const errorResponse: ErrorResponse = {
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: Date.now(),
    };

    res.status(error.status || 500).json(errorResponse);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Accepting requests from: ${FRONTEND_URL}`);
    console.log(`Chat endpoint: POST http://localhost:${PORT}/chat/message`);
    console.log(`History endpoint: GET http://localhost:${PORT}/chat/history/:sessionId`);
});