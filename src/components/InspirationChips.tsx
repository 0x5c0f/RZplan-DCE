import React from 'react';
import {
  Sparkles,
  BarChart3,
  Move,
  Rotate3d,
  Maximize2,
  Layers,
  MessageSquare,
  Search,
  ArrowRight,
  Compass,
  LucideIcon,
} from 'lucide-react';
import { QUICK_PICK_PRESETS, PRESET_RECIPES } from '../config/presets';

interface InspirationChipsProps {
  onSelect: (prompt: string, categoryId?: string) => void;
  activePrompt?: string;
  onOpenCommunity?: () => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Move,
  Rotate3d,
  Maximize2,
  Layers,
  MessageSquare,
  Search,
};

export const InspirationChips: React.FC<InspirationChipsProps> = ({
  onSelect,
  activePrompt,
  onOpenCommunity,
}) => {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>经典场景快速填入:</span>
        </span>
        {onOpenCommunity && (
          <button
            type="button"
            onClick={onOpenCommunity}
            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors group cursor-pointer"
          >
            <span>浏览预设库 ({PRESET_RECIPES.length})</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>

      {/* Wrapping Chips (No awkward horizontal scrollbars) */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        {QUICK_PICK_PRESETS.map((item) => {
          const Icon = (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : Sparkles;
          const isActive = activePrompt?.trim() === item.rawInput.trim();
          const displayTitle = item.shortTitle || item.title;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.rawInput, item.id)}
              title={item.title}
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all text-left shadow-2xs cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-200 border-indigo-300 dark:border-indigo-500/50 ring-1 ring-indigo-500/30'
                  : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-950/70 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 flex-shrink-0 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-indigo-500 dark:text-indigo-400'
                }`}
              />
              <span className="whitespace-nowrap">{displayTitle}</span>
            </button>
          );
        })}

        {onOpenCommunity && (
          <button
            type="button"
            onClick={onOpenCommunity}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-dashed border-indigo-300 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/50 transition-all cursor-pointer shadow-2xs"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="whitespace-nowrap">+ 更多...</span>
          </button>
        )}
      </div>
    </div>
  );
};
