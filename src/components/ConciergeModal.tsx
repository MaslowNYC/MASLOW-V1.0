'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConciergeModalProps {
  userId: string;
  onClose: () => void;
}

const MAX_CHARS = 500;
const DAILY_LIMIT = 10;
const HOURLY_LIMIT = 5;

// System prompt for the AI
const SYSTEM_PROMPT = `You are Maslow Concierge, an expert on the Maslow company, Abraham Maslow's hierarchy of needs, and New York City.

Guidelines:
- Detect the user's language and respond in the same language
- Adapt to cultural context (formal vs casual based on language/culture)
- Only cite trusted sources: NYT, Eater, Time Out, Michelin, The Infatuation
- Never rank or give opinions - only state facts or cite others' rankings
- For questions outside NYC/Maslow: "I specialize in NYC and Maslow - what can I help you with about the city?"
- Keep responses concise and helpful
- Be warm and professional, like a knowledgeable NYC local`;

export default function ConciergeModal({ userId, onClose }: ConciergeModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingChats, setRemainingChats] = useState(DAILY_LIMIT);
  const [isAtLimit, setIsAtLimit] = useState(false);
  const [limitMessage, setLimitMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const charCount = input.length;
  const isOverLimit = charCount > MAX_CHARS;

  // Load chat history and rate limits on mount
  useEffect(() => {
    loadChatHistory();
    checkRateLimits();
  }, [userId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const loadChatHistory = async () => {
    try {
      const { data } = await (supabase
        .from('concierge_chats') as any)
        .select('messages')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data?.messages) {
        const loadedMessages = data.messages.slice(-10).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(loadedMessages);
      }
    } catch (err) {
      // No existing chat history
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "Welcome to Maslow. I'm your NYC concierge - ask me anything about the city, our services, or what makes Maslow special.",
        timestamp: new Date(),
      }]);
    }
  };

  const checkRateLimits = async () => {
    try {
      const { data } = await (supabase
        .from('concierge_usage') as any)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        const now = new Date();
        const lastReset = new Date(data.last_reset_date);
        const lastHourReset = new Date(data.last_hour_reset || 0);

        // Check if we need to reset daily count
        const isNewDay = now.toDateString() !== lastReset.toDateString();
        const todayCount = isNewDay ? 0 : data.message_count_today;

        // Check if we need to reset hourly count
        const hoursSinceReset = (now.getTime() - lastHourReset.getTime()) / (1000 * 60 * 60);
        const hourCount = hoursSinceReset >= 1 ? 0 : data.hour_count;

        setRemainingChats(DAILY_LIMIT - todayCount);

        if (todayCount >= DAILY_LIMIT) {
          setIsAtLimit(true);
          setLimitMessage("You've used your 10 daily chats. Resets at midnight EST. Need help? support@maslow.nyc");
        } else if (hourCount >= HOURLY_LIMIT) {
          setIsAtLimit(true);
          setLimitMessage("You've reached your hourly limit. Please wait a bit before sending more messages.");
        }
      } else {
        setRemainingChats(DAILY_LIMIT);
      }
    } catch (err) {
      console.error('Error checking rate limits:', err);
    }
  };

  const updateRateLimits = async () => {
    try {
      const now = new Date();

      // Upsert usage record
      await (supabase
        .from('concierge_usage') as any)
        .upsert({
          user_id: userId,
          message_count_today: DAILY_LIMIT - remainingChats + 1,
          hour_count: 1, // Will be incremented server-side
          last_reset_date: now.toISOString().split('T')[0],
          last_hour_reset: now.toISOString(),
        }, {
          onConflict: 'user_id',
        });

      setRemainingChats(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error updating rate limits:', err);
    }
  };

  const saveChatHistory = async (newMessages: Message[]) => {
    try {
      await (supabase
        .from('concierge_chats') as any)
        .upsert({
          user_id: userId,
          messages: newMessages.map(m => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp.toISOString(),
          })),
          created_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });
    } catch (err) {
      console.error('Error saving chat history:', err);
    }
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || isOverLimit || isAtLimit) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call AI API (Supabase Edge Function)
      const { data, error } = await supabase.functions.invoke('concierge-chat', {
        body: {
          message: userMessage.content,
          userId,
          history: messages.slice(-5).map(m => ({
            role: m.role,
            content: m.content,
          })),
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || "I apologize, but I couldn't process your request. Please try again.",
        timestamp: new Date(),
      };

      const newMessages = [...messages, userMessage, assistantMessage];
      setMessages(newMessages);

      // Update rate limits and save chat
      await updateRateLimits();
      await saveChatHistory(newMessages);

      // Update remaining chats from response
      if (data.remainingChats !== undefined) {
        setRemainingChats(data.remainingChats);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isOverLimit, isAtLimit, messages, userId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="fixed z-[9999] inset-4 md:inset-auto md:bottom-6 md:right-6 md:w-[400px] md:h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="concierge-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#286ABC] to-[#3B5998]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF4ED] rounded-full flex items-center justify-center">
              <span className="text-[#286ABC] font-bold text-lg">M</span>
            </div>
            <div>
              <h2 id="concierge-title" className="text-white font-semibold">
                AI Concierge
              </h2>
              <p className="text-white/70 text-xs">
                {remainingChats} of {DAILY_LIMIT} chats left today
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-[#286ABC] text-white rounded-br-sm'
                    : 'bg-[#FAF4ED] text-gray-800 rounded-bl-sm border border-[#E5DFD8]'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-[10px] mt-1 ${
                  message.role === 'user' ? 'text-white/60' : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#FAF4ED] rounded-2xl rounded-bl-sm px-4 py-3 border border-[#E5DFD8]">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Rate limit message */}
        {isAtLimit && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-200">
            <p className="text-amber-800 text-xs text-center">{limitMessage}</p>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isAtLimit ? "Chat limit reached" : "Ask me about NYC..."}
                disabled={isAtLimit}
                className="w-full px-4 py-3 pr-16 rounded-xl border border-gray-200 focus:border-[#286ABC] focus:ring-2 focus:ring-[#286ABC]/20 outline-none resize-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={1}
                maxLength={MAX_CHARS + 50} // Allow typing a bit over for UX
              />
              {/* Character counter */}
              <span className={`absolute bottom-3 right-3 text-[10px] ${
                isOverLimit ? 'text-red-500 font-semibold' : 'text-gray-400'
              }`}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>

            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading || isOverLimit || isAtLimit}
              className="w-12 h-12 bg-[#286ABC] hover:bg-[#1E5299] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
