// 'use client';

// import { useState } from 'react';
// import { MessageCircle, X } from 'lucide-react'; // Lucide icons
// import clsx from 'clsx';

// const SupportChat = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="fixed bottom-2 left-[94%] z-50">
//       {/* Floating Support Panel */}
//       <div
//         className={clsx(
//           'transition-all duration-300 ease-in-out w-80 max-w-[90vw] bg-orange-100 shadow-xl rounded-xl overflow-hidden border border-gray-200',
//           isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'
//         )}
//       >
//         <div className="p-4 ">
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-sm font-semibold">Bokksu Market</h2>
//               <p className="text-xs text-gray-600">Chat support is open 9am - 10pm ET on Weekdays.</p>
//             </div>
//             <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Support links */}
//           <div className="bg-gray-100 rounded-lg divide-y divide-gray-300 text-sm">
//             <button className="w-full px-4 py-3 text-left hover:bg-gray-200">Report a Damaged Order</button>
//             <button className="w-full px-4 py-3 text-left hover:bg-gray-200">Shipping Questions</button>
//             <button className="w-full px-4 py-3 text-left hover:bg-gray-200">How are my items packed?</button>
//           </div>

//           <button className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm text-left font-medium hover:bg-gray-200">
//             Track and manage my orders
//           </button>

//           <button className="w-full px-4 py-3 bg-white border rounded-lg text-sm flex items-center justify-between hover:bg-gray-50">
//             <span>Bokksu Market Support</span>
//             <span className="text-green-600 font-bold">➤</span>
//           </button>
//         </div>
//       </div>

'use client';

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { MessageCircle, X, Send, RefreshCw } from 'lucide-react';

interface Message {
  from: 'bot' | 'user';
  text: string;
  timestamp?: Date;
  id?: string;
}

interface ChatConfig {
  persona?: 'budget' | 'luxury' | 'balanced';
  categories?: string[];
  maxPrice?: number;
  dietary?: string[];
  locale?: string;
}

function renderMessage(text: string): ReactNode {
  const lines = (text || '').split(/\r?\n/);
  const elements: ReactNode[] = [];
  let listItems: string[] = [];
  const flushList = () => {
    if (listItems.length) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1">
          {listItems.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };
  lines.forEach((line, idx) => {
    const m = line.match(/^\s*[-•]\s+(.*)/);
    if (m) {
      listItems.push(m[1]);
    } else {
      const trimmed = line.trim();
      if (trimmed.length) {
        flushList();
        elements.push(
          <p key={`p-${idx}`}>{trimmed}</p>
        );
      }
    }
  });
  flushList();
  if (!elements.length) return text;
  return <>{elements}</>;
}

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      from: 'bot', 
      text: '👋 Hi there! How can I assist you today?',
      timestamp: new Date(),
      id: 'welcome'
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quickOptions, setQuickOptions] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Array<{_id:string; name:string; price:number; inStock?: boolean}>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [chatConfig] = useState<ChatConfig>({
    persona: 'balanced',
    locale: 'en-IN'
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus textarea when chat opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(async (overrideText?: string) => {
    const trimmedInput = (overrideText ?? input).trim();
    if (!trimmedInput || loading) return;

    const newUserMessage: Message = { 
      from: 'user', 
      text: trimmedInput,
      timestamp: new Date(),
      id: `user-${Date.now()}`
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);
    setError(null);
    setQuickOptions([]);
    setSuggestions([]);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: trimmedInput,
          ...chatConfig
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        const errorMsg = errorData.details || errorData.error || `Server error: ${res.status}`;
        throw new Error(errorMsg);
      }

      const data = await res.json();
      
      if (!data.reply) {
        throw new Error('No response received from AI');
      }
      
      const botReply = data.reply;
      
      setMessages((prev) => [...prev, { 
        from: 'bot', 
        text: botReply,
        timestamp: new Date(),
        id: `bot-${Date.now()}`
      }]);
      if (Array.isArray(data.quickOptions)) setQuickOptions(data.quickOptions);
      if (Array.isArray(data.matchedProducts)) setSuggestions(data.matchedProducts);
    } catch (err) {
      console.error('Chat error:', err);
      
      let errorMessage = '⚠️ Something went wrong. Please try again!';
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = '⏱️ Request timed out. Please try again.';
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = '🌐 Network error. Check your connection.';
        } else if (err.message.includes('Rate limit') || err.message.includes('Too many requests')) {
          errorMessage = '⏳ Too many requests. Please wait a moment.';
        } else if (err.message.includes('API key') || err.message.includes('Authentication')) {
          errorMessage = '🔑 Configuration error. Please contact support.';
        } else if (err.message.includes('quota') || err.message.includes('Quota')) {
          errorMessage = '💳 Service quota exceeded. Please try again later.';
        } else if (err.message) {
          // Show the actual error message if it's user-friendly
          errorMessage = `⚠️ ${err.message}`;
        }
      }
      
      setError(errorMessage);
      setMessages((prev) => [...prev, { 
        from: 'bot', 
        text: errorMessage,
        timestamp: new Date(),
        id: `error-${Date.now()}`
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, chatConfig]);

  const handleRetry = useCallback(() => {
    setError(null);
    // Optionally resend last user message
    const lastUserMessage = [...messages].reverse().find(m => m.from === 'user');
    if (lastUserMessage) {
      setInput(lastUserMessage.text);
    }
  }, [messages]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    setError(null);
  }, []);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-200"
          onClick={toggleChat}
          aria-hidden="true"
        />
      )}

      <div className="fixed bottom-4 right-4 z-50">
        {isOpen && (
          <div 
            className="bg-white shadow-soft-lg border border-border overflow-hidden flex flex-col fixed inset-4 rounded-xl md:relative md:inset-auto md:w-80 lg:w-96 md:max-w-[90vw] md:rounded-xl max-h-[calc(100vh-2rem)] md:max-h-[600px] transition-all duration-200 ease-out animate-slideUp"
            role="dialog"
            aria-label="Chat support"
          >
            {/* Header */}
            <div className="p-3 sm:p-4 flex justify-between items-center border-b bg-primary text-white shadow-soft">
              <div>
                <h3 className="text-sm sm:text-base font-bold">AI Chat Support</h3>
                <p className="text-xs text-foreground/80">Online • Avg. response 2s</p>
              </div>
              <button 
                onClick={toggleChat}
                aria-label="Close chat"
                className="text-white/90 hover:text-white transition-colors p-1 rounded-full hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Messages Container */}
            <div
              ref={containerRef}
              className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto scroll-smooth bg-gradient-to-b from-gray-50 to-white"
              style={{ minHeight: '200px' }}
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-sm sm:text-base max-w-[85%] sm:max-w-[80%] shadow-sm break-words transition-all duration-200 hover:shadow-md ${
                      msg.from === 'user' 
                        ? 'bg-primary text-white rounded-br-md' 
                        : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                    }`}
                  >
                    {renderMessage(msg.text)}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="px-3 py-2 sm:px-4 sm:py-3 bg-white rounded-2xl rounded-bl-md text-sm sm:text-base border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                      <span className="text-gray-500 text-xs">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center">
                  <button
                    onClick={handleRetry}
                    className="text-xs text-primary hover:text-primary underline flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry last message
                  </button>
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="space-y-2">
                  {suggestions.map(s => (
                    <div key={s._id} className="flex items-center justify-between border rounded-lg p-2 bg-white">
                      <div className="text-sm">
                        <div className="font-medium">{s.name}</div>
                        <div className="text-gray-600">₹{s.price} • {s.inStock ? 'In stock' : 'Out of stock'}</div>
                      </div>
                      <button
                        onClick={() => handleSend(`Add ${s.name} to cart`)}
                        className="text-xs px-2 py-1 rounded-md bg-primary text-white hover:bg-primary"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-4 border-t bg-white shadow-inner">
              {quickOptions.length > 0 && (
                <div className="w-full overflow-x-auto whitespace-nowrap pb-2 -mb-1">
                  <div className="inline-flex gap-2">
                    {quickOptions.map((opt, idx) => (
                      <button
                        key={`${opt}-${idx}`}
                        onClick={() => handleSend(opt)}
                        className="px-3 py-1.5 text-xs rounded-full border border-border text-primary hover:bg-secondary shrink-0"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-end space-x-2 sm:space-x-3">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    className="w-full border border-border rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[44px] max-h-[120px]"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    disabled={loading}
                    rows={1}
                    aria-label="Message input"
                  />
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="bg-primary hover:bg-primary disabled:bg-gray-300 text-white p-2 sm:p-3 rounded-xl transition-all duration-200 flex-shrink-0 disabled:cursor-not-allowed hover:scale-105 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              
              {/* Helper text */}
              <p className="text-xs text-gray-500 mt-2 text-center">
                <span className="hidden md:inline">Enter to send • </span>
                <span className="md:hidden">Press Enter to send • </span>
                Shift+Enter for new line
              </p>
            </div>
          </div>
        )}

        {/* Floating Chat Button */}
        <button
          onClick={toggleChat}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          className={`flex items-center justify-center rounded-full shadow-soft bg-primary text-white hover:bg-primary transition-all duration-300 hover:scale-110 active:scale-95 ${
            isOpen ? 'scale-90 rotate-90' : 'scale-100 rotate-0'
          } w-12 h-12 sm:w-14 sm:h-14 hover:shadow-soft-lg focus:outline-none focus:ring-4 focus:ring-primary`}
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default SupportChat;