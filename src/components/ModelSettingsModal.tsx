import React, { useState, useEffect } from 'react';
import {
  X,
  Cpu,
  Sparkles,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Radio,
  Zap,
  Trash2,
  ShieldCheck,
  Lock,
  KeyRound,
  LogOut,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  CustomModelConfig,
  SystemModelInfo,
  POPULAR_PRESETS,
} from '../utils/configStore';

interface ModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CustomModelConfig | null;
  onSaveConfig: (cfg: CustomModelConfig) => void;
  onClearConfig: () => void;
  authKey: string | null;
  systemModel: SystemModelInfo | null;
  onOpenAuth: () => void;
  onLogout?: () => void;
}

export const ModelSettingsModal: React.FC<ModelSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onClearConfig,
  authKey,
  systemModel,
  onOpenAuth,
  onLogout,
}) => {
  const isLoggedIn = Boolean(authKey && authKey.trim().length > 0);

  // Form states
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [enableOverride, setEnableOverride] = useState(false);

  const [testStatus, setTestStatus] = useState<{
    testing: boolean;
    success?: boolean;
    message?: string;
  }>({ testing: false });

  useEffect(() => {
    if (config) {
      setBaseUrl(config.baseUrl || '');
      setApiKey(config.apiKey || '');
      setModel(config.model || '');
      setEnabled(config.enabled ?? true);
      setEnableOverride(Boolean(config.enabled && config.apiKey));
    } else {
      setBaseUrl('https://api.deepseek.com');
      setModel('deepseek-flash');
      setApiKey('');
      setEnabled(true);
      setEnableOverride(false);
    }
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: (typeof POPULAR_PRESETS)[0]) => {
    setBaseUrl(preset.baseUrl);
    setModel(preset.defaultModel);
    setTestStatus({ testing: false });
  };

  const handleTestConnection = async () => {
    if (!baseUrl.trim() || !apiKey.trim() || !model.trim()) {
      setTestStatus({
        testing: false,
        success: false,
        message: '请先填写完整的 Base URL、API Key 与 Model 名称',
      });
      return;
    }

    setTestStatus({ testing: true });

    let cleanBase = baseUrl.trim();
    if (cleanBase.endsWith('/')) cleanBase = cleanBase.slice(0, -1);
    if (!cleanBase.endsWith('/v1') && !cleanBase.includes('/chat/completions')) {
      cleanBase = `${cleanBase}/v1`;
    }
    const endpoint = cleanBase.endsWith('/chat/completions')
      ? cleanBase
      : `${cleanBase}/chat/completions`;

    try {
      // Test via server proxy to avoid browser CORS
      const res = await fetch('/api/designer-prompt/proxy-openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint,
          apiKey: apiKey.trim(),
          payload: {
            model: model.trim(),
            messages: [{ role: 'user', content: 'Say "OK"' }],
            max_tokens: 5,
          },
        }),
      });

      if (res.ok) {
        setTestStatus({
          testing: false,
          success: true,
          message: '连接测试成功！模型响应正常。',
        });
        return;
      } else {
        // Fallback test in case of server issue
        try {
          const directRes = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey.trim()}`,
            },
            body: JSON.stringify({
              model: model.trim(),
              messages: [{ role: 'user', content: 'Say "OK"' }],
              max_tokens: 5,
            }),
          });

          if (directRes.ok) {
            setTestStatus({
              testing: false,
              success: true,
              message: '直连测试成功！模型响应正常。',
            });
            return;
          }
        } catch {}

        const err = await res.json().catch(() => ({}));
        setTestStatus({
          testing: false,
          success: false,
          message: err.error || `连接失败 (HTTP ${res.status})，请检查 Key 与 BaseURL`,
        });
      }
    } catch (e: any) {
      setTestStatus({
        testing: false,
        success: false,
        message: e?.message || '网络连接超时或地址不可达',
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // If logged in and override not enabled, clear custom model
    if (isLoggedIn && !enableOverride) {
      onClearConfig();
      onClose();
      return;
    }

    if (!baseUrl.trim() || !apiKey.trim() || !model.trim()) {
      setTestStatus({
        testing: false,
        success: false,
        message: 'Base URL、API Key 与 Model 均为必填项',
      });
      return;
    }

    const newConfig: CustomModelConfig = {
      enabled: true,
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
      model: model.trim(),
    };

    onSaveConfig(newConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 transition-colors max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className={`p-2 rounded-xl flex-shrink-0 ${isLoggedIn ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'}`}>
              {isLoggedIn ? <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /> : <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {isLoggedIn ? '大模型配置 (已登录状态)' : '自定义大模型配置 (访客模式)'}
                </h2>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${isLoggedIn ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'}`}>
                  {isLoggedIn ? '已授权' : '未登录'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                {isLoggedIn
                  ? '服务端环境变量模型已激活，密钥脱敏安全保护'
                  : '支持接入 DeepSeek 官方或兼容端点 (BYOK)'}
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

        {/* Content Body */}
        <div className="p-3.5 sm:p-5 flex flex-col gap-3.5 sm:gap-4 text-xs">
          {/* SECTION 1: LOGGED IN - SYSTEM BUILT-IN MODEL DETAILS */}
          {isLoggedIn ? (
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${systemModel?.hasBuiltin ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${systemModel?.hasBuiltin ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white text-xs">
                      {systemModel?.hasBuiltin
                        ? '系统内置模型 (服务端环境变量托管)'
                        : '系统环境变量未配置内置模型'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAuth();
                      }}
                      className="text-[11px] text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium transition-colors"
                      title="更换系统授权码"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>更换授权码</span>
                    </button>
                  </div>
                </div>

                {systemModel?.hasBuiltin ? (
                  <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-slate-400">服务提供商:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        {systemModel.provider || 'DeepSeek'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-slate-400">模型名称 (Model):</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                        {systemModel.model || 'deepseek-flash'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5 col-span-2">
                      <span className="text-[11px] text-slate-400">API 端点 (Base URL):</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                        {systemModel.baseUrl || 'https://api.deepseek.com/v1'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5 col-span-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-500" />
                        API 密钥安全状态 (脱敏保护，仅限后端代理使用):
                      </span>
                      <div className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                        <span>{systemModel.maskedKey || 'sk-••••••••••••••••'}</span>
                        <span className="text-[10px] text-slate-400">前端安全保密</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    服务端尚未在 <code>.env</code> 中配置 <code>BUILTIN_LLM_API_KEY</code>。您可在下方勾选配置个人自定义模型覆盖使用，或由管理员在环境变量中统一指定。
                  </div>
                )}
              </div>

              {/* Toggle to override with custom model */}
              <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enableOverride}
                    onChange={(e) => setEnableOverride(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    使用个人自定义大模型覆盖系统内置模型
                  </span>
                </label>
              </div>
            </div>
          ) : (
            /* SECTION 1: NOT LOGGED IN - GUEST NOTICE */
            <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-purple-900 dark:text-purple-300">
                  未登录访客模式
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>使用系统授权码登录 →</span>
                </button>
              </div>
              <p className="text-[11px] text-purple-800 dark:text-purple-300/80 leading-relaxed">
                未登录用户需在下方配置您个人的大模型（API Key / BaseURL）方可使用提示词重塑能力；数据仅保存在您本地浏览器中，绝不上报服务器。
              </p>
            </div>
          )}

          {/* SECTION 2: CUSTOM MODEL FORM (Active if guest OR logged in with override enabled) */}
          {(!isLoggedIn || enableOverride) && (
            <form onSubmit={handleSave} className="flex flex-col gap-3.5 pt-1">
              {/* Presets */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>快速载入服务商预设 (Preset):</span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-normal">点击一键载入官方配置</span>
                </label>
                <div className="flex flex-col gap-2">
                  {POPULAR_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-600/40 transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        <span className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          {p.name}
                        </span>
                        <span className="font-mono text-[11px] text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 px-2 py-0.5 rounded-md">
                          {p.defaultModel}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 hidden sm:inline">
                        {p.description || '官方兼容端点'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Base URL */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  API Base URL (端点地址):
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.deepseek.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-purple-500 font-mono text-xs"
                />
              </div>

              {/* Model Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  模型名称 (Model Name):
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="例如: deepseek-flash, gpt-4o, claude-3-7-sonnet"
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-purple-500 font-mono text-xs"
                />
              </div>

              {/* API Key */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  API Key (保存在本地浏览器):
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-purple-500 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Test Status feedback */}
              {testStatus.message && (
                <div
                  className={`p-3 rounded-xl border flex items-center gap-2 ${
                    testStatus.success
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300'
                  }`}
                >
                  {testStatus.success ? (
                    <Check className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="text-xs">{testStatus.message}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testStatus.testing}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors w-full sm:w-auto cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{testStatus.testing ? '正在测试...' : '测试连通性'}</span>
                  </button>

                  {isLoggedIn && (
                    <button
                      type="button"
                      onClick={() => {
                        onLogout?.();
                        onClose();
                      }}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="退出系统授权登录"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>退出登录</span>
                    </button>
                  )}

                  {config && (
                    <button
                      type="button"
                      onClick={() => {
                        onClearConfig();
                        onClose();
                      }}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>清除配置</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                  >
                    保存并生效
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Close & Logout buttons if logged in and not overriding */}
          {isLoggedIn && !enableOverride && (
            <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  onLogout?.();
                  onClose();
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 py-2 px-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-200 dark:hover:border-red-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>退出登录</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                确定 (使用系统内置模型)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
