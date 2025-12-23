import { Database } from 'bun:sqlite';

export interface Conversation {
  id: string;
  createdAt: number;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

class DatabaseService {
  private db: Database;

  constructor(dbPath: string = './chat.db') {
    this.db = new Database(dbPath, { create: true });
    this.initialize();
  }

  private initialize() {
    // Create conversations table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL
      )
    `);

    // Create messages table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversationId TEXT NOT NULL,
        sender TEXT NOT NULL CHECK(sender IN ('user', 'ai')),
        text TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (conversationId) REFERENCES conversations(id)
      )
    `);

    // Create index for faster queries
    this.db.run(`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation 
      ON messages(conversationId, timestamp)
    `);
  }

  // Create a new conversation
  createConversation(id: string): Conversation {
    const createdAt = Date.now();
    const stmt = this.db.prepare(
      'INSERT INTO conversations (id, createdAt) VALUES (?, ?)'
    );
    stmt.run(id, createdAt);
    return { id, createdAt };
  }

  // Get conversation by ID
  getConversation(id: string): Conversation | undefined {
    const stmt = this.db.prepare('SELECT * FROM conversations WHERE id = ?');
    return stmt.get(id) as Conversation | undefined;
  }

  // Create a new message
  createMessage(
    id: string,
    conversationId: string,
    sender: 'user' | 'ai',
    text: string
  ): Message {
    const timestamp = Date.now();
    const stmt = this.db.prepare(
      'INSERT INTO messages (id, conversationId, sender, text, timestamp) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(id, conversationId, sender, text, timestamp);
    return { id, conversationId, sender, text, timestamp };
  }

  // Get all messages for a conversation
  getMessages(conversationId: string): Message[] {
    const stmt = this.db.prepare(
      'SELECT * FROM messages WHERE conversationId = ? ORDER BY timestamp ASC'
    );
    return stmt.all(conversationId) as Message[];
  }

  // Get conversation history (last N messages)
  getConversationHistory(conversationId: string, limit: number = 10): Message[] {
    const stmt = this.db.prepare(
      'SELECT * FROM messages WHERE conversationId = ? ORDER BY timestamp DESC LIMIT ?'
    );
    const messages = stmt.all(conversationId, limit) as Message[];
    return messages.reverse(); // Return in chronological order
  }

  // Check if conversation exists
  conversationExists(id: string): boolean {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM conversations WHERE id = ?');
    const result = stmt.get(id) as { count: number };
    return result.count > 0;
  }

  // Close database connection
  close() {
    this.db.close();
  }
}

export const db = new DatabaseService();
export default DatabaseService;
