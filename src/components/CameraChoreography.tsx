import React from 'react';
import { Camera, Compass, RefreshCw, ZoomIn, ArrowRight, Video } from 'lucide-react';
import { CameraMotion } from '../types';
import { CAMERA_PRESETS } from '../data/presets';

interface CameraChoreographyProps {
  motion: CameraMotion;
  onChange: (motion: CameraMotion) => void;
}

export const CameraChoreography: React.FC<CameraChoreographyProps> = ({ motion, onChange }) => {
  const updateAxis = (axis: keyof CameraMotion, value: number) => {
    onChange({
      ...motion,
      [axis]: value,
    });
  };

  const resetCamera = () => {
    onChange({ pan: 0, tilt: 0, zoom: 0, roll: 0 });
  };

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Camera Choreography
          </span>
        </div>
        <button
          type="button"
          onClick={resetCamera}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Preset Camera Moves */}
      <div className="grid grid-cols-3 gap-1.5 mb-4">
        {CAMERA_PRESETS.map((preset) => {
          const isSelected =
            motion.pan === preset.motion.pan &&
            motion.tilt === preset.motion.tilt &&
            motion.zoom === preset.motion.zoom &&
            motion.roll === preset.motion.roll;

          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.motion)}
              className={`px-2.5 py-1.5 rounded-lg text-left text-xs transition-all border ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-sm'
                  : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="font-medium truncate">{preset.label}</div>
            </button>
          );
        })}
      </div>

      {/* Sliders for 4 Camera Degrees of Freedom */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Horizontal Pan */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Pan (Horizontal)</span>
            <span className="font-mono text-cyan-400 tabular-nums">
              {motion.pan > 0 ? `+${motion.pan}` : motion.pan}
            </span>
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={motion.pan}
            onChange={(e) => updateAxis('pan', Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Left</span>
            <span>Right</span>
          </div>
        </div>

        {/* Vertical Tilt */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Tilt (Vertical)</span>
            <span className="font-mono text-cyan-400 tabular-nums">
              {motion.tilt > 0 ? `+${motion.tilt}` : motion.tilt}
            </span>
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={motion.tilt}
            onChange={(e) => updateAxis('tilt', Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Down</span>
            <span>Up</span>
          </div>
        </div>

        {/* Zoom In/Out */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Zoom (Dolly)</span>
            <span className="font-mono text-cyan-400 tabular-nums">
              {motion.zoom > 0 ? `+${motion.zoom}` : motion.zoom}
            </span>
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={motion.zoom}
            onChange={(e) => updateAxis('zoom', Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Out</span>
            <span>In</span>
          </div>
        </div>

        {/* Roll (Dutch Angle) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Roll (Dutch)</span>
            <span className="font-mono text-cyan-400 tabular-nums">
              {motion.roll > 0 ? `+${motion.roll}` : motion.roll}°
            </span>
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={motion.roll}
            onChange={(e) => updateAxis('roll', Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>-10°</span>
            <span>+10°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
