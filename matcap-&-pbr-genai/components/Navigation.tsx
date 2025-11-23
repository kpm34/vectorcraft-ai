import React from 'react';
import { Book, Puzzle, Home } from 'lucide-react';

interface NavigationProps {
  currentPage: 'studio' | 'docs' | 'plugins';
  onNavigate: (page: 'studio' | 'docs' | 'plugins') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'studio' as const, label: 'Studio', icon: Home },
    { id: 'docs' as const, label: 'Docs', icon: Book },
    { id: 'plugins' as const, label: 'Plugins', icon: Puzzle },
  ];

  return (
    <nav className="w-full bg-neutral-950 border-b border-neutral-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-purple-400">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
            <span className="text-sm font-bold">MC</span>
          </div>
          <span className="font-bold text-lg">MatCap Studio</span>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-neutral-900 rounded-lg p-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              currentPage === item.id
                ? 'bg-purple-600 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="text-xs text-neutral-500">
        v1.0.0
      </div>
    </nav>
  );
};
