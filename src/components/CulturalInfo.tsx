import React, { useState } from 'react';
import { BookOpen, Star, Sparkles, Feather, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SectionId = 'meaning' | 'composition' | 'geometry' | 'craft';

export default function CulturalInfo() {
  const [activeTab, setActiveTab] = useState<SectionId>('meaning');

  const tabs = [
    { id: 'meaning', label: '何为“宝相”', icon: BookOpen },
    { id: 'composition', label: '合相之美', icon: Star },
    { id: 'geometry', label: '几何之序', icon: Compass },
    { id: 'craft', label: '泥金流彩', icon: Feather }
  ] as const;

  const content = {
    meaning: {
      title: '“宝相”之称的庄严内涵',
      subtitle: '万物吉祥之华，神圣端庄之相',
      paragraphs: [
        '“宝相”一词源自佛教术语，原指佛祖、菩萨等神圣庄严的面相与法身（即“宝相庄严”）。在唐代艺术繁盛时期，工匠们将这种神圣与世俗的审美相融合，创造出一种完美契合庄严与富丽的理想花卉图案，遂得名“宝相花”。',
        '宝相花并非真实存在的自然植物，而是一种“想象中的百花之王”。它超越了时空的限制，代表了人们心目中一切吉祥、圆满、纯净与繁荣的最高视觉图腾。它盛行于隋唐，并被广泛应用于金银器、瓷器、丝织品以及敦煌莫高窟的壁画中。'
      ],
      highlights: ['佛光庄严', '融汇百家', '千古图腾']
    },
    composition: {
      title: '诸花合一的吉祥意象',
      subtitle: '荷花之纯、牡丹之贵、石榴之茂',
      paragraphs: [
        '宝相花是最著名的“合相纹样”。它巧妙地将自然界中多种具有吉祥寓意的植物花果融于一身，取其神骨，避其局限：',
        '它的花冠主体多源自【荷花/莲花】，代表佛家的纯洁清净与“出淤泥而不染”的禅意风骨；它的花瓣肥硕、多层叠放，汲取了【牡丹】的雍容华贵，寄托着世俗对富贵昌盛的期许；而其核心点缀的饱满花蕊，则吸收了【石榴】多子多福、生生不息的繁衍特征。这种完美的植物融合展现了东方文化“万物包容、和合共生”的核心哲学。'
      ],
      highlights: ['圣莲清净', '富贵国色', '生生不息']
    },
    geometry: {
      title: '宇宙对称的圆满秩序',
      subtitle: '中轴对称，多维散射的宇宙视界',
      paragraphs: [
        '在结构上，宝相花展现出惊人的几何严谨性。它以中央莲蓬（花心）为原点，向四周呈多重对称、层层递进的径向发散。最经典的为【八瓣对称】，呼应佛教的“八宝吉祥”与“八正道”；亦有六、十、十二或十六对称。',
        '这种“圆轮状”的同心圆结构不仅代表了视觉上的中正平衡，更呼应了天圆地方、宇宙生生不息的自然秩序。层层嵌套的内瓣与外瓣、含苞欲放的缠枝花蕊交错相生，形成了一座微型的宇宙几何宫殿，给观者以平静、和谐的心理秩序暗示。'
      ],
      highlights: ['中正平衡', '同心圆融', '宇宙秩序']
    },
    craft: {
      title: '描金勾勒与矿彩流光',
      subtitle: '流光溢彩的泥金技艺与莫高窟之美',
      paragraphs: [
        '极尽工巧的勾勒是宝相花生命力的源泉。在敦煌莫高窟壁画与古代鎏金器皿中，宝相花之所以历经千年仍熠熠生辉，得益于【泥金】与【矿彩】的完美搭档。',
        '工匠们以细腻的“金线”勾勒出花叶细密的筋脉，起到“界色”作用，使各色矿物颜料（石青、朱砂、绿松石）互不侵染、边界分明。同时，阳光或烛光下，这些金色线条会反射出高贵的金属光泽，配合渐变的晕染，使整朵宝相花在昏暗的洞窟中如同宝石般“流光溢彩”，浮动着一层超脱世俗的灵动神韵。'
      ],
      highlights: ['泥金界色', '矿物重彩', '光影浮动']
    }
  };

  return (
    <div className="bg-[#09090b]/90 backdrop-blur-xl border border-[#D4AF37]/25 rounded-2xl p-6 shadow-2xl text-gray-200">
      <div className="flex items-center gap-2 text-[#D4AF37] font-medium mb-4 font-serif">
        <BookOpen className="w-5 h-5 animate-pulse" />
        <span className="text-base tracking-wider font-semibold">宝相华美学小传</span>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#D4AF37]/15 pb-2 overflow-x-auto gap-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                active 
                  ? 'text-[#D4AF37] bg-[#D4AF37]/10 border-b-2 border-[#D4AF37] rounded-b-none' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#D4AF37]/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Canvas */}
      <div className="mt-4 min-h-[220px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-base font-bold text-gray-100 flex items-center gap-2 font-serif">
                {content[activeTab].title}
                <Sparkles className="w-4 h-4 text-[#D4AF37]/80" />
              </h3>
              <p className="text-xs text-[#D4AF37]/80 font-mono mt-0.5">{content[activeTab].subtitle}</p>
            </div>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed font-sans">
              {content[activeTab].paragraphs.map((p, index) => (
                <p key={index} className="indent-6 text-justify">{p}</p>
              ))}
            </div>

            {/* highlights */}
            <div className="flex gap-2 pt-2">
              {content[activeTab].highlights.map((h, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 text-[10px] font-medium text-[#D4AF37] bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-full shadow-[inset_0_1px_2px_rgba(254,240,138,0.05)]"
                >
                  ✦ {h}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
