import React from 'react';
import { Loader2, XCircle, Clock, Zap, Cpu, Sparkles } from 'lucide-react';
import { GenerationProgress } from '../types';

interface LoadingProgressProps {
  progress: GenerationProgress;
  onCancel: () => void;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ progress, onCancel }) => {
  if (!progress.isGenerating) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const stages = [
    { title: 'Prompt & Semantics', desc: 'Spatial vector mapping' },
    { title: 'Latent Diffusion', desc: 'Keyframe synthesis' },
    { title: 'Temporal Motion', desc: '24fps flow coherence' },
    { title: 'Neural Upscale', desc: 'Spatial audio mix' },
  ];

  const currentStageIndex =
    progress.progress < 25 ? 0 : progress.progress < 50 ? 1 : progress.progress < 75 ? 2 : 3;

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/40 bg-[#0b101b]/95 p-5 shadow-2xl backdrop-blur-xl transition-all">
      {/* Background glowing sweep */}
      <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Header with status & cancel button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Generating Video Sequence
            </h3>
            <p className="text-xs text-cyan-400/90 font-mono">{progress.stage}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md border border-slate-800 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>
      </div>

      {/* Main Progress Bar Container */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Estimated Remaining:</span>
            <span className="font-mono font-semibold text-cyan-300 tabular-nums">
              {formatSeconds(progress.estimatedSecondsRemaining)}
            </span>
          </div>
          <div className="font-mono text-sm font-bold text-cyan-400 tabular-nums">
            {progress.progress}%
          </div>
        </div>

        {/* Progress track */}
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-300 relative"
            style={{ width: `${Math.max(2, progress.progress)}%` }}
          >
            {/* Shimmer light bar effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[pulse_1.5s_infinite]" />
          </div>
        </div>
      </div>

      {/* Pipeline 4-Stage Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/60">
        {stages.map((stg, idx) => {
          const isDone = idx < currentStageIndex;
          const isActive = idx === currentStageIndex;

          return (
            <div
              key={stg.title}
              className={`p-2 rounded-lg border text-left transition-all ${
                isActive
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200 shadow-sm shadow-cyan-500/10'
                  : isDone
                  ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                  : 'bg-slate-900/20 border-slate-800/30 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-slate-500">
                  Step 0{idx + 1}
                </span>
                {isDone && <span className="text-[10px] text-emerald-400 font-mono font-bold">Done</span>}
                {isActive && (
                  <span className="text-[10px] text-cyan-400 font-mono animate-pulse">Running</span>
                )}
              </div>
              <div className="text-xs font-semibold truncate text-slate-200">{stg.title}</div>
              <div className="text-[10px] text-slate-500 truncate">{stg.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
