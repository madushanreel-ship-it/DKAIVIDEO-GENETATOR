import { CameraMotion, GeneratedVideo } from '../types';

export interface PromptTemplate {
  id: string;
  category: string;
  title: string;
  prompt: string;
  negativePrompt: string;
  recommendedDuration: 5 | 10;
  recommendedAspect: '16:9' | '9:16' | '1:1' | '21:9';
  cameraMotion: CameraMotion;
  motionIntensity: number;
  previewImage: string;
}

export const INITIAL_SHOWCASE_VIDEOS: GeneratedVideo[] = [
  {
    id: 'kling-showcase-01',
    title: 'Neon Cyberpunk Metropolis',
    prompt: 'Cinematic wide-angle tracking shot of a futuristic neon-lit cyberpunk metropolis street at night in rain, reflective puddles, glowing holographic billboards, volumetric mist, high detail 8k cinematic film still.',
    negativePrompt: 'blurry, low resolution, jitter, flickering, deformed pedestrians, text artifacts',
    createdAt: 'Just now',
    model: 'kling-2.0-master',
    resolution: '1080p',
    aspectRatio: '16:9',
    duration: 5,
    cameraMotion: { pan: 4, tilt: -1, zoom: 3, roll: 0 },
    videoUrl: '', // Will be rendered or animated via canvas
    thumbnailUrl: '/src/assets/images/kling_cyberpunk_neon_1790581500016.jpg',
    fileSizeMB: 18.4,
    motionIntensity: 7,
  },
  {
    id: 'kling-showcase-02',
    title: 'Icelandic Volcanic FPV Flight',
    prompt: 'Cinematic aerial FPV drone sweep over misty dramatic Icelandic moss cliffs and volcanic black sand coastline with roaring ocean waves, morning golden hour light, photorealistic 8k video frame.',
    negativePrompt: 'overexposed, washed out, low frame rate, glitch, drone propeller artifacts',
    createdAt: '5 mins ago',
    model: 'kling-2.0-master',
    resolution: '4k',
    aspectRatio: '16:9',
    duration: 10,
    cameraMotion: { pan: -2, tilt: 5, zoom: 6, roll: 2 },
    videoUrl: '',
    thumbnailUrl: '/src/assets/images/kling_drone_nature_1790581517830.jpg',
    fileSizeMB: 36.2,
    motionIntensity: 8,
  },
  {
    id: 'kling-showcase-03',
    title: 'Interstellar Nebula Voyage',
    prompt: 'Cinematic deep space travel through an intricate glowing cosmic nebula with shimmering stellar dust, distant spiral galaxy, hyper-realistic IMAX 70mm sci-fi cinematography.',
    negativePrompt: 'noise, pixelation, flat background, cartoonish, low dynamic range',
    createdAt: '18 mins ago',
    model: 'kling-1.5-pro',
    resolution: '1080p',
    aspectRatio: '21:9',
    duration: 5,
    cameraMotion: { pan: 0, tilt: 0, zoom: 8, roll: -1 },
    videoUrl: '',
    thumbnailUrl: '/src/assets/images/kling_deepspace_nebula_1790581529878.jpg',
    fileSizeMB: 16.8,
    motionIntensity: 6,
  },
  {
    id: 'kling-showcase-04',
    title: 'Zero-G Iridescent Splash',
    prompt: 'High-speed macro cinematography of iridescent golden fluid droplets splashing and colliding in zero gravity, studio lighting, hyper-detailed reflections, 1000fps slow motion film still.',
    negativePrompt: 'motion blur, static drops, chromatic aberration, low sharpness',
    createdAt: '1 hour ago',
    model: 'kling-2.0-master',
    resolution: '1080p',
    aspectRatio: '1:1',
    duration: 5,
    cameraMotion: { pan: 1, tilt: -2, zoom: 4, roll: 3 },
    videoUrl: '',
    thumbnailUrl: '/src/assets/images/kling_macro_liquid_1790581545947.jpg',
    fileSizeMB: 19.5,
    motionIntensity: 9,
  },
];

export const CAMERA_PRESETS: Array<{ label: string; description: string; motion: CameraMotion }> = [
  {
    label: 'Forward Dolly',
    description: 'Cinematic forward push into the scene',
    motion: { pan: 0, tilt: 0, zoom: 5, roll: 0 },
  },
  {
    label: 'FPV Drone Sweep',
    description: 'High-energy forward motion with slight roll',
    motion: { pan: 2, tilt: 3, zoom: 7, roll: 2 },
  },
  {
    label: 'Orbit Right',
    description: 'Dynamic horizontal panning rotation',
    motion: { pan: 6, tilt: 0, zoom: 1, roll: 0 },
  },
  {
    label: 'Vertigo Zoom',
    description: 'Dolly zoom in with counter-tilt',
    motion: { pan: 0, tilt: -4, zoom: 8, roll: 0 },
  },
  {
    label: 'Dutch Roll',
    description: 'Stylistic angled cinematic tilt',
    motion: { pan: 1, tilt: 1, zoom: 2, roll: 6 },
  },
  {
    label: 'Static Locked',
    description: 'Tripod locked-off shot for subtle subject motion',
    motion: { pan: 0, tilt: 0, zoom: 0, roll: 0 },
  },
];

export const PROMPT_ENHANCE_MODIFIERS = [
  'cinematic 8k master',
  'shot on ARRI Alexa Mini LF',
  'anamorphic lens bokeh',
  'volumetric atmospheric lighting',
  'photorealistic motion dynamics',
  '24fps cinematic shutter angle',
  'subtle film grain texture',
  'hyper-detailed subsurface scattering',
];
