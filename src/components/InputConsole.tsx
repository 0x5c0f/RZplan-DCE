import React from 'react';
import {
  Wand2,
  Activity,
  Target,
  RotateCcw,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Palette,
} from 'lucide-react';
import {
  DesignStyle,
  MotionTone,
  TargetTool,
  MOTION_DEFINITIONS,
  STYLE_DEFINITIONS,
} from '../utils/promptTransformer';
import { InspirationChips } from './InspirationChips';
import { CustomModelConfig, SystemModelInfo } from '../utils/configStore';
import { CustomSelect, SelectOption } from './CustomSelect';

interface InputConsoleProps {
  input: string;
  setInput: (val: string) => void;
  style: DesignStyle;
  setStyle: (val: DesignStyle) => void;
  motionTone: MotionTone;
  setMotionTone: (val: MotionTone) => void;
  targetTool: TargetTool;
  setTargetTool: (val: TargetTool) => void;
  loading: boolean;
  onGenerate: () => void;
  onReset: () => void;
  authKey: string | null;
  customModel: CustomModelConfig | null;
  systemModel: SystemModelInfo | null;
  onOpenAuth: () => void;
  onOpenModelSettings: () => void;
  onOpenCommunity?: () => void;
}

export const InputConsole: React.FC<InputConsoleProps> = ({
  input,
  setInput,
  style,
  setStyle,
  motionTone,
  setMotionTone,
  targetTool,
  setTargetTool,
  loading,
  onGenerate,
  onReset,
  authKey,
  customModel,
  systemModel,
  onOpenAuth,
  onOpenModelSettings,
  onOpenCommunity,
}) => {
  const currentMotion = MOTION_DEFINITIONS[motionTone];
  const isCustomModelActive = Boolean(customModel && customModel.enabled && customModel.apiKey);
  const isAuthKeyActive = Boolean(authKey && authKey.trim().length > 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-sm dark:shadow-xl flex flex-col gap-3.5 sm:gap-4.5 transition-colors">
      {/* 1. Inspiration Chips (Top row with full width) */}
      <InspirationChips
        onSelect={(text) => setInput(text)}
        activePrompt={input}
        onOpenCommunity={onOpenCommunity}
      />

      {/* 2. Input Textarea Section */}
      <div className="flex flex-col gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            原始自然语言需求 (Raw Developer Requirement):
          </label>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
            支持粗糙、碎片化口语描述，AI 自动补全高保真参数
          </span>
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder="例如: dashboard添加一些动效，让页面看起来更加平滑，每个标签采用标签卡片的形式显示..."
            className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs sm:text-sm rounded-xl p-3 sm:p-3.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-y font-sans leading-relaxed"
          />
          {input && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="absolute top-3 right-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 shadow-xs transition-colors"
            >
              清空
            </button>
          )}
        </div>
      </div>

      {/* 3. Designer Tuning Parameters Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        {/* Column 1: Visual Style & Tokens */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            视觉设计风格 (Visual Style & Tokens):
          </label>
          <CustomSelect<DesignStyle>
            value={style}
            onChange={setStyle}
            aria-label="选择视觉设计风格"
            options={[
              {
                value: 'linear-dark',
                label: 'Linear.app 暗黑极客风',
                badge: '极客设计流派',
                description: '源自产品 Linear.app 的 Zinc-950 黑底、1px微光边框、Indigo 高级质感',
              },
              {
                value: 'minimal-clean',
                label: 'Apple Clean 极简现代',
                badge: '极简白',
                description: '纯白低饱和灰、精致细边框、苹果级优雅留白',
              },
              {
                value: 'neo-brutalist',
                label: 'Neo-Brutalism 新野兽派',
                badge: '潮流硬角',
                description: '2px黑粗描边、高饱和撞色、无模糊硬投影',
              },
              {
                value: 'glassmorphism',
                label: 'Glassmorphism 毛玻璃',
                badge: '晶体通透',
                description: '多层背景虚化、亚克力质感与高光反光条',
              },
              {
                value: 'saas-dense',
                label: 'High-Density SaaS 高密度',
                badge: '效率优先',
                description: '紧凑行高与小圆角，适合数据密集型生产力工具',
              },
            ]}
          />
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between px-1">
            <span>主色: <code className="text-indigo-600 dark:text-indigo-300 font-mono text-[10px]">{STYLE_DEFINITIONS[style]?.tokens.primaryColor.split(' ')[0]}</code></span>
            <span>倒角: <span className="text-slate-700 dark:text-slate-300">{STYLE_DEFINITIONS[style]?.tokens.radius.split(' ')[0]}</span></span>
          </div>
        </div>

        {/* Column 2: Motion Tone Dial */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            动效与物理质感 (Motion & Physics):
          </label>
          <CustomSelect<MotionTone>
            value={motionTone}
            onChange={setMotionTone}
            aria-label="选择动效调性"
            options={[
              {
                value: 'apple-ease',
                label: 'Apple Ease-Out 丝滑微动效',
                badge: '0.16, 1, 0.3, 1',
                description: '苹果级连续物理缓动，高雅平滑无回弹',
              },
              {
                value: 'snappy-spring',
                label: 'Snappy Spring 弹性物理',
                badge: 'Stiffness: 420',
                description: '劲挺有力微震荡反弹，适合交互式按键与卡片',
              },
              {
                value: 'micro-delight',
                label: 'Micro-Delight 愉悦反馈',
                badge: '微交互',
                description: '微旋转、粒子波纹与 Shimmer 光泽交互',
              },
              {
                value: 'subdued',
                label: 'Subdued 克制工业规范',
                badge: '高效流',
                description: '极致极短过渡，专注高密度信息呈现与操作效率',
              },
            ]}
          />
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between px-1">
            <span>曲线: <code className="text-sky-600 dark:text-sky-300 font-mono text-[10px] truncate max-w-[130px] inline-block align-bottom">{currentMotion.easingBezier}</code></span>
            <span>时长: <span className="text-slate-700 dark:text-slate-300">{currentMotion.duration}</span></span>
          </div>
        </div>

        {/* Column 3: Target Tool Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
            目标输出平台/工具 (Target Model & Format):
          </label>
          <CustomSelect<TargetTool>
            value={targetTool}
            onChange={setTargetTool}
            aria-label="选择目标输出工具"
            options={[
              {
                value: 'cursor',
                label: 'Cursor / Claude Code',
                badge: '.cursorrules',
                description: '深度工程架构约束、动效规范与 Tailwind 令牌提示词',
              },
              {
                value: 'v0',
                label: 'v0.dev / Bolt.new',
                badge: '组件生成',
                description: '单次组件生成高保真 Prompt + 精准动效原子类',
              },
              {
                value: 'claude',
                label: 'Claude 3.7 Sonnet / Gemini',
                badge: '深度推理',
                description: '高级设计思维模式、设计系统规范与全量交互方案',
              },
              {
                value: 'prd',
                label: 'Markdown PRD 规范',
                badge: '团队评审',
                description: '团队设计评审、动效物理参数表与研发交付文档',
              },
            ]}
          />
          <div className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 px-1 truncate">
            自动匹配对应下游工具的最优 Prompt 结构与约束词
          </div>
        </div>
      </div>

      {/* 4. Model Provider Status & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {/* Model Provider Info */}
        <div className="flex items-center gap-2 text-xs">
          {isCustomModelActive ? (
            <div
              onClick={onOpenModelSettings}
              className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">当前模型: <strong>{customModel?.model || 'OpenAI Compatible'}</strong> (自定义)</span>
            </div>
          ) : isAuthKeyActive ? (
            <div
              onClick={onOpenModelSettings}
              className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" />
              <span className="truncate">当前模型: <strong>{systemModel?.model || (systemModel?.hasBuiltin ? '环境变量模型' : '系统内置')}</strong> (已授权)</span>
            </div>
          ) : (
            <div
              onClick={onOpenModelSettings}
              className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>访客模式：需配置自定义大模型或登录授权</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onReset}
            className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 sm:py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (重置)</span>
          </button>

          <button
            type="button"
            disabled={loading || !input.trim()}
            onClick={onGenerate}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Synthesizing (正在生成...)</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-sky-200" />
                <span>重塑为设计师提示词</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
