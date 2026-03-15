import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Code, CheckCircle, XCircle, Loader2, Bot, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '@/lib/api';

const LANGUAGES = [
  { id: 'javascript', name: 'Node.js', icon: '📜' },
];

const STARTER_CODE: Record<string, string> = {
  javascript: 'function solve() {\n    // Write your code here\n}\n\nsolve();',
};

interface CodeEditorModalProps {
  challenge: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CodeEditorModal({ challenge, onClose, onSuccess }: CodeEditorModalProps) {
  const [lang] = useState('javascript');
  const [code, setCode] = useState(STARTER_CODE.javascript);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // AI Chat state
  const [showAi, setShowAi] = useState(false);
  const [aiChat, setAiChat] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState('');

  const handleRunCode = async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await api.submitChallenge(challenge._id, code, lang);
      setResult(res);
      if (res.result === 'passed') {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      setResult({ result: 'error', output: err.message || 'Execution failed', testCasesPassed: 0, totalTestCases: challenge.testCases?.length || 0 });
    } finally {
      setRunning(false);
    }
  };

  const handleAskAI = async (prompt?: string) => {
    if (!code.trim() && !prompt) return;
    
    setShowAi(true);
    setAiLoading(true);
    
    const userMsg = prompt || "Please explain my code and suggest improvements.";
    setAiChat(prev => [...prev, { role: 'user', content: userMsg }]);
    
    try {
      // Use the prompt + code for context
      const query = `Code:\n${code}\n\nQuestion: ${userMsg}\n\nChallenge Title: ${challenge.title}\nDescription: ${challenge.description}`;
      const res = await api.explainCode(query, lang);
      setAiChat(prev => [...prev, { role: 'ai', content: res.explanation }]);
    } catch (err: any) {
      setAiChat(prev => [...prev, { role: 'ai', content: 'Oops! AI error: ' + err.message }]);
    } finally {
      setAiLoading(false);
      setAiInput('');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50">
            <div className="flex items-center gap-3">
              <Code className="text-green-400" size={24} />
              <h2 className="text-xl font-bold text-white">{challenge.title}</h2>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${
                challenge.difficulty === 'easy' ? 'text-green-400 bg-green-500/10' :
                challenge.difficulty === 'medium' ? 'text-amber-400 bg-amber-500/10' :
                'text-red-400 bg-red-500/10'
              }`}>{challenge.difficulty}</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-xl">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Box: Problem Description */}
            <div className="w-1/3 border-r border-gray-800 overflow-y-auto p-6 bg-gray-900/30">
              <h3 className="text-lg font-semibold text-white mb-4">Problem Statement</h3>
              <div className="text-gray-300 text-sm whitespace-pre-wrap mb-6 leading-relaxed">
                {challenge.description}
              </div>

              {challenge.inputFormat && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Input Format</h4>
                  <div className="p-3 bg-black/40 rounded-lg border border-gray-800 text-sm text-gray-300 font-mono whitespace-pre-wrap">
                    {challenge.inputFormat}
                  </div>
                </div>
              )}

              {challenge.outputFormat && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Output Format</h4>
                  <div className="p-3 bg-black/40 rounded-lg border border-gray-800 text-sm text-gray-300 font-mono whitespace-pre-wrap">
                    {challenge.outputFormat}
                  </div>
                </div>
              )}

              {(challenge.sampleInput || challenge.sampleOutput) && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-400">Sample Test Case</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-black/40 rounded-lg border border-gray-800">
                      <div className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">Input</div>
                      <code className="text-sm text-green-400 whitespace-pre-wrap">{challenge.sampleInput}</code>
                    </div>
                    <div className="p-3 bg-black/40 rounded-lg border border-gray-800">
                      <div className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">Output</div>
                      <code className="text-sm text-green-400 whitespace-pre-wrap">{challenge.sampleOutput}</code>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Box: Code Editor & Results */}
            <div className="w-2/3 flex flex-col bg-[#1e1e1e]">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#333]">
                <div className="flex space-x-2">
                  <div className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <span>📜</span> Node.js (JavaScript)
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAskAI()} disabled={aiLoading || !code.trim() || code === STARTER_CODE.javascript} className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 border border-purple-500/20">
                    {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Bot size={16} />} 
                    Ask AI Assistant
                  </button>
                  <button onClick={handleRunCode} disabled={running} className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition-colors text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50">
                    {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                    Run Code
                  </button>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 relative overflow-hidden bg-[#1e1e1e]">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full p-6 bg-transparent text-gray-300 font-mono text-sm leading-relaxed outline-none resize-none z-10 relative"
                  spellCheck="false"
                  style={{ tabSize: 4 }}
                />
              </div>

              {/* AI Explanation Chat Panel */}
              {showAi && (
                <div className="h-64 border-t border-purple-500/30 bg-purple-900/10 flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 bg-purple-900/20 border-b border-purple-500/20">
                    <div className="flex items-center gap-2 text-purple-400 font-medium text-sm">
                      <Bot size={18} /> AI Code Analyst
                    </div>
                    <button onClick={() => setShowAi(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {aiChat.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-800 border border-purple-500/20 text-gray-300'}`}>
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
                    {aiLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-800 border border-purple-500/20 text-purple-400 px-4 py-3 rounded-2xl flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" /> Thinking...
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-gray-900/50 border-t border-purple-500/20 flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAskAI(aiInput)}
                      placeholder="Ask the AI a question about your code..."
                      className="flex-1 bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                    <button onClick={() => handleAskAI(aiInput)} disabled={aiLoading || !aiInput.trim()} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm disabled:opacity-50">
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* Results Console */}
              {result && (
                <div className="h-64 border-t border-[#333] bg-[#1e1e1e] flex flex-col">
                  <div className={`px-4 py-2 text-sm font-medium flex items-center gap-2 justify-between border-b border-[#333] ${result.result === 'passed' ? 'text-green-400 bg-green-500/5' : 'text-red-400 bg-red-500/5'}`}>
                    <div className="flex items-center gap-2">
                      {result.result === 'passed' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {result.message}
                    </div>
                    <div className="text-gray-400 flex items-center gap-2">
                       <button onClick={() => handleAskAI("I'm totally stuck. Please show me the completely correct solution code for this challenge and explain how it traverses the problem.")} className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 underline decoration-red-500/30 underline-offset-4 rounded-md flex items-center gap-2 transition-all mr-4 text-xs">
                           <AlertTriangle size={14} /> Show Answer
                       </button>
                      <span className="text-xs uppercase font-bold tracking-wider">Test Cases Passed:</span>
                      <span className={`px-2 py-0.5 rounded bg-black/50 ${result.result === 'passed' ? 'text-green-400' : 'text-amber-400'}`}>
                        {result.testCasesPassed} / {result.totalTestCases || challenge.testCases?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 overflow-y-auto flex-1 font-mono text-sm relative">
                    {result.result !== 'passed' && result.totalTestCases > 0 && result.testCasesPassed < result.totalTestCases && (
                       <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 flex items-start gap-3 text-sm">
                         <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                         <div>
                           <div className="font-semibold mb-1">Failed hidden test cases.</div>
                           Not sure why? <button onClick={() => handleAskAI("My code failed some hidden test cases. Can you spot edge cases I missed?")} className="underline hover:text-red-200">Ask AI for a hint</button>
                         </div>
                       </div>
                    )}
                    {result.result === 'passed' && (
                       <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-300 flex items-center justify-between text-sm">
                         <span>Great job! Want a detailed explanation of why your solution works, or its time/space complexity?</span>
                         <button onClick={() => handleAskAI("Can you explain my correct solution's time and space complexity?")} className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-purple-200 flex items-center gap-2">
                           <Bot size={14} /> Explain My Solution
                         </button>
                       </div>
                    )}
                    <pre className={`${result.result === 'error' ? 'text-red-400' : 'text-gray-300'} whitespace-pre-wrap`}>
                      {result.output || 'No output generated.'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
