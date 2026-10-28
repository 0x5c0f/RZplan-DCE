import React, { useState } from 'react';
import { Copy, Check, Layers, Cpu } from 'lucide-react';
import { DesignerPromptResult } from '../utils/promptTransformer';

interface CodeRecipePanelProps {
  result: DesignerPromptResult;
  onCopy: (text: string) => void;
}

export const CodeRecipePanel: React.FC<CodeRecipePanelProps> = ({ result, onCopy }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    onCopy(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Tailwind Utility Classes snippet */}
      <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            Tailwind CSS 推荐原子类组合 (Design Tokens)
          </span>
          <button
            onClick={() =>
              handleCopy(result.codeRecipe.tailwindClasses.join(' '), 'tailwind')
            }
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
          >
            {copiedType === 'tailwind' ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300">已复制 Classes</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>复制 Class 字符串</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 font-mono text-xs text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-800">
          {result.codeRecipe.tailwindClasses.map((cls, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-2xs"
            >
              {cls}
            </span>
          ))}
        </div>
      </div>

      {/* Framer Motion Configuration */}
      <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            Framer Motion / Motion-One 物理参数配置代码
          </span>
          <button
            onClick={() =>
              handleCopy(result.codeRecipe.framerMotionCode, 'framermotion')
            }
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
          >
            {copiedType === 'framermotion' ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300">已复制配置</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>复制 TypeScript 配置</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-3.5 rounded-lg bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
          {result.codeRecipe.framerMotionCode}
        </pre>
      </div>
    </div>
  );
};
