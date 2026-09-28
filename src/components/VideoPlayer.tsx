import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Download,
  Music,
  Share2,
  Sparkles,
  FastForward,
  Copy,
  Check,
  Film,
} from 'lucide-react';
import { GeneratedVideo } from '../types';
import { downloadFile, generateCinematicAudio } from '../utils/videoEngine';

interface VideoPlayerProps {
  video: GeneratedVideo;
  onExtend: (video: GeneratedVideo) => void;
  onReusePrompt: (prompt: string, cameraMotion: any) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  onExtend,
  onReusePrompt,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(video.duration || 5);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloadingMP4, setIsDownloadingMP4] = useState(false);
  const [isDownloadingMP3, setIsDownloadingMP3] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Sync duration with video prop
  useEffect(() => {
    setDuration(video.duration || 5);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [video.id, video.duration, video.videoUrl]);

  // Handle native video playback
  useEffect(() => {
    if (!video.videoUrl || !videoRef.current) return;
    const v = videoRef.current;
    if (isPlaying) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isPlaying, video.videoUrl]);

  // Handle canvas animation fallback if videoUrl is not standard webm/mp4 blob
  useEffect(() => {
    if (video.videoUrl) return; // Native video handles rendering

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = video.thumbnailUrl;

    const width = 1280;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    const particles: Array<{ x: number; y: number; size: number; speed: number; alpha: number }> = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.8,
        speed: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    let running = true;
    let localTime = currentTime;
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      if (!running) return;

      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isPlaying) {
        localTime += delta * playbackRate;
        if (localTime >= duration) {
          localTime = 0;
        }
        setCurrentTime(localTime);
      }

      const progress = localTime / duration;
      const motionIntensity = video.motionIntensity || 7;
      const intensity = motionIntensity / 5;

      const panOffset = (video.cameraMotion.pan / 10) * width * 0.12 * (progress - 0.5) * intensity;
      const tiltOffset = (video.cameraMotion.tilt / 10) * height * 0.12 * (progress - 0.5) * intensity;
      const zoomFactor = 1 + (video.cameraMotion.zoom / 10) * 0.2 * progress * intensity + 0.03 * progress;
      const rollAngle = (video.cameraMotion.roll / 10) * 0.06 * (progress - 0.5) * intensity;

      // Draw background
      ctx.fillStyle = '#090b10';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(rollAngle);
      ctx.scale(zoomFactor, zoomFactor);
      ctx.translate(-width / 2 + panOffset, -height / 2 + tiltOffset);

      if (img.complete && img.naturalWidth > 0) {
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = width / height;
        let dw = width;
        let dh = height;
        let dx = 0;
        let dy = 0;

        if (imgAspect > canvasAspect) {
          dw = height * imgAspect;
          dx = (width - dw) / 2;
        } else {
          dh = width / imgAspect;
          dy = (height - dh) / 2;
        }

        ctx.drawImage(img, dx - width * 0.1, dy - height * 0.1, dw + width * 0.2, dh + height * 0.2);
      }

      // Anamorphic flare
      ctx.globalCompositeOperation = 'screen';
      const flareGrad = ctx.createLinearGradient(0, height * 0.2, width, height * 0.8);
      flareGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      flareGrad.addColorStop(0.5 + 0.15 * Math.sin(progress * Math.PI * 2), 'rgba(56, 189, 248, 0.14)');
      flareGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, 0, width, height);

      // Dynamic Particles
      for (const p of particles) {
        p.y -= p.speed * 0.7;
        if (p.y < 0) p.y = height;
        p.x += Math.sin(progress * 5 + p.y * 0.02) * 0.6;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * (0.6 + 0.4 * Math.sin(progress * 5 + p.x))})`;
        ctx.fill();
      }

      ctx.restore();

      // Vignette
      ctx.globalCompositeOperation = 'multiply';
      const vig = ctx.createRadialGradient(width / 2, height / 2, width * 0.35, width / 2, height / 2, width * 0.7);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [video.id, video.videoUrl, isPlaying, playbackRate, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const handleDownloadMP4 = async () => {
    setIsDownloadingMP4(true);
    try {
      if (video.videoUrl) {
        downloadFile(video.videoUrl, `kling_${video.id}_${video.resolution}.mp4`);
      } else {
        // Create downloadable canvas recording or image bundle
        const canvas = canvasRef.current;
        if (canvas) {
          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.95)
          );
          if (blob) {
            downloadFile(blob, `kling_${video.id}_frame.jpg`);
          }
        }
      }
    } finally {
      setIsDownloadingMP4(false);
    }
  };

  const handleDownloadMP3 = async () => {
    setIsDownloadingMP3(true);
    try {
      if (video.audioUrl) {
        downloadFile(video.audioUrl, `kling_${video.id}_soundtrack.mp3`);
      } else {
        const audioBlob = await generateCinematicAudio(video.duration, 'scifi');
        downloadFile(audioBlob, `kling_${video.id}_soundtrack.wav`);
      }
    } finally {
      setIsDownloadingMP3(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(video.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis
      .toString()
      .padStart(2, '0')}`;
  };

  const getAspectClass = () => {
    switch (video.aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-h-[580px] mx-auto';
      case '1:1':
        return 'aspect-square max-h-[520px] mx-auto';
      case '21:9':
        return 'aspect-[21/9] w-full';
      case '16:9':
      default:
        return 'aspect-video w-full';
    }
  };

  return (
    <div className="space-y-4">
      {/* Media Player Box */}
      <div
        ref={containerRef}
        className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#07090e] shadow-2xl transition-all"
      >
        {/* Aspect Frame */}
        <div className={`relative flex items-center justify-center bg-black ${getAspectClass()}`}>
          {video.videoUrl ? (
            <video
              ref={videoRef}
              src={video.videoUrl}
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={() => {
                if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) setDuration(videoRef.current.duration);
              }}
              className="h-full w-full object-contain"
            />
          ) : (
            <canvas
              ref={canvasRef}
              className="h-full w-full object-contain cursor-pointer"
              onClick={togglePlay}
            />
          )}

          {/* Top overlay metadata kicker */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] text-white font-mono">
              <span className="text-cyan-400 font-semibold">{video.resolution.toUpperCase()}</span>
              <span>·</span>
              <span>{video.model.replace('kling-', '').toUpperCase()}</span>
              <span>·</span>
              <span>{video.aspectRatio}</span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md hover:bg-black/90 px-3 py-1 rounded-full border border-white/10 text-[11px] text-white transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Prompt'}</span>
              </button>
            </div>
          </div>

          {/* Center Play Button Overlay on Hover/Pause */}
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/90 text-white shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-7 h-7 fill-white ml-1" />
            </button>
          )}

          {/* Bottom Player Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-8 transition-opacity duration-200">
            {/* Timeline Scrubber */}
            <div className="space-y-1 mb-2">
              <div className="relative group/track flex items-center">
                <input
                  type="range"
                  min="0"
                  max={duration || 5}
                  step="0.05"
                  value={currentTime}
                  onChange={handleTimeSeek}
                  className="w-full h-1.5 bg-white/20 hover:h-2 rounded-lg cursor-pointer appearance-none accent-cyan-400 transition-all"
                />
              </div>
            </div>

            {/* Bottom Button Row */}
            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1 hover:text-cyan-400 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTime(0);
                    if (videoRef.current) videoRef.current.currentTime = 0;
                  }}
                  className="p-1 hover:text-cyan-400 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Timecode */}
                <div className="font-mono text-[11px] tabular-nums text-slate-300">
                  <span className="text-white font-semibold">{formatTime(currentTime)}</span>
                  <span className="text-slate-500"> / </span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Speed toggle */}
                <button
                  type="button"
                  onClick={cycleSpeed}
                  className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {playbackRate}x
                </button>

                {/* Mute toggle */}
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 hover:text-cyan-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Fullscreen */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1 hover:text-cyan-400 transition-colors"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar Beneath Player: Download MP4, Download MP3, Extend, Reuse */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Download MP4 button */}
          <button
            type="button"
            onClick={handleDownloadMP4}
            disabled={isDownloadingMP4}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download MP4</span>
            <span className="font-mono text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-cyan-200">
              {video.fileSizeMB} MB
            </span>
          </button>

          {/* Download MP3 Audio Track button */}
          <button
            type="button"
            onClick={handleDownloadMP3}
            disabled={isDownloadingMP3}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 transition-all active:scale-95"
          >
            <Music className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download MP3</span>
            <span className="text-[10px] text-slate-400">Audio Track</span>
          </button>

          {/* Extend Video (+5s) */}
          <button
            type="button"
            onClick={() => onExtend(video)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition-colors"
          >
            <FastForward className="w-3.5 h-3.5 text-amber-400" />
            <span>Extend (+5s)</span>
          </button>
        </div>

        {/* Right side prompt reuse */}
        <button
          type="button"
          onClick={() => onReusePrompt(video.prompt, video.cameraMotion)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 border border-cyan-800/40 hover:bg-cyan-900/40 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Reuse Settings</span>
        </button>
      </div>

      {/* Video Details Card */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span className="font-semibold text-slate-200">{video.title}</span>
          <span className="font-mono text-slate-500">{video.createdAt}</span>
        </div>
        <p className="text-slate-300 leading-relaxed font-sans">{video.prompt}</p>

        {video.negativePrompt && (
          <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
            <span className="text-slate-400 font-medium">Negative: </span>
            <span>{video.negativePrompt}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 font-mono">
          <span>Camera Pan: {video.cameraMotion.pan > 0 ? `+${video.cameraMotion.pan}` : video.cameraMotion.pan}</span>
          <span>·</span>
          <span>Tilt: {video.cameraMotion.tilt > 0 ? `+${video.cameraMotion.tilt}` : video.cameraMotion.tilt}</span>
          <span>·</span>
          <span>Zoom: {video.cameraMotion.zoom > 0 ? `+${video.cameraMotion.zoom}` : video.cameraMotion.zoom}</span>
          <span>·</span>
          <span>Motion: {video.motionIntensity}/10</span>
        </div>
      </div>
    </div>
  );
};
