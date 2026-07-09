import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlowerConfig, HistoricalPresetId, ScrollCardTemplateId, ScrollCardData, ScrollCardTemplate } from './types';
import { HISTORICAL_PRESETS } from './data/presets';
import BaoxiangFlower from './components/BaoxiangFlower';
import ControlPanel from './components/ControlPanel';
import CulturalInfo from './components/CulturalInfo';
import ScrollCardModal, { SCROLL_CARD_TEMPLATES } from './components/ScrollCardModal';
import MobileTabBar from './components/MobileTabBar';
import ErrorBoundary from './components/ErrorBoundary';
import { playChime, setChimeVolume } from './utils/ZenChime';
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
  X,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // 0. Theme mode (dark/light)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('baoxiang-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('baoxiang-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // 0. Initial loading transition state
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Brief delay to let DOM settle, then fade in
    const timer = setTimeout(() => setIsAppReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

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
    chimeVolume: 70,
    renderingMode: 'both',
    customColors: {
      outer: '',
      inner: '',
      center: ''
    },
    showDecorRing: false,
    isDrawing: false
  });

  // Config history for undo (max 20 steps)
  const [configHistory, setConfigHistory] = useState<FlowerConfig[]>([]);
  const pushHistory = useCallback((newConfig: FlowerConfig) => {
    setConfigHistory(prev => {
      const updated = [...prev, newConfig];
      if (updated.length > 20) updated.shift();
      return updated;
    });
  }, []);

  const handleConfigChange = useCallback((newConfig: FlowerConfig) => {
    pushHistory(config);
    setConfig(newConfig);
  }, [config, pushHistory]);

  const handleUndo = useCallback(() => {
    setConfigHistory(prev => {
      if (prev.length === 0) return prev;
      const previous = prev[prev.length - 1];
      setConfig(previous);
      return prev.slice(0, -1);
    });
  }, []);

  // Sync chime volume to audio engine
  useEffect(() => {
    setChimeVolume(config.chimeVolume / 100);
  }, [config.chimeVolume]);

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
  const [scrollTemplateId, setScrollTemplateId] = useState<ScrollCardTemplateId>('classic-scroll');
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

    const duration = 6000; // Matches the setTimeout and draw-lines SVG keyframe animation
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
    }, 6000);

    return () => clearTimeout(timer);
  };

  const handleExportScrollCard = async () => {
    const scrollEl = document.getElementById('parchment-scroll');
    if (!scrollEl) {
      setToastMessage('笺卡尚未就绪，请稍后再试');
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }
    try {
      // Use a simple approach: convert the scroll DOM to an image via canvas
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const canvas = await html2canvas(scrollEl, {
        backgroundColor: '#f5efe0',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      canvas.toBlob((blob) => {
        if (!blob) {
          setToastMessage('笺卡导出失败，请重试');
          setTimeout(() => setToastMessage(null), 2000);
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `禅意笺卡_${recipientName}_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setToastMessage(`《${recipientName || '雅集知音'} · 吉祥笺卡》已保存为高清图片！`);
        setTimeout(() => setToastMessage(null), 3500);
      }, 'image/png');
    } catch {
      // Fallback: basic screenshot prompt
      setToastMessage(`《${recipientName || '雅集知音'} · 吉祥笺卡》已成功生成！长按上方画卷或截屏即可保存。`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Flower canvas export ref
  const flowerContainerRef = useRef<HTMLDivElement>(null);

  const handleExportFlowerImage = async () => {
    const svgEl = document.getElementById('baoxiang-svg') as unknown as SVGSVGElement | null;
    if (!svgEl) {
      setToastMessage('花卉画布尚未就绪，请稍后再试');
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }
    try {
      // Clone the SVG to render at high resolution
      const clone = svgEl.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('width', '1024');
      clone.setAttribute('height', '1024');
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clone);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      // Draw onto a canvas for PNG export
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;
      // Dark background matching the app
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 1024, 1024);

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) {
          setToastMessage('导出失败，请重试');
          setTimeout(() => setToastMessage(null), 2000);
          return;
        }
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `宝相花_${currentPreset.name}_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
        setToastMessage('宝相花已保存为高清图片！');
        setTimeout(() => setToastMessage(null), 2500);
      }, 'image/png');
    } catch {
      setToastMessage('导出失败，请重试');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  const handleShareFlower = async () => {
    const svgEl = document.getElementById('baoxiang-svg') as unknown as SVGSVGElement | null;
    if (!svgEl) {
      setToastMessage('花卉画布尚未就绪');
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }
    try {
      const clone = svgEl.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('width', '1024');
      clone.setAttribute('height', '1024');
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clone);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 1024, 1024);

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      URL.revokeObjectURL(url);
      if (!blob) {
        setToastMessage('分享图片生成失败');
        setTimeout(() => setToastMessage(null), 2000);
        return;
      }

      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `宝相花_${currentPreset.name}.png`, { type: 'image/png' });
        const shareData = { 
          title: `宝相花 · ${currentPreset.name}`,
          text: `我在宝相花流光美学工坊创作了一幅${currentPreset.name}风格的宝相花，邀你共赏东方重彩之美 ✨`,
          files: [file]
        };
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          // Fallback: download
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `宝相花_${currentPreset.name}_${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(downloadUrl);
          setToastMessage('已保存到相册，可手动分享');
          setTimeout(() => setToastMessage(null), 2500);
        }
      } else {
        // Fallback for browsers without Web Share API
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `宝相花_${currentPreset.name}_${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(downloadUrl);
        setToastMessage('已保存到相册，可手动分享');
        setTimeout(() => setToastMessage(null), 2500);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return; // User cancelled share
      setToastMessage('分享失败，请重试');
      setTimeout(() => setToastMessage(null), 2000);
    }
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
  const scrollData: Record<HistoricalPresetId, ScrollCardData> = {
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
    },
    'ming-blue': {
      poem: '青花白地，缠枝不断。钴蓝沉静，一色千变，素心永传。',
      translation: '永乐青花，苏麻离青钴料深沉，白地之上缠枝连绵，常伴清新雅致、世代长青之吉祥。',
      artist: '御窑厂 青花匠人 敬绘'
    },
    'qing-rose': {
      poem: '粉彩胭脂，柔美如春。松石明黄，层层叠染，富贵长春。',
      translation: '雍正粉彩，胭脂水红柔嫩如脂，松石绿与明黄交织，常驻柔美富贵、锦绣长春之瑞兆。',
      artist: '清宫 珐琅作 督造'
    },
    'tibetan-tangka': {
      poem: '雪域梵音，金粉为光。朱砂蓝靛，层层加持，照破无明。',
      translation: '藏密唐卡，矿物颜料浓烈厚重，金粉勾勒法相庄严，常得智慧光明、护佑平安之加持。',
      artist: '雪域 画僧 虔心敬绘'
    },
    'japan-rinpa': {
      poem: '金箔流光，青绿相映。简约凝练，间之美学，侘寂禅心。',
      translation: '琳派金屏，金箔底色之上绿青群青交映，曲水流畅，常享清净简约、心无挂碍之禅悦。',
      artist: '琳派 光琳宗达 遗韵'
    }
  };

  const activeScroll = scrollData[config.presetId];

  // Render Scroll Tab content (reused by both desktop and mobile)
  const renderScrollTab = (mobile = false) => (
    <div className={`bg-[#09090b]/95 border border-[#D4AF37]/20 rounded-2xl shadow-2xl text-gray-200 space-y-5 ${mobile ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center gap-2 text-[#D4AF37] font-medium font-serif">
        <FileText className="w-5 h-5" />
        <span className="text-base tracking-wider font-semibold">生成个人定制禅意笺卡</span>
      </div>
      <p className="text-xs text-gray-400">
        输入福主（或好友）姓名，选择笺卡样式，结合当前宝相花的设计风格，生成一张极具古典意境的笺卡：
      </p>

      <div className="space-y-4 pt-1">
        <div className="space-y-1.5">
          <label className="text-xs text-gray-300">福主尊讳 / 姓名</label>
          <input 
            type="text" 
            value={recipientName}
            maxLength={6}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="例如：知音、清风阁"
            className="w-full bg-[#050505]/60 border border-[#D4AF37]/20 rounded-xl px-4 py-2.5 text-sm text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]/50 placeholder:text-gray-600"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-gray-300">祈福意向</label>
          <div className="flex flex-wrap gap-2">
            {['花开富贵', '万象圆融', '生生不息', '岁岁平安', '金碧辉煌', '清心自得'].map((wish) => (
              <button
                key={wish}
                onClick={() => setBlessingTheme(wish)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ios-tap ${
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

        {/* 笺卡模板选择 */}
        <div className="space-y-1.5">
          <label className="text-xs text-gray-300">笺卡样式</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.values(SCROLL_CARD_TEMPLATES) as ScrollCardTemplate[]).map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setScrollTemplateId(tpl.id)}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all cursor-pointer ios-tap ${
                  scrollTemplateId === tpl.id 
                    ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.15)]' 
                    : 'border-[#D4AF37]/10 bg-[#050505]/40 text-gray-400 hover:bg-[#D4AF37]/5 hover:text-gray-200'
                }`}
              >
                <span className="text-lg">{tpl.icon}</span>
                <span className="text-[10px] font-semibold tracking-wide">{tpl.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#050505]/60 rounded-xl p-3 border border-[#D4AF37]/15 flex gap-2">
          <div className="bg-[#D4AF37]/10 p-2 rounded-lg h-fit animate-pulse">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="space-y-1 text-xs">
            <h4 className="font-semibold text-[#D4AF37] font-serif">定制笺卡亮点</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              笺卡包含您的【宝相花专属迷你星宿绘】、【{SCROLL_CARD_TEMPLATES[scrollTemplateId]?.name || '古卷轴'}风格落款】、【古典断代诗词解译】。极具收藏与分享意趣。
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsScrollModalOpen(true);
            if (config.chimeEnabled) {
              playChime(currentPreset.soundScale[1]);
              setTimeout(() => playChime(currentPreset.soundScale[3]), 200);
            }
          }}
          className="w-full ios-btn-primary flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          开启画轴 · 生成美学笺卡
        </button>
      </div>
    </div>
  );

  const bgColor = isDarkMode ? '#050505' : '#FAFAF5';
  const textColor = isDarkMode ? '#E5E5E5' : '#2c1f1a';

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden select-none" style={{ backgroundColor: bgColor, color: textColor }}>
      
      {/* ================= INITIAL LOADING TRANSITION ================= */}
      <AnimatePresence>
        {!isAppReady && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center gap-4"
            style={{ backgroundColor: bgColor }}
          >
            <motion.div
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.1) 60%, transparent 100%)',
              }}
            />
            <p className="text-[#D4AF37]/70 text-sm font-serif tracking-[0.3em] animate-pulse">宝相庄严 · 流光初现</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(prev => !prev)}
        className="fixed top-4 right-4 z-40 w-9 h-9 flex items-center justify-center bg-[#09090b]/70 backdrop-blur-md text-gray-300 hover:text-[#D4AF37] rounded-full border border-[#D4AF37]/15 shadow-md cursor-pointer transition-all"
        title={isDarkMode ? "切换亮色主题" : "切换暗色主题"}
      >
        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[130px] pointer-events-none" />

      {/* ==================== DESKTOP LAYOUT (lg+) ==================== */}
      {!isMobile && (
        <>
          {/* Decorative Golden Pattern Corners */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-[#D4AF37]/20 pointer-events-none rounded-tl-3xl m-4 transition-all duration-500" />
          <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-[#D4AF37]/20 pointer-events-none rounded-tr-3xl m-4 transition-all duration-500" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-[#D4AF37]/20 pointer-events-none rounded-bl-3xl m-4 transition-all duration-500" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-[#D4AF37]/20 pointer-events-none rounded-br-3xl m-4 transition-all duration-500" />

          {/* HEADER */}
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

          {/* MAIN CONTAINER - Desktop */}
          <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-2 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10 relative">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-center justify-start gap-4 relative">
              <div className="w-full relative flex items-center justify-center p-2 rounded-3xl bg-[#09090b]/80 border border-[#D4AF37]/20 backdrop-blur-sm gold-glowing">
                {/* Visual presets quick switcher */}
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

                {/* Quick Actions */}
                <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, chimeEnabled: !prev.chimeEnabled }))}
                    className="w-9 h-9 flex items-center justify-center bg-[#050505]/80 backdrop-blur-md text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 rounded-full border border-[#D4AF37]/15 transition-all shadow-md cursor-pointer"
                    title={config.chimeEnabled ? "关闭静修禅音" : "开启静修禅音"}
                  >
                    {config.chimeEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
                  </button>
                  <button
                    onClick={handleExportFlowerImage}
                    className="w-9 h-9 flex items-center justify-center bg-[#050505]/80 backdrop-blur-md text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 rounded-full border border-[#D4AF37]/15 transition-all shadow-md cursor-pointer"
                    title="保存花卉为高清图片"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleShareFlower}
                    className="w-9 h-9 flex items-center justify-center bg-[#050505]/80 backdrop-blur-md text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 rounded-full border border-[#D4AF37]/15 transition-all shadow-md cursor-pointer"
                    title="分享花卉"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleTriggerDrawing}
                    className="px-3 h-9 flex items-center gap-1.5 bg-[#050505]/80 backdrop-blur-md text-xs font-semibold text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 rounded-full border border-[#D4AF37]/15 transition-all shadow-md cursor-pointer"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${config.isDrawing ? 'animate-spin' : ''}`} />
                    <span>重新勾勒</span>
                  </button>
                </div>

                {/* Drawing Progress Bar */}
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
                        <div 
                          className="h-full bg-gradient-to-r from-amber-600 via-[#D4AF37] to-yellow-200 rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_#ffd700]"
                          style={{ width: `${drawingProgress}%` }}
                        />
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_14px_#ffd700,0_0_6px_#ffffff] -translate-x-1/2 transition-all duration-75 ease-out flex items-center justify-center"
                          style={{ left: `${drawingProgress}%` }}
                        >
                          <div className="w-1 h-1 bg-[#D4AF37] rounded-full" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <BaoxiangFlower 
                  config={config} 
                  presetColors={currentPreset.colors} 
                  gradientColors={currentPreset.gradientColors}
                  soundScale={currentPreset.soundScale}
                  isMobile={false}
                />
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs text-[#D4AF37]/90 font-serif tracking-wider flex items-center justify-center gap-1.5 px-4">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                  💡 悬停或触碰花瓣：唤醒金沙尘埃与古琴金铃 (五音：{currentPreset.soundScale.join(' ')})
                </p>
                <p className="text-[10px] text-gray-500">
                  当前对称性：{config.petalCount}重径向发散 · 描金：{config.outlineWidth}px · 晕染：{config.glowIntensity}级
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN - Desktop */}
            <div className="lg:col-span-5 xl:col-span-6 flex flex-col h-full justify-start space-y-4">
              <div className="flex bg-[#09090b]/90 p-1.5 rounded-xl border border-[#D4AF37]/25 shadow-inner">
                {[
                  { id: 'design', icon: Compass, label: '流光设计工坊' },
                  { id: 'narrative', icon: Info, label: '美学传记' },
                  { id: 'scroll', icon: FileText, label: '禅意笺卡' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === tab.id 
                        ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm font-bold' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-grow">
                <AnimatePresence mode="wait">
                  {activeTab === 'design' && (
                    <motion.div key="design-tab" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }}>
                      <ControlPanel config={config} onChange={handleConfigChange} onTriggerDrawing={handleTriggerDrawing} onUndo={handleUndo} hasHistory={configHistory.length > 0} isMobile={false} />
                    </motion.div>
                  )}
                  {activeTab === 'narrative' && (
                    <motion.div key="narrative-tab" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }}>
                      <CulturalInfo isMobile={false} />
                    </motion.div>
                  )}
                  {activeTab === 'scroll' && (
                    <motion.div key="scroll-tab" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }}>
                      {renderScrollTab()}
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
        </>
      )}

      {/* ==================== iOS MOBILE LAYOUT ==================== */}
      {isMobile && (
        <div className="flex flex-col h-[100dvh] ios-scroll">
          {/* iOS-style Navigation Bar */}
          <nav className="ios-nav sticky top-0 z-30 px-4 py-3">
            <div className="flex items-center justify-center">
              <h1 className="text-base font-semibold text-white tracking-wide">
                宝相花流光美学工坊
              </h1>
            </div>
          </nav>

          {/* Hero: Full-Width Flower Canvas */}
          <div className="relative px-3 pt-2 pb-3">
            <div className="w-full relative flex items-center justify-center rounded-[24px] bg-[#09090b]/80 border border-[#D4AF37]/15 backdrop-blur-sm aspect-square">
              
              {/* Preset Color Dots - Horizontal iOS-style row at top */}
              <div className="absolute top-3 left-3 right-3 z-20 flex justify-center gap-2">
                <div className="flex gap-2 bg-[#000]/60 backdrop-blur-xl px-2 py-1.5 rounded-full border border-[#D4AF37]/15">
                  {HISTORICAL_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setConfig(prev => ({ ...prev, presetId: p.id, customColors: { outer: '', inner: '', center: '' } }))}
                      className="relative"
                      title={p.name}
                    >
                      <span 
                        className={`block w-5 h-5 rounded-full transition-all ${
                          config.presetId === p.id 
                            ? 'ring-2 ring-[#D4AF37] ring-offset-1 ring-offset-black/50 scale-110 shadow-[0_0_10px_rgba(212,175,55,0.5)]' 
                            : 'opacity-60'
                        }`}
                        style={{ backgroundColor: p.colors.center }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Top-Right Actions */}
              <div className="absolute top-3 right-3 z-20 flex gap-1.5">
                <button
                  onClick={() => setConfig(prev => ({ ...prev, chimeEnabled: !prev.chimeEnabled }))}
                  className="w-8 h-8 flex items-center justify-center bg-[#000]/60 backdrop-blur-xl rounded-full border border-[#D4AF37]/15"
                  title={config.chimeEnabled ? "关闭禅音" : "开启禅音"}
                >
                  {config.chimeEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
                </button>
                <button
                  onClick={handleExportFlowerImage}
                  className="w-8 h-8 flex items-center justify-center bg-[#000]/60 backdrop-blur-xl rounded-full border border-[#D4AF37]/15"
                  title="保存花卉图片"
                >
                  <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>
                <button
                  onClick={handleShareFlower}
                  className="w-8 h-8 flex items-center justify-center bg-[#000]/60 backdrop-blur-xl rounded-full border border-[#D4AF37]/15"
                  title="分享花卉"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>
                <button
                  onClick={handleTriggerDrawing}
                  className="w-8 h-8 flex items-center justify-center bg-[#000]/60 backdrop-blur-xl rounded-full border border-[#D4AF37]/15"
                >
                  <RotateCw className={`w-3.5 h-3.5 text-[#D4AF37] ${config.isDrawing ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Drawing Progress Bar */}
              <AnimatePresence>
                {config.isDrawing && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-14 left-6 right-6 z-25 flex flex-col items-center gap-1"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/90 font-serif font-medium flex items-center gap-1 animate-pulse">
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        描摹中...
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#D4AF37]">{Math.round(drawingProgress)}%</span>
                    </div>
                    <div className="w-full h-[3px] bg-[#050505]/60 rounded-full relative overflow-visible">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-600 via-[#D4AF37] to-yellow-200 rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_#ffd700]"
                        style={{ width: `${drawingProgress}%` }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <BaoxiangFlower 
                config={config} 
                presetColors={currentPreset.colors} 
                gradientColors={currentPreset.gradientColors}
                soundScale={currentPreset.soundScale}
                isMobile={true}
              />
            </div>

            {/* Touch hint */}
            <p className="text-center text-[11px] text-gray-400 mt-2 px-4 leading-relaxed">
              轻触花瓣唤醒金色涟漪与五音共鸣
            </p>
          </div>

          {/* Bottom Sheet Content Area - Scrolls */}
          <div className="flex-1 ios-scroll px-4 pb-4 pt-2">
            {/* Active Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'design' && (
                <motion.div
                  key="design-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <ControlPanel config={config} onChange={handleConfigChange} onTriggerDrawing={handleTriggerDrawing} onUndo={handleUndo} hasHistory={configHistory.length > 0} isMobile={true} />
                </motion.div>
              )}

              {activeTab === 'narrative' && (
                <motion.div
                  key="narrative-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <CulturalInfo isMobile={true} />
                </motion.div>
              )}

              {activeTab === 'scroll' && (
                <motion.div
                  key="scroll-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderScrollTab(true)}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spacer for tab bar */}
            <div className="h-24" />
          </div>

          {/* iOS-style Bottom Tab Bar */}
          <MobileTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}

      {/* ================= MODAL: TRADITIONAL CALLIGRAPHY SCROLL CARD ================= */}
      <ScrollCardModal
        isOpen={isScrollModalOpen}
        onClose={() => setIsScrollModalOpen(false)}
        isMobile={isMobile}
        config={config}
        currentPreset={currentPreset}
        recipientName={recipientName}
        blessingTheme={blessingTheme}
        poem={activeScroll.poem}
        translation={activeScroll.translation}
        artist={activeScroll.artist}
        toastMessage={toastMessage}
        inkBleeds={inkBleeds}
        templateId={scrollTemplateId}
        onScrollClick={handleScrollClick}
        onExport={handleExportScrollCard}
      />

    </div>
  );
}
