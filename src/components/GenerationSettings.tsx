import React from 'react';
import { ModelVersion, Resolution, AspectRatio, VideoDuration } from '../types';
import { Monitor, Smartphone, Square, Tv, Clock, Cpu, Sliders, ShieldCheck } from 'lucide-react';

interface GenerationSettingsProps {
  model: ModelVersion;
  setModel: (m: ModelVersion) => void;
  resolution: Resolution;
  setResolution: (r: Resolution) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (a: AspectRatio) => void;
  duration: VideoDuration;
  setDuration: (d: VideoDuration) => void;
  motionIntensity: number;
  setMotionIntensity: (val: number) => void;
  cfgScale: number;
  setCfgScale: (val: number) => void;
}

export const GenerationSettings: React.FC<GenerationSettingsProps> = ({
  model,
  setModel,
  resolution,
  setResolution,
  aspectRatio,
  setAspectRatio,
  duration,
  setDuration,
  motionIntensity,
  setMotionIntensity,
  cfgScale,
  setCfgScale,
}) => {
  const aspectOptions: Array<{ id: AspectRatio; label: string; desc: string; icon: React.ReactNode }> = [
    {
      id: '16:9',
      label: '16:9',
      desc: 'Cinematic',
      icon: <Tv className="w-3.5 h-3.5" />,
    },
    {
      id: '9:16',
      label: '9:16',
      desc: 'Vertical Reel',
      icon: <Smartphone className="w-3.5 h-3.5" />,
    },
    {
      id: '1:1',
      label: '1:1',
      desc: 'Square',
      icon: <Square className="w-3.5 h-3.5" />,
    },
    {
      id: '21:9',
      label: '21:9',
      desc: 'Ultrawide',
      icon: <Monitor className="w-3.5 h-3.5" />,
    },
  ];

  const resolutionOptions: Array<{ id: Resolution; label: string; badge: string }> = [
    { id: '720p', label: '720p HD', badge: 'Fastest' },
    { id: '1080p', label: '1080p FHD', badge: 'Standard' },
    { id: '4k', label: '4K Ultra', badge: 'Upscale' },
  ];

  return (
    <div className="space-y-4">
      {/* Model Mode Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generation Model</span>
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">v2.0 Diffusion Pipeline</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setModel('kling-2.0-master')}
            className={`p-2 rounded-lg text-left border transition-all ${
              model === 'kling-2.0-master'
                ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-200'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="text-xs font-semibold text-white">Kling 2.0 Master</div>
            <div className="text-[10px] text-slate-400">High temporal coherence</div>
          </button>
          <button
            type="button"
            onClick={() => setModel('kling-1.5-pro')}
            className={`p-2 rounded-lg text-left border transition-all ${
              model === 'kling-1.5-pro'
                ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-200'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="text-xs font-semibold text-white">Kling 1.5 Pro</div>
            <div className="text-[10px] text-slate-400">Balanced dynamic motion</div>
          </button>
          <button
            type="button"
            onClick={() => setModel('kling-standard')}
            className={`p-2 rounded-lg text-left border transition-all ${
              model === 'kling-standard'
                ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-200'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="text-xs font-semibold text-white">Standard Mode</div>
            <div className="text-[10px] text-slate-400">Rapid draft generation</div>
          </button>
        </div>
      </div>

      {/* Aspect Ratio & Resolution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Aspect Ratio Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Aspect Ratio
          </label>
          <div className="grid grid-cols-4 gap-1">
            {aspectOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAspectRatio(opt.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                  aspectRatio === opt.id
                    ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                {opt.icon}
                <span className="text-xs font-mono font-medium mt-1">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Resolution Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Resolution
          </label>
          <div className="grid grid-cols-3 gap-1">
            {resolutionOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setResolution(opt.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                  resolution === opt.id
                    ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <span className="text-xs font-semibold text-white">{opt.label}</span>
                <span className="text-[10px] text-slate-400">{opt.badge}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Duration Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Clip Duration</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {duration === 5 ? '10 Credits' : '20 Credits'}
          </span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDuration(5)}
            className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
              duration === 5
                ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="text-left">
              <div className="text-xs font-semibold text-white">5 Seconds</div>
              <div className="text-[10px] text-slate-400">150 Frames · 30 FPS</div>
            </div>
            <span className="font-mono text-xs font-semibold text-cyan-400">10 Cr</span>
          </button>
          <button
            type="button"
            onClick={() => setDuration(10)}
            className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
              duration === 10
                ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="text-left">
              <div className="text-xs font-semibold text-white">10 Seconds (Extended)</div>
              <div className="text-[10px] text-slate-400">300 Frames · 30 FPS</div>
            </div>
            <span className="font-mono text-xs font-semibold text-cyan-400">20 Cr</span>
          </button>
        </div>
      </div>

      {/* Motion Intensity & CFG Scale */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Motion Dynamic</span>
            <span className="font-mono text-cyan-400 font-semibold tabular-nums">{motionIntensity}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={motionIntensity}
            onChange={(e) => setMotionIntensity(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Subtle</span>
            <span>Dynamic</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Prompt Adherence (CFG)</span>
            <span className="font-mono text-cyan-400 font-semibold tabular-nums">{cfgScale.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={cfgScale}
            onChange={(e) => setCfgScale(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Creative</span>
            <span>Strict</span>
          </div>
        </div>
      </div>
    </div>
  );
};
