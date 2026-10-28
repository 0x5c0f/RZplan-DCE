import React from 'react';
import { X, Lock, KeyRound, Cpu, ArrowRight } from 'lucide-react';

interface AccessGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onOpenCustomModel: () => void;
}

export const AccessGateModal: React.FC<AccessGateModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenCustomModel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                请先完成模型配置或登录
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                访客需配置自定义大模型，或输入授权码登录以使用系统内置模型
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pathways */}
        <div className="p-5 flex flex-col gap-3.5 text-xs">
          {/* Option 1: Custom Model BYOK (Prioritized for Guests) */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCustomModel();
            }}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500/60 bg-slate-50/50 dark:bg-slate-950/60 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-all text-left flex items-start justify-between group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white text-xs block group-hover:text-purple-600 dark:group-hover:text-purple-300">
                  方式一：配置自定义大模型 (BYOK)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-relaxed">
                  在前端填入您的 BaseURL、Key 与 Model (支持 DeepSeek、OpenRouter、OneAPI)，Key 仅存在您本地。
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
          </button>

          {/* Option 2: Passcode Login */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/60 bg-slate-50/50 dark:bg-slate-950/60 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-all text-left flex items-start justify-between group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white text-xs block group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                  方式二：输入系统授权码 (Passcode 登录)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-relaxed">
                  解锁服务端通过环境变量托管的内置大模型，享受免配置直接调用体验。
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>预设场景与触感缓动测试均可免登录直接体验</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
          >
            仅浏览界面
          </button>
        </div>
      </div>
    </div>
  );
};
