export type HistoricalPresetId = 'tang-gold' | 'dunhuang' | 'song-teal' | 'glazed-palace';
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
  renderingMode: 'both' | 'gold-only' | 'gradient-only';
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
