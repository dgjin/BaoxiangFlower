import React from 'react';
import { Compass, Info, FileText } from 'lucide-react';

interface MobileTabBarProps {
  activeTab: 'design' | 'narrative' | 'scroll';
  onTabChange: (tab: 'design' | 'narrative' | 'scroll') => void;
}

const tabs = [
  { id: 'design' as const, icon: Compass, label: '设计工坊' },
  { id: 'narrative' as const, icon: Info, label: '美学传记' },
  { id: 'scroll' as const, icon: FileText, label: '禅意笺卡' },
];

export default function MobileTabBar({ activeTab, onTabChange }: MobileTabBarProps) {
  return (
    <div className="ios-tab-bar fixed bottom-0 inset-x-0 z-30 flex items-center justify-around px-4 py-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="flex flex-col items-center gap-0.5 py-1 px-3 ios-tap min-w-[64px]"
        >
          <tab.icon 
            className={`w-5 h-5 transition-colors ${
              activeTab === tab.id ? 'text-[#D4AF37]' : 'text-gray-500'
            }`} 
            strokeWidth={activeTab === tab.id ? 2.5 : 1.5}
          />
          <span className={`text-[10px] font-medium transition-colors ${
            activeTab === tab.id ? 'text-[#D4AF37]' : 'text-gray-500'
          }`}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
