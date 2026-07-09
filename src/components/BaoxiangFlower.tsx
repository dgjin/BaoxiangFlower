import React, { useRef, useEffect, useState } from 'react';
import { FlowerConfig, Particle } from '../types';
import { playChime } from '../utils/ZenChime';
import { motion } from 'motion/react';

interface FlowerShapePaths {
  outerPath: string;
  outerAccentPath: string;
  innerPath: string;
  innerInlayPath: string;
}

export const FLOWER_SHAPES: Record<string, FlowerShapePaths> = {
  classic: {
    // 经典宝相花：端庄富丽、曲直相生
    outerPath: "M 0 0 C -25 -30, -50 -80, -25 -145 C -12 -165, -5 -185, 0 -195 C 5 -185, 12 -165, 25 -145 C 50 -80, 25 -30, 0 0 Z",
    outerAccentPath: "M 0 -20 C -15 -45, -30 -85, -12 -135 C -6 -148, -2 -160, 0 -168 C 2 -160, 6 -148, 12 -135 C 30 -85, 15 -45, 0 -20 Z",
    innerPath: "M 0 0 C -30 -15, -42 -55, -20 -105 C -10 -120, 10 -120, 20 -105 C 42 -55, 30 -15, 0 0 Z",
    innerInlayPath: "M 0 -20 C -15 -35, -20 -60, -10 -85 C -5 -92, 5 -92, 10 -85 C 20 -60, 15 -35, 0 -20 Z"
  },
  rounded: {
    // 盛唐妙音团花：丰满圆润、雍容华美
    outerPath: "M 0 0 C -35 -20, -60 -60, -55 -125 C -50 -155, -30 -175, 0 -185 C 30 -175, 50 -155, 55 -125 C 60 -60, 35 -20, 0 0 Z",
    outerAccentPath: "M 0 -20 C -25 -35, -40 -65, -35 -110 C -30 -130, -15 -145, 0 -152 C 15 -145, 30 -130, 35 -110 C 40 -65, 25 -35, 0 -20 Z",
    innerPath: "M 0 0 C -25 -10, -45 -40, -35 -90 C -25 -105, 25 -105, 35 -90 C 45 -40, 25 -10, 0 0 Z",
    innerInlayPath: "M 0 -15 C -15 -25, -25 -45, -15 -70 C -5 -80, 5 -80, 15 -70 C 25 -45, 15 -25, 0 -15 Z"
  },
  lotus: {
    // 敦煌千叶莲华：清雅高洁、空灵禅意
    outerPath: "M 0 0 C -20 -30, -35 -90, -15 -155 C -10 -170, -3 -195, 0 -205 C 3 -195, 10 -170, 15 -155 C 35 -90, 20 -30, 0 0 Z",
    outerAccentPath: "M 0 -20 C -12 -45, -22 -85, -10 -135 C -6 -145, -2 -158, 0 -165 C 2 -158, 6 -145, 12 -135 C 22 -85, 12 -45, 0 -20 Z",
    innerPath: "M 0 0 C -18 -15, -28 -55, -12 -110 C -8 -120, 8 -120, 12 -110 C 28 -55, 18 -15, 0 0 Z",
    innerInlayPath: "M 0 -20 C -10 -30, -15 -60, -5 -85 C -2 -90, 2 -90, 5 -85 C 15 -60, 10 -30, 0 -20 Z"
  },
  ruyi: {
    // 如意瑞云仙花：流转飘逸、祥云瑞气
    outerPath: "M 0 0 C -35 -10, -50 -50, -45 -100 C -40 -125, -55 -155, -25 -170 C -12 -175, -5 -180, 0 -180 C 5 -180, 12 -175, 25 -170 C 55 -155, 40 -125, 45 -100 C 50 -50, 35 -10, 0 0 Z",
    outerAccentPath: "M 0 -15 C -20 -25, -30 -55, -25 -85 C -22 -100, -32 -120, -15 -130 C -8 -135, -3 -138, 0 -138 C 3 -138, 8 -135, 15 -130 C 32 -120, 22 -100, 25 -85 C 30 -55, 20 -25, 0 -15 Z",
    innerPath: "M 0 0 C -35 -10, -35 -45, -25 -80 C -35 -90, -20 -115, 0 -110 C 20 -115, 35 -90, 25 -80 C 35 -45, 35 -10, 0 0 Z",
    innerInlayPath: "M 0 -15 C -15 -25, -25 -45, -20 -65 C -25 -75, -10 -85, 0 -85 C 10 -85, 25 -75, 20 -65 C 25 -45, 15 -25, 0 -15 Z"
  }
};

interface BaoxiangFlowerProps {
  config: FlowerConfig;
  presetColors: {
    bg: string;
    center: string;
    inner: string;
    outer: string;
    backgroundAura: string;
    goldLine: string;
  };
  gradientColors: string[];
  soundScale: string[];
  isMobile?: boolean;
}

export default function BaoxiangFlower({
  config,
  presetColors,
  gradientColors,
  soundScale,
  isMobile = false,
}: BaoxiangFlowerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastChimeTime = useRef<number>(0);
  const particleIdCounter = useRef<number>(0);

  const [gradientAngle, setGradientAngle] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);

  // States for interactive click ripples and petal saturation enhancement
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [activeOuterPetals, setActiveOuterPetals] = useState<Record<number, number>>({});
  const [activeInnerPetals, setActiveInnerPetals] = useState<Record<number, number>>({});
  const rippleIdCounter = useRef<number>(0);

  // Pinch-to-zoom state
  const [pinchScale, setPinchScale] = useState(1);
  const initialPinchDistance = useRef<number>(0);
  const initialPinchScale = useRef<number>(1);

  // Active color choices (allowing custom over preset)
  const outerColor = config.renderingMode === 'gold-only' ? 'transparent' : (config.customColors.outer || presetColors.outer);
  const innerColor = config.renderingMode === 'gold-only' ? 'transparent' : (config.customColors.inner || presetColors.inner);
  const centerColor = config.renderingMode === 'gold-only' ? 'transparent' : (config.customColors.center || presetColors.center);
  const goldStrokeColor = config.renderingMode === 'gradient-only' ? 'transparent' : presetColors.goldLine;

  const paths = FLOWER_SHAPES[config.flowerType] || FLOWER_SHAPES.classic;

  // 1. requestAnimationFrame for continuous animations (gradient flow, rotation, breathing pulse)
  // Pauses when page is not visible to save battery/CPU
  useEffect(() => {
    let animId: number;
    let localRotation = 0;
    let pulseTime = 0;
    let localAngle = 0;
    let isPageVisible = true;

    const handleVisibility = () => {
      isPageVisible = document.visibilityState === 'visible';
      if (isPageVisible && !animId) {
        animId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const animate = () => {
      if (!isPageVisible) {
        animId = 0;
        return;
      }

      // Rotate the gradients inside petals (Flowing Radiance)
      if (config.flowSpeed > 0) {
        localAngle = (localAngle + config.flowSpeed * 0.18) % 360;
        setGradientAngle(localAngle);
      }

      // Continuous rotation of the entire flower
      if (config.rotationSpeed > 0) {
        localRotation = (localRotation + config.rotationSpeed * 0.04) % 360;
        setRotationAngle(localRotation);
      }

      // Breathing / Pulsing scale animation
      if (config.pulseSpeed > 0) {
        pulseTime += config.pulseSpeed * 0.015;
        // Pulse between 0.97 and 1.03
        const nextScale = 1 + Math.sin(pulseTime) * 0.035;
        setPulseScale(nextScale);
      } else {
        setPulseScale(1);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [config.flowSpeed, config.rotationSpeed, config.pulseSpeed]);

  // 2. Canvas particle simulation (radiating light beams from center, like the reference animation)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isPageVisible = true;

    const handleVisibility = () => {
      isPageVisible = document.visibilityState === 'visible';
      if (isPageVisible && !animId) {
        animId = requestAnimationFrame(updateParticles);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Radiating beams and star particles from the center flower
    const beams: Array<{
      id: number;
      x: number;
      y: number;
      angle: number;
      speed: number;
      length: number;
      width: number;
      life: number;
      maxLife: number;
      color: string;
      type: 'beam' | 'star' | 'dot';
      size: number;
      wobble: number;
    }> = [];

    const centerX = () => canvas.width / 2;
    const centerY = () => canvas.height / 2;

    const drawBeam = (b: typeof beams[0]) => {
      const alpha = b.life / b.maxLife;
      const tailX = b.x - Math.cos(b.angle) * b.length * (1 - alpha * 0.3);
      const tailY = b.y - Math.sin(b.angle) * b.length * (1 - alpha * 0.3);

      const grad = ctx.createLinearGradient(tailX, tailY, b.x, b.y);
      grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
      grad.addColorStop(0.4, `rgba(255, 242, 163, ${alpha * 0.5})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.9})`);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = grad;
      ctx.lineWidth = b.width;
      ctx.lineCap = 'round';
      ctx.shadowBlur = b.width * 4;
      ctx.shadowColor = b.color;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();
    };

    const drawStar = (b: typeof beams[0]) => {
      const alpha = b.life / b.maxLife;
      const r = b.size;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = b.color;
      ctx.shadowBlur = r * 3;
      ctx.shadowColor = b.color;
      ctx.translate(b.x, b.y);
      ctx.rotate(b.wobble);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        ctx.moveTo(b.x, b.y - r);
        ctx.quadraticCurveTo(b.x, b.y, b.x + r, b.y);
        ctx.quadraticCurveTo(b.x, b.y, b.x, b.y + r);
        ctx.quadraticCurveTo(b.x, b.y, b.x - r, b.y);
        ctx.quadraticCurveTo(b.x, b.y, b.x, b.y - r);
      }
      ctx.fill();
      ctx.restore();
    };

    const drawDot = (b: typeof beams[0]) => {
      const alpha = b.life / b.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = b.color;
      ctx.shadowBlur = b.size * 2.5;
      ctx.shadowColor = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const spawnBeam = () => {
      const angle = Math.random() * Math.PI * 2;
      const innerRadius = Math.random() * 60 + 40; // start near the flower edge
      const speed = Math.random() * 2.5 + 1.5;
      const colors = ['#FFF2A3', '#D4AF37', '#FFFFFF', '#FFE066', '#E8E8E8'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      beams.push({
        id: particleIdCounter.current++,
        x: centerX() + Math.cos(angle) * innerRadius,
        y: centerY() + Math.sin(angle) * innerRadius,
        angle,
        speed,
        length: Math.random() * 120 + 80,
        width: Math.random() * 1.2 + 0.3,
        life: Math.floor(Math.random() * 60 + 60),
        maxLife: 120,
        color,
        type: 'beam',
        size: 0,
        wobble: Math.random() * Math.PI,
      });
    };

    const spawnStar = () => {
      const angle = Math.random() * Math.PI * 2;
      const innerRadius = Math.random() * 80 + 30;
      const speed = Math.random() * 1.2 + 0.6;
      const colors = ['#FFFFFF', '#FFF2A3', '#FFD700', '#E8E8E8'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      beams.push({
        id: particleIdCounter.current++,
        x: centerX() + Math.cos(angle) * innerRadius,
        y: centerY() + Math.sin(angle) * innerRadius,
        angle,
        speed,
        length: 0,
        width: 0,
        life: Math.floor(Math.random() * 80 + 50),
        maxLife: 130,
        color,
        type: 'star',
        size: Math.random() * 2.5 + 1,
        wobble: Math.random() * Math.PI * 2,
      });
    };

    const spawnDot = () => {
      const angle = Math.random() * Math.PI * 2;
      const innerRadius = Math.random() * 120 + 40;
      const speed = Math.random() * 0.8 + 0.3;
      const colors = ['#FFFFFF', '#FFF2A3', '#F0F0F0'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      beams.push({
        id: particleIdCounter.current++,
        x: centerX() + Math.cos(angle) * innerRadius,
        y: centerY() + Math.sin(angle) * innerRadius,
        angle,
        speed,
        length: 0,
        width: 0,
        life: Math.floor(Math.random() * 100 + 60),
        maxLife: 160,
        color,
        type: 'dot',
        size: Math.random() * 1.5 + 0.5,
        wobble: 0,
      });
    };

    const updateParticles = () => {
      if (!isPageVisible) {
        animId = 0;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // performance guard: cap maximum concurrent particles on mobile to maintain 60 FPS
      const maxParticles = isMobile ? 45 : 120;
      if (beams.length > maxParticles) {
        beams.splice(0, beams.length - maxParticles);
      }

      for (let i = beams.length - 1; i >= 0; i--) {
        const b = beams[i];
        b.life -= 1;

        // Move outward along the angle
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;
        b.wobble += 0.02;

        if (b.life <= 0) {
          beams.splice(i, 1);
          continue;
        }

        if (b.type === 'beam') drawBeam(b);
        else if (b.type === 'star') drawStar(b);
        else drawDot(b);
      }

      // Spawn ambient radiating beams and particles
      const densityFactor = config.particleDensity;
      if (Math.random() < 0.12 * densityFactor) spawnBeam();
      if (Math.random() < 0.18 * densityFactor) spawnStar();
      if (Math.random() < 0.25 * densityFactor) spawnDot();

      animId = requestAnimationFrame(updateParticles);
    };

    updateParticles();
    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [gradientColors, config.particleDensity, isMobile]);

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !containerRef.current) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // 3. User interaction handler (Mouse movement and touch spark trigger)
  const handleInteraction = (clientX: number, clientY: number, isTap = false) => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only trigger if inside the active flower area
    if (distance < 240) {
      // Play Zen Chime dynamically mapped to cursor distance
      const now = Date.now();
      const throttleTime = isTap ? 50 : 250; // allow tap to chime immediately
      if (config.chimeEnabled && now - lastChimeTime.current > throttleTime) {
        // Map distance to note index (closer to center = higher note, further = lower note)
        const noteIndex = Math.min(
          soundScale.length - 1,
          Math.max(0, Math.floor((1 - distance / 240) * soundScale.length))
        );
        playChime(soundScale[noteIndex]);
        lastChimeTime.current = now;
      }

      // Spawn bursts of sparkles!
      const count = isTap ? config.particleDensity * 4 + 8 : config.particleDensity * 0.8 + 1;
      const particles = particlesRef.current;

      for (let i = 0; i < count; i++) {
        const spreadAngle = Math.random() * Math.PI * 2;
        const speed = isTap ? Math.random() * 3 + 1.5 : Math.random() * 1.5 + 0.5;
        
        particles.push({
          id: particleIdCounter.current++,
          x,
          y,
          vx: Math.cos(spreadAngle) * speed + (dx / distance) * 0.5,
          vy: Math.sin(spreadAngle) * speed + (dy / distance) * 0.5,
          size: Math.random() * 4 + 2,
          color: isTap ? '#FFFFFF' : (gradientColors[Math.floor(Math.random() * gradientColors.length)] || '#FFD700'),
          alpha: 1,
          life: Math.floor(Math.random() * 50) + 40,
          maxLife: 90
        });
      }

      // 3.8. Gilded Zen Ripple and Local Petal Saturation Enhancement on click/tap
      if (isTap) {
        const rectWidth = rect.width;
        const rectHeight = rect.height;

        // Map click coords into the unrotated SVG viewBox [-250, 250]
        const svgX = (x / rectWidth) * 500 - 250;
        const svgY = (y / rectHeight) * 500 - 250;
        const svgDistance = Math.sqrt(svgX * svgX + svgY * svgY);

        // Push a new golden ripple
        const rippleId = rippleIdCounter.current++;
        setRipples(prev => [...prev, { id: rippleId, x: svgX, y: svgY }]);
        
        // Remove the ripple after 1.5 seconds (completion of wave)
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== rippleId));
        }, 1500);

        // Calculate exact radial angle relative to the center
        const clickedAngleRad = Math.atan2(svgY, svgX);
        let clickedAngleDeg = (clickedAngleRad * 180) / Math.PI;
        clickedAngleDeg = (clickedAngleDeg + 360) % 360;

        // Compensate for active rotation of the SVG flower to locate correct physical petal
        const localClickedAngle = (clickedAngleDeg - rotationAngle + 360) % 360;
        const petalAngleWidth = 360 / config.petalCount;

        // Select petal ring layer by radius
        if (svgDistance >= 100 && svgDistance <= 220) {
          // Outer petal ring
          const outerPetalIndex = Math.round(localClickedAngle / petalAngleWidth) % config.petalCount;
          const clickTimeId = Date.now();
          setActiveOuterPetals(prev => ({ ...prev, [outerPetalIndex]: clickTimeId }));
          
          setTimeout(() => {
            setActiveOuterPetals(prev => {
              if (prev[outerPetalIndex] === clickTimeId) {
                const next = { ...prev };
                delete next[outerPetalIndex];
                return next;
              }
              return prev;
            });
          }, 800);
        } else if (svgDistance >= 35 && svgDistance < 100) {
          // Inner petal ring (offset by 0.5 indices)
          const innerPetalIndex = Math.floor(localClickedAngle / petalAngleWidth) % config.petalCount;
          const clickTimeId = Date.now();
          setActiveInnerPetals(prev => ({ ...prev, [innerPetalIndex]: clickTimeId }));
          
          setTimeout(() => {
            setActiveInnerPetals(prev => {
              if (prev[innerPetalIndex] === clickTimeId) {
                const next = { ...prev };
                delete next[innerPetalIndex];
                return next;
              }
              return prev;
            });
          }, 800);
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handleInteraction(e.clientX, e.clientY, false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      // Pinch-to-zoom: record initial distance
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDistance.current = Math.sqrt(dx * dx + dy * dy);
      initialPinchScale.current = pinchScale;
    } else if (e.touches.length === 1) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY, true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && initialPinchDistance.current > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const scaleChange = distance / initialPinchDistance.current;
      const newScale = Math.max(0.5, Math.min(3, initialPinchScale.current * scaleChange));
      setPinchScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    // Reset pinch tracking
    initialPinchDistance.current = 0;
    // Smoothly return to normal scale
    setTimeout(() => {
      setPinchScale(1);
    }, 200);
  };

  const handleDoubleClick = () => {
    // Toggle zoom on double-click (desktop)
    setPinchScale(prev => prev > 1 ? 1 : 2);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleInteraction(e.clientX, e.clientY, true);
  };

  // Precalculate petal indices for rendering
  const petalIndices = Array.from({ length: config.petalCount }, (_, i) => i);

  // Math helper for linear gradient rotation vector
  const rad = (gradientAngle * Math.PI) / 180;
  const x1 = 50 + 50 * Math.cos(rad);
  const y1 = 50 + 50 * Math.sin(rad);
  const x2 = 50 + 50 * Math.cos(rad + Math.PI);
  const y2 = 50 + 50 * Math.sin(rad + Math.PI);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square max-w-[500px] mx-auto select-none overflow-hidden flex items-center justify-center bg-radial from-[rgba(26,18,22,0.4)] to-transparent ${config.showDecorRing ? '' : 'rounded-full'}`}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      style={{ cursor: pinchScale > 1 ? 'zoom-out' : 'pointer' }}
    >
      {/* Background radial soft light halo with stronger breathing glow */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${presetColors.backgroundAura}dd 0%, ${presetColors.backgroundAura}44 35%, transparent 70%)`,
          transform: `scale(${pulseScale * 1.15})`,
          opacity: config.renderingMode === 'gold-only' ? 0.2 : 0.95,
        }}
      />

      {/* Main SVG Render Layer */}
      <svg
        id="baoxiang-svg"
        viewBox="-250 -250 500 500"
        className="w-full h-full overflow-visible pointer-events-none drop-shadow-2xl"
        style={{
          transform: `rotate(${rotationAngle}deg) scale(${pulseScale * pinchScale})`,
          transition: config.rotationSpeed === 0 ? 'transform 1s ease-out' : 'none',
        }}
      >
        <defs>
          {/* Master Dynamic Light Flow Gradient */}
          <linearGradient id="flow-grad" x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}>
            <stop offset="0%" stopColor={outerColor} />
            <stop offset="35%" stopColor={innerColor} />
            <stop offset="70%" stopColor={centerColor} />
            <stop offset="100%" stopColor={outerColor} />
          </linearGradient>

          {/* Core Metallic Golden Lines Gradient */}
          <linearGradient id="gold-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F9A825" />
            <stop offset="85%" stopColor="#AA7C11" />
            <stop offset="100%" stopColor="#FFF2A3" />
          </linearGradient>

          {/* Radial Stamen Core Gradient */}
          <radialGradient id="stamen-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF" stopOpacity="1" />
            <stop offset="40%" stopColor="#FFE066" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
          </radialGradient>

          {/* Heavy Glow Filter for Celestial Halo */}
          <filter id="zen-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={3 + config.glowIntensity * 1.5} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {config.showDecorRing && (
          <g id="decorative-ring-frame" opacity={config.renderingMode === 'gradient-only' ? 0.9 : 1}>
            {/* Outer gold ring */}
            <circle
              r="215"
              fill="none"
              stroke="url(#gold-line-grad)"
              strokeWidth={config.outlineWidth * 1.8}
              opacity={0.9}
              className={config.isDrawing ? 'animate-draw' : ''}
            />
            {/* Inner teal ring */}
            <circle
              r="180"
              fill="none"
              stroke={innerColor}
              strokeWidth={config.outlineWidth * 1.2}
              opacity={0.75}
              className={config.isDrawing ? 'animate-draw' : ''}
            />
            {/* Dotted bead pattern between rings */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = i * 15;
              const beadRadius = 197;
              return (
                <circle
                  key={`ring-bead-${i}`}
                  cx={Math.cos((angle * Math.PI) / 180) * beadRadius}
                  cy={Math.sin((angle * Math.PI) / 180) * beadRadius}
                  r={2.2}
                  fill={i % 2 === 0 ? goldStrokeColor : innerColor}
                  opacity={0.85}
                />
              );
            })}
            {/* Subtle corner scroll motifs */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = i * 45;
              return (
                <circle
                  key={`ring-dot-${i}`}
                  cx={Math.cos((angle * Math.PI) / 180) * 165}
                  cy={Math.sin((angle * Math.PI) / 180) * 165}
                  r={3.5}
                  fill={goldStrokeColor}
                  opacity={0.7}
                />
              );
            })}
          </g>
        )}

        {/* ================= LAYER 1: OUTER FLAME PETALS (火焰外瓣) ================= */}
        <g id="outer-petals">
          {petalIndices.map((i) => {
            const angle = i * (360 / config.petalCount);
            const duration = 5.2 + (i % 3) * 1.1;
            const delay = i * -0.73;
            const isActive = activeOuterPetals[i] !== undefined;
            return (
              <g key={`outer-${i}`} transform={`rotate(${angle})`}>
                <g 
                  className="animate-petal-breeze" 
                  style={{ 
                    animationDuration: `${duration}s`, 
                    animationDelay: `${delay}s` 
                  }}
                >
                  <motion.g
                    animate={{
                      filter: isActive 
                        ? 'saturate(2.2) brightness(1.35) drop-shadow(0 0 12px rgba(212,175,55,0.7))' 
                        : 'saturate(1) brightness(1) drop-shadow(0 0 0px rgba(0,0,0,0))',
                      scale: isActive ? 1.04 : 1
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ transformOrigin: "0px 0px" }}
                  >
                    {/* Petal fill with animated flow-grad */}
                    <path
                      d={paths.outerPath}
                      fill="url(#flow-grad)"
                      opacity="0.85"
                    />
                    {/* Secondary accent overlay within petal */}
                    <path
                      d={paths.outerAccentPath}
                      fill="url(#flow-grad)"
                      opacity="0.5"
                      style={{ mixBlendMode: 'screen' }}
                    />
                    {/* Dynamic golden borders drawing */}
                    <path
                      d={paths.outerPath}
                      fill="none"
                      stroke={goldStrokeColor}
                      strokeWidth={config.outlineWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={config.isDrawing ? 'animate-draw' : ''}
                    />
                  </motion.g>
                </g>
              </g>
            );
          })}
        </g>

        {/* ================= LAYER 2: INTERLACED STAMENS (缠枝花蕊) ================= */}
        <g id="floral-stamens">
          {petalIndices.map((i) => {
            // Rotated to stand in-between the outer petals
            const angle = (i + 0.5) * (360 / config.petalCount);
            const duration = 4.5 + ((i + 1) % 3) * 0.8;
            const delay = i * -0.59;
            return (
              <g key={`stamen-${i}`} transform={`rotate(${angle})`} opacity="0.9">
                <g
                  className="animate-petal-breeze"
                  style={{
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`
                  }}
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="-130"
                    stroke="url(#gold-line-grad)"
                    strokeWidth={config.outlineWidth * 0.7}
                    strokeDasharray="4, 1"
                    className={config.isDrawing ? 'animate-draw' : ''}
                  />
                  {/* Stamen beads/dots */}
                  <circle
                    cx="0"
                    cy="-130"
                    r="5"
                    fill="url(#gold-line-grad)"
                    filter="url(#zen-glow)"
                  />
                  <circle
                    cx="0"
                    cy="-130"
                    r="2"
                    fill="#FFFFFF"
                  />
                </g>
              </g>
            );
          })}
        </g>

        {/* ================= LAYER 3: INNER RUYI CLOUD PETALS (如意内瓣) ================= */}
        <g id="inner-petals">
          {petalIndices.map((i) => {
            const angle = (i + 0.5) * (360 / config.petalCount);
            const duration = 4.8 + ((i + 2) % 3) * 1.0;
            const delay = i * -0.81;
            const isActive = activeInnerPetals[i] !== undefined;
            return (
              <g key={`inner-${i}`} transform={`rotate(${angle})`}>
                <g
                  className="animate-petal-breeze"
                  style={{
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`
                  }}
                >
                  <motion.g
                    animate={{
                      filter: isActive 
                        ? 'saturate(2.2) brightness(1.35) drop-shadow(0 0 12px rgba(212,175,55,0.7))' 
                        : 'saturate(1) brightness(1) drop-shadow(0 0 0px rgba(0,0,0,0))',
                      scale: isActive ? 1.05 : 1
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ transformOrigin: "0px 0px" }}
                  >
                    {/* Background color offset fill */}
                    <path
                      d={paths.innerPath}
                      fill={innerColor}
                      opacity="0.9"
                    />
                    <path
                      d={paths.innerPath}
                      fill="url(#flow-grad)"
                      opacity="0.4"
                      style={{ mixBlendMode: 'overlay' }}
                    />
                    {/* Traditional Ruyi cloud curve inlay */}
                    <path
                      d={paths.innerInlayPath}
                      fill="none"
                      stroke={goldStrokeColor}
                      strokeWidth={config.outlineWidth * 0.8}
                      className={config.isDrawing ? 'animate-draw' : ''}
                    />
                    {/* Golden Outline */}
                    <path
                      d={paths.innerPath}
                      fill="none"
                      stroke={goldStrokeColor}
                      strokeWidth={config.outlineWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={config.isDrawing ? 'animate-draw' : ''}
                    />
                  </motion.g>
                </g>
              </g>
            );
          })}
        </g>

        {/* ================= LAYER 4: INTERNAL STAR RING (内圈花蕊饰纹) ================= */}
        <g opacity="0.8">
          <circle
            r="60"
            fill="none"
            stroke="url(#gold-line-grad)"
            strokeWidth={config.outlineWidth * 0.6}
            strokeDasharray="4, 5"
          />
          {petalIndices.map((i) => {
            const angle = i * (360 / config.petalCount);
            return (
              <g key={`bead-${i}`} transform={`rotate(${angle})`}>
                <circle
                  cx="0"
                  cy="-60"
                  r="3.5"
                  fill="url(#gold-line-grad)"
                />
              </g>
            );
          })}
        </g>

        {/* ================= LAYER 5: AUSPICIOUS FLOWER CORE (宝相花心) ================= */}
        <g id="flower-core" filter="url(#zen-glow)">
          {/* Outermost core ring */}
          <circle
            r="42"
            fill={centerColor}
            stroke="url(#gold-line-grad)"
            strokeWidth={config.outlineWidth}
          />
          {/* Golden flower crown seed core */}
          <circle
            r="32"
            fill="url(#flow-grad)"
            stroke="url(#gold-line-grad)"
            strokeWidth={config.outlineWidth * 0.8}
            className={config.isDrawing ? 'animate-draw' : ''}
          />
          {/* Auspicious geometric lines (Tang 宝相八川纹) */}
          {Array.from({ length: Math.max(6, config.petalCount) }).map((_, i) => {
            const angle = i * (360 / Math.max(6, config.petalCount));
            return (
              <line
                key={`core-line-${i}`}
                x1="0"
                y1="0"
                x2="0"
                y2="-32"
                transform={`rotate(${angle})`}
                stroke="url(#gold-line-grad)"
                strokeWidth={config.outlineWidth * 0.6}
                opacity="0.8"
              />
            );
          })}
          {/* Center Ruyi jewel seed */}
          <circle
            r="10"
            fill="url(#stamen-glow)"
            stroke="url(#gold-line-grad)"
            strokeWidth="1.2"
          />
          <circle
            r="4"
            fill="#FFFFFF"
          />
        </g>
      </svg>

      {/* Overlay Canvas for Sparkling Interactive Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Ripple SVG Overlay (Unrotated, centered, matching main SVG scale) */}
      <svg
        id="ripple-svg"
        viewBox="-250 -250 500 500"
        className="absolute inset-0 w-11/12 h-11/12 m-auto overflow-visible pointer-events-none z-20"
        style={{
          transform: `scale(${pulseScale * pinchScale})`,
        }}
      >
        <defs>
          <radialGradient id="ripple-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFE066" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
        </defs>

        {ripples.map((ripple) => (
          <g key={ripple.id}>
            {/* Outer golden ring ripple */}
            <motion.circle
              cx={ripple.x}
              cy={ripple.y}
              initial={{ r: 0, opacity: 0.95, strokeWidth: 2.2 }}
              animate={{ r: 110, opacity: 0, strokeWidth: 0.5 }}
              transition={{ duration: 1.4, ease: [0.1, 0.8, 0.2, 1] }}
              fill="none"
              stroke="url(#gold-line-grad)"
            />
            {/* Secondary delayed soft glow ring */}
            <motion.circle
              cx={ripple.x}
              cy={ripple.y}
              initial={{ r: 0, opacity: 0.6, strokeWidth: 5 }}
              animate={{ r: 85, opacity: 0, strokeWidth: 1 }}
              transition={{ duration: 1.1, delay: 0.1, ease: "easeOut" }}
              fill="none"
              stroke="#FFE066"
              filter="url(#zen-glow)"
            />
            {/* Soft expanding filled core glow */}
            <motion.circle
              cx={ripple.x}
              cy={ripple.y}
              initial={{ r: 0, opacity: 0.45 }}
              animate={{ r: 50, opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              fill="url(#ripple-glow)"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
