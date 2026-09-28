export type ModelVersion = 'kling-2.0-master' | 'kling-1.5-pro' | 'kling-standard';
export type Resolution = '720p' | '1080p' | '4k';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '21:9';
export type VideoDuration = 5 | 10;

export interface CameraMotion {
  pan: number; // -10 (left) to 10 (right)
  tilt: number; // -10 (down) to 10 (up)
  zoom: number; // -10 (zoom out) to 10 (zoom in)
  roll: number; // -10 (counter-clockwise) to 10 (clockwise)
}

export interface GenerationParams {
  prompt: string;
  negativePrompt: string;
  model: ModelVersion;
  resolution: Resolution;
  aspectRatio: AspectRatio;
  duration: VideoDuration;
  cameraMotion: CameraMotion;
  motionIntensity: number; // 1 to 10
  cfgScale: number; // 0.1 to 1.0
  seed: number;
}

export interface GeneratedVideo {
  id: string;
  title: string;
  prompt: string;
  negativePrompt?: string;
  createdAt: string;
  model: ModelVersion;
  resolution: Resolution;
  aspectRatio: AspectRatio;
  duration: VideoDuration;
  cameraMotion: CameraMotion;
  videoUrl: string;
  thumbnailUrl: string;
  audioUrl?: string;
  fileSizeMB: number;
  motionIntensity: number;
}

export interface GenerationProgress {
  isGenerating: boolean;
  progress: number; // 0 to 100
  stage: string;
  currentStep: number;
  totalSteps: number;
  estimatedSecondsRemaining: number;
}
