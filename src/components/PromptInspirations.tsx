import React from 'react';
import { Sparkles, Compass, Eye, Film, Layers } from 'lucide-react';
import { CameraMotion } from '../types';

interface TemplateCard {
  title: string;
  category: string;
  image: string;
  prompt: string;
  camera: CameraMotion;
  aspectRatio: '16:9' | '9:16' | '1:1' | '21:9';
}

interface PromptInspirationsProps {
  onApply: (prompt: string, camera: CameraMotion, aspect: '16:9' | '9:16' | '1:1' | '21:9') => void;
}

export const PromptInspirations: React.FC<PromptInspirationsProps> = ({ onApply }) => {
  const templates: TemplateCard[] = [
    {
      title: 'Blade Runner Alleyway',
      category: 'Cyberpunk & Sci-Fi',
      image: '/src/assets/images/kling_cyberpunk_neon_1790581500016.jpg',
      prompt: 'Cinematic wide-angle tracking shot of a futuristic neon-lit cyberpunk metropolis street at night in rain, reflective puddles, glowing holographic billboards, volumetric mist, high detail 8k cinematic film still.',
      camera: { pan: 4, tilt: -1, zoom: 3, roll: 0 },
      aspectRatio: '16:9',
    },
    {
      title: 'Volcanic Fjord Flight',
      category: 'Aerial & Nature',
      image: '/src/assets/images/kling_drone_nature_1790581517830.jpg',
      prompt: 'Cinematic aerial FPV drone sweep over misty dramatic Icelandic moss cliffs and volcanic black sand coastline with roaring ocean waves, morning golden hour light, photorealistic 8k video frame.',
      camera: { pan: -2, tilt: 5, zoom: 6, roll: 2 },
      aspectRatio: '16:9',
    },
    {
      title: 'Cosmic Nebula Passage',
      category: 'Space & Astronomy',
      image: '/src/assets/images/kling_deepspace_nebula_1790581529878.jpg',
      prompt: 'Cinematic deep space travel through an intricate glowing cosmic nebula with shimmering stellar dust, distant spiral galaxy, hyper-realistic IMAX 70mm sci-fi cinematography.',
      camera: { pan: 0, tilt: 0, zoom: 8, roll: -1 },
      aspectRatio: '21:9',
    },
    {
      title: 'Zero-G Liquid Gold',
      category: 'High-Speed Macro',
      image: '/src/assets/images/kling_macro_liquid_1790581545947.jpg',
      prompt: 'High-speed macro cinematography of iridescent golden fluid droplets splashing and colliding in zero gravity, studio lighting, hyper-detailed reflections, 1000fps slow motion film still.',
      camera: { pan: 1, tilt: -2, zoom: 4, roll: 3 },
      aspectRatio: '1:1',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Cinematography Styles
          </h3>
        </div>
        <span className="text-[11px] text-slate-500">Click to load preset</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {templates.map((tpl) => (
          <div
            key={tpl.title}
            onClick={() => onApply(tpl.prompt, tpl.camera, tpl.aspectRatio)}
            className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-1.5 cursor-pointer hover:border-cyan-500/60 hover:shadow-lg transition-all"
          >
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black mb-2">
              <img
                src={tpl.image}
                alt={tpl.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-1.5 left-2 text-[10px] text-cyan-300 font-mono">
                {tpl.aspectRatio}
              </div>
            </div>
            <div className="px-1 pb-1">
              <div className="text-xs font-semibold text-white group-hover:text-cyan-300 truncate">
                {tpl.title}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{tpl.category}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
