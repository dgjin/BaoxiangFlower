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
  },
  {
    id: 'ming-blue',
    name: '明青花瓷',
    era: '明代永乐宣德 (Ming Dynasty)',
    description: '灵感源自永乐青花瓷。钴蓝白地、青翠欲滴，繁复缠枝莲纹与回纹环绕，既有伊斯兰几何之严谨，又蕴东方水墨之雅韵，清新脱俗。',
    colors: {
      bg: '#f5f0e8',
      center: '#1e3a8a',
      inner: '#3b82f6',
      outer: '#1e40af',
      backgroundAura: '#dbeafe',
      goldLine: '#64748b'
    },
    gradientColors: ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    soundScale: ['C4', 'D4', 'E4', 'G4', 'A4']
  },
  {
    id: 'qing-rose',
    name: '清粉彩瓷',
    era: '清代雍正乾隆 (Qing Dynasty)',
    description: '源自雍正粉彩与珐琅彩瓷器。粉嫩柔和、胭脂水红、松石绿与明黄交织，层层晕染如花瓣初绽，尽显宫廷柔美富贵与精工细作。',
    colors: {
      bg: '#1c0f14',
      center: '#db2777',
      inner: '#f9a8d4',
      outer: '#be185d',
      backgroundAura: '#fce7f3',
      goldLine: '#fbbf24'
    },
    gradientColors: ['#db2777', '#f9a8d4', '#f472b6', '#ec4899', '#fbbf24'],
    soundScale: ['D4', 'E4', 'F4', 'A4', 'C5']
  },
  {
    id: 'tibetan-tangka',
    name: '藏密唐卡',
    era: '藏传佛教 (Tibetan Thangka)',
    description: '来自雪域高原的唐卡艺术。朱砂红、孔雀蓝、金粉与松石绿层层堆叠，色彩浓烈厚重，笔触庄严神圣，蕴含着密宗修行的深邃与光明。',
    colors: {
      bg: '#0d0d0d',
      center: '#dc2626',
      inner: '#0369a1',
      outer: '#7c3aed',
      backgroundAura: '#1e0a2e',
      goldLine: '#fbbf24'
    },
    gradientColors: ['#dc2626', '#0369a1', '#7c3aed', '#f59e0b', '#fbbf24'],
    soundScale: ['G3', 'B3', 'D4', 'E4', 'G4']
  },
  {
    id: 'japan-rinpa',
    name: '琳派金屏',
    era: '江户琳派 (Rinpa School)',
    description: '灵感源自尾形光琳与俵屋宗达的金屏风画派。金箔为底、绿青与群青交错，简约凝练的曲线中蕴含着日本独特的"间"之美与侘寂禅意。',
    colors: {
      bg: '#1a1208',
      center: '#065f46',
      inner: '#047857',
      outer: '#1e40af',
      backgroundAura: '#2c2416',
      goldLine: '#f59e0b'
    },
    gradientColors: ['#065f46', '#047857', '#1e40af', '#f59e0b', '#fbbf24'],
    soundScale: ['A3', 'C4', 'E4', 'G4', 'A4']
  },
  {
    id: 'hua-shang-lotus',
    name: '华裳莲纹',
    era: '新中式纹样 (Neo-Chinese Pattern)',
    description: '灵感源自现代中式品牌纹样。深海靛蓝为底，青绿莲花为主体，珊瑚橙与金线点缀，庄重典雅中透着灵动，适合文创包装与品牌视觉。',
    colors: {
      bg: '#0a1628',
      center: '#f4a261',
      inner: '#2a9d8f',
      outer: '#1d4e89',
      backgroundAura: '#142a45',
      goldLine: '#e9c46a'
    },
    gradientColors: ['#1d4e89', '#2a9d8f', '#f4a261', '#e9c46a', '#ffffff'],
    soundScale: ['C4', 'E4', 'G4', 'A4', 'C5']
  }
];

// Helper to convert scale names to frequencies for Web Audio API
export const NOTE_FREQUENCIES: Record<string, number> = {
  'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25
};
