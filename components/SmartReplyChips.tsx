'use client';

import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, X } from 'lucide-react';

interface SmartReplyChipsProps {
  replies: string[];
  onSelectReply: (reply: string) => void;
  disabled?: boolean;
}

export default function SmartReplyChips({
  replies,
  onSelectReply,
  disabled = false,
}: SmartReplyChipsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (!replies || replies.length === 0 || isDismissed) return null;

  return (
    <div className="w-full my-2 animate-fade-in">
      {/* Header bar with expand / dismiss controls */}
      <div className="flex items-center justify-between px-1 mb-1.5 text-[11px]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-[#FF2E55] hover:text-rose-400 font-bold uppercase tracking-wider transition-colors"
        >
          <Sparkles size={13} className="text-[#FF2E55]" />
          <span>Quick Responses ({replies.length})</span>
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
          title="Dismiss suggestions"
        >
          <X size={12} />
        </button>
      </div>

      {/* Horizontal compact scrolling mode */}
      {!isExpanded ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none px-0.5">
          {replies.map((reply, idx) => (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onSelectReply(reply)}
              className="flex-shrink-0 max-w-[280px] sm:max-w-xs px-3.5 py-1.5 rounded-full bg-[#0D0E15] hover:bg-rose-500/20 border border-white/[0.08] hover:border-rose-500/50 text-xs text-slate-300 hover:text-rose-200 transition-all shadow-sm active:scale-95 disabled:opacity-50 truncate text-left"
              title={reply}
            >
              <span className="text-[#FF2E55] font-bold mr-1.5">›</span>
              {reply}
            </button>
          ))}
        </div>
      ) : (
        /* Expanded full view when user clicks to see details */
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
          {replies.map((reply, idx) => (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onSelectReply(reply)}
              className="text-left px-3.5 py-2 rounded-xl bg-[#0D0E15] hover:bg-rose-500/15 border border-white/[0.08] hover:border-rose-500/50 text-xs text-slate-300 hover:text-rose-200 font-normal transition-all active:scale-[0.99] disabled:opacity-50 flex items-start gap-2"
            >
              <span className="text-[#FF2E55] font-bold text-sm leading-none mt-0.5">›</span>
              <span className="flex-1 leading-relaxed">{reply}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
