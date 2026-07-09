export type HistoricalPresetId = 'tang-gold' | 'dunhuang' | 'song-teal' | 'glazed-palace' | 'ming-blue' | 'qing-rose' | 'tibetan-tangka' | 'japan-rinpa' | 'hua-shang-lotus';
export type FlowerType = 'classic' | 'rounded' | 'lotus' | 'ruyi';

export interface FlowerPreset {
  id: HistoricalPresetId;
  name: string;
  era: string;
  description: string;
  colors: {
    bg: string;
    center: string;
    inner: string;
    outer: string;
    backgroundAura: string;
    goldLine: string;
  };
  gradientColors: string[]; // Gradient colors for flowing light
  soundScale: string[]; // Musical notes for interaction in this preset
}

export interface FlowerConfig {
  presetId: HistoricalPresetId;
  flowerType: FlowerType; // 'classic' | 'rounded' | 'lotus' | 'ruyi'
  petalCount: number; // 6, 8, 10, 12, 16
  rotationSpeed: number; // 0 (stop) to 10 (fast)
  pulseSpeed: number; // 0 to 10
  flowSpeed: number; // 0 to 10
  glowIntensity: number; // 0 to 10
  outlineWidth: number; // 1 to 5
  particleDensity: number; // 0 to 10
  chimeEnabled: boolean;
  chimeVolume: number; // 0 to 100 (percentage)
  renderingMode: 'both' | 'gold-only' | 'gradient-only';
  showDecorRing: boolean; // Toggles the decorative circular frame rings like the reference image
  customColors: {
    outer: string;
    inner: string;
    center: string;
  };
  isDrawing: boolean; // Triggers the dash-offset drawing animation
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

// 笺卡模板类型
export type ScrollCardTemplateId = 'classic-scroll' | 'fan-shaped' | 'square-seal' | 'round-mirror' | 'bamboo-slip' | 'lotus-leaf';

export interface ScrollCardTemplate {
  id: ScrollCardTemplateId;
  name: string;
  description: string;
  icon: string; // emoji
  bgColor: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  paperStyle: 'parchment' | 'rice-paper' | 'silk' | 'bamboo' | 'gold-foil';
}

export interface ScrollCardData {
  poem: string;
  translation: string;
  artist: string;
  secondaryPoem?: string;
}
