import React, { useState } from 'react';
import { X, KeyRound, ShieldCheck, Check, AlertCircle, LogOut, Lock } from 'lucide-react';
import { SystemModelInfo } from '../utils/configStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string | null;
  onSaveKey: (key: string, systemModel?: SystemModelInfo) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentKey,
  onSaveKey,
  onLogout,
}) => {
  const [inputKey, setInputKey] = useState(currentKey || '');
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleVerifyAndSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputKey.trim()) {
      setError('请输入系统授权码');
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey: inputKey.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setSuccess(true);
        onSaveKey(inputKey.trim(), data.systemModel);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 800);
      } else {
        setError(data.error || '授权码无效，请检查后重新输入');
      }
    } catch {
      setError('网络连接异常或服务未响应，请稍后重试');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                系统访问授权登录
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                输入 Access Key 解锁服务端环境变量配置的内置大模型
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

        {/* Body */}
        <form onSubmit={handleVerifyAndSave} className="p-3.5 sm:p-5 flex flex-col gap-3.5 sm:gap-4 text-xs">
          {currentKey ? (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300 block">
                    当前状态：已授权登录
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                    已激活服务端内置大模型服务
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-red-200 dark:border-red-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>退出登录</span>
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span>
                系统采用轻量高强度口令验证，无需复杂的账号数据库，开箱即用。
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              访问授权码 (System Access Key):
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                setError(null);
              }}
              placeholder="请输入系统授权码..."
              className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500/60 font-mono text-xs"
            />
            {error && (
              <span className="text-red-500 flex items-center gap-1 text-[11px] mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {error}
              </span>
            )}
            <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
              💡 授权码由系统管理员在环境变量中配置 (<code>SYSTEM_ACCESS_KEY</code>)。若无授权码，请关闭此弹窗并配置个人大模型 (BYOK) 自由使用。
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={verifying}
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>正在验证...</span>
                </>
              ) : success ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>验证成功</span>
                </>
              ) : (
                <span>确认并授权</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
