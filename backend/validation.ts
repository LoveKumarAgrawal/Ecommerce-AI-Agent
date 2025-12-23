import { z } from 'zod';

/**
 * Validation schemas using Zod for robust input validation
 * Prevents bad data from crashing the backend
 */

// Chat message request schema
export const ChatMessageRequestSchema = z.object({
  message: z
    .string({
      message: 'Message must be a string',
    })
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message is too long. Please keep it under 2000 characters.')
    .trim()
    .refine(
      (msg) => msg.length > 0,
      'Message cannot be empty after trimming whitespace'
    ),
  sessionId: z
    .string()
    .uuid('Invalid session ID format')
    .optional(),
});

export type ChatMessageRequest = z.infer<typeof ChatMessageRequestSchema>;

// Chat message response schema
export const ChatMessageResponseSchema = z.object({
  reply: z.string(),
  sessionId: z.uuid(),
  error: z.string().optional(),
});

export type ChatMessageResponse = z.infer<typeof ChatMessageResponseSchema>;

// Session ID parameter schema
export const SessionIdParamSchema = z.object({
  sessionId: z
    .string({
      message: 'Session ID must be a string',
    })
    .uuid('Invalid session ID format'),
});

export type SessionIdParam = z.infer<typeof SessionIdParamSchema>;

// Health check response schema
export const HealthCheckResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  llmEnabled: z.boolean(),
  timestamp: z.number(),
  message: z.string().optional(),
});

export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
  timestamp: z.number().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Middleware helper to validate request body against a Zod schema
 * Returns parsed data or throws validation error
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: firstError?.message || 'Validation error',
      };
    }
    return {
      success: false,
      error: 'Invalid request data',
    };
  }
}

/**
 * Safe parse helper that returns parsed data or null
 */
export function safeParseRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T | null {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}
