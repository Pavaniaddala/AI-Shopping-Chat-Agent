'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import PhoneCard from './PhoneCard';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  phones?: any[];
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm your mobile phone shopping assistant. I can help you find the perfect phone based on your budget and needs. What are you looking for?",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        phones: data.phones
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQueries = [
    "Best camera phone under ₹30k?",
    "Compare Pixel 8a vs OnePlus 12R",
    "Compact phone with good battery"
  ];

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center">
      {/* Centered LOGO + HEADING */}
      <div className="w-full flex flex-col items-center mt-3">
        <div className="flex items-center justify-center gap-6 max-w-3xl w-full mx-auto">
          <Image
            src="/logo.png"
            alt="Logo"
            width={600}
            height={500}
            className="rounded-lg shadow-lg border-2 border-cyan-400 bg-black"
            style={{ objectFit: 'contain', minWidth: 50, minHeight: 50 }}
          />
          <div>
            <h1
              style={{
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "2.7rem",
                textAlign: "center",
                fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                letterSpacing: "0.09em",
                marginBottom: "7px"
              }}
            >
              MOBILE SHOPPING ASSISTANT
            </h1>
            <p
              style={{
                color: "#00FF00",
                fontWeight: 600,
                fontSize: "1.12rem",
                textAlign: "center",
                fontFamily: "Quicksand, Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                marginTop: 0
              }}
            >
              <span style={{ color: "#ffffff", fontWeight: 700 }}>
                AI-Powered Shopping
              </span>{" "}
              for smart mobile choices!
            </p>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 w-full max-w-2xl bg-black rounded-2xl  p-4 md:p-6 flex flex-col justify-end">
        <div className="flex-1 overflow-y-auto space-y-5 pb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 w-full max-w-[96vw] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center 
                  ${msg.role === 'user' ? 'bg-blue-600 border-2 border-blue-400' : 'bg-green-600 border-2 border-green-400'}`}>
                  {msg.role === 'user' ? 
                    <User size={20} className="text-white" /> : 
                    <Bot size={20} className="text-white" />}
                </div>
                <div>
                  <div className={msg.role === 'user' ? "user-bubble-impress" : "assistant-bubble-impress"}>
                    <p className="whitespace-pre-wrap leading-relaxed"
                    style={idx === 0 && msg.role === 'assistant' ? { color: "#C0C0C0", fontWeight: 600 } : {}}>{msg.content}</p>
                  </div>
                  {msg.phones && msg.phones.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.phones.map(phone => (
                        <PhoneCard key={phone.id} phone={phone} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center border-2 border-green-400">
                  <Loader2 size={20} className="text-white animate-spin" />
                </div>
                <div className="assistant-bubble-impress">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input Area - replaced with ChatGPT style */}
        <div className="mt-4">
          <div className="flex items-center w-full bg-[#21232A] rounded-2xl shadow-lg px-4 py-3 mb-6 border border-[#262626]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about phones..."
              className="flex-1 bg-transparent text-white placeholder:text-gray-400 text-[1.09rem] border-none outline-none px-2"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="ml-2 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#2563eb] to-[#38bdf8] hover:from-[#1d4ed8] hover:to-[#0ea5e9] p-2 h-11 w-11 shadow-md transition disabled:opacity-60"
            >
              <Send size={50} className="text-white" />
            </button>
          </div>
          {/* Suggested Queries */}
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((query, idx) => (
              <button
                key={idx}
                onClick={() => setInput(query)}
                className="suggested-btn"
              >
                {query}
                
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

