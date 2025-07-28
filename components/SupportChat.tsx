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
import { MessageCircle, X } from 'lucide-react';

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
      const botReply = data.reply || '🤖 Sorry, I didn’t get that.';
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
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="w-96 max-w-[90vw] bg-white shadow-2xl rounded-xl border border-gray-300 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b">
            <div>
              <h3 className="text-sm font-bold">AI Chat Support</h3>
              <p className="text-xs text-gray-500">Available 24/7</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">
              <X />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={containerRef}
            className="flex-1 p-4 space-y-2 overflow-y-auto max-h-[400px] scroll-smooth"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-4 py-2 rounded-lg text-sm max-w-[80%] ${
                    msg.from === 'user' ? 'bg-orange-200' : 'bg-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Typing...</div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Icon */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 flex items-center justify-center rounded-full shadow-xl bg-orange-500 text-white hover:bg-orange-600"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SupportChat;
