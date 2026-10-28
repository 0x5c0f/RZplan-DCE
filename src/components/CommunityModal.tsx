import React, { useState } from 'react';
import { X, Search, BookOpen, ArrowRight, Gamepad2 } from 'lucide-react';
import { PRESET_RECIPES, PresetRecipe } from '../utils/promptTransformer';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: PresetRecipe) => void;
  onPlayInSandbox?: (recipe: PresetRecipe) => void;
}

export const CommunityModal: React.FC<CommunityModalProps> = ({
  isOpen,
  onClose,
  onSelectRecipe,
  onPlayInSandbox,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(PRESET_RECIPES.map((r) => r.category)))];

  const filtered = PRESET_RECIPES.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.designerPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rawInput.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-slate-800 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                资深设计师经典提示词开源预设库
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                收录 {PRESET_RECIPES.length} 个工业级 UI/UX 动效与交互提示词工程模版 (支持 presets.json 自由增删)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索预设场景（例如：数据加载、拖拽、AI思考、⌘K）..."
              className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 sm:px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-medium shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat === 'all' ? '全部' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe List */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-3.5 flex-1">
          {filtered.map((recipe) => (
            <div
              key={recipe.id}
              className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-50/80 dark:hover:bg-slate-950 transition-all flex flex-col gap-2.5 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {recipe.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {recipe.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      onPlayInSandbox?.(recipe);
                      onClose();
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>沙盒实测</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectRecipe(recipe);
                      onClose();
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>载入编辑器</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Contrast preview */}
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span className="text-slate-400 dark:text-slate-500 text-[11px] block">开发者原始口语表达:</span>
                <p className="italic text-slate-600 dark:text-slate-400">"{recipe.rawInput}"</p>
              </div>

              <div className="text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900/90 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-2xs">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] block mb-1">
                  ✨ 设计师重塑提示词:
                </span>
                <p className="line-clamp-3 leading-relaxed">{recipe.designerPrompt}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {recipe.highlightTags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              没有找到匹配的预设场景，欢迎在主界面直接输入你的原始需求！
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
