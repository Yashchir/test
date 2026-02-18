
import React from 'react';
import { AppTab } from '../types';

interface TabNavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: AppTab.HOME, label: 'Головна', icon: '🏠' },
    { id: AppTab.ACADEMY, label: 'Академія', icon: '🎓' },
    { id: AppTab.STATS, label: 'Прогрес', icon: '📅' },
    { id: AppTab.REWARDS, label: 'Нагороди', icon: '🏆' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 ios-blur border-t border-white/5 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all ${
              activeTab === tab.id ? 'text-blue-500 scale-110' : 'text-zinc-500'
            }`}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
