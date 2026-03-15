'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Loader2, Sparkles, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '@/lib/api';

export default function GlobalAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Hi there! I am the GFG Campus AI. How can I help you with your coding journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // Reusing the simple text AI endpoint
      const res = await api.askAI(userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: res.answer || res.explanation }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-purple-500/30 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] max-h-[80vh]"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-medium">
                <Bot size={20} /> GFG Campus AI
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0f1c]/95">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-gray-800 border border-purple-500/20 text-gray-300 rounded-tl-sm'}`}>
                    {msg.role === 'user' ? msg.content : (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            ul: ({ children }) => <ul className="list-disc ml-4 space-y-1 my-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal ml-4 space-y-1 my-2">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            h3: ({ children }) => <h3 className="text-white font-bold mb-2 mt-3">{children}</h3>,
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            code: ({ children }) => <code className="bg-black/50 px-1.5 py-0.5 rounded text-purple-300 font-mono text-xs">{children}</code>,
                            pre: ({ children }) => <pre className="bg-black/50 p-3 rounded-lg my-2 overflow-x-auto border border-gray-700">{children}</pre>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 border border-purple-500/20 text-purple-400 px-4 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-2 text-sm">
                    <Loader2 size={16} className="animate-spin" /> Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-black/40 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                disabled={loading}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white disabled:opacity-50 transition-colors"
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
