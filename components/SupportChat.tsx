'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react'; // Lucide icons
import clsx from 'clsx';

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-2 left-[94%] z-50">
      {/* Floating Support Panel */}
      <div
        className={clsx(
          'transition-all duration-300 ease-in-out w-80 max-w-[90vw] bg-orange-100 shadow-xl rounded-xl overflow-hidden border border-gray-200',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'
        )}
      >
        <div className="p-4 ">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-semibold">Bokksu Market</h2>
              <p className="text-xs text-gray-600">Chat support is open 9am - 10pm ET on Weekdays.</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Support links */}
          <div className="bg-gray-100 rounded-lg divide-y divide-gray-300 text-sm">
            <button className="w-full px-4 py-3 text-left hover:bg-gray-200">Report a Damaged Order</button>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-200">Shipping Questions</button>
            <button className="w-full px-4 py-3 text-left hover:bg-gray-200">How are my items packed?</button>
          </div>

          <button className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm text-left font-medium hover:bg-gray-200">
            Track and manage my orders
          </button>

          <button className="w-full px-4 py-3 bg-white border rounded-lg text-sm flex items-center justify-between hover:bg-gray-50">
            <span>Bokksu Market Support</span>
            <span className="text-green-600 font-bold">➤</span>
          </button>
        </div>
      </div>

      {/* Floating Chat Icon */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="mt-3 flex items-center justify-center w-14 h-14 bg-white border shadow-lg rounded-full hover:bg-gray-100"
      >
        <MessageCircle className="w-6 h-6 text-black" />
      </button>
    </div>
  );
};

export default SupportChat;
