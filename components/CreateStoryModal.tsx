'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { Sparkles, X, Wand2, Compass, Flame, AlertCircle, Loader2 } from 'lucide-react';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
}

const GENRE_SUGGESTIONS = [
  'Pakistani Drama',
  'Romance',
  'Crime & Mafia',
  'Billionaire CEO',
  'Anime & Fantasy',
  'Thriller & Gothic',
];

const EXAMPLE_TITLES = [
  'Ishq Ka Inteqam',
  "Billionaire's Secret Bride",
  'The Don of Karachi',
  'Reborn as the Mafia Prince',
  'Forbidden Moonlight',
  'Second Chance with My Ex-Wife',
];

export default function CreateStoryModal({
  isOpen,
  onClose,
  initialTitle = '',
}: CreateStoryModalProps) {
  const router = useRouter();
  const { addCustomStory } = useApp();

  const [title, setTitle] = useState(initialTitle);
  const [selectedGenre, setSelectedGenre] = useState('Pakistani Drama');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepText, setStepText] = useState('Connecting to neural story engine...');

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a story title');
      return;
    }

    setLoading(true);
    setError(null);
    setStepText('Designing male protagonist & dramatic tension...');

    const stepInterval = setInterval(() => {
      setStepText((prev) => {
        if (prev.includes('male protagonist')) return 'Writing cinematic Roman Urdu opening hook...';
        if (prev.includes('Roman Urdu')) return 'Composing high-stakes interactive choices...';
        return 'Finalizing scene atmosphere & character persona...';
      });
    }, 2000);

    try {
      const response = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          genre: selectedGenre,
          prompt: prompt.trim(),
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate story');
      }

      const data = await response.json();
      if (data.story) {
        addCustomStory(data.story);
        onClose();
        router.push(`/chat/${data.story.id}`);
      } else {
        throw new Error('No story returned from generator');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Story generation error:', err);
      setError(err?.message || 'Failed to generate story. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close (disabled while loading) */}
      <div
        className="fixed inset-0"
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      <div className="relative w-full max-w-lg bg-[#0d0f14] border border-white/10 rounded-2xl shadow-2xl shadow-rose-950/40 overflow-hidden z-10">
        {/* Glowing Top Banner */}
        <div className="relative px-5 py-4 bg-gradient-to-r from-rose-950/60 via-[#181a22] to-rose-950/40 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF2E55] to-rose-400 flex items-center justify-center text-white shadow-glow-crimson">
              <Wand2 size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                AI Story Generator
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF2E55]/20 text-[#FF2E55] border border-[#FF2E55]/40">
                  Instant
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Enter any title — AI builds the character, scene & choices instantly
              </p>
            </div>
          </div>

          {!loading && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-300">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Story Title *</span>
              <span className="text-[10px] text-slate-500 font-normal">Hindi, Urdu or English</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError(null);
                }}
                disabled={loading}
                placeholder="e.g. Ishq Ka Inteqam, The Ruthless CEO, Dilnasheen..."
                className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E55] focus:ring-1 focus:ring-[#FF2E55] text-sm font-medium transition-all"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleGenerate();
                  }
                }}
              />
            </div>

            {/* Quick Title Suggestions */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-500 flex items-center gap-1 self-center mr-1">
                <Sparkles size={10} className="text-[#FF2E55]" /> Try:
              </span>
              {EXAMPLE_TITLES.slice(0, 3).map((ex) => (
                <button
                  key={ex}
                  type="button"
                  disabled={loading}
                  onClick={() => setTitle(ex)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-rose-500/10 hover:text-rose-300 border border-white/[0.06] text-slate-400 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Genre Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Genre / Vibe
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {GENRE_SUGGESTIONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  disabled={loading}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-semibold text-center transition-all border ${
                    selectedGenre === g
                      ? 'bg-rose-600/20 border-[#FF2E55] text-white shadow-sm shadow-rose-900/30'
                      : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Plot / Hook Note */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Custom Hook / Plot Idea (Optional)</span>
              <span className="text-[10px] text-slate-500 font-normal">Any specific twist</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              rows={2}
              placeholder="e.g. She rejected me 3 years ago, now she arrives at my luxury penthouse asking for help..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E55] focus:ring-1 focus:ring-[#FF2E55] text-xs resize-none transition-all"
            />
          </div>

          {/* Highlights Info */}
          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-[#FF2E55] shrink-0">
              <Flame size={14} />
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              <span className="text-white font-bold">100% Uncensored Male POV:</span> Protagonist is always male, accompanied by dynamic Hinglish dialogue and 3 interactive choice buttons.
            </div>
          </div>

          {/* Generate Button & Progress */}
          <div className="pt-2">
            {loading ? (
              <div className="p-4 rounded-xl bg-rose-950/30 border border-[#FF2E55]/30 flex flex-col items-center justify-center text-center space-y-2.5">
                <Loader2 size={24} className="text-[#FF2E55] animate-spin" />
                <div>
                  <p className="text-xs font-bold text-white">{stepText}</p>
                  <p className="text-[10px] text-slate-400">Powered by OpenRouter Uncensored Roleplay Engine</p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FF2E55] via-red-600 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-black text-sm tracking-wide shadow-glow-crimson hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                <span>Create & Start Story Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
