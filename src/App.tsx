import React, { useState, useEffect, useRef } from 'react';
import { FlowerConfig, HistoricalPresetId } from './types';
import { HISTORICAL_PRESETS } from './data/presets';
import BaoxiangFlower from './components/BaoxiangFlower';
import ControlPanel from './components/ControlPanel';
import CulturalInfo from './components/CulturalInfo';
import { playChime } from './utils/ZenChime';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Compass, 
  RotateCw, 
  Info, 
  FileText, 
  Send, 
  Heart,
  Undo,
  Download,
  Share2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // 1. Core Config State
  const [config, setConfig] = useState<FlowerConfig>({
    presetId: 'tang-gold',
    flowerType: 'classic',
    petalCount: 8,
    rotationSpeed: 3,
    pulseSpeed: 3,
    flowSpeed: 4,
    glowIntensity: 4,
    outlineWidth: 1.8,
    particleDensity: 5,
    chimeEnabled: true,
    renderingMode: 'both',
    customColors: {
      outer: '',
      inner: '',
      center: ''
    },
    isDrawing: false
  });

  // Derived current historical preset
  const currentPreset = HISTORICAL_PRESETS.find(p => p.id === config.presetId) || HISTORICAL_PRESETS[0];

  // 2. Tab Navigation
  const [activeTab, setActiveTab] = useState<'design' | 'narrative' | 'scroll'>('design');

  // 1.5. Mobile Layout Detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Scroll Card States
  const [recipientName, setRecipientName] = useState('雅集知音');
  const [blessingTheme, setBlessingTheme] = useState('花开富贵');
  const [isScrollModalOpen, setIsScrollModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 3.6. Xuan Paper Ink Bleed State
  const [inkBleeds, setInkBleeds] = useState<{ id: number; x: number; y: number }[]>([]);
  const inkBleedCounter = useRef<number>(0);

  // 3.5. Drawing progress and completion chime syncing
  const [drawingProgress, setDrawingProgress] = useState(0);

  useEffect(() => {
    if (!config.isDrawing) {
      setDrawingProgress(0);
      return;
    }

    const duration = 4000; // Matches the setTimeout and draw-lines SVG keyframe animation
    const start = performance.now();
    let animId: number;
    let hasPlayedEndChime = false;

    const updateProgress = () => {
      const now = performance.now();
      const elapsed = now - start;
      const progress = Math.min(100, (elapsed / duration) * 100);

      setDrawingProgress(progress);

      if (progress < 100) {
        animId = requestAnimationFrame(updateProgress);
      } else {
        if (!hasPlayedEndChime) {
          hasPlayedEndChime = true;
          if (config.chimeEnabled) {
            // Play a crisp high-frequency bronze bell chime (E5)
            playChime('E5');
          }
        }
      }
    };

    animId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [config.isDrawing, config.chimeEnabled]);

  // 4. Trigger drawing on mount
  useEffect(() => {
    handleTriggerDrawing();
  }, []);

  const handleTriggerDrawing = () => {
    // Toggles the drawing keyframe animation on SVG outlines
    setConfig(prev => ({ ...prev, isDrawing: true }));
    // Play an entry chime cascade
    if (config.chimeEnabled) {
      setTimeout(() => playChime(currentPreset.soundScale[0]), 0);
      setTimeout(() => playChime(currentPreset.soundScale[2]), 350);
      setTimeout(() => playChime(currentPreset.soundScale[4]), 700);
    }
    
    // Reset isDrawing state after animation completes
    const timer = setTimeout(() => {
      setConfig(prev => ({ ...prev, isDrawing: false }));
    }, 4000);

    return () => clearTimeout(timer);
  };

  const handleScrollClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const id = inkBleedCounter.current++;
    setInkBleeds(prev => [...prev, { id, x: clickX, y: clickY }]);

    // Clean up after the watercolor diffusion animation completes (2.2s)
    setTimeout(() => {
      setInkBleeds(prev => prev.filter(item => item.id !== id));
    }, 2200);

    // Play a gentle water drop chime (C6) to enrich the Zen click feedback
    if (config.chimeEnabled) {
      playChime('C6');
    }
  };

  // Pre-coded dynamic traditional scroll contents
  const scrollData: Record<HistoricalPresetId, { poem: string; translation: string; artist: string }> = {
    'tang-gold': {
      poem: '九天閶闔开宫殿，万国衣冠拜冕旒。花开富贵，万象圆融。',
      translation: '大唐盛世，金碧生辉。泥金界线分明，重彩交融，常伴大国雍容、福禄双全之吉光。',
      artist: '画师 吴道子 笔意'
    },
    'dunhuang': {
      poem: '大漠孤烟，莫高千佛。金壁辉光，照见本心，得大清净。',
      translation: '莫高窟千年风沙，石青石绿矿彩斑斓，金线隐约，常生澄澈安宁、生生不息之禅机。',
      artist: '敦煌 莫高工匠 敬绘'
    },
    'song-teal': {
      poem: '雨过天青云破处，这般颜色做将来。清雅脱俗，温润如玉。',
      translation: '两宋极简，汝窑天青，龙泉粉青，衬以素雅金丝，常享清朗脱俗、温润素雅之逸趣。',
      artist: '画院 徽宗皇帝 遗风'
    },
    'glazed-palace': {
      poem: '朱墙金瓦，九重端庄。瑞气祥云，皇家气象，万代昌盛。',
      translation: '紫禁红墙，耀眼琉璃金与霁蓝相拥，威严对称，常驻前程锦绣、尊荣华贵之瑞气。',
      artist: '造办处 珐琅匠人 督造'
    }
  };

  const activeScroll = scrollData[config.presetId];

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] flex flex-col justify-between font-sans relative overflow-x-hidden select-none">
      
      {/* Decorative Background Glows from Elegant Dark Theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Decorative Golden Pattern Corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-[#D4AF37]/20 pointer-events-none rounded-tl-3xl m-4 transition-all duration-500" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-[#D4AF37]/20 pointer-events-none rounded-tr-3xl m-4 transition-all duration-500" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-[#D4AF37]/20 pointer-events-none rounded-bl-3xl m-4 transition-all duration-500" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-[#D4AF37]/20 pointer-events-none rounded-br-3xl m-4 transition-all duration-500" />

      {/* HEADER SECTION with Diamond Accents */}
      <header className="pt-8 pb-3 text-center px-4 relative z-20">
        <div className="inline-flex items-center justify-center gap-4 mb-3">
          <div className="w-6 h-6 border border-[#D4AF37]/60 rotate-45 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[#D4AF37]"></div>
          </div>
          <span className="text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-serif font-semibold">Baoxiang Heritage</span>
          <div className="w-6 h-6 border border-[#D4AF37]/60 rotate-45 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[#D4AF37]"></div>
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-serif font-bold italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-[#D4AF37] to-amber-200 drop-shadow-md">
          宝相花流光美学工坊
        </h1>
        
        <p className="text-xs sm:text-sm text-white/50 max-w-xl mx-auto mt-2 leading-relaxed tracking-wide font-sans">
          基于东方传统重彩美学设计的交互式艺术工坊。触碰花瓣唤醒流光溢彩之变，结合金色线条描摹、泥金界色与古琴五音，呈递生生不息的圆满禅境。
        </p>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-2 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 relative">
        
        {/* LEFT COLUMN: THE MAGICAL FLUID SVG CANVAS */}
        <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-center justify-center gap-4 relative">
          
          {/* Main Baoxiang Flower Interactive Box */}
          <div className="w-full relative flex items-center justify-center p-2 rounded-3xl bg-[#09090b]/80 border border-[#D4AF37]/20 backdrop-blur-sm gold-glowing">
            
            {/* Visual presets quick switcher floating dots */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 bg-[#050505]/85 backdrop-blur-md p-1.5 rounded-xl border border-[#D4AF37]/15">
              {HISTORICAL_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setConfig(prev => ({ ...prev, presetId: p.id, customColors: { outer: '', inner: '', center: '' } }))}
                  className="group relative flex items-center justify-center"
                  title={p.name}
                >
                  <span 
                    className={`w-3.5 h-3.5 rounded-full transition-all border ${
                      config.presetId === p.id 
                        ? 'border-[#D4AF37] scale-125 shadow-[0_0_8px_#ffd700]' 
                        : 'border-transparent scale-90 opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: p.colors.center }}
                  />
                  <span className="absolute left-6 text-[10px] bg-[#050505] text-gray-200 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 border border-[#D4AF37]/20">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Action Overlays (Mute/Unmute & Re-draw) */}
            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
              <button
                onClick={() => setConfig(prev => ({ ...prev, chimeEnabled: !prev.chimeEnabled }))}
                className="w-9 h-9 flex items-center justify-center bg-[#050505]/80 backdrop-blur-md text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 rounded-full border border-[#D4AF37]/15 transition-all shadow-md cursor-pointer"
                title={config.chimeEnabled ? "关闭静修禅音" : "开启静修禅音"}
              >
                {config.chimeEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
              </button>
              <button
                onClick={handleTriggerDrawing}
                className="px-3 h-9 flex items-center gap-1.5 bg-[#050505]/80 backdrop-blur-md text-xs font-semibold text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 rounded-full border border-[#D4AF37]/15 transition-all shadow-md cursor-pointer"
                title="重新金线勾勒"
              >
                <RotateCw className={`w-3.5 h-3.5 ${config.isDrawing ? 'animate-spin' : ''}`} />
                <span>重新勾勒</span>
              </button>
            </div>

            {/* Fine Flowing Progress Bar for Re-drawing */}
            <AnimatePresence>
              {config.isDrawing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 left-16 right-16 sm:left-24 sm:right-24 z-25 flex flex-col items-center gap-1.5"
                >
                  <div className="flex items-center justify-between w-full px-1">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#D4AF37]/90 font-serif font-medium flex items-center gap-1.5 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      泥金界画描摹中...
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#D4AF37]">
                      {Math.round(drawingProgress)}%
                    </span>
                  </div>
                  <div className="w-full h-[3px] bg-[#050505]/60 border border-[#D4AF37]/10 rounded-full relative overflow-visible">
                    {/* Progress Fill */}
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 via-[#D4AF37] to-yellow-200 rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_#ffd700]"
                      style={{ width: `${drawingProgress}%` }}
                    />
                    {/* Glowing Flowing Cursor */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_14px_#ffd700,0_0_6px_#ffffff] -translate-x-1/2 transition-all duration-75 ease-out flex items-center justify-center"
                      style={{ left: `${drawingProgress}%` }}
                    >
                      {/* Inner gold core */}
                      <div className="w-1 h-1 bg-[#D4AF37] rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isMobile && (
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-[#D4AF37]/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#D4AF37]/35 text-[9px] font-semibold text-[#D4AF37] tracking-wider animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] inline-block animate-ping" />
                <span>📱 专属触控模式开启</span>
              </div>
            )}

            {/* THE FLOWER COMPONENT */}
            <BaoxiangFlower 
              config={config} 
              presetColors={currentPreset.colors} 
              gradientColors={currentPreset.gradientColors}
              soundScale={currentPreset.soundScale}
              isMobile={isMobile}
            />
          </div>

          {/* Interactive Instruction Banner */}
          <div className="text-center space-y-1">
            <p className="text-xs text-[#D4AF37]/90 font-serif tracking-wider flex items-center justify-center gap-1.5 px-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              💡 {isMobile ? "轻触任意花瓣：唤醒金色涟漪、五音共鸣与局部饱和度提升" : `悬停或触碰花瓣：唤醒金沙尘埃与古琴金铃 (五音：${currentPreset.soundScale.join(' ')})`}
            </p>
            <p className="text-[10px] text-gray-500">
              当前对称性：{config.petalCount}重径向发散 · 描金：{config.outlineWidth}px · 晕染：{config.glowIntensity}级
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: TABBED WORKSPACE & CONFIG CONTROL */}
        <div className="lg:col-span-5 xl:col-span-6 flex flex-col h-full justify-start space-y-4">
          
          {/* Premium workspace tabs */}
          <div className="flex bg-[#09090b]/90 p-1.5 rounded-xl border border-[#D4AF37]/25 shadow-inner">
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'design' 
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm font-bold' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              流光设计工坊
            </button>
            <button
              onClick={() => setActiveTab('narrative')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'narrative' 
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm font-bold' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Info className="w-4 h-4" />
              美学传记
            </button>
            <button
              onClick={() => setActiveTab('scroll')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'scroll' 
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm font-bold' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              禅意笺卡
            </button>
          </div>

          {/* ACTIVE TAB RENDERER */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {activeTab === 'design' && (
                <motion.div
                  key="design-tab"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <ControlPanel 
                    config={config} 
                    onChange={setConfig} 
                    onTriggerDrawing={handleTriggerDrawing}
                    isMobile={isMobile}
                  />
                </motion.div>
              )}

              {activeTab === 'narrative' && (
                <motion.div
                  key="narrative-tab"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <CulturalInfo />
                </motion.div>
              )}

              {activeTab === 'scroll' && (
                <motion.div
                  key="scroll-tab"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#09090b]/95 border border-[#D4AF37]/20 rounded-2xl p-6 shadow-2xl text-gray-200 space-y-5"
                >
                  <div className="flex items-center gap-2 text-[#D4AF37] font-medium font-serif">
                    <FileText className="w-5 h-5" id="icon-filetext" />
                    <span className="text-base tracking-wider font-semibold">生成个人定制禅意笺卡</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    输入福主（或好友）姓名，结合当前宝相花的设计风格，生成一张极具古典意境的竖版绢本笺卡卷轴：
                  </p>

                  <div className="space-y-4 pt-1">
                    {/* Input name */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-300">福主尊讳 / 姓名</label>
                      <input 
                        type="text" 
                        value={recipientName}
                        maxLength={6}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="例如：知音、清风阁"
                        className="w-full bg-[#050505]/60 border border-[#D4AF37]/20 rounded-xl px-4 py-2 text-sm text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]/50"
                      />
                    </div>

                    {/* Choose wish */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-300">祈福意向</label>
                      <div className="flex flex-wrap gap-2">
                        {['花开富贵', '万象圆融', '生生不息', '岁岁平安', '金碧辉煌', '清心自得'].map((wish) => (
                          <button
                            key={wish}
                            onClick={() => setBlessingTheme(wish)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              blessingTheme === wish 
                                ? 'border-[#D4AF37]/60 bg-[#D4AF37]/15 text-[#D4AF37]' 
                                : 'border-[#D4AF37]/10 bg-[#050505]/40 text-gray-400 hover:bg-[#D4AF37]/5 hover:text-gray-200'
                            }`}
                          >
                            {wish}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Card generation explanation card */}
                    <div className="bg-[#050505]/60 rounded-xl p-3 border border-[#D4AF37]/15 flex gap-2">
                      <div className="bg-[#D4AF37]/10 p-2 rounded-lg h-fit animate-pulse">
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <div className="space-y-1 text-xs">
                        <h4 className="font-semibold text-[#D4AF37] font-serif">定制笺卡亮点</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          笺卡包含您的【宝相花专属迷你星宿绘】、【竖排朱砂落款书法】、【古典断代诗词解译】。极具收藏与分享意趣。
                        </p>
                      </div>
                    </div>

                    {/* Trigger Generate Modal */}
                    <button
                      onClick={() => {
                        setIsScrollModalOpen(true);
                        // Play golden chime chord
                        if (config.chimeEnabled) {
                          playChime(currentPreset.soundScale[1]);
                          setTimeout(() => playChime(currentPreset.soundScale[3]), 200);
                        }
                      }}
                      className="w-full py-3 bg-gradient-to-r from-[#D4AF37] via-amber-500 to-yellow-600 hover:brightness-110 active:scale-98 text-black font-semibold text-xs tracking-widest rounded-xl transition-all shadow-[0_4px_16px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      开启画轴 · 生成美学笺卡
                    </button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-[10px] text-white/30 border-t border-[#D4AF37]/15 mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>宝相花流光美学工坊 © 2026 · 基于传统国画与莫高窟壁画色彩推演</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors cursor-pointer">
              <Heart className="w-3 h-3 text-red-500/60" /> 传承中华艺术之美
            </span>
          </div>
        </div>
      </footer>

      {/* ================= MODAL: TRADITIONAL CALLIGRAPHY SCROLL CARD (禅意笺卡弹窗) ================= */}
      <AnimatePresence>
        {isScrollModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Modal backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsScrollModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal content box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className={`relative bg-[#09090b] border border-[#D4AF37]/35 rounded-3xl max-w-lg w-full shadow-[0_20px_50px_rgba(212,175,55,0.2)] flex flex-col items-center overflow-hidden max-h-[92vh] ${
                isMobile ? 'p-4 gap-4' : 'p-6 sm:p-8 gap-6'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsScrollModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-[#D4AF37] p-1 bg-[#050505]/40 hover:bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20 transition-all cursor-pointer z-30"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative aura behind scroll */}
              <div 
                className="absolute w-80 h-80 rounded-full blur-[100px] pointer-events-none -z-10 opacity-40"
                style={{ backgroundColor: currentPreset.colors.backgroundAura }}
              />

              {/* THE CHINESE VERTICAL SCROLL CARD */}
              <div 
                id="parchment-scroll" 
                onClick={handleScrollClick}
                className={`w-full bg-[#f5efe0] text-[#2c1f1a] rounded-2xl shadow-inner border-[6px] border-[#cdbf9f] relative flex flex-col items-center overflow-hidden font-serif cursor-pointer select-none active:scale-[0.995] transition-all duration-150 ${
                  isMobile ? 'p-3.5' : 'p-6 sm:p-8'
                }`}
                style={{
                  backgroundImage: 'radial-gradient(#FAF5E6 25%, transparent 25%), radial-gradient(#FAF5E6 25%, transparent 25%)',
                  backgroundPosition: '0 0, 8px 8px',
                  backgroundSize: '16px 16px',
                  backgroundColor: '#f5efe0'
                }}
              >
                {/* Embedded SVG for local custom Xuan paper & ink wash filters */}
                <svg width="0" height="0" className="absolute pointer-events-none">
                  <defs>
                    {/* 1. Xuan Paper Texture Filter with high-frequency organic fractal noise */}
                    <filter id="xuan-paper-texture" x="0%" y="0%" width="100%" height="100%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
                      <feDiffuseLighting in="noise" lighting-color="#ffffff" surfaceScale="2.2" result="light">
                        <feDistantLight azimuth="45" elevation="60" />
                      </feDiffuseLighting>
                      <feBlend mode="multiply" in="SourceGraphic" in2="light" result="blend" />
                    </filter>

                    {/* 2. Ink Wash Bleeding/Diffusion Filter */}
                    <filter id="ink-bleed-filter">
                      {/* Distort edges using organic fractal noise to represent natural capillary diffusion in paper fibers */}
                      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="noise" />
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                      <feGaussianBlur in="displaced" stdDeviation="12" />
                    </filter>

                    {/* 3. Golden radial wash for clicking */}
                    <radialGradient id="gold-ink-grad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.8" />
                      <stop offset="35%" stopColor="#D4AF37" stopOpacity="0.6" />
                      <stop offset="70%" stopColor="#A87F18" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#8A640F" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>

                {/* Genuine Xuan Paper Fibrous Overlay with 3D embossed lighting */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply z-0" 
                  style={{
                    filter: 'url(#xuan-paper-texture)',
                    backgroundColor: '#FAF5E6',
                  }}
                />

                {/* Exquisite Dunhuang Mandala Wheel Background Underlay */}
                <motion.div 
                  animate={{ 
                    scale: inkBleeds.length > 0 ? [1, 1.04, 1.01] : 1,
                    opacity: inkBleeds.length > 0 ? [0.06, 0.18, 0.06] : 0.06
                  }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none"
                >
                  <svg viewBox="-250 -250 500 500" className="w-10/12 h-10/12 animate-[spin_120s_linear_infinite]">
                    {/* Circle rings */}
                    <circle r="230" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="6, 6" />
                    <circle r="190" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
                    <circle r="150" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeDasharray="3, 12" />
                    
                    {/* 8 radiating spokes */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line
                        key={i}
                        x1="0"
                        y1="-230"
                        x2="0"
                        y2="230"
                        stroke="#D4AF37"
                        strokeWidth="0.8"
                        transform={`rotate(${i * 45})`}
                      />
                    ))}

                    {/* Decorative lotus petals in underlay */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <path
                        key={i}
                        d="M 0 0 C -15 -20, -30 -50, 0 -110 C 30 -50, 15 -20, 0 0 Z"
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="1"
                        transform={`rotate(${i * 30})`}
                      />
                    ))}
                  </svg>
                </motion.div>

                {/* Interactive Ink Wash Bleeding (水墨晕染) Animation Overlay */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
                  style={{ mixBlendMode: 'color-burn' }}
                >
                  <AnimatePresence>
                    {inkBleeds.map((bleed) => (
                      <g key={bleed.id}>
                        {/* Organically distorted expanding gold ink bleed */}
                        <motion.circle
                          cx={bleed.x}
                          cy={bleed.y}
                          initial={{ r: 5, opacity: 0.95, scale: 0.8 }}
                          animate={{ r: 200, opacity: 0, scale: 1.5 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 2.2, ease: [0.1, 0.6, 0.2, 1] }}
                          fill="url(#gold-ink-grad)"
                          filter="url(#ink-bleed-filter)"
                        />
                        {/* Multi-layered bleed for soft watercolor spread */}
                        <motion.circle
                          cx={bleed.x}
                          cy={bleed.y}
                          initial={{ r: 2, opacity: 0.8, scale: 0.9 }}
                          animate={{ r: 130, opacity: 0, scale: 1.7 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.8, delay: 0.1, ease: "easeOut" }}
                          fill="rgba(212, 175, 55, 0.35)"
                          filter="url(#ink-bleed-filter)"
                        />
                        {/* Inner intense soaking nucleus */}
                        <motion.circle
                          cx={bleed.x}
                          cy={bleed.y}
                          initial={{ r: 1, opacity: 1 }}
                          animate={{ r: 50, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.0, ease: "easeOut" }}
                          fill="#D4AF37"
                          filter="url(#ink-bleed-filter)"
                        />
                      </g>
                    ))}
                  </AnimatePresence>
                </svg>
                {/* Scroll upper and lower wood rollers decorative lines */}
                <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-b from-[#8B5A2B] to-[#5C3818] shadow-md" />
                <div className="absolute bottom-0 inset-x-0 h-2.5 bg-gradient-to-t from-[#8B5A2B] to-[#5C3818] shadow-md" />

                {/* Inner red seal border */}
                <div className="absolute inset-2 border-2 border-red-800/15 pointer-events-none rounded-xl" />

                {/* Card Title Header */}
                <div className="flex flex-col items-center gap-1 mb-5 pt-2">
                  <div className="text-[10px] tracking-[0.4em] uppercase font-mono font-bold text-red-800/60 flex items-center gap-1">
                    ✦ 宝相花专属吉祥笺 ✦
                  </div>
                  <div className="h-[1px] w-28 bg-red-800/20 my-1" />
                  <div className="text-xl font-bold tracking-[0.2em] text-[#3e1b12] font-sans">
                    {blessingTheme}
                  </div>
                </div>

                {/* Calligraphic Vertical Text Layout */}
                <div className="flex flex-row-reverse justify-center items-stretch gap-6 sm:gap-8 h-64 min-h-[250px] w-full">
                  
                  {/* Column 1: Wish & Recipient (Vertical RL) */}
                  <div className="flex flex-col items-center justify-start border-l border-red-800/10 pl-4 sm:pl-5">
                    <span className="text-[11px] text-red-800/50 font-bold tracking-[0.2em] uppercase mb-2 writing-vertical font-sans">福主姓名</span>
                    <div 
                      className="text-lg font-bold text-[#b91c1c] border border-red-800/35 rounded px-1.5 py-3 text-center bg-red-800/5 shadow-sm"
                      style={{ writingMode: 'vertical-rl' }}
                    >
                      {recipientName || '雅集知音'}
                    </div>
                  </div>

                  {/* Column 2: The Dynasty classical Poem (Vertical RL) */}
                  <div className="flex flex-col items-center justify-start px-2 sm:px-3">
                    <div 
                      className="text-base font-bold tracking-[0.3em] text-[#2c1f1a] leading-loose text-justify pr-2 h-full"
                      style={{ writingMode: 'vertical-rl' }}
                    >
                      {activeScroll.poem}
                    </div>
                  </div>

                  {/* Column 3: Custom mini SVG flower to showcase their specific design */}
                  <div className="flex flex-col items-center justify-center pr-3">
                    <div className="w-24 h-24 rounded-full border border-red-800/20 bg-white/40 p-1 flex items-center justify-center shadow-md">
                      <svg viewBox="-250 -250 500 500" className="w-full h-full">
                        <defs>
                          <linearGradient id="mini-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFF" />
                            <stop offset="50%" stopColor="#D4AF37" />
                            <stop offset="100%" stopColor="#8A640F" />
                          </linearGradient>
                        </defs>
                        {/* 8 quick outer petals inside miniature */}
                        {Array.from({ length: config.petalCount }).map((_, i) => (
                          <path
                            key={i}
                            d="M 0 0 C -25 -30, -50 -80, -25 -145 C -12 -165, -5 -185, 0 -195 C 5 -185, 12 -165, 25 -145 C 50 -80, 25 -30, 0 0 Z"
                            transform={`rotate(${i * (360 / config.petalCount)})`}
                            fill={config.customColors.outer || currentPreset.colors.outer}
                            stroke="url(#mini-gold)"
                            strokeWidth="10"
                          />
                        ))}
                        {/* 8 mini inner petals */}
                        {Array.from({ length: config.petalCount }).map((_, i) => (
                          <path
                            key={i}
                            d="M 0 0 C -30 -15, -42 -55, -20 -105 C -10 -120, 10 -120, 20 -105 C 42 -55, 30 -15, 0 0 Z"
                            transform={`rotate(${(i + 0.5) * (360 / config.petalCount)})`}
                            fill={config.customColors.inner || currentPreset.colors.inner}
                            stroke="url(#mini-gold)"
                            strokeWidth="8"
                          />
                        ))}
                        <circle r="40" fill={config.customColors.center || currentPreset.colors.center} stroke="url(#mini-gold)" strokeWidth="12" />
                        <circle r="15" fill="#FFFFFF" />
                      </svg>
                    </div>
                    <span className="text-[9px] text-[#2c1f1a]/50 font-bold tracking-widest mt-2 block whitespace-nowrap">
                      {currentPreset.name} (定格)
                    </span>
                  </div>

                </div>

                {/* Explanatory footer narrative (horizontal small characters) */}
                <div className="mt-6 border-t border-red-800/10 pt-3 text-center w-full space-y-1">
                  <p className="text-[10px] text-red-900/70 font-semibold tracking-wide">
                    {activeScroll.translation}
                  </p>
                  <p className="text-[9px] text-red-900/50 font-mono font-bold tracking-widest">
                    {activeScroll.artist} · 庚申吉旦
                  </p>
                </div>

                {/* Traditional Auspicious Stamp (Red block seal) */}
                <div className="absolute bottom-5 right-5 w-8 h-8 border border-red-800/80 rounded flex items-center justify-center bg-red-800/5 shadow-sm transform rotate-6">
                  <span className="text-[9px] text-red-800 font-bold font-sans tracking-tight leading-none text-center">
                    吉祥<br />如意
                  </span>
                </div>

              </div>

              {/* Elegant Toast notification overlay inside modal */}
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

              {/* Action Buttons to save scroll or play bells */}
              <div className="flex gap-3 w-full relative z-10">
                <button
                  onClick={() => setIsScrollModalOpen(false)}
                  className="flex-1 py-2.5 bg-[#050505]/40 hover:bg-[#D4AF37]/10 text-gray-300 font-semibold text-xs tracking-wider rounded-xl transition-all border border-[#D4AF37]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Undo className="w-3.5 h-3.5" /> 返回修改
                </button>
                <button
                  onClick={() => {
                    setToastMessage(`《${recipientName || '雅集知音'} · 吉祥笺卡》已成功生成！长按上方画卷或截屏即可保存。`);
                    setTimeout(() => setToastMessage(null), 3500);
                  }}
                  className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#cfa82e] text-black font-semibold text-xs tracking-wider rounded-xl transition-all shadow-[0_4px_12px_rgba(212,175,55,0.25)] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> 保存画卷
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
