'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransitionProgressBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When path changes, flash a smooth 350ms top laser loading progress
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2.5px] pointer-events-none overflow-hidden">
      <div className="h-full w-full loading-progress-bar shadow-[0_0_12px_rgba(255,46,85,0.8)]" />
    </div>
  );
}
