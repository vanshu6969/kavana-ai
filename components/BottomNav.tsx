'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { Sparkles, Search, MessageSquare, User, Film } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const { sessions } = useApp();

  // Hide bottom nav inside active chat conversation screen to maximize screen estate
  if (pathname.startsWith('/chat/')) {
    return null;
  }

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: Film,
      isActive: pathname === '/',
    },
    {
      id: 'search',
      label: 'Search',
      href: '/search',
      icon: Search,
      isActive: pathname === '/search',
    },
    {
      id: 'chats',
      label: 'Chats',
      href: '/chats',
      icon: MessageSquare,
      isActive: pathname === '/chats',
      badge: sessions.length > 0 ? sessions.length : undefined,
    },
    {
      id: 'profile',
      label: 'Profile',
      href: '/profile',
      icon: User,
      isActive: pathname === '/profile',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050608]/95 backdrop-blur-xl border-t border-white/[0.08] pb-safe md:hidden">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 transition-all relative ${
                item.isActive
                  ? 'text-[#FF2E55] font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  size={21}
                  className={`transition-transform duration-200 ${
                    item.isActive
                      ? 'scale-110 stroke-[2.5] text-[#FF2E55] drop-shadow-[0_0_10px_rgba(255,46,85,0.6)]'
                      : 'stroke-[1.8]'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 bg-[#FF2E55] text-white text-[10px] font-bold rounded-full border border-[#050608]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-wide">
                {item.label}
              </span>
              {item.isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E55] mt-[-2px] shadow-glow-crimson"></span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
