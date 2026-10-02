'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User as UserIcon, Bot, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  source?: string | null;
};

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/student/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg.text }),
        credentials: 'include'
      });
      
      const data = await res.json();
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.answer || "I'm sorry, I couldn't process that request.",
        source: data.source
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: 'Network error communicating with the AI Engine.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Show my examination schedule",
    "What is RAG?",
    "Find my assignment deadlines",
    "Show my class timetable"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-card rounded-2xl shadow-sm shadow-border border border-border overflow-hidden relative">
      
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center px-6 bg-background">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Helpdesk AI Assistant</h2>
          <p className="text-xs text-muted-foreground flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-background/50">
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">How can I help you today?</h3>
            <p className="text-muted-foreground mb-8">I can answer questions about your courses, exams, assignments, and search through college study materials.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => { setInput(s); }}
                  className="p-3 text-sm text-left bg-card border border-border rounded-xl hover:border-primary hover:shadow-md transition-all text-foreground font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${msg.sender === 'user' ? 'bg-muted ml-3' : 'bg-primary mr-3'}`}>
                  {msg.sender === 'user' ? <UserIcon className="w-4 h-4 text-muted-foreground" /> : <Bot className="w-4 h-4 text-white" />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`px-5 py-3.5 rounded-2xl shadow-sm shadow-border text-[15px] leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-white rounded-tr-sm' 
                        : 'bg-card border border-border text-foreground rounded-tl-sm'
                    }`}
                  >
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className={i !== 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>
                  
                  {/* Source Badge */}
                  {msg.source && (
                    <div className="mt-2 text-xs font-medium text-muted-foreground flex items-center bg-muted px-2 py-1 rounded-md">
                      Source: {msg.source}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-card border border-border px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm shadow-border flex space-x-1.5 items-center h-[52px]">
                  <motion.div className="w-2 h-2 bg-indigo-300 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-2 h-2 bg-indigo-300 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 bg-indigo-300 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border">
        <form onSubmit={handleSend} className="relative flex items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask AI Assistant..."
            className="w-full bg-background border border-border text-foreground rounded-2xl pl-4 pr-14 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all placeholder:text-muted-foreground"
            rows={1}
            style={{ minHeight: '56px', maxHeight: '150px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:hover:bg-primary"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">AI can make mistakes. Verify important academic information.</span>
        </div>
      </div>
    </div>
  );
}
