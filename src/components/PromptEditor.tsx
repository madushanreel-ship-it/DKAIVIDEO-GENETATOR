import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Wand2, Copy, Check } from 'lucide-react';
import { PROMPT_ENHANCE_MODIFIERS } from '../data/presets';

interface PromptEditorProps {
  prompt: string;
  setPrompt: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  onSelectTemplate: (templateId: string) => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  onSelectTemplate,
}) => {
  const [showNegative, setShowNegative] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);

    setTimeout(() => {
      // Pick 2-3 cinematic modifiers that aren't already included
      const unincluded = PROMPT_ENHANCE_MODIFIERS.filter(
        (mod) => !prompt.toLowerCase().includes(mod.toLowerCase())
      );
      const selected = unincluded.slice(0, 3).join(', ');
      const enhanced = `${prompt.trim()}, ${selected}, photorealistic motion dynamics, ultra-high definition.`;
      setPrompt(enhanced);
      setIsEnhancing(false);
    }, 400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <span>Prompt Description</span>
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleEnhance}
            disabled={!prompt.trim() || isEnhancing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900/60 hover:text-cyan-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
            <span>{isEnhancing ? 'Enhancing...' : 'Enhance Prompt'}</span>
          </button>
          {prompt && (
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
              title="Copy prompt"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea Container */}
      <div className="relative rounded-xl border border-slate-800/90 bg-[#0d121c] p-3 focus-within:border-cyan-500/80 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all shadow-inner">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your scene in detail... (e.g. A hyper-realistic drone flight sweeping through a cyberpunk rainy alleyway with neon signs reflecting in puddles, cinematic 8k, slow motion)"
          rows={4}
          maxLength={800}
          className="w-full resize-none bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none leading-relaxed"
        />

        <div className="mt-2 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Quick styles:</span>
            <button
              type="button"
              onClick={() => onSelectTemplate('kling-showcase-01')}
              className="text-cyan-400 hover:underline"
            >
              Cyberpunk
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onSelectTemplate('kling-showcase-02')}
              className="text-cyan-400 hover:underline"
            >
              FPV Drone
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onSelectTemplate('kling-showcase-03')}
              className="text-cyan-400 hover:underline"
            >
              Nebula
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onSelectTemplate('kling-showcase-04')}
              className="text-cyan-400 hover:underline"
            >
              Macro Zero-G
            </button>
          </div>
          <span className="font-mono tabular-nums">{prompt.length}/800</span>
        </div>
      </div>

      {/* Negative Prompt Accordion */}
      <div className="rounded-lg border border-slate-800/60 bg-slate-900/30 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowNegative(!showNegative)}
          className="flex w-full items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span>Negative Prompt (Optional)</span>
          {showNegative ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showNegative && (
          <div className="border-t border-slate-800/60 p-3 pt-2">
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Elements you wish to exclude (e.g. low quality, stutter, artifacts, blurred facial details, jitter)"
              rows={2}
              className="w-full resize-none rounded-md bg-[#0b0e14] p-2 text-xs text-slate-200 placeholder-slate-600 border border-slate-800 focus:border-slate-700 focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
