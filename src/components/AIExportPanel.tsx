import React, { useState } from 'react';
import { Copy, Check, Terminal, FileText, Sparkles } from 'lucide-react';
import { DesignerPromptResult } from '../utils/promptTransformer';
import { copyTextToClipboard } from '../utils/clipboard';

interface AIExportPanelProps {
  result: DesignerPromptResult;
  onCopy: (text: string) => void;
}

export const AIExportPanel: React.FC<AIExportPanelProps> = ({ result, onCopy }) => {
  const [activeTab, setActiveTab] = useState<'cursor' | 'v0' | 'prd'>('cursor');
  const [copied, setCopied] = useState<string | null>(null);

  const getActiveContent = () => {
    switch (activeTab) {
      case 'cursor':
        return result.cursorPrompt;
      case 'v0':
        return result.v0Prompt;
      case 'prd':
        return result.markdownPRD;
      default:
        return result.cursorPrompt;
    }
  };

  const handleCopyCurrent = async () => {
    const text = getActiveContent();
    const success = await copyTextToClipboard(text);
    onCopy(text);
    if (success) {
      setCopied(activeTab);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Target Tool Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 bg-white dark:bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto pb-0.5 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('cursor')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'cursor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Cursor / Claude Code Prompt</span>
            <span className="sm:hidden">Cursor Code</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('v0')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'v0'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">v0.dev / Bolt.new Prompt</span>
            <span className="sm:hidden">v0.dev</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prd')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'prd'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">PRD 交互规范 (Markdown)</span>
            <span className="sm:hidden">PRD 规范</span>
          </button>
        </div>

        <button
          onClick={handleCopyCurrent}
          type="button"
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-all cursor-pointer"
        >
          {copied === activeTab ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300">已复制完整内容</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>复制当前格式</span>
            </>
          )}
        </button>
      </div>

      {/* Code / Prompt Viewport */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px]">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-[11px] text-slate-400 font-sans">
          <span>
            {activeTab === 'cursor' && '🤖 包含角色定位、交互规范、设计令牌与 Framer Motion 动效约束'}
            {activeTab === 'v0' && '⚡ 专为单轮组件生成优化，包含精确 Tailwind Class 与动画曲线'}
            {activeTab === 'prd' && '📄 包含需求诊断、动效时序表、设计令牌规范的完整设计文档'}
          </span>
          <span className="text-slate-500 font-mono">
            {getActiveContent().length} chars
          </span>
        </div>

        <pre className="whitespace-pre-wrap leading-relaxed selection:bg-indigo-500/30">
          {getActiveContent()}
        </pre>
      </div>
    </div>
  );
};
