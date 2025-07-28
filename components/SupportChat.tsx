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

//       {/* Floating Chat Icon */}
//       <button
//         onClick={() => setIsOpen((prev) => !prev)}
//         className="mt-3 flex items-center justify-center w-14 h-14 bg-white border shadow-lg rounded-full hover:bg-gray-100"
//       >
//         <MessageCircle className="w-6 h-6 text-black" />
//       </button>
//     </div>
//   );
// };

// export default SupportChat;


'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: '👋 Hi there! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      const botReply = data.reply || '🤖 Sorry, I didnot get that';
      setMessages((prev) => [...prev, { from: 'bot', text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { from: 'bot', text: '⚠️ Something went wrong. Try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-4 right-4 z-50">
        {isOpen && (
          <div className={`
            bg-white shadow-2xl border border-gray-300 overflow-hidden flex flex-col
            /* Mobile - Full screen modal */
            fixed inset-4 rounded-xl md:relative md:inset-auto
            /* Tablet & Desktop - Floating window */
            md:w-80 lg:w-96 md:max-w-[90vw] md:rounded-xl
            /* Height adjustments */
            max-h-[calc(100vh-2rem)] md:max-h-[600px]
          `}>
            
            {/* Header */}
            <div className="p-3 sm:p-4 flex justify-between items-center border-b bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div>
                <h3 className="text-sm sm:text-base font-bold">AI Chat Support</h3>
                <p className="text-xs text-orange-100">Available 24/7</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-orange-100 hover:text-white transition-colors p-1 rounded-full hover:bg-orange-600"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Messages Container */}
            <div
              ref={containerRef}
              className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto scroll-smooth bg-gray-50"
              style={{ minHeight: '200px' }}
            >
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-sm sm:text-base max-w-[85%] sm:max-w-[80%]
                      shadow-sm break-words
                      ${msg.from === 'user' 
                        ? 'bg-orange-500 text-white rounded-br-md' 
                        : 'bg-white text-gray-800 rounded-bl-md border'
                      }
                    `}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 sm:px-4 sm:py-3 bg-white rounded-2xl rounded-bl-md text-sm sm:text-base border shadow-sm">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-500 ml-2">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-4 border-t bg-white">
              <div className="flex items-end space-x-2 sm:space-x-3">
                <div className="flex-1">
                  <textarea
                    className="
                      w-full border rounded-xl px-3 py-2 sm:px-4 sm:py-3 
                      text-sm sm:text-base resize-none
                      focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                      transition-all duration-200
                      min-h-[44px] max-h-[120px]
                    "
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={loading}
                    rows={1}
                    style={{
                      height: 'auto',
                      minHeight: '44px'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                    }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="
                    bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 
                    text-white p-2 sm:p-3 rounded-xl 
                    transition-all duration-200 flex-shrink-0
                    disabled:cursor-not-allowed
                    min-w-[44px] min-h-[44px] flex items-center justify-center
                  "
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              
              {/* Helper text for mobile */}
              <p className="text-xs text-gray-500 mt-2 md:hidden">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        )}

        {/* Floating Chat Icon */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
            flex items-center justify-center rounded-full shadow-xl 
            bg-orange-500 text-white hover:bg-orange-600 
            transition-all duration-300 hover:scale-110
            ${isOpen ? 'scale-90' : 'scale-100'}
            /* Responsive sizes */
            w-12 h-12 sm:w-14 sm:h-14
            /* Animation */
            hover:shadow-2xl
          `}
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>
    </>
  );
};

export default SupportChat;