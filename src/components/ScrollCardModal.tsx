import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Undo, Download } from 'lucide-react';
import { FlowerConfig, FlowerPreset, ScrollCardTemplateId, ScrollCardTemplate } from '../types';

// 笺卡模板定义
export const SCROLL_CARD_TEMPLATES: Record<ScrollCardTemplateId, ScrollCardTemplate> = {
  'classic-scroll': {
    id: 'classic-scroll',
    name: '古卷轴',
    description: '仿古绢本竖轴，朱砂落款',
    icon: '📜',
    bgColor: '#f5efe0',
    borderColor: '#cdbf9f',
    textColor: '#2c1f1a',
    accentColor: '#b91c1c',
    paperStyle: 'parchment',
  },
  'fan-shaped': {
    id: 'fan-shaped',
    name: '团扇笺',
    description: '圆融扇形，仕女雅趣',
    icon: '🪭',
    bgColor: '#fefaf0',
    borderColor: '#d4a574',
    textColor: '#3e2723',
    accentColor: '#c62828',
    paperStyle: 'silk',
  },
  'square-seal': {
    id: 'square-seal',
    name: '方寸印',
    description: '方正印章，金石气韵',
    icon: '🔲',
    bgColor: '#f8f4e8',
    borderColor: '#8d6e63',
    textColor: '#1b1a17',
    accentColor: '#bf360c',
    paperStyle: 'rice-paper',
  },
  'round-mirror': {
    id: 'round-mirror',
    name: '铜镜笺',
    description: '圆满铜镜，汉唐古意',
    icon: '🪞',
    bgColor: '#faf6ed',
    borderColor: '#b8960c',
    textColor: '#2c1810',
    accentColor: '#8b0000',
    paperStyle: 'gold-foil',
  },
  'bamboo-slip': {
    id: 'bamboo-slip',
    name: '竹简笺',
    description: '先秦竹简，古朴天成',
    icon: '🎋',
    bgColor: '#e8dcc8',
    borderColor: '#6b8e23',
    textColor: '#1a1a0a',
    accentColor: '#4a7c10',
    paperStyle: 'bamboo',
  },
  'lotus-leaf': {
    id: 'lotus-leaf',
    name: '莲叶笺',
    description: '青莲出水，禅意空灵',
    icon: '🪷',
    bgColor: '#f0f7f0',
    borderColor: '#7cb342',
    textColor: '#1b3a1b',
    accentColor: '#2e7d32',
    paperStyle: 'rice-paper',
  },
};

interface ScrollCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  config: FlowerConfig;
  currentPreset: FlowerPreset;
  recipientName: string;
  blessingTheme: string;
  poem: string;
  translation: string;
  artist: string;
  toastMessage: string | null;
  inkBleeds: { id: number; x: number; y: number }[];
  templateId: ScrollCardTemplateId;
  onScrollClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onExport: () => void;
}

// 古卷轴模板
function ClassicScrollCard({
  template, config, currentPreset, recipientName, blessingTheme, poem, translation, artist, inkBleeds, isMobile, onScrollClick,
}: {
  template: ScrollCardTemplate;
  config: FlowerConfig;
  currentPreset: FlowerPreset;
  recipientName: string;
  blessingTheme: string;
  poem: string;
  translation: string;
  artist: string;
  inkBleeds: { id: number; x: number; y: number }[];
  isMobile: boolean;
  onScrollClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div 
      onClick={onScrollClick}
      className={`w-full rounded-2xl shadow-inner border-[6px] relative flex flex-col items-center overflow-hidden font-zen cursor-pointer select-none active:scale-[0.995] transition-all duration-150 ${
        isMobile ? 'p-3.5' : 'p-6 sm:p-8'
      }`}
      style={{
        backgroundColor: template.bgColor,
        borderColor: template.borderColor,
        backgroundImage: 'radial-gradient(#FAF5E6 25%, transparent 25%), radial-gradient(#FAF5E6 25%, transparent 25%)',
        backgroundPosition: '0 0, 8px 8px',
        backgroundSize: '16px 16px',
      }}
    >
      <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-b from-[#8B5A2B] to-[#5C3818] shadow-md" />
      <div className="absolute bottom-0 inset-x-0 h-2.5 bg-gradient-to-t from-[#8B5A2B] to-[#5C3818] shadow-md" />
      <div className="absolute inset-2 border-2 border-red-800/15 pointer-events-none rounded-xl" />

      <div className="flex flex-col items-center gap-1 mb-5 pt-2">
        <div className="text-[10px] tracking-[0.4em] uppercase font-mono font-bold text-red-800/60 flex items-center gap-1">
          ✦ 宝相花专属吉祥笺 ✦
        </div>
        <div className="h-[1px] w-28 bg-red-800/20 my-1" />
        <div className="text-xl font-bold tracking-[0.2em] text-[#3e1b12] font-sans">{blessingTheme}</div>
      </div>

      <div className={`flex flex-row-reverse justify-center items-stretch w-full ${isMobile ? 'gap-3 h-56 min-h-[200px]' : 'gap-6 sm:gap-8 h-64 min-h-[250px]'}`}>
        <div className="flex flex-col items-center justify-start border-l border-red-800/10 pl-4 sm:pl-5">
          <span className="text-[11px] text-red-800/50 font-bold tracking-[0.2em] uppercase mb-2 writing-vertical font-sans">福主姓名</span>
          <div className="text-lg font-bold text-[#b91c1c] border border-red-800/35 rounded px-1.5 py-3 text-center bg-red-800/5 shadow-sm" style={{ writingMode: 'vertical-rl' }}>
            {recipientName || '雅集知音'}
          </div>
        </div>
        <div className="flex flex-col items-center justify-start px-2 sm:px-3">
          <div className={`font-bold tracking-[0.3em] text-[#2c1f1a] leading-loose text-justify pr-2 h-full ${isMobile ? 'text-sm' : 'text-base'}`} style={{ writingMode: 'vertical-rl' }}>
            {poem}
          </div>
        </div>
        <MiniFlower config={config} currentPreset={currentPreset} isMobile={isMobile} />
      </div>

      <div className="mt-6 border-t border-red-800/10 pt-3 text-center w-full space-y-1">
        <p className="text-[10px] text-red-900/70 font-semibold tracking-wide">{translation}</p>
        <p className="text-[9px] text-red-900/50 font-mono font-bold tracking-widest">{artist} · 庚申吉旦</p>
      </div>

      <SealStamp />
      <InkBleeds inkBleeds={inkBleeds} />
    </div>
  );
}

// 团扇笺模板
function FanShapedCard({
  template, config, currentPreset, recipientName, blessingTheme, poem, translation, artist, inkBleeds, isMobile, onScrollClick,
}: {
  template: ScrollCardTemplate;
  config: FlowerConfig;
  currentPreset: FlowerPreset;
  recipientName: string;
  blessingTheme: string;
  poem: string;
  translation: string;
  artist: string;
  inkBleeds: { id: number; x: number; y: number }[];
  isMobile: boolean;
  onScrollClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div 
      onClick={onScrollClick}
      className={`w-full rounded-2xl shadow-inner border-[4px] relative flex flex-col items-center overflow-hidden font-zen cursor-pointer select-none active:scale-[0.995] transition-all duration-150 ${
        isMobile ? 'p-4' : 'p-6 sm:p-8'
      }`}
      style={{
        backgroundColor: template.bgColor,
        borderColor: template.borderColor,
        borderRadius: '40% 40% 20px 20px',
      }}
    >
      <div className="absolute inset-0 rounded-[40%_40%_16px_16px] border-[3px] border-amber-200/50 pointer-events-none" style={{ margin: '6px' }} />
      
      <div className="flex flex-col items-center gap-2 mb-4 pt-2">
        <div className="text-[10px] tracking-[0.3em] font-mono text-amber-700/70">✦ 宝相花团扇雅笺 ✦</div>
        <div className="h-[1px] w-20 bg-amber-300/40" />
        <div className="text-lg font-bold tracking-[0.15em] text-amber-900">{blessingTheme}</div>
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="flex flex-col items-center">
            <MiniFlower config={config} currentPreset={currentPreset} isMobile={isMobile} size="small" />
            <span className="text-[9px] text-amber-800/50 mt-1">{currentPreset.name}</span>
          </div>
          <div className="flex-1 text-center">
            <p className={`font-zen tracking-wider leading-relaxed text-amber-900/80 ${isMobile ? 'text-sm' : 'text-base'}`}>
              {poem}
            </p>
            <p className="text-[11px] text-amber-700/50 mt-2 italic">{translation}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-amber-200/50 pt-3 w-full justify-center">
          <span className="text-[10px] text-amber-800/40">敬呈</span>
          <span className="text-base font-bold text-red-700 border-b border-red-400/40 px-2">{recipientName || '雅集知音'}</span>
          <span className="text-[10px] text-amber-800/40">雅鉴</span>
        </div>
        <p className="text-[9px] text-amber-700/40 font-mono tracking-widest">{artist}</p>
      </div>

      <InkBleeds inkBleeds={inkBleeds} />
    </div>
  );
}

// 方寸印模板
function SquareSealCard({
  template, config, currentPreset, recipientName, blessingTheme, poem, translation, artist, inkBleeds, isMobile, onScrollClick,
}: {
  template: ScrollCardTemplate;
  config: FlowerConfig;
  currentPreset: FlowerPreset;
  recipientName: string;
  blessingTheme: string;
  poem: string;
  translation: string;
  artist: string;
  inkBleeds: { id: number; x: number; y: number }[];
  isMobile: boolean;
  onScrollClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div 
      onClick={onScrollClick}
      className={`w-full shadow-inner border-[5px] relative flex flex-col items-center overflow-hidden font-zen cursor-pointer select-none active:scale-[0.995] transition-all duration-150 ${
        isMobile ? 'p-4' : 'p-6'
      }`}
      style={{
        backgroundColor: template.bgColor,
        borderColor: template.borderColor,
        aspectRatio: '1/1',
      }}
    >
      <div className="absolute inset-3 border-2 border-stone-400/20 pointer-events-none" />
      <div className="absolute inset-6 border border-stone-300/15 pointer-events-none" />

      <div className="flex flex-col items-center justify-center h-full w-full gap-3 relative z-10">
        <MiniFlower config={config} currentPreset={currentPreset} isMobile={isMobile} size="small" />
        <div className="text-lg font-bold tracking-[0.2em] text-stone-800">{blessingTheme}</div>
        <div className="h-[1px] w-16 bg-stone-300/50" />
        <p className={`text-center font-zen tracking-wide leading-relaxed text-stone-700/80 px-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {poem}
        </p>
        <div className="flex items-center gap-2 border border-stone-300/30 rounded px-4 py-1.5 bg-stone-100/30">
          <span className="text-[10px] text-stone-500">呈</span>
          <span className="text-sm font-bold text-red-800">{recipientName || '雅集知音'}</span>
        </div>
        <p className="text-[9px] text-stone-500/60 font-mono tracking-widest">{artist}</p>
        <p className="text-[10px] text-stone-500/50 italic text-center px-2 leading-relaxed">{translation}</p>
      </div>

      <InkBleeds inkBleeds={inkBleeds} />
    </div>
  );
}

// 铜镜笺模板
function RoundMirrorCard({
  template, config, currentPreset, recipientName, blessingTheme, poem, translation, artist, inkBleeds, isMobile, onScrollClick,
}: {
  template: ScrollCardTemplate;
  config: FlowerConfig;
  currentPreset: FlowerPreset;
  recipientName: string;
  blessingTheme: string;
  poem: string;
  translation: string;
  artist: string;
  inkBleeds: { id: number; x: number; y: number }[];
  isMobile: boolean;
  onScrollClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div 
      onClick={onScrollClick}
      className={`w-full rounded-full shadow-inner border-[5px] relative flex flex-col items-center justify-center overflow-hidden font-zen cursor-pointer select-none active:scale-[0.995] transition-all duration-150 ${
        isMobile ? 'p-5' : 'p-8'
      }`}
      style={{
        backgroundColor: template.bgColor,
        borderColor: template.borderColor,
        aspectRatio: '1/1',
        backgroundImage: 'radial-gradient(circle at center, rgba(212,175,55,0.08) 0%, transparent 70%)',
      }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="1" strokeDasharray="4, 8" />
        <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5" />
      </svg>

      <div className="flex flex-col items-center gap-2 relative z-10 text-center">
        <div className="text-[10px] tracking-[0.3em] font-mono text-amber-700/60">✦ 汉唐铜镜吉语笺 ✦</div>
        <MiniFlower config={config} currentPreset={currentPreset} isMobile={isMobile} size="small" />
        <div className="text-lg font-bold tracking-[0.2em] text-amber-900">{blessingTheme}</div>
        <div className="w-12 h-[1px] bg-amber-400/30" />
        <p className={`font-zen tracking-wide leading-relaxed text-amber-800/80 px-6 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {poem}
        </p>
        <div className="flex items-center gap-1.5 bg-amber-100/40 rounded-full px-4 py-1">
          <span className="text-[9px] text-amber-600/50">谨呈</span>
          <span className="text-sm font-bold text-red-700">{recipientName || '雅集知音'}</span>
        </div>
        <p className="text-[9px] text-amber-600/50 italic">{translation}</p>
        <p className="text-[8px] text-amber-500/40 font-mono tracking-widest">{artist}</p>
      </div>

      <InkBleeds inkBleeds={inkBleeds} />
    </div>
  );
}

// 竹简笺模板
function BambooSlipCard({
  template, config, currentPreset, recipientName, blessingTheme, poem, translation, artist, inkBleeds, isMobile, onScrollClick,
}: {
  template: ScrollCardTemplate;
  config: FlowerConfig;
  currentPreset: FlowerPreset;
  recipientName: string;
  blessingTheme: string;
  poem: string;
  translation: string;
  artist: string;
  inkBleeds: { id: number; x: number; y: number }[];
  isMobile: boolean;
  onScrollClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const slats = 7;
  return (
    <div 
      onClick={onScrollClick}
      className={`w-full rounded-lg shadow-inner border-[3px] relative flex flex-col items-center overflow-hidden font-zen cursor-pointer select-none active:scale-[0.995] transition-all duration-150 ${
        isMobile ? 'p-3' : 'p-5'
      }`}
      style={{
        backgroundColor: template.bgColor,
        borderColor: template.borderColor,
      }}
    >
      <div className="flex gap-1 w-full justify-center" style={{ direction: 'rtl' }}>
        {Array.from({ length: slats }).map((_, i) => (
          <div 
            key={i}
            className="flex-1 rounded-sm relative"
            style={{
              backgroundColor: '#d4c9a8',
              backgroundImage: 'linear-gradient(90deg, rgba(139,119,80,0.15) 0%, transparent 40%, transparent 60%, rgba(139,119,80,0.15) 100%)',
              boxShadow: 'inset 1px 0 2px rgba(139,119,80,0.2), 2px 2px 4px rgba(0,0,0,0.1)',
              minHeight: isMobile ? '200px' : '280px',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className={`flex flex-col items-center gap-2 px-6 py-4 bg-[#e8dcc8]/90 rounded-lg shadow-lg ${isMobile ? 'max-w-[90%]' : 'max-w-[80%]'}`}>
          <div className="text-[10px] tracking-[0.3em] font-mono text-olive-800/60">✦ 竹简古笺 ✦</div>
          <MiniFlower config={config} currentPreset={currentPreset} isMobile={isMobile} size="tiny" />
          <div className="text-base font-bold tracking-[0.15em] text-olive-900">{blessingTheme}</div>
          <div className="w-10 h-[1px] bg-olive-500/30" />
          <p className={`font-zen tracking-wide leading-relaxed text-center text-olive-800/80 px-2 ${isMobile ? 'text-[11px]' : 'text-sm'}`}>
            {poem}
          </p>
          <div className="flex items-center gap-1.5 border-b border-olive-500/20 pb-1">
            <span className="text-[10px] text-olive-700/50">呈</span>
            <span className="text-sm font-bold text-red-800">{recipientName || '雅集知音'}</span>
          </div>
          <p className="text-[9px] text-olive-600/50 italic text-center">{translation}</p>
          <p className="text-[8px] text-olive-500/40 font-mono tracking-widest">{artist}</p>
        </div>
      </div>

      <InkBleeds inkBleeds={inkBleeds} />
    </div>
  );
}

// 莲叶笺模板
function LotusLeafCard({
  template, config, currentPreset, recipientName, blessingTheme, poem, translation, artist, inkBleeds, isMobile, onScrollClick,
}: {
  template: ScrollCardTemplate;
  config: FlowerConfig;
  currentPreset: FlowerPreset;
  recipientName: string;
  blessingTheme: string;
  poem: string;
  translation: string;
  artist: string;
  inkBleeds: { id: number; x: number; y: number }[];
  isMobile: boolean;
  onScrollClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div 
      onClick={onScrollClick}
      className={`w-full shadow-inner border-[4px] relative flex flex-col items-center overflow-hidden font-zen cursor-pointer select-none active:scale-[0.995] transition-all duration-150 ${
        isMobile ? 'p-4' : 'p-6 sm:p-8'
      }`}
      style={{
        backgroundColor: template.bgColor,
        borderColor: template.borderColor,
        borderRadius: '60% 40% 55% 45% / 45% 55% 40% 60%',
        borderWidth: '5px',
      }}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M 100 20 C 160 30, 180 90, 150 150 C 130 185, 70 185, 50 150 C 20 90, 40 30, 100 20 Z" fill="none" stroke="#2e7d32" strokeWidth="0.5" />
          <path d="M 100 20 L 100 180" stroke="#2e7d32" strokeWidth="0.3" />
          <path d="M 40 100 L 160 100" stroke="#2e7d32" strokeWidth="0.3" />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-3 relative z-10 text-center w-full">
        <div className="text-[10px] tracking-[0.3em] font-mono text-emerald-700/60">✦ 莲叶禅心笺 ✦</div>
        <div className="text-lg font-bold tracking-[0.15em] text-emerald-800">{blessingTheme}</div>
        <MiniFlower config={config} currentPreset={currentPreset} isMobile={isMobile} size="small" />
        <div className="w-16 h-[1px] bg-emerald-400/30" />
        <p className={`font-zen tracking-wide leading-relaxed text-emerald-800/70 px-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {poem}
        </p>
        <div className="flex items-center gap-2 text-emerald-700/60">
          <span className="text-[10px]">—— 谨呈</span>
          <span className="text-sm font-bold text-red-700">{recipientName || '雅集知音'}</span>
        </div>
        <p className="text-[9px] text-emerald-600/50 italic">{translation}</p>
        <p className="text-[8px] text-emerald-500/40 font-mono tracking-widest">{artist}</p>
      </div>

      <InkBleeds inkBleeds={inkBleeds} />
    </div>
  );
}

// 迷你宝相花组件
function MiniFlower({ config, currentPreset, isMobile, size = 'normal' }: {
  config: FlowerConfig;
  currentPreset: FlowerPreset;
  isMobile: boolean;
  size?: 'normal' | 'small' | 'tiny';
}) {
  const dims = size === 'tiny' ? 'w-12 h-12' : size === 'small' ? 'w-16 h-16' : isMobile ? 'w-20 h-20' : 'w-24 h-24';
  return (
    <div className={`${dims} rounded-full border border-red-800/20 bg-white/40 p-1 flex items-center justify-center shadow-md`}>
      <svg viewBox="-250 -250 500 500" className="w-full h-full">
        <defs>
          <linearGradient id="mini-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8A640F" />
          </linearGradient>
        </defs>
        {Array.from({ length: config.petalCount }).map((_, i) => (
          <path key={`mo-${i}`} d="M 0 0 C -25 -30, -50 -80, -25 -145 C -12 -165, -5 -185, 0 -195 C 5 -185, 12 -165, 25 -145 C 50 -80, 25 -30, 0 0 Z" transform={`rotate(${i * (360 / config.petalCount)})`} fill={config.customColors.outer || currentPreset.colors.outer} stroke="url(#mini-gold)" strokeWidth="10" />
        ))}
        {Array.from({ length: config.petalCount }).map((_, i) => (
          <path key={`mi-${i}`} d="M 0 0 C -30 -15, -42 -55, -20 -105 C -10 -120, 10 -120, 20 -105 C 42 -55, 30 -15, 0 0 Z" transform={`rotate(${(i + 0.5) * (360 / config.petalCount)})`} fill={config.customColors.inner || currentPreset.colors.inner} stroke="url(#mini-gold)" strokeWidth="8" />
        ))}
        <circle r="40" fill={config.customColors.center || currentPreset.colors.center} stroke="url(#mini-gold)" strokeWidth="12" />
        <circle r="15" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

// 印章组件
function SealStamp() {
  return (
    <div className="absolute bottom-5 right-5 w-8 h-8 border border-red-800/80 rounded flex items-center justify-center bg-red-800/5 shadow-sm transform rotate-6">
      <span className="text-[9px] text-red-800 font-bold font-sans tracking-tight leading-none text-center">吉祥<br />如意</span>
    </div>
  );
}

// 墨滴晕染组件
function InkBleeds({ inkBleeds }: { inkBleeds: { id: number; x: number; y: number }[] }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible" style={{ mixBlendMode: 'color-burn' }}>
      <defs>
        <filter id="ink-bleed-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="12" />
        </filter>
        <radialGradient id="gold-ink-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.8" />
          <stop offset="35%" stopColor="#D4AF37" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#A87F18" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#8A640F" stopOpacity="0" />
        </radialGradient>
      </defs>
      <AnimatePresence>
        {inkBleeds.map((bleed) => (
          <g key={bleed.id}>
            <motion.circle cx={bleed.x} cy={bleed.y} initial={{ r: 5, opacity: 0.95, scale: 0.8 }} animate={{ r: 200, opacity: 0, scale: 1.5 }} exit={{ opacity: 0 }} transition={{ duration: 2.2, ease: [0.1, 0.6, 0.2, 1] }} fill="url(#gold-ink-grad)" filter="url(#ink-bleed-filter)" />
            <motion.circle cx={bleed.x} cy={bleed.y} initial={{ r: 2, opacity: 0.8, scale: 0.9 }} animate={{ r: 130, opacity: 0, scale: 1.7 }} exit={{ opacity: 0 }} transition={{ duration: 1.8, delay: 0.1, ease: "easeOut" }} fill="rgba(212, 175, 55, 0.35)" filter="url(#ink-bleed-filter)" />
            <motion.circle cx={bleed.x} cy={bleed.y} initial={{ r: 1, opacity: 1 }} animate={{ r: 50, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1.0, ease: "easeOut" }} fill="#D4AF37" filter="url(#ink-bleed-filter)" />
          </g>
        ))}
      </AnimatePresence>
    </svg>
  );
}

export default function ScrollCardModal({
  isOpen,
  onClose,
  isMobile,
  config,
  currentPreset,
  recipientName,
  blessingTheme,
  poem,
  translation,
  artist,
  toastMessage,
  inkBleeds,
  templateId,
  onScrollClick,
  onExport,
}: ScrollCardModalProps) {
  const template = SCROLL_CARD_TEMPLATES[templateId];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className={`relative bg-[#09090b] border border-[#D4AF37]/35 rounded-3xl max-w-lg w-full shadow-[0_20px_50px_rgba(212,175,55,0.2)] flex flex-col items-center overflow-hidden max-h-[92vh] ${
              isMobile ? 'p-4 gap-4 mx-2 rounded-[28px]' : 'p-6 sm:p-8 gap-6'
            }`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#D4AF37] p-1 bg-[#050505]/40 hover:bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20 transition-all cursor-pointer z-30"
            >
              <X className="w-5 h-5" />
            </button>

            <div 
              className="absolute w-80 h-80 rounded-full blur-[100px] pointer-events-none -z-10 opacity-40"
              style={{ backgroundColor: currentPreset.colors.backgroundAura }}
            />

            {/* 模板名称标签 */}
            <div className="flex items-center gap-2 text-[#D4AF37]/80 text-xs font-zen tracking-wider">
              <span>{template.icon}</span>
              <span>{template.name}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 text-[10px]">{template.description}</span>
            </div>

            {/* SCROLL CARD - 根据模板渲染不同样式 */}
            <div id="parchment-scroll" className="w-full">
              {/* 宣纸纹理 */}
              <svg width="0" height="0" className="absolute pointer-events-none">
                <defs>
                  <filter id="xuan-paper-texture" x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
                    <feDiffuseLighting in="noise" lighting-color="#ffffff" surfaceScale="2.2" result="light">
                      <feDistantLight azimuth="45" elevation="60" />
                    </feDiffuseLighting>
                    <feBlend mode="multiply" in="SourceGraphic" in2="light" result="blend" />
                  </filter>
                </defs>
              </svg>

              {templateId === 'classic-scroll' && (
                <ClassicScrollCard template={template} config={config} currentPreset={currentPreset} recipientName={recipientName} blessingTheme={blessingTheme} poem={poem} translation={translation} artist={artist} inkBleeds={inkBleeds} isMobile={isMobile} onScrollClick={onScrollClick} />
              )}
              {templateId === 'fan-shaped' && (
                <FanShapedCard template={template} config={config} currentPreset={currentPreset} recipientName={recipientName} blessingTheme={blessingTheme} poem={poem} translation={translation} artist={artist} inkBleeds={inkBleeds} isMobile={isMobile} onScrollClick={onScrollClick} />
              )}
              {templateId === 'square-seal' && (
                <SquareSealCard template={template} config={config} currentPreset={currentPreset} recipientName={recipientName} blessingTheme={blessingTheme} poem={poem} translation={translation} artist={artist} inkBleeds={inkBleeds} isMobile={isMobile} onScrollClick={onScrollClick} />
              )}
              {templateId === 'round-mirror' && (
                <RoundMirrorCard template={template} config={config} currentPreset={currentPreset} recipientName={recipientName} blessingTheme={blessingTheme} poem={poem} translation={translation} artist={artist} inkBleeds={inkBleeds} isMobile={isMobile} onScrollClick={onScrollClick} />
              )}
              {templateId === 'bamboo-slip' && (
                <BambooSlipCard template={template} config={config} currentPreset={currentPreset} recipientName={recipientName} blessingTheme={blessingTheme} poem={poem} translation={translation} artist={artist} inkBleeds={inkBleeds} isMobile={isMobile} onScrollClick={onScrollClick} />
              )}
              {templateId === 'lotus-leaf' && (
                <LotusLeafCard template={template} config={config} currentPreset={currentPreset} recipientName={recipientName} blessingTheme={blessingTheme} poem={poem} translation={translation} artist={artist} inkBleeds={inkBleeds} isMobile={isMobile} onScrollClick={onScrollClick} />
              )}
            </div>

            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  className="absolute bottom-20 left-4 right-4 z-40 bg-gradient-to-r from-amber-500 via-[#D4AF37] to-yellow-500 border border-amber-300 text-black font-semibold text-[11px] py-2.5 px-4 rounded-xl shadow-2xl flex items-center justify-center gap-2 text-center leading-relaxed"
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-red-800 animate-pulse" />
                  <span>{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`flex gap-3 w-full relative z-10 ${isMobile ? 'flex-col' : ''}`}>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-[#050505]/40 hover:bg-[#D4AF37]/10 text-gray-300 font-semibold text-xs tracking-wider rounded-xl transition-all border border-[#D4AF37]/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Undo className="w-3.5 h-3.5" /> 返回修改
              </button>
              <button
                onClick={onExport}
                className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#cfa82e] text-black font-semibold text-xs tracking-wider rounded-xl transition-all shadow-[0_4px_12px_rgba(212,175,55,0.25)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> 保存画卷
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
