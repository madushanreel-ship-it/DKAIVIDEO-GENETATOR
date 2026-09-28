import React, { useState } from 'react';
import { Play, Download, Sparkles, Clock, Check, Copy } from 'lucide-react';
import { GeneratedVideo } from '../types';
import { downloadFile } from '../utils/videoEngine';

interface RecentCreationsProps {
  videos: GeneratedVideo[];
  activeVideoId: string;
  onSelectVideo: (video: GeneratedVideo) => void;
  onReusePrompt: (prompt: string, cameraMotion: any) => void;
}

export const RecentCreations: React.FC<RecentCreationsProps> = ({
  videos,
  activeVideoId,
  onSelectVideo,
  onReusePrompt,
}) => {
  const [filter, setFilter] = useState<'all' | 'showcase' | 'user'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredVideos = videos.filter((v) => {
    if (filter === 'showcase') return v.id.startsWith('kling-showcase');
    if (filter === 'user') return !v.id.startsWith('kling-showcase');
    return true;
  });

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (video: GeneratedVideo, e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.videoUrl) {
      downloadFile(video.videoUrl, `kling_${video.id}.mp4`);
    } else {
      // Fallback thumbnail frame download
      downloadFile(video.thumbnailUrl, `kling_${video.id}_frame.jpg`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">
            Creations & Showcase
          </h2>
          <p className="text-xs text-slate-400">
            Select any generated sequence to preview, scrub, or download
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({videos.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('showcase')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'showcase'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Showcase
          </button>
          <button
            type="button"
            onClick={() => setFilter('user')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'user'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Clips
          </button>
        </div>
      </div>

      {/* Grid of video cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredVideos.map((video) => {
          const isActive = video.id === activeVideoId;

          return (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video)}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-slate-900/60 transition-all cursor-pointer hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 ${
                isActive
                  ? 'border-cyan-500 ring-1 ring-cyan-500/50 bg-slate-900/90'
                  : 'border-slate-800'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Duration and Resolution badging */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                  <span className="text-cyan-400 font-semibold">{video.resolution.toUpperCase()}</span>
                  <span>·</span>
                  <span>{video.aspectRatio}</span>
                </div>

                <div className="absolute top-2 right-2 text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-cyan-400" />
                  <span>{video.duration}s</span>
                </div>

                {/* Play Icon in Center */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/90 text-white shadow-lg">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400" />
                )}
              </div>

              {/* Content Description */}
              <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {video.prompt}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono">{video.createdAt}</span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleCopy(video.id, video.prompt, e)}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="Copy prompt"
                    >
                      {copiedId === video.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReusePrompt(video.prompt, video.cameraMotion);
                      }}
                      className="p-1 text-slate-400 hover:text-cyan-400 rounded hover:bg-slate-800 transition-colors"
                      title="Reuse settings"
                    >
                      <Sparkles className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDownload(video, e)}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="Download MP4"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
