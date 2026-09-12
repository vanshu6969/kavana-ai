'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import {
  User,
  Settings,
  Shield,
  CreditCard,
  MessageSquare,
  Sparkles,
  HelpCircle,
  FileText,
  Star,
  ChevronRight,
  LogOut,
  X,
  Crown,
  CheckCircle2,
} from 'lucide-react';

export default function ProfilePage() {
  const { userName, userEmail } = useApp();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const menuItems = [
    { id: 'profile', icon: User, label: 'Edit Profile Persona', desc: 'Change display name and protagonist alias' },
    { id: 'messages', icon: MessageSquare, label: 'Story History & Memory', desc: 'Manage your active and archived roleplays' },
    { id: 'features', icon: Sparkles, label: 'AuraFlex VIP Features', desc: '100% Free · Unlimited interactive storytelling' },
    { id: 'support', icon: HelpCircle, label: 'Help & 24/7 AI Concierge', desc: 'Get assistance with storylines and prompts' },
    { id: 'terms', icon: FileText, label: 'Privacy & Terms', desc: 'Zero-logging policy and encryption details' },
    { id: 'rate', icon: Star, label: 'Rate Kavana.ai AuraFlex', desc: 'Leave feedback for the next story drop' },
  ];

  const handleMenuClick = (id: string) => {
    setActiveModal(id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-white/[0.08]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide font-sans">
            User Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage your interactive experience & AuraFlex preferences
          </p>
        </div>
      </div>

      {/* Responsive Desktop 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Member Status */}
        <div className="space-y-4">
          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-[#0D0E15] border border-white/[0.08] shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FF2E55]/10 blur-3xl pointer-events-none" />

            {/* User Avatar */}
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#FF2E55] via-rose-600 to-amber-500 shadow-glow-crimson">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
                  alt={userName}
                  className="w-full h-full object-cover rounded-full border-2 border-[#050608]"
                />
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#FF2E55] border-2 border-[#050608] shadow-glow-crimson"></span>
            </div>

            {/* User Name & Email */}
            <h3 className="text-xl font-black text-white tracking-wider font-sans">
              {userName}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{userEmail}</p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[#FF5C7A] text-xs font-bold">
              <Crown size={14} className="text-[#FF2E55]" />
              <span>AuraFlex VIP Unlimited</span>
            </div>

            {/* Unlimited Status Card */}
            <div className="mt-5 w-full flex flex-col items-start gap-2.5 p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-zinc-900 to-[#050608] border border-rose-500/30 text-left">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF2E55]" />
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  Unlimited VIP Pass Active
                </span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-[#FF2E55]" />
                  <span>Zero Coins / 100% Free Access</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-[#FF2E55]" />
                  <span>40+ Scenarios & Pakistani Dramas</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-[#FF2E55]" />
                  <span>4K UHD Streaming Visuals</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Account Management */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-[#0D0E15] border border-white/[0.08] p-5 sm:p-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 px-1">
              Account & Storyteller Settings
            </h3>

            <div className="flex flex-col divide-y divide-white/5 rounded-2xl bg-[#050608]/60 border border-white/[0.08] overflow-hidden">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-[#151722] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF2E55] group-hover:scale-105 transition-transform">
                        <Icon size={18} />
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-white transition-colors block">
                          {item.label}
                        </span>
                        <span className="text-xs text-slate-500">
                          {item.desc}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-slate-600 group-hover:text-[#FF2E55] group-hover:translate-x-1 transition-all"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center sm:text-left text-xs text-slate-500 px-2 flex flex-wrap justify-between gap-2">
            <span>Kavana AI · AuraFlex Movies Edition</span>
            <span>Neural Engine Status: 100% Operational (Unlimited Free)</span>
          </div>
        </div>
      </div>

      {/* Settings Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0D0E15] border border-white/[0.08] p-6 relative shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-white/10"
            >
              <X size={18} />
            </button>

            <h4 className="text-lg font-black text-white capitalize mb-2">
              {menuItems.find((m) => m.id === activeModal)?.label}
            </h4>

            {activeModal === 'profile' && (
              <div className="text-xs sm:text-sm text-slate-300 space-y-2.5 pt-2">
                <p><strong>Name:</strong> {userName}</p>
                <p><strong>Email:</strong> {userEmail}</p>
                <p><strong>Membership Tier:</strong> <span className="text-[#FF2E55] font-bold">AuraFlex Unlimited VIP</span></p>
                <p><strong>Status:</strong> Active & Free</p>
              </div>
            )}

            {activeModal === 'messages' && (
              <div className="text-xs sm:text-sm text-slate-300 space-y-2.5 pt-2">
                <p>All dialogues are encrypted with zero-knowledge keys.</p>
                <p>Memory retainment is active for your ongoing story decisions.</p>
                <Link href="/chats" onClick={() => setActiveModal(null)} className="text-[#FF2E55] font-bold underline block mt-2">
                  Go to Active Conversations &rarr;
                </Link>
              </div>
            )}

            {activeModal === 'features' && (
              <div className="text-xs sm:text-sm text-slate-300 space-y-2.5 pt-2">
                <p className="text-[#FF2E55] font-bold">Your Unlimited VIP Perks:</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>Zero coin deductions on any message</li>
                  <li>Full access to 40+ interactive scenarios</li>
                  <li>Multi-dialect responses in Punjabi, Hinglish, Urdu, English</li>
                  <li>Uncensored 18+ creative narrative freedom</li>
                </ul>
              </div>
            )}

            {activeModal === 'rate' && (
              <div className="text-xs sm:text-sm text-slate-300 space-y-3 pt-2 text-center">
                <p>Enjoying the AuraFlex theme and unlimited stories? Give us a 5-star rating!</p>
                <div className="flex justify-center text-amber-400 text-2xl gap-1">
                  ★★★★★
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E55] to-[#E00034] text-white font-bold shadow-glow-crimson"
                >
                  Submit 5-Star Rating
                </button>
              </div>
            )}

            {(activeModal === 'support' || activeModal === 'faq' || activeModal === 'terms') && (
              <div className="text-xs sm:text-sm text-slate-300 space-y-2.5 pt-2">
                <p>24/7 Concierge Support is active for all members.</p>
                <p className="text-slate-400">Email: support@kavana.ai</p>
                <p className="text-slate-400">Policy: All interactive scenarios are adult fiction generated for entertainment.</p>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
