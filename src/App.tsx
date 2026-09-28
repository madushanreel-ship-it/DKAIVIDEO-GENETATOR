/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Play,
  Film,
  Camera,
  Coins,
  History,
  Layers,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  ModelVersion,
  Resolution,
  AspectRatio,
  VideoDuration,
  CameraMotion,
  GeneratedVideo,
  GenerationProgress,
} from './types';
import { TopNav } from './components/TopNav';
import { PromptEditor } from './components/PromptEditor';
import { CameraChoreography } from './components/CameraChoreography';
import { GenerationSettings } from './components/GenerationSettings';
import { LoadingProgress } from './components/LoadingProgress';
import { VideoPlayer } from './components/VideoPlayer';
import { RecentCreations } from './components/RecentCreations';
import { PromptInspirations } from './components/PromptInspirations';
import { INITIAL_SHOWCASE_VIDEOS } from './data/presets';
import { renderKlingVideo } from './utils/videoEngine';

export default function App() {
  // Navigation & tabs
  const [activeTab, setActiveTab] = useState<'studio' | 'showcase' | 'history'>('studio');
  const [credits, setCredits] = useState<number>(850);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generation Parameters
  const [prompt, setPrompt] = useState<string>(
    'Cinematic wide-angle tracking shot of a futuristic neon-lit cyberpunk metropolis street at night in rain, reflective puddles, glowing holographic billboards, volumetric mist, high detail 8k cinematic film still.'
  );
  const [negativePrompt, setNegativePrompt] = useState<string>(
    'blurry, low resolution, jitter, flickering, deformed pedestrians, text artifacts'
  );
  const [model, setModel] = useState<ModelVersion>('kling-2.0-master');
  const [resolution, setResolution] = useState<Resolution>('1080p');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [duration, setDuration] = useState<VideoDuration>(5);
  const [motionIntensity, setMotionIntensity] = useState<number>(7);
  const [cfgScale, setCfgScale] = useState<number>(0.7);
  const [cameraMotion, setCameraMotion] = useState<CameraMotion>({
    pan: 4,
    tilt: -1,
    zoom: 3,
    roll: 0,
  });

  // Generation Progress State
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    isGenerating: false,
    progress: 0,
    stage: 'Idle',
    currentStep: 1,
    totalSteps: 4,
    estimatedSecondsRemaining: 0,
  });

  // Videos list & currently selected active video
  const [videos, setVideos] = useState<GeneratedVideo[]>(INITIAL_SHOWCASE_VIDEOS);
  const [activeVideo, setActiveVideo] = useState<GeneratedVideo>(INITIAL_SHOWCASE_VIDEOS[0]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Cost calculation
  const creditsCost = duration === 5 ? 10 : 20;

  // Handle Generate Video
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('Please enter a prompt to generate video');
      return;
    }

    if (credits < creditsCost) {
      showToast('Insufficient credits balance');
      return;
    }

    // Set generating state
    const estimatedTotalSeconds = duration === 5 ? 14 : 22;
    setGenerationProgress({
      isGenerating: true,
      progress: 4,
      stage: 'Initializing latent diffusion pipeline...',
      currentStep: 1,
      totalSteps: 4,
      estimatedSecondsRemaining: estimatedTotalSeconds,
    });

    // Countdown interval for remaining time
    let secondsLeft = estimatedTotalSeconds;
    const timerInterval = setInterval(() => {
      secondsLeft = Math.max(1, secondsLeft - 1);
      setGenerationProgress((prev) => ({
        ...prev,
        estimatedSecondsRemaining: secondsLeft,
      }));
    }, 1000);

    try {
      // Pick background reference image based on keywords in prompt
      let baseImage = '/src/assets/images/kling_cyberpunk_neon_1790581500016.jpg';
      const p = prompt.toLowerCase();
      if (p.includes('drone') || p.includes('cliff') || p.includes('ocean') || p.includes('nature') || p.includes('iceland')) {
        baseImage = '/src/assets/images/kling_drone_nature_1790581517830.jpg';
      } else if (p.includes('space') || p.includes('nebula') || p.includes('galaxy') || p.includes('star')) {
        baseImage = '/src/assets/images/kling_deepspace_nebula_1790581529878.jpg';
      } else if (p.includes('macro') || p.includes('liquid') || p.includes('splash') || p.includes('gold')) {
        baseImage = '/src/assets/images/kling_macro_liquid_1790581545947.jpg';
      }

      // Execute render engine
      const result = await renderKlingVideo({
        imageSrc: baseImage,
        duration,
        aspectRatio,
        cameraMotion,
        motionIntensity,
        prompt,
        onProgress: (percent, stage) => {
          setGenerationProgress((prev) => ({
            ...prev,
            progress: percent,
            stage,
          }));
        },
      });

      clearInterval(timerInterval);

      // Deduct credits
      setCredits((prev) => Math.max(0, prev - creditsCost));

      // Calculate approximate file size in MB
      const fileSizeMB = Number(((result.videoBlob.size || 15000000) / (1024 * 1024)).toFixed(1));

      const newVideo: GeneratedVideo = {
        id: `kling-gen-${Date.now()}`,
        title: prompt.slice(0, 36) + '...',
        prompt,
        negativePrompt,
        createdAt: 'Just now',
        model,
        resolution,
        aspectRatio,
        duration,
        cameraMotion,
        videoUrl: result.videoBlobUrl,
        audioUrl: result.audioBlobUrl,
        thumbnailUrl: baseImage,
        fileSizeMB,
        motionIntensity,
      };

      setVideos((prev) => [newVideo, ...prev]);
      setActiveVideo(newVideo);
      setGenerationProgress({
        isGenerating: false,
        progress: 100,
        stage: 'Complete',
        currentStep: 4,
        totalSteps: 4,
        estimatedSecondsRemaining: 0,
      });

      showToast('Video synthesized successfully! Ready to play and download.');
    } catch (err) {
      clearInterval(timerInterval);
      console.error('Generation error:', err);
      setGenerationProgress({
        isGenerating: false,
        progress: 0,
        stage: 'Error occurred during generation',
        currentStep: 1,
        totalSteps: 4,
        estimatedSecondsRemaining: 0,
      });
      showToast('Generation halted. Please try again.');
    }
  };

  const handleCancelGeneration = () => {
    setGenerationProgress({
      isGenerating: false,
      progress: 0,
      stage: 'Cancelled',
      currentStep: 1,
      totalSteps: 4,
      estimatedSecondsRemaining: 0,
    });
    showToast('Video generation cancelled');
  };

  const handleApplyPreset = (
    newPrompt: string,
    newCamera: CameraMotion,
    newAspect: AspectRatio
  ) => {
    setPrompt(newPrompt);
    setCameraMotion(newCamera);
    setAspectRatio(newAspect);
    showToast('Applied style preset and camera parameters');
  };

  const handleExtendVideo = (v: GeneratedVideo) => {
    setPrompt(v.prompt + ', seamless continuation camera glide');
    setCameraMotion(v.cameraMotion);
    setDuration(10);
    showToast('Extended mode ready (+5s). Click Generate to synthesize.');
  };

  const handleReuseSettings = (p: string, c: CameraMotion) => {
    setPrompt(p);
    setCameraMotion(c);
    showToast('Parameters loaded into workspace');
  };

  const handleSelectTemplate = (templateId: string) => {
    const found = videos.find((v) => v.id === templateId);
    if (found) {
      setPrompt(found.prompt);
      setCameraMotion(found.cameraMotion);
      setAspectRatio(found.aspectRatio);
      setActiveVideo(found);
      showToast(`Loaded ${found.title}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <TopNav
        credits={credits}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewGeneration={() => {
          setActiveTab('studio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-16 right-6 z-50 flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-slate-900/95 px-4 py-2.5 text-xs text-cyan-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-3">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab 1: Studio Rig */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* Top Workspace Grid: Left Column (Controls) vs Right Column (Player & Progress) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Input Form (5 cols on lg) */}
              <div className="lg:col-span-5 space-y-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-5 backdrop-blur-md shadow-xl">
                {/* Prompt Editor */}
                <PromptEditor
                  prompt={prompt}
                  setPrompt={setPrompt}
                  negativePrompt={negativePrompt}
                  setNegativePrompt={setNegativePrompt}
                  onSelectTemplate={handleSelectTemplate}
                />

                {/* Camera Choreography Controls */}
                <CameraChoreography
                  motion={cameraMotion}
                  onChange={setCameraMotion}
                />

                {/* Resolution, Aspect, Duration, Model, Motion */}
                <GenerationSettings
                  model={model}
                  setModel={setModel}
                  resolution={resolution}
                  setResolution={setResolution}
                  aspectRatio={aspectRatio}
                  setAspectRatio={setAspectRatio}
                  duration={duration}
                  setDuration={setDuration}
                  motionIntensity={motionIntensity}
                  setMotionIntensity={setMotionIntensity}
                  cfgScale={cfgScale}
                  setCfgScale={setCfgScale}
                />

                {/* Primary Generate Button Bar */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={generationProgress.isGenerating}
                    className="relative group w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 p-px font-semibold text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="relative flex items-center justify-between rounded-[11px] bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-5 py-3.5 transition-all group-hover:brightness-110">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-cyan-200 animate-pulse" />
                        <span className="text-sm font-bold tracking-wide">
                          {generationProgress.isGenerating ? 'Synthesizing Video...' : 'Generate Video'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-mono">
                        <Coins className="w-3.5 h-3.5 text-amber-300" />
                        <span className="text-amber-200 font-semibold">{creditsCost} Cr</span>
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                    <span>Includes 4K Upscale & Spatial Audio</span>
                    <span>Cost: {creditsCost} Credits ({duration}s clip)</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Video Player & Progress Bar (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Generation Progress Bar (shown when generating) */}
                {generationProgress.isGenerating && (
                  <LoadingProgress
                    progress={generationProgress}
                    onCancel={handleCancelGeneration}
                  />
                )}

                {/* Video Player */}
                <VideoPlayer
                  video={activeVideo}
                  onExtend={handleExtendVideo}
                  onReusePrompt={handleReuseSettings}
                />
              </div>
            </div>

            {/* Prompt Inspirations */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-5">
              <PromptInspirations onApply={handleApplyPreset} />
            </div>

            {/* Recent Generations & Showcase Grid */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-5">
              <RecentCreations
                videos={videos}
                activeVideoId={activeVideo.id}
                onSelectVideo={(v) => {
                  setActiveVideo(v);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onReusePrompt={handleReuseSettings}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Showcase Gallery */}
        {activeTab === 'showcase' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    <span>Kling AI Curated Showcase</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Explore high-dynamic-range scenes generated with Kling 2.0 camera choreographies and temporal diffusion.
                  </p>
                </div>
              </div>

              <RecentCreations
                videos={videos}
                activeVideoId={activeVideo.id}
                onSelectVideo={(v) => {
                  setActiveVideo(v);
                  setActiveTab('studio');
                }}
                onReusePrompt={(p, c) => {
                  handleReuseSettings(p, c);
                  setActiveTab('studio');
                }}
              />
            </div>
          </div>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-amber-400" />
                    <span>Generation History</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Review previously synthesized video sequences, camera parameters, and export logs.
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  Total clips: <span className="text-white font-bold">{videos.length}</span>
                </div>
              </div>

              <RecentCreations
                videos={videos}
                activeVideoId={activeVideo.id}
                onSelectVideo={(v) => {
                  setActiveVideo(v);
                  setActiveTab('studio');
                }}
                onReusePrompt={(p, c) => {
                  handleReuseSettings(p, c);
                  setActiveTab('studio');
                }}
              />
            </div>
          </div>
        )}
      </main>

      {/* Futuristic Studio Footer */}
      <footer className="border-t border-slate-800/70 bg-[#06080c] py-6 px-4 sm:px-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-500/20 text-cyan-400 font-bold text-xs">
              K
            </div>
            <span>Kling AI Video Studio</span>
            <span>·</span>
            <span>Spatial Latent Diffusion</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>1080p / 4K Ultra Upscaler</span>
            <span>·</span>
            <span>MediaRecorder MP4 Export</span>
            <span>·</span>
            <span>Spatial Audio Track MP3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
