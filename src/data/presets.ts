import { FlowerPreset } from '../types';

export const HISTORICAL_PRESETS: FlowerPreset[] = [
  {
    id: 'tang-gold',
    name: '唐风金翠',
    era: '大唐盛世 (Tang Dynasty)',
    description: '盛唐美学富丽堂皇。红绿重彩相衬，辅以泥金勾勒缠枝。金碧辉煌，雍容华贵，尽显万国来朝的自信与大国气象。',
    colors: {
      bg: '#140c0f',
      center: '#e63946',
      inner: '#2a9d8f',
      outer: '#f4a261',
      backgroundAura: '#2c1e21',
      goldLine: '#ffd700'
    },
    gradientColors: ['#e63946', '#2a9d8f', '#f4a261', '#e76f51', '#ffd700'],
    soundScale: ['C4', 'D4', 'E4', 'G4', 'A4'] // Gong scale (宫调式)
  },
  {
    id: 'dunhuang',
    name: '敦煌矿彩',
    era: '魏晋至隋唐 (Dunhuang Caves)',
    description: '灵感源于莫高窟壁画。采用石青、石绿、朱砂、赭石等天然矿物颜料，历经千年褪色后呈现出深沉饱满、素雅且神圣的禅意美感。',
    colors: {
      bg: '#121214',
      center: '#3b7a57',
      inner: '#1e3f66',
      outer: '#b85b42',
      backgroundAura: '#2c1a16',
      goldLine: '#d4af37'
    },
    gradientColors: ['#b85b42', '#3b7a57', '#1e3f66', '#e2a76f', '#d4af37'],
    soundScale: ['A3', 'C4', 'D4', 'E4', 'G4'] // Yu scale (羽调式 - Meditative & Deep)
  },
  {
    id: 'song-teal',
    name: '宋韵青瓷',
    era: '极简两宋 (Song Dynasty)',
    description: '宋代文人美学追求大道至简。如雨过天晴的汝窑天青、温润如玉的龙泉粉青，衬以素雅的金丝，优雅内敛，流露出清朗的风骨。',
    colors: {
      bg: '#0f1211',
      center: '#a3c1ad',
      inner: '#8f9779',
      outer: '#708090',
      backgroundAura: '#1b1f1d',
      goldLine: '#e5c158'
    },
    gradientColors: ['#a3c1ad', '#8f9779', '#708090', '#c2cad0', '#e5c158'],
    soundScale: ['F4', 'G4', 'A4', 'C5', 'D5'] // Zhi scale (徵调式 - Air/Flowing)
  },
  {
    id: 'glazed-palace',
    name: '紫禁琉璃',
    era: '明清宫廷 (Forbidden City)',
    description: '灵感源自皇室珐琅与九龙壁。朱墙红瓦、耀眼琉璃金、以及深邃如海的霁蓝相融合，威严庄重，规整秩序中透露着皇家极致的华美。',
    colors: {
      bg: '#0d0d12',
      center: '#c1121f',
      inner: '#ffb703',
      outer: '#03045e',
      backgroundAura: '#171720',
      goldLine: '#f9a825'
    },
    gradientColors: ['#c1121f', '#ffb703', '#03045e', '#0077b6', '#f9a825'],
    soundScale: ['G3', 'A3', 'B3', 'D4', 'E4'] // Shang/Gong hybrid (庄重宏大)
  }
];

// Helper to convert scale names to frequencies for Web Audio API
export const NOTE_FREQUENCIES: Record<string, number> = {
  'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25
};
