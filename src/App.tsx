import React, { useState, useEffect } from 'react';
import {
  Layers,
  Terminal,
  Check,
  Sparkles,
  Gamepad2,
} from 'lucide-react';
import { Header } from './components/Header';
import { InputConsole } from './components/InputConsole';
import { DiffViewer } from './components/DiffViewer';
import { InteractiveSandbox } from './components/InteractiveSandbox';
import { AIExportPanel } from './components/AIExportPanel';
import { CommunityModal } from './components/CommunityModal';
import { AboutModal } from './components/AboutModal';
import { AuthModal } from './components/AuthModal';
import { ModelSettingsModal } from './components/ModelSettingsModal';
import { AccessGateModal } from './components/AccessGateModal';
import {
  DesignStyle,
  MotionTone,
  TargetTool,
  synthesizeDesignerPrompt,
  DesignerPromptResult,
  PresetRecipe,
} from './utils/promptTransformer';
import {
  ThemeMode,
  CustomModelConfig,
  SystemModelInfo,
  getStoredTheme,
  setStoredTheme,
  getStoredAuthKey,
  setStoredAuthKey,
  clearStoredAuthKey,
  getStoredCustomModel,
  setStoredCustomModel,
  clearStoredCustomModel,
  getStoredSystemModel,
  setStoredSystemModel,
  clearStoredSystemModel,
  isUserAuthorized,
} from './utils/configStore';
import { callOpenAICompatibleModel } from './utils/llmClient';
import { copyTextToClipboard } from './utils/clipboard';

export default function App() {
  const [input, setInput] = useState(
    'dashboard添加一些动效，让页面看起来更加平滑，每个标签采用标签卡片的形式显示。'
  );
  const [style, setStyle] = useState<DesignStyle>('linear-dark');
  const [motionTone, setMotionTone] = useState<MotionTone>('apple-ease');
  const [targetTool, setTargetTool] = useState<TargetTool>('cursor');
  const [activeTab, setActiveTab] = useState<'diff' | 'sandbox' | 'export'>('diff');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('dashboard-loading');

  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());

  // Auth & Custom Model States
  const [authKey, setAuthKey] = useState<string | null>(() => getStoredAuthKey());
  const [customModel, setCustomModel] = useState<CustomModelConfig | null>(() =>
    getStoredCustomModel()
  );
  const [systemModel, setSystemModel] = useState<SystemModelInfo | null>(() =>
    getStoredSystemModel()
  );

  // Modals
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isModelSettingsOpen, setIsModelSettingsOpen] = useState(false);
  const [isAccessGateOpen, setIsAccessGateOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DesignerPromptResult>(() =>
    synthesizeDesignerPrompt(
      'dashboard添加一些动效，让页面看起来更加平滑，每个标签采用标签卡片的形式显示。',
      { style: 'linear-dark', motionTone: 'apple-ease', targetTool: 'cursor' }
    )
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme to root class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Query server for system model info on load or auth change
  useEffect(() => {
    const fetchSystemConfig = async () => {
      try {
        const url = authKey
          ? `/api/auth/verify?accessKey=${encodeURIComponent(authKey)}`
          : '/api/auth/verify';
        const res = await fetch(url, {
          headers: authKey ? { Authorization: `Bearer ${authKey}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (data.systemModel) {
            setSystemModel(data.systemModel);
            setStoredSystemModel(data.systemModel);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch system model config:', err);
      }
    };

    fetchSystemConfig();
  }, [authKey]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyToClipboard = async (text: string, label: string = '提示词') => {
    const ok = await copyTextToClipboard(text);
    if (ok) {
      showToast(`📋 已成功复制${label}至剪贴板！`);
    } else {
      showToast(`⚠️ 复制异常，请手动选中文本复制`);
    }
  };

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setStoredTheme(nextTheme);
    showToast(`已切换至${nextTheme === 'dark' ? '深色' : '浅色'}主题`);
  };

  const handleSaveAuthKey = (key: string, sysModel?: SystemModelInfo) => {
    setAuthKey(key);
    setStoredAuthKey(key);
    if (sysModel) {
      setSystemModel(sysModel);
      setStoredSystemModel(sysModel);
    }
    showToast('🎉 系统授权码验证成功，已激活服务端内置模型！');
  };

  const handleLogoutAuth = () => {
    setAuthKey(null);
    clearStoredAuthKey();
    clearStoredSystemModel();
    setSystemModel(null);
    showToast('已退出授权登录');
  };

  const handleSaveCustomModel = (cfg: CustomModelConfig) => {
    setCustomModel(cfg);
    setStoredCustomModel(cfg);
    showToast(`✨ 自定义大模型 (${cfg.model}) 配置成功并已生效！`);
  };

  const handleClearCustomModel = () => {
    setCustomModel(null);
    clearStoredCustomModel();
    showToast('已清除自定义大模型配置');
  };

  // Generation Trigger with Access Gate
  const handleGenerate = async () => {
    if (!input.trim()) return;

    // Strict Authorization Check: Must have custom model OR system auth key
    const authorized = isUserAuthorized(authKey, customModel);
    if (!authorized) {
      showToast('🔒 访客需先配置自定义大模型 (BYOK) 或输入授权码登录');
      setIsAccessGateOpen(true);
      return;
    }

    setLoading(true);

    // Pathway A: Custom Model Configured
    if (customModel && customModel.enabled && customModel.apiKey) {
      try {
        const customResult = await callOpenAICompatibleModel(customModel, input, {
          style,
          motionTone,
          targetTool,
        });
        setResult(customResult);
        showToast(`✨ 已通过自定义模型 (${customModel.model}) 生成设计师提示词！`);
        return;
      } catch (err: any) {
        console.warn('Custom model generation failed, falling back to server route:', err);
        showToast(`⚠️ 自定义模型调用异常: ${err?.message?.slice(0, 40) || '超时'}，正在尝试服务端代理...`);
      }
    }

    // Pathway B: Built-in System Model (Authenticated with Access Key)
    try {
      const res = await fetch('/api/designer-prompt/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          style,
          motionTone,
          targetTool,
          accessKey: authKey,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setResult(json.data);
          if (json.errorNotice) {
            showToast(`⚠️ ${json.errorNotice}`);
          } else if (json.notice) {
            showToast(`💡 ${json.notice}`);
          } else {
            showToast(`✨ 设计师提示词重塑完成！(由 ${json.source || '内置大模型'} 生成)`);
          }
          return;
        }
      } else if (res.status === 401) {
        showToast('🔒 访问授权码无效或未通过验证，请重新输入');
        setIsAccessGateOpen(true);
        return;
      } else {
        const errJson = await res.json().catch(() => ({}));
        showToast(`⚠️ 服务端响应异常: ${errJson.error || res.statusText}`);
      }
    } catch (e) {
      console.warn('Network call failed, utilizing local deterministic engine:', e);
      const synthesized = synthesizeDesignerPrompt(input, {
        style,
        motionTone,
        targetTool,
      });
      setResult(synthesized);
      showToast('⚠️ 服务端通信异常，已启用本地设计师规则引擎');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: PresetRecipe) => {
    setInput(preset.rawInput);
    setStyle(preset.style);
    setMotionTone(preset.motionTone);
    setSelectedPresetId(preset.id);
    const synthesized = synthesizeDesignerPrompt(preset.rawInput, {
      style: preset.style,
      motionTone: preset.motionTone,
      targetTool,
    });
    setResult(synthesized);
    showToast(`已载入预设场景: ${preset.title}`);
  };

  const handlePlayPresetInSandbox = (preset: PresetRecipe) => {
    setSelectedPresetId(preset.id);
    setStyle(preset.style);
    setMotionTone(preset.motionTone);
    setActiveTab('sandbox');
    showToast(`🎮 进入沙盒实测: ${preset.shortTitle || preset.title}`);
  };

  const handleReset = () => {
    const defaultInput =
      'dashboard添加一些动效，让页面看起来更加平滑，每个标签采用标签卡片的形式显示。';
    setInput(defaultInput);
    setStyle('linear-dark');
    setMotionTone('apple-ease');
    setTargetTool('cursor');
    setResult(
      synthesizeDesignerPrompt(defaultInput, {
        style: 'linear-dark',
        motionTone: 'apple-ease',
        targetTool: 'cursor',
      })
    );
    showToast('已重置为标准仪表板示例');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-600 dark:selection:text-indigo-200 transition-colors duration-200">
      {/* Top Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenCommunity={() => setIsCommunityOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenModelSettings={() => setIsModelSettingsOpen(true)}
        onLogout={handleLogoutAuth}
        authKey={authKey}
        customModel={customModel}
        systemModel={systemModel}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 flex flex-col gap-6">
        {/* Top Feature Banner */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-white to-sky-500/10 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-sky-950/30 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm dark:shadow-lg transition-colors">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
            <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mt-0.5 sm:mt-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                开源设计师角色引擎：让自然语言蜕变为工业级 UI/UX 动效提示词
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                支持服务端环境变量内置模型与前端自定义模型 (BYOK)，支持明/暗主题自适应切换。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsAboutOpen(true)}
              className="w-full sm:w-auto text-center text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-white px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 transition-all whitespace-nowrap"
            >
              了解设计理念 →
            </button>
          </div>
        </div>

        {/* Input Console */}
        <InputConsole
          input={input}
          setInput={setInput}
          style={style}
          setStyle={setStyle}
          motionTone={motionTone}
          setMotionTone={setMotionTone}
          targetTool={targetTool}
          setTargetTool={setTargetTool}
          loading={loading}
          onGenerate={handleGenerate}
          onReset={handleReset}
          authKey={authKey}
          customModel={customModel}
          systemModel={systemModel}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenModelSettings={() => setIsModelSettingsOpen(true)}
          onOpenCommunity={() => setIsCommunityOpen(true)}
        />

        {/* Studio Output Panel */}
        <div className="flex flex-col gap-4">
          {/* Studio Tab Navigation: 3 Core Dimensions */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('diff')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'diff'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Prompt Diff (对比与物理模型)</span>
                <span className="sm:hidden">提示词对比</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('sandbox')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'sandbox'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-amber-500 dark:text-amber-300" />
                <span className="hidden sm:inline">🎮 交互沙盒 (所见即所得原子实验)</span>
                <span className="sm:hidden">🎮 交互沙盒</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 font-mono hidden md:inline ml-0.5 border border-amber-500/25">
                  6大原子原语
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('export')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'export'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">AI Prompt Export (Cursor / v0 / Claude)</span>
                <span className="sm:hidden">AI 交付导出</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden md:block font-mono">
              方案 ID: {result.id.slice(0, 14)}
            </span>
          </div>

          {/* Tab Views */}
          <div className="pt-2">
            {activeTab === 'diff' && (
              <DiffViewer
                result={result}
                onCopy={(text) => handleCopyToClipboard(text, '设计师重塑提示词')}
                onOpenSandbox={() => setActiveTab('sandbox')}
              />
            )}

            {activeTab === 'sandbox' && (
              <InteractiveSandbox
                result={result}
                currentStyle={style}
                activeRecipeId={selectedPresetId}
                onCopyPrompt={(p, l) => handleCopyToClipboard(p, l)}
                onSelectRecipe={(recipe) => {
                  setSelectedPresetId(recipe.id);
                  setStyle(recipe.style);
                  setMotionTone(recipe.motionTone);
                }}
              />
            )}

            {activeTab === 'export' && (
              <AIExportPanel
                result={result}
                onCopy={(text) => handleCopyToClipboard(text, '交付 Prompt')}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">DesignCraftsman Engine</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">DCE v1.0.0</span>
            <span>· 智能 UI/UX 设计师提示词工程引擎</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              设计哲学
            </button>
            <button
              type="button"
              onClick={() => setIsCommunityOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              经典预设库
            </button>
            <span>MIT License © 2026</span>
          </div>
        </div>
      </footer>

      {/* Floating Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-semibold border border-indigo-500/40 shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Community Modal */}
      <CommunityModal
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
        onSelectRecipe={handleSelectPreset}
        onPlayInSandbox={handlePlayPresetInSandbox}
      />

      {/* About & Philosophy Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Auth Passcode Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentKey={authKey}
        onSaveKey={handleSaveAuthKey}
        onLogout={handleLogoutAuth}
      />

      {/* Custom Model Settings Modal */}
      <ModelSettingsModal
        isOpen={isModelSettingsOpen}
        onClose={() => setIsModelSettingsOpen(false)}
        config={customModel}
        onSaveConfig={handleSaveCustomModel}
        onClearConfig={handleClearCustomModel}
        authKey={authKey}
        systemModel={systemModel}
        onOpenAuth={() => {
          setIsModelSettingsOpen(false);
          setIsAuthOpen(true);
        }}
        onLogout={handleLogoutAuth}
      />

      {/* Access Gate Modal */}
      <AccessGateModal
        isOpen={isAccessGateOpen}
        onClose={() => setIsAccessGateOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCustomModel={() => setIsModelSettingsOpen(true)}
      />
    </div>
  );
}
