'use client';
import { useState } from "react";
import { ChevronDown } from "lucide-react"; // optional icon

type Bank = {
  name: string;
};

const bankList: Bank[] = [
  { name: "HDFC" },
  { name: "Punjab And Sind Bank" },
  { name: "Jammu and Kashmir Bank" },
  { name: "Janata Sahakari Bank Pune" },
  { name: "Karnataka Bank" },
  { name: "Karur Vysya" },
  { name: "State Bank of India" },
  { name: "Axis Bank" },
  { name: "ICICI Bank" },
  { name: "Kotak Mahindra Bank" },
  { name: "Yes Bank" },
  // Add more banks...
];

export default function BankDropdown() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const filteredBanks = bankList.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative mx-auto">
      <div
        className="border border-gray-300 rounded-md px-4 py-2 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-700">{selectedBank?.name || "All Banks"}</span>
        <ChevronDown size={18} />
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          <input
            type="text"
            placeholder="Search bank"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-200 text-sm focus:outline-none"
          />
          {filteredBanks.map((bank, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedBank(bank);
                setIsOpen(false);
                setSearchTerm("");
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
            >
              {bank.name}
            </div>
          ))}
          {filteredBanks.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500">No results</div>
          )}
        </div>
      )}
    </div>
  );
}
