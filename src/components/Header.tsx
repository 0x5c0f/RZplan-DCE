import React from 'react';
import {
  Sparkles,
  BookOpen,
  Wand2,
  Info,
  Sun,
  Moon,
  KeyRound,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { ThemeMode, CustomModelConfig, SystemModelInfo } from '../utils/configStore';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenCommunity: () => void;
  onOpenAbout: () => void;
  onOpenAuth: () => void;
  onOpenModelSettings: () => void;
  onLogout: () => void;
  authKey: string | null;
  customModel: CustomModelConfig | null;
  systemModel: SystemModelInfo | null;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenCommunity,
  onOpenAbout,
  onOpenAuth,
  onOpenModelSettings,
  onLogout,
  authKey,
  customModel,
  systemModel,
}) => {
  const isCustomModelActive = Boolean(customModel && customModel.enabled && customModel.apiKey);
  const isAuthKeyActive = Boolean(authKey && authKey.trim().length > 0);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-950/85 backdrop-blur-md px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-3">
        {/* Brand and Tagline */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-[1px] shadow-md shadow-indigo-500/20 flex-shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] sm:rounded-[11px] flex items-center justify-center">
                <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-slate-900 dark:bg-gradient-to-r dark:from-white dark:via-slate-100 dark:to-slate-400 dark:bg-clip-text dark:text-transparent">
                  DesignCraftsman Engine
                </h1>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 whitespace-nowrap">
                  DCE v1.0.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                面向高水准 AI 前端开发的设计师工程引擎 · 动效缓动与高保真代码提示词
              </p>
            </div>
          </div>

          {/* Quick theme toggle on mobile screen right */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onToggleTheme}
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
              aria-label="切换浅色与深色主题"
              title={`切换为${theme === 'dark' ? '浅色' : '深色'}主题`}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
              )}
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 w-full md:w-auto">
          {/* Auth / Model Status Button */}
          {isCustomModelActive ? (
            <button
              onClick={onOpenModelSettings}
              type="button"
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all cursor-pointer"
              title="已配置自定义模型，点击修改"
            >
              <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500" />
              <span className="truncate max-w-[130px] sm:max-w-none">自定义: {customModel?.model || 'OpenAI'}</span>
            </button>
          ) : isAuthKeyActive ? (
            <button
              onClick={onOpenModelSettings}
              type="button"
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all cursor-pointer"
              title="已授权登录，点击查看系统大模型配置或退出登录"
            >
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
              <span className="truncate max-w-[130px] sm:max-w-none">内置: {systemModel?.model || (systemModel?.hasBuiltin ? '已就绪' : '已授权')}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              type="button"
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all cursor-pointer"
              title="未登录授权，点击登录"
            >
              <KeyRound className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
              <span>访客模式 (点击登录)</span>
            </button>
          )}

          {/* Model Config Button */}
          <button
            onClick={onOpenModelSettings}
            type="button"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-all cursor-pointer"
            title="配置大模型 (BaseURL / API Key)"
          >
            <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500 dark:text-purple-400" />
            <span>模型配置</span>
          </button>

          {/* Preset Library Button */}
          <button
            onClick={onOpenCommunity}
            type="button"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-all cursor-pointer"
          >
            <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-500 dark:text-sky-400" />
            <span>预设库</span>
          </button>

          {/* Philosophy Button */}
          <button
            onClick={onOpenAbout}
            type="button"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-all cursor-pointer"
          >
            <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>设计理念</span>
          </button>

          {/* Theme Switcher Button (Desktop) */}
          <button
            onClick={onToggleTheme}
            type="button"
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            aria-label="切换浅色与深色主题"
            title={`切换为${theme === 'dark' ? '浅色' : '深色'}主题`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
