import { GoogleGenAI } from '@google/genai';
import type { Message } from './database';

// FAQ Knowledge Base for the fictional store
const FAQ_KNOWLEDGE = `
You are a helpful customer support agent for "TechStyle Store", an e-commerce company that sells electronics and fashion items.

Here is important information about our store:

SHIPPING POLICY:
- Free shipping on orders over $50
- Standard shipping (5-7 business days): $5.99
- Express shipping (2-3 business days): $14.99
- International shipping available to USA, Canada, UK, and EU countries
- Orders are processed within 24 hours on business days

RETURN & REFUND POLICY:
- 30-day return window from delivery date
- Items must be unused and in original packaging
- Free returns for defective or incorrect items
- Return shipping cost: $7.99 (deducted from refund) for change of mind
- Refunds processed within 5-7 business days after receiving returned items
- Original shipping charges are non-refundable

SUPPORT HOURS:
- Monday to Friday: 9 AM - 6 PM EST
- Saturday: 10 AM - 4 PM EST
- Sunday: Closed
- Email support: support@techstyle.com (responds within 24 hours)
- Live chat: Available during support hours

PAYMENT METHODS:
- Credit/Debit cards (Visa, Mastercard, Amex)
- PayPal
- Apple Pay and Google Pay

GENERAL INFO:
- All prices in USD
- Price match guarantee within 14 days of purchase
- Warranty varies by product (typically 1-2 years manufacturer warranty)

Please answer customer questions clearly, concisely, and professionally. If you don't know something, direct them to contact support@techstyle.com.
`;

interface LLMConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

class LLMService {
  private genAI: GoogleGenAI;
  private model: any;
  private maxTokens: number;
  private temperature: number;

  constructor(config: LLMConfig) {
    if (!config.apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }

    this.genAI = new GoogleGenAI({ apiKey: config.apiKey });
    this.maxTokens = config.maxTokens || 500; // Cost control
    this.temperature = config.temperature || 0.7;
    
    // Using gemini-pro model - will be used when generating content
    this.model = config.model || 'gemini-1.5-flash';
  }

  /**
   * Generate a reply using the LLM
   * @param conversationHistory - Array of previous messages
   * @param userMessage - Current user message
   * @returns AI-generated reply
   */
  async generateReply(
    conversationHistory: Message[],
    userMessage: string
  ): Promise<string> {
    try {
      // Build the conversation context
      const conversationContext = this.buildConversationContext(
        conversationHistory,
        userMessage
      );

      // Call Gemini API using the new SDK
      const result = await this.genAI.models.generateContent({
        model: this.model,
        contents: conversationContext,
        config: {
          maxOutputTokens: this.maxTokens,
          temperature: this.temperature,
        },
      });

      const reply = result.text;

      if (!reply || reply.trim().length === 0) {
        throw new Error('Empty response from LLM');
      }

      return reply.trim();
    } catch (error: any) {
      console.error('LLM Error:', error);
      
      // Handle specific error types
      if (error.message?.includes('API key') || error.message?.includes('API_KEY')) {
        throw new Error('Invalid API key. Please check your Gemini API configuration.');
      }
      
      if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        throw new Error('Rate limit reached. Please try again in a moment.');
      }
      
      if (error.message?.includes('timeout')) {
        throw new Error('Request timeout. Please try again.');
      }
      
      // Generic error
      throw new Error('Sorry, I encountered an error processing your request. Please try again.');
    }
  }

  /**
   * Build conversation context for the LLM
   */
  private buildConversationContext(
    history: Message[],
    currentMessage: string
  ): string {
    let context = FAQ_KNOWLEDGE + '\n\n';
    
    // Include recent conversation history (last 10 messages for context)
    const recentHistory = history.slice(-10);
    
    if (recentHistory.length > 0) {
      context += 'CONVERSATION HISTORY:\n';
      recentHistory.forEach((msg) => {
        const role = msg.sender === 'user' ? 'Customer' : 'Agent';
        context += `${role}: ${msg.text}\n`;
      });
      context += '\n';
    }
    
    context += `Customer: ${currentMessage}\n\nAgent:`;
    
    return context;
  }

  /**
   * Validate and sanitize user input
   * @deprecated Use Zod schema validation instead
   */
  validateInput(message: string): { valid: boolean; error?: string } {
    if (!message || message.trim().length === 0) {
      return { valid: false, error: 'Message cannot be empty' };
    }

    const trimmed = message.trim();
    
    // Max length check (prevent very long messages)
    const MAX_LENGTH = 2000;
    if (trimmed.length > MAX_LENGTH) {
      return { 
        valid: false, 
        error: `Message too long. Please keep it under ${MAX_LENGTH} characters.` 
      };
    }

    // Min length check
    if (trimmed.length < 1) {
      return { valid: false, error: 'Message is too short' };
    }

    return { valid: true };
  }
}

export default LLMService;
