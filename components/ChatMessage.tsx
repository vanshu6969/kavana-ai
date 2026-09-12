'use client';

import React from 'react';
import { MessageItem } from '@/lib/supabase';

interface ChatMessageProps {
  message: MessageItem;
  characterAvatar?: string;
  characterName?: string;
}

export default function ChatMessage({
  message,
  characterAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  characterName = 'Character',
}: ChatMessageProps) {
  const isUser = message.sender === 'user';

  // Formats text so actions in asterisks or brackets flow naturally with dialogue
  const renderFormattedAiText = (rawText: string) => {
    const parts = rawText.split(/(\*?\[.*?\]\*?|\*.*?\*)/g);

    return (
      <div className="text-slate-100 text-[14px] sm:text-[15px] leading-relaxed font-sans space-y-2">
        <p>
          {parts.map((part, index) => {
            if (!part) return null;

            const isAction =
              (part.startsWith('[') && part.endsWith(']')) ||
              (part.startsWith('*[') && part.endsWith(']*')) ||
              (part.startsWith('*') && part.endsWith('*'));

            if (isAction) {
              let clean = part;
              if (clean.startsWith('*[') && clean.endsWith(']*')) {
                clean = clean.slice(2, -2);
              } else if (clean.startsWith('[') && clean.endsWith(']')) {
                clean = clean.slice(1, -1);
              } else if (clean.startsWith('*') && clean.endsWith('*')) {
                clean = clean.slice(1, -1);
              }

              return (
                <span
                  key={index}
                  className="text-rose-300 italic font-medium tracking-wide mx-0.5"
                >
                  *{clean.trim()}*
                </span>
              );
            }

            return (
              <span key={index} className="text-slate-100">
                {part}
              </span>
            );
          })}
        </p>
      </div>
    );
  };

  if (isUser) {
    return (
      <div className="flex justify-end my-2.5 pl-8 sm:pl-16 animate-fade-in">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-xs bg-gradient-to-r from-[#FF2E55] via-rose-600 to-[#E00034] text-white px-4 py-3 shadow-md shadow-rose-950/40">
          <p className="text-[14px] sm:text-[15px] font-sans leading-relaxed font-medium">
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 my-2.5 pr-4 sm:pr-12 animate-fade-in group">
      {/* Character Avatar */}
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-rose-500/40 flex-shrink-0 mt-0.5 shadow-sm">
        <img
          src={characterAvatar}
          alt={characterName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col items-start max-w-[90%] sm:max-w-[80%]">
        {/* Character Name */}
        <span className="text-xs font-bold text-[#FF5C7A] mb-1 ml-0.5 tracking-wide">
          {characterName}
        </span>

        {/* Message Bubble */}
        <div className="rounded-2xl rounded-tl-xs bg-[#0D0E15]/95 border border-white/[0.08] px-4 py-3 shadow-md backdrop-blur-md">
          {renderFormattedAiText(message.text)}
        </div>
      </div>
    </div>
  );
}
