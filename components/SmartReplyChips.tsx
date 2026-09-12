'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, List, Columns, X } from 'lucide-react';

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
  const scrollRef = useRef<HTMLDivElement | null>(null);

  if (!replies || replies.length === 0 || isDismissed) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Helper to cleanly separate and format *[Action]* from 'Spoken Dialogue'
  const renderReplyText = (text: string) => {
    const actionMatch = text.match(/^\*(\[.*?\]|.*?)\*\s*(.*)$/);
    if (actionMatch) {
      const action = actionMatch[1].replace(/^\[|\]$/g, '');
      const spoken = actionMatch[2];
      return (
        <div className="flex flex-col gap-0.5 text-left">
          <span className="text-rose-300 italic text-[11px] leading-snug">
            *{action}*
          </span>
          {spoken && (
            <span className="text-slate-100 font-semibold text-xs leading-snug">
              {spoken}
            </span>
          )}
        </div>
      );
    }
    return <span className="text-slate-200 font-medium text-xs leading-snug text-left">{text}</span>;
  };

  return (
    <div className="w-full my-2 animate-fade-in">
      {/* Header bar with controls */}
      <div className="flex items-center justify-between px-1 mb-1.5 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[#FF2E55] font-bold uppercase tracking-wider">
            <Sparkles size={12} className="text-[#FF2E55]" />
            <span>Quick Dialogue Choices ({replies.length})</span>
          </span>

          {/* Toggle between Horizontal Carousel and Vertical List View */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-white border border-white/10 transition-colors text-[10px] font-semibold"
            title={isExpanded ? 'Switch to slider view' : 'View all options in a list'}
          >
            {isExpanded ? (
              <>
                <Columns size={11} className="text-rose-400" />
                <span>Slider</span>
              </>
            ) : (
              <>
                <List size={11} className="text-rose-400" />
                <span>View All</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="text-slate-500 hover:text-slate-300 p-1 rounded-full transition-colors"
          title="Dismiss suggestions"
        >
          <X size={13} />
        </button>
      </div>

      {/* 1. SLIDER VIEW WITH NAVIGATION BUTTONS (Default) */}
      {!isExpanded ? (
        <div className="relative flex items-center group/slider">
          {/* Left Navigation Button */}
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0D0E15]/95 border border-white/15 text-slate-300 hover:text-white hover:border-[#FF2E55] flex items-center justify-center flex-shrink-0 shadow-lg active:scale-95 transition-all mr-1.5 z-10"
            title="Scroll Left"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Horizontal Scroller (Full Text Readable, No Blind Truncate) */}
          <div
            ref={scrollRef}
            className="flex-1 flex items-stretch gap-2.5 overflow-x-auto py-1 scrollbar-none scroll-smooth px-0.5"
          >
            {replies.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => onSelectReply(reply)}
                className="flex-shrink-0 min-w-[220px] max-w-[320px] sm:max-w-[360px] p-2.5 sm:p-3 rounded-2xl bg-[#0D0E15] hover:bg-[#151724] border border-white/[0.1] hover:border-rose-500/60 transition-all shadow-md hover:shadow-glow-crimson active:scale-[0.98] disabled:opacity-50 flex items-start gap-2.5 text-left group/btn"
              >
                <span className="w-5 h-5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[#FF2E55] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/btn:bg-[#FF2E55] group-hover/btn:text-white transition-colors">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  {renderReplyText(reply)}
                </div>
              </button>
            ))}
          </div>

          {/* Right Navigation Button */}
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0D0E15]/95 border border-white/15 text-slate-300 hover:text-white hover:border-[#FF2E55] flex items-center justify-center flex-shrink-0 shadow-lg active:scale-95 transition-all ml-1.5 z-10"
            title="Scroll Right"
            aria-label="Scroll Right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        /* 2. EXPANDED FULL STACKED VIEW (All 3 options 100% visible at once) */
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 py-1">
          {replies.map((reply, idx) => (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onSelectReply(reply)}
              className="w-full text-left p-3 rounded-2xl bg-[#0D0E15] hover:bg-[#151724] border border-white/[0.1] hover:border-rose-500/60 transition-all active:scale-[0.99] disabled:opacity-50 flex items-start gap-3 shadow-md group/opt"
            >
              <span className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/30 text-[#FF2E55] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/opt:bg-[#FF2E55] group-hover/opt:text-white transition-colors">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                {renderReplyText(reply)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
