const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface ChatMessageRequest {
  message: string;
  sessionId?: string;
}

export interface ChatMessageResponse {
  reply: string;
  sessionId: string;
  error?: string;
}

export interface GetHistoryResponse {
  messages: Message[];
  sessionId: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Send a chat message to the backend
   */
  async sendMessage(message: string, sessionId?: string): Promise<ChatMessageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, sessionId } as ChatMessageRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: ChatMessageResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      
      // Handle network errors
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server');
      }
      
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  async getHistory(sessionId: string): Promise<GetHistoryResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/history/${sessionId}`);

      if (!response.ok) {
        if (response.status === 404) {
          // Conversation doesn't exist yet, return empty
          return { messages: [], sessionId };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GetHistoryResponse = await response.json();
      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server.');
      }
      
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; llmEnabled: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return await response.json();
    } catch (error) {
      throw new Error('Cannot connect to server');
    }
  }
}

export const apiService = new ApiService();
export default ApiService;
