'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Code, Copy, Check } from 'lucide-react';
import { api } from '@/lib/api';

interface Message { role: 'user' | 'assistant'; content: string; }

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your GFG AI Coding Assistant 🤖\n\nI can help you with:\n- **Explaining code** and concepts\n- **Debugging errors**\n- **Suggesting improvements**\n- **DSA problem solving**\n- **Interview preparation**\n\nAsk me anything about coding!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput(''); setLoading(true);
    try {
      const data = await api.aiChat({ message: input, context: messages.slice(-6) });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Here are some tips:\n\n1. Check your problem statement carefully\n2. Break down the problem into smaller parts\n3. Consider edge cases\n4. Try a brute force approach first\n\nFeel free to ask again!" }]);
    }
    setLoading(false);
  };

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx); setTimeout(() => setCopied(null), 2000);
  };

  const suggestions = ['Explain binary search', 'How does quicksort work?', 'Debug my Python code', 'What is dynamic programming?', 'System design basics'];

  return (
    <div className="min-h-screen bg-grid flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Coding Assistant</h1>
              <p className="text-xs text-gray-500">Powered by AI · Ask anything about coding</p>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'glass'}`}>
                  <div className={`text-sm whitespace-pre-wrap ${msg.role === 'assistant' ? 'text-gray-300' : 'text-white'}`}>
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && (
                    <button onClick={() => copyText(msg.content, i)}
                      className="mt-2 text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors">
                      {copied === i ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                    </button>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center"><Bot size={16} className="text-white" /></div>
              <div className="glass rounded-2xl p-4"><div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" /><div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.1s' }} /><div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }} /></div></div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map(s => (
              <button key={s} onClick={() => { setInput(s); }}
                className="px-3 py-1.5 rounded-full glass text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="glass rounded-2xl p-3 flex gap-3 items-end">
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask me anything about coding..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none resize-none max-h-32 text-sm"
            rows={1} />
          <button onClick={sendMessage} disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 flex-shrink-0">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
