import React from 'react';
import { Sparkles, Coins, Video, Layers, HelpCircle, History } from 'lucide-react';

interface TopNavProps {
  credits: number;
  activeTab: 'studio' | 'showcase' | 'history';
  setActiveTab: (tab: 'studio' | 'showcase' | 'history') => void;
  onNewGeneration: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  credits,
  activeTab,
  setActiveTab,
  onNewGeneration,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090b10]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white font-black text-sm tracking-wider">
            K
          </div>
          <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
            Kling AI <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-1.5 py-0.5 rounded">v2.0 Master</span>
          </span>
        </div>

        {/* Zone 2: Clean nav links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'studio'
                ? 'bg-slate-800 text-white'
                : 'hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span>Studio Rig</span>
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'showcase'
                ? 'bg-slate-800 text-white'
                : 'hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Showcase Gallery</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-slate-800 text-white'
                : 'hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Generations Log</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Credits */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-xs text-slate-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-semibold tabular-nums text-amber-300">{credits}</span>
            <span className="text-slate-500 text-[11px]">Credits</span>
          </div>

          <button
            onClick={onNewGeneration}
            className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Video</span>
          </button>
        </div>
      </div>
    </header>
  );
};
