import { useState, useEffect, useRef } from 'react';
import { apiService, type Message } from './api';

// Session management
const SESSION_STORAGE_KEY = 'chat_session_id';

function getSessionId(): string | null {
    return localStorage.getItem(SESSION_STORAGE_KEY);
}

function setSessionId(id: string): void {
    localStorage.setItem(SESSION_STORAGE_KEY, id);
}

function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionId, setSessionIdState] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Load conversation history on mount
    useEffect(() => {
        const loadHistory = async () => {
            const existingSessionId = getSessionId();
            if (existingSessionId) {
                try {
                    const history = await apiService.getHistory(existingSessionId);
                    if (history.messages.length > 0) {
                        setMessages(history.messages);
                        setSessionIdState(existingSessionId);
                    }
                } catch (error) {
                    console.error('Failed to load history:', error);
                }
            }
        };

        loadHistory();
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedMessage = inputValue.trim();

        // Validate input
        if (!trimmedMessage) {
            setError('Please enter a message');
            return;
        }

        if (trimmedMessage.length > 2000) {
            setError('Message is too long. Please keep it under 2000 characters.');
            return;
        }

        // Clear error and input
        setError(null);
        setInputValue('');
        setIsLoading(true);

        // Add user message to UI immediately
        const tempUserMessage: Message = {
            id: `temp-${Date.now()}`,
            sender: 'user',
            text: trimmedMessage,
            timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, tempUserMessage]);

        // Show typing indicator
        setIsTyping(true);

        try {
            // Send to backend
            const response = await apiService.sendMessage(trimmedMessage, sessionId || undefined);

            // Save session ID
            if (!sessionId) {
                setSessionIdState(response.sessionId);
                setSessionId(response.sessionId);
            }

            // Remove temp message and add real messages
            setMessages((prev) => {
                const filtered = prev.filter((m) => m.id !== tempUserMessage.id);

                // Add user message with real ID
                const userMsg: Message = {
                    id: `user-${Date.now()}`,
                    sender: 'user',
                    text: trimmedMessage,
                    timestamp: Date.now(),
                };

                // Add AI response
                const aiMsg: Message = {
                    id: `ai-${Date.now()}`,
                    sender: 'ai',
                    text: response.reply,
                    timestamp: Date.now() + 1,
                };

                return [...filtered, userMsg, aiMsg];
            });

        } catch (error: any) {
            console.error('Error sending message:', error);

            // Remove temp message
            setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));

            // Show error
            setError(error.message || 'Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
            setIsTyping(false);
            inputRef.current?.focus();
        }
    };

    const handleNewChat = () => {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setSessionIdState(null);
        setMessages([]);
        setError(null);
        setInputValue('');
        inputRef.current?.focus();
    };

    const formatTime = (timestamp: number): string => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="flex flex-col h-screen max-w-225 mx-auto bg-white shadow-[0_0_20px_rgba(0,0,0,0.1)]">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 m-0">
                        💬 TechStyle Support
                    </h1>
                    <p className="text-sm mt-1 mb-0 text-gray-600">
                        Ask us anything about our products and policies
                    </p>
                </div>

                {messages.length > 0 && (
                    <button
                        onClick={handleNewChat}
                        title="Start new conversation"
                        className="bg-neutral-900 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-neutral-800 hover:-translate-y-px"
                    >
                        New Chat
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {messages.length === 0 && (
                    <div className="text-center py-12 px-8 text-gray-600">
                        <h2 className="text-[#667eea] mb-4 mt-0">👋 Welcome to TechStyle Support!</h2>
                        <p>How can we help you today?</p>
                        <div className="mt-8 bg-white p-6 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] text-left max-w-125 mx-auto">
                            <p><strong>Try asking:</strong></p>
                            <ul className="list-none p-0 mt-4 mb-0">
                                <li className="py-2 text-gray-500 italic before:content-['💡_'] before:mr-2">"What's your shipping policy?"</li>
                                <li className="py-2 text-gray-500 italic before:content-['💡_'] before:mr-2">"Do you ship internationally?"</li>
                                <li className="py-2 text-gray-500 italic before:content-['💡_'] before:mr-2">"How do I return an item?"</li>
                                <li className="py-2 text-gray-500 italic before:content-['💡_'] before:mr-2">"What are your support hours?"</li>
                            </ul>
                        </div>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-4 mb-6 animate-[fadeIn_0.3s_ease-in] ${message.sender === 'user' ? 'flex-row-reverse' : ''
                            }`}
                    >
                        <div className="text-[2rem] w-10 h-10 flex items-center justify-center shrink-0">
                            {message.sender === 'user' ? '👤' : '🤖'}
                        </div>
                        <div className="flex-1 max-w-[70%]">
                            <div className={`p-4 rounded-xl shadow-[0_2px_5px_rgba(0,0,0,0.05)] leading-6 whitespace-pre-wrap wrap-break-word ${message.sender === 'user'
                                    ? 'bg-linear-to-br from-[#667eea] to-[#764ba2] text-white'
                                    : 'bg-white'
                                }`}>
                                {message.text}
                            </div>
                            <div className={`text-xs text-gray-500 mt-2 px-2 ${message.sender === 'user' ? 'text-right' : ''
                                }`}>
                                {formatTime(message.timestamp)}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-4 mb-6 animate-[fadeIn_0.3s_ease-in]">
                        <div className="text-[2rem] w-10 h-10 flex items-center justify-center shrink-0">🤖</div>
                        <div className="flex-1 max-w-[70%]">
                            <div className="flex gap-[0.3rem] p-4 bg-white rounded-xl shadow-[0_2px_5px_rgba(0,0,0,0.05)] w-fit">
                                <span className="w-2 h-2 bg-[#667eea] rounded-full animate-[typing_1.4s_infinite]"></span>
                                <span className="w-2 h-2 bg-[#667eea] rounded-full animate-[typing_1.4s_infinite_0.2s]"></span>
                                <span className="w-2 h-2 bg-[#667eea] rounded-full animate-[typing_1.4s_infinite_0.4s]"></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-100 text-red-800 p-4 flex items-center gap-3 border-t border-red-200 animate-[slideDown_0.3s_ease-out]">
                    <span className="text-xl">⚠️</span>
                    <span className="flex-1">{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="bg-transparent border-none text-red-800 text-2xl cursor-pointer p-0 w-7.5 h-7.5 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/10"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-3 p-6 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3.5 border-2 border-gray-200 rounded-3xl text-base outline-none transition-colors duration-200 focus:border-[#667eea] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    maxLength={2000}
                />
                <button
                    type="submit"
                    className="w-12.5 h-12.5 rounded-full border-none bg-linear-to-br from-[#667eea] to-[#764ba2] text-white text-xl cursor-pointer transition-all duration-200 flex items-center justify-center shrink-0 enabled:hover:scale-105 enabled:hover:shadow-[0_4px_12px_rgba(102,126,234,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !inputValue.trim()}
                >
                    {isLoading ? '⏳' : '➤'}
                </button>
            </form>
        </div>
    );
}

export default Chat;
