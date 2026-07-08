import React from 'react';
import { FlowerConfig, HistoricalPresetId } from '../types';
import { HISTORICAL_PRESETS } from '../data/presets';
import { 
  Sparkles, 
  Music, 
  RotateCw, 
  Flame, 
  Layers, 
  Palette, 
  Info, 
  RefreshCw,
  Eye,
  Sliders,
  Feather,
  Flower2
} from 'lucide-react';

interface ControlPanelProps {
  config: FlowerConfig;
  onChange: (newConfig: FlowerConfig) => void;
  onTriggerDrawing: () => void;
  isMobile?: boolean;
}

export default function ControlPanel({
  config,
  onChange,
  onTriggerDrawing,
  isMobile = false,
}: ControlPanelProps) {
  
  const currentPreset = HISTORICAL_PRESETS.find(p => p.id === config.presetId) || HISTORICAL_PRESETS[0];

  const updateConfig = (key: keyof FlowerConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const updateCustomColor = (key: 'outer' | 'inner' | 'center', value: string) => {
    onChange({
      ...config,
      customColors: {
        ...config.customColors,
        [key]: value
      }
    });
  };

  const handlePresetSelect = (presetId: HistoricalPresetId) => {
    const preset = HISTORICAL_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    
    onChange({
      ...config,
      presetId,
      customColors: {
        outer: '',
        inner: '',
        center: ''
      }
    });
  };

  const handleRandomize = () => {
    const randomColors = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    onChange({
      ...config,
      petalCount: [6, 8, 10, 12, 16][Math.floor(Math.random() * 5)],
      rotationSpeed: Math.floor(Math.random() * 8) + 1,
      pulseSpeed: Math.floor(Math.random() * 8) + 1,
      flowSpeed: Math.floor(Math.random() * 8) + 1,
      glowIntensity: Math.floor(Math.random() * 8) + 2,
      outlineWidth: parseFloat((Math.random() * 3 + 1.2).toFixed(1)),
      customColors: {
        outer: randomColors(),
        inner: randomColors(),
        center: randomColors()
      }
    });
  };

  const handleReset = () => {
    onChange({
      ...config,
      petalCount: 8,
      rotationSpeed: 3,
      pulseSpeed: 3,
      flowSpeed: 4,
      glowIntensity: 4,
      outlineWidth: 1.8,
      particleDensity: 5,
      renderingMode: 'both',
      customColors: {
        outer: '',
        inner: '',
        center: ''
      }
    });
  };

  return (
    <div 
      id="control-panel" 
      className={`bg-[#09090b]/90 backdrop-blur-xl border border-[#D4AF37]/25 rounded-2xl shadow-2xl text-gray-200 transition-all ${
        isMobile ? 'p-4 space-y-4' : 'p-6 space-y-6'
      }`}
    >
      
      {/* SECTION 1: Historical Presets Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#D4AF37] font-medium font-serif">
          <Palette className="w-5 h-5" id="icon-palette" />
          <span className="text-base tracking-wider font-semibold">东方历史美学色调</span>
        </div>
        <p className="text-xs text-gray-400">选择中国传统美学断代或壁画色彩作为视觉底蕴：</p>
        
        <div className="grid grid-cols-2 gap-2 pt-1">
          {HISTORICAL_PRESETS.map((p) => {
            const active = config.presetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePresetSelect(p.id)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                  active 
                    ? 'border-[#D4AF37]/65 bg-gradient-to-br from-[#D4AF37]/15 to-red-500/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                    : 'border-[#D4AF37]/10 bg-[#050505]/40 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/20'
                }`}
              >
                {active && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-[#D4AF37]/20 rounded-bl-full flex items-center justify-end pr-1 pt-0.5">
                    <span className="text-[10px] text-[#D4AF37] font-bold">✔</span>
                  </div>
                )}
                <span className="text-sm font-semibold tracking-wide text-gray-100">{p.name}</span>
                <span className="text-[10px] text-[#D4AF37]/80 font-mono mt-0.5">{p.era}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Preset Narrative */}
        <div className="bg-[#050505]/60 border border-[#D4AF37]/15 rounded-xl p-3.5 space-y-2 mt-2">
          <div className="flex items-start gap-1.5 text-xs text-[#D4AF37]/90 font-medium font-serif">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{currentPreset.description}</span>
          </div>
        </div>
      </div>

      <hr className="border-[#D4AF37]/15" />

      {/* SECTION 1.5: Flower Shape/Type Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#D4AF37] font-medium font-serif">
          <Flower2 className="w-5 h-5 text-[#D4AF37]" id="icon-flower-type" />
          <span className="text-base tracking-wider font-semibold">传世宝相花型规制</span>
        </div>
        <p className="text-xs text-gray-400">选择大唐与敦煌造像壁画中的经典花瓣几何轮廓：</p>
        
        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { id: 'classic', name: '经典宝相花', style: '端庄富丽 · 曲直相生', icon: '🌸' },
            { id: 'rounded', name: '盛唐妙音团', style: '丰满圆润 · 雍容华美', icon: '🏵️' },
            { id: 'lotus', name: '敦煌千叶莲', style: '清雅高洁 · 空灵禅意', icon: '🪷' },
            { id: 'ruyi', name: '如意瑞云仙', style: '流转飘逸 · 祥云瑞气', icon: '☁️' }
          ].map((type) => {
            const active = config.flowerType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => {
                  updateConfig('flowerType', type.id);
                  onTriggerDrawing();
                }}
                className={`flex flex-col text-left p-2.5 rounded-xl border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                  active 
                    ? 'border-[#D4AF37]/65 bg-gradient-to-br from-[#D4AF37]/15 to-amber-500/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                    : 'border-[#D4AF37]/10 bg-[#050505]/40 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/20'
                }`}
              >
                {active && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-[#D4AF37]/20 rounded-bl-full flex items-center justify-end pr-1 pt-0.5">
                    <span className="text-[10px] text-[#D4AF37] font-bold">✔</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs shrink-0">{type.icon}</span>
                  <span className="text-sm font-semibold tracking-wide text-gray-100">{type.name}</span>
                </div>
                <span className="text-[9px] text-gray-400 mt-1 truncate">{type.style}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-[#D4AF37]/15" />

      {/* SECTION 2: Dynamic Mechanics & Rendering */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[#D4AF37] font-medium font-serif">
          <Sliders className="w-5 h-5" id="icon-sliders" />
          <span className="text-base tracking-wider font-semibold">流光与构图控制</span>
        </div>

        {/* Structure & Grid */}
        <div className={`bg-[#050505]/60 border border-[#D4AF37]/15 rounded-xl transition-all ${
          isMobile ? 'p-3 space-y-2' : 'p-4 space-y-3'
        }`}>
          {/* Petal Count */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> 花瓣层数 (对称性)</span>
              <span className="font-mono text-[#D4AF37] font-bold">{config.petalCount} 瓣</span>
            </div>
            <div className="flex gap-1.5">
              {[6, 8, 10, 12, 16].map((count) => (
                <button
                  key={count}
                  onClick={() => updateConfig('petalCount', count)}
                  className={`flex-1 py-1 rounded-md text-xs font-mono font-semibold border transition-all cursor-pointer ${
                    config.petalCount === count
                      ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]'
                      : 'border-[#D4AF37]/10 bg-[#050505]/40 hover:bg-[#D4AF37]/5 text-gray-400'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Rendering Modes */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> 视觉渲染模式</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'both', label: '流光泥金' },
                { id: 'gold-only', label: '纯金线描' },
                { id: 'gradient-only', label: '无界流光' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => updateConfig('renderingMode', mode.id)}
                  className={`py-1 rounded-md text-[10px] font-semibold border transition-all cursor-pointer ${
                    config.renderingMode === mode.id
                      ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]'
                      : 'border-[#D4AF37]/10 bg-[#050505]/40 hover:bg-[#D4AF37]/5 text-gray-400'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fine Tuning Sliders */}
        <div className={`bg-[#050505]/60 border border-[#D4AF37]/15 rounded-xl transition-all ${
          isMobile ? 'p-3 space-y-3' : 'p-4 space-y-4'
        }`}>
          {/* Gradient Flow Speed */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-400" /> 流光溢彩速度 (Gradient Flow)</span>
              <span className="font-mono text-[#D4AF37] font-bold">{config.flowSpeed}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={config.flowSpeed}
              onChange={(e) => updateConfig('flowSpeed', parseInt(e.target.value))}
              className="w-full accent-[#D4AF37] bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Rotation Speed */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1.5"><RotateCw className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" /> 宝相法轮转速 (Rotation)</span>
              <span className="font-mono text-[#D4AF37] font-bold">{config.rotationSpeed}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={config.rotationSpeed}
              onChange={(e) => updateConfig('rotationSpeed', parseInt(e.target.value))}
              className="w-full accent-[#D4AF37] bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Breathing Pulse Speed */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1.5"><Feather className="w-3.5 h-3.5 text-green-400" /> 生生不息律动 (Breathing)</span>
              <span className="font-mono text-[#D4AF37] font-bold">{config.pulseSpeed}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={config.pulseSpeed}
              onChange={(e) => updateConfig('pulseSpeed', parseInt(e.target.value))}
              className="w-full accent-[#D4AF37] bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Stroke Width */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-yellow-500" /> 金线描边粗细 (Outline)</span>
              <span className="font-mono text-[#D4AF37] font-bold">{config.outlineWidth}px</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="0.2"
              value={config.outlineWidth}
              onChange={(e) => updateConfig('outlineWidth', parseFloat(e.target.value))}
              className="w-full accent-[#D4AF37] bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Glow Intensity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-yellow-300" /> 佛光晕染强度 (Glow Effect)</span>
              <span className="font-mono text-[#D4AF37] font-bold">{config.glowIntensity}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={config.glowIntensity}
              onChange={(e) => updateConfig('glowIntensity', parseInt(e.target.value))}
              className="w-full accent-[#D4AF37] bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      <hr className="border-[#D4AF37]/15" />

      {/* SECTION 3: Custom Color Fine-Tuning */}
      {config.renderingMode !== 'gold-only' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#D4AF37] font-medium font-serif">
            <Palette className="w-5 h-5" id="icon-custom-palette" />
            <span className="text-base tracking-wider font-semibold">自定义矿颜微调</span>
          </div>
          <p className="text-xs text-gray-400">修改特定花层的矿物颜色实现个性化配色：</p>
          <div className="grid grid-cols-3 gap-3 bg-[#050505]/60 border border-[#D4AF37]/15 rounded-xl p-3">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-400">外瓣颜色</span>
              <input 
                type="color" 
                value={config.customColors.outer || currentPreset.colors.outer}
                onChange={(e) => updateCustomColor('outer', e.target.value)}
                className="w-8 h-8 rounded-md bg-transparent border-none cursor-pointer"
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-400">内瓣颜色</span>
              <input 
                type="color" 
                value={config.customColors.inner || currentPreset.colors.inner}
                onChange={(e) => updateCustomColor('inner', e.target.value)}
                className="w-8 h-8 rounded-md bg-transparent border-none cursor-pointer"
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-400">花心颜色</span>
              <input 
                type="color" 
                value={config.customColors.center || currentPreset.colors.center}
                onChange={(e) => updateCustomColor('center', e.target.value)}
                className="w-8 h-8 rounded-md bg-transparent border-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Interactive Sound & Sparks */}
      <div className={`bg-[#050505]/60 border border-[#D4AF37]/15 rounded-xl transition-all ${
        isMobile ? 'p-3 space-y-3' : 'p-4 space-y-4'
      }`}>
        {/* Sound Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-[#D4AF37]" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-200">禅意五音敲击 (Chime)</span>
              <span className="text-[10px] text-gray-400">触碰或悬停花瓣时弹奏古琴金铃</span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={config.chimeEnabled}
              onChange={(e) => updateConfig('chimeEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-black/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
          </label>
        </div>

        {/* Sparks Density Slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-gray-300">
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> 悬停金沙尘埃 (Sparkles)</span>
            <span className="font-mono text-[#D4AF37] font-bold">{config.particleDensity}</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={config.particleDensity}
            onChange={(e) => updateConfig('particleDensity', parseInt(e.target.value))}
            className="w-full accent-[#D4AF37] bg-black/40 h-1 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* ACTION TRIGGERS */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onTriggerDrawing}
          className={`px-4 bg-[#D4AF37] hover:bg-[#cfa82e] active:scale-95 text-black font-semibold text-xs tracking-wider rounded-xl transition-all shadow-[0_4px_12px_rgba(212,175,55,0.25)] flex items-center justify-center gap-1.5 cursor-pointer ${
            isMobile ? 'py-3' : 'py-2.5'
          }`}
        >
          <Feather className="w-3.5 h-3.5" /> 重新金线勾勒
        </button>
        <button
          onClick={handleRandomize}
          className={`px-4 bg-[#050505]/50 hover:bg-[#D4AF37]/10 active:scale-95 border border-[#D4AF37]/20 text-gray-200 font-semibold text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isMobile ? 'py-3' : 'py-2.5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> 妙笔随机配色
        </button>
      </div>

      <div className="text-center pt-1">
        <button
          onClick={handleReset}
          className="text-[11px] text-gray-400 hover:text-[#D4AF37] underline inline-flex items-center gap-1 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> 重置设计至默认配置
        </button>
      </div>

    </div>
  );
}
