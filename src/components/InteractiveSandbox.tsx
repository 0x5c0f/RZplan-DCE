import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Layers,
  GripVertical,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Rotate3d,
  Maximize2,
  Minimize2,
  MessageSquare,
  Terminal,
  Copy,
  Check,
  Eye,
  Palette,
  Gauge,
  ArrowRight,
  Sparkle,
  Compass,
  CheckCircle,
  Search,
  Move,
  BarChart3,
  Zap,
} from 'lucide-react';
import {
  DesignerPromptResult,
  DesignStyle,
  STYLE_DEFINITIONS,
  PRESET_RECIPES,
  PresetRecipe,
} from '../utils/promptTransformer';
import { copyTextToClipboard } from '../utils/clipboard';

interface InteractiveSandboxProps {
  result: DesignerPromptResult;
  currentStyle?: DesignStyle;
  activeRecipeId?: string;
  onCopyPrompt?: (prompt: string, label: string) => void;
  onSelectRecipe?: (recipe: PresetRecipe) => void;
}

type PrimitiveType =
  | 'dashboard'
  | 'dragdrop'
  | 'card3d'
  | 'expand'
  | 'stack'
  | 'streaming'
  | 'command-palette';

// Centralized Theme Token Resolver for the Sandbox
const getSandboxThemeClasses = (style: DesignStyle) => {
  switch (style) {
    case 'minimal-clean':
      return {
        isDark: false,
        containerBg: 'bg-white',
        containerBorder: 'border-slate-200/90 shadow-sm',
        cardBg: 'bg-white border-slate-200/90 shadow-md shadow-slate-200/60',
        subCardBg: 'bg-slate-50 border-slate-200/80',
        titleText: 'text-slate-900 font-bold',
        bodyText: 'text-slate-700',
        mutedText: 'text-slate-400',
        accentBadge: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        statValue: 'text-slate-900 font-black',
        divider: 'border-slate-100',
        chartStroke: '#4f46e5',
        chartFill: 'rgba(79, 70, 229, 0.12)',
        glowEffect: '',
      };
    case 'neo-brutalist':
      return {
        isDark: false,
        containerBg: 'bg-[#fffdf7]',
        containerBorder: 'border-2 border-black shadow-[4px_4px_0_0_#000]',
        cardBg: 'bg-[#fef9c3] border-2 border-black shadow-[4px_4px_0_0_#000]',
        subCardBg: 'bg-white border-2 border-black',
        titleText: 'text-black font-black tracking-tight',
        bodyText: 'text-black font-semibold',
        mutedText: 'text-slate-700 font-mono',
        accentBadge: 'bg-yellow-300 text-black border-2 border-black font-bold',
        statValue: 'text-black font-black',
        divider: 'border-black',
        chartStroke: '#000000',
        chartFill: 'rgba(0, 0, 0, 0.08)',
        glowEffect: '',
      };
    case 'glassmorphism':
      return {
        isDark: true,
        containerBg: 'bg-gradient-to-br from-slate-950 via-[#111326] to-slate-950',
        containerBorder: 'border-white/20 shadow-2xl shadow-indigo-950/50',
        cardBg: 'bg-white/10 backdrop-blur-2xl border-white/20 shadow-2xl shadow-indigo-500/10 text-white',
        subCardBg: 'bg-white/5 backdrop-blur-md border-white/15',
        titleText: 'text-white font-bold',
        bodyText: 'text-slate-200',
        mutedText: 'text-slate-300/80',
        accentBadge: 'bg-white/15 text-white border-white/25 backdrop-blur-sm',
        statValue: 'text-white font-black',
        divider: 'border-white/15',
        chartStroke: '#38bdf8',
        chartFill: 'rgba(56, 189, 248, 0.20)',
        glowEffect: 'before:absolute before:inset-0 before:bg-radial before:from-indigo-500/15 before:via-transparent before:to-transparent before:pointer-events-none',
      };
    case 'saas-dense':
      return {
        isDark: true,
        containerBg: 'bg-[#0f172a]',
        containerBorder: 'border-slate-800 shadow-sm',
        cardBg: 'bg-slate-900 border-slate-700/80 shadow-xs text-slate-100',
        subCardBg: 'bg-slate-950 border-slate-800',
        titleText: 'text-slate-100 font-semibold',
        bodyText: 'text-slate-300',
        mutedText: 'text-slate-400',
        accentBadge: 'bg-slate-800 text-sky-400 border border-slate-700',
        statValue: 'text-slate-100 font-black',
        divider: 'border-slate-800',
        chartStroke: '#0ea5e9',
        chartFill: 'rgba(14, 165, 233, 0.15)',
        glowEffect: '',
      };
    case 'linear-dark':
    default:
      return {
        isDark: true,
        containerBg: 'bg-[#0b0c10]',
        containerBorder: 'border-slate-800 shadow-2xl shadow-black/60',
        cardBg: 'bg-[#12131a] border-slate-800/90 shadow-2xl shadow-black/50 text-white',
        subCardBg: 'bg-[#090a0f] border-slate-800/80',
        titleText: 'text-white font-bold',
        bodyText: 'text-slate-300',
        mutedText: 'text-slate-400',
        accentBadge: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25',
        statValue: 'text-white font-extrabold',
        divider: 'border-slate-800/80',
        chartStroke: '#6366f1',
        chartFill: 'rgba(99, 102, 241, 0.18)',
        glowEffect: '',
      };
  }
};

export const InteractiveSandbox: React.FC<InteractiveSandboxProps> = ({
  result,
  currentStyle = 'linear-dark',
  activeRecipeId,
  onCopyPrompt,
  onSelectRecipe,
}) => {
  // Active recipe driven by presets.json
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(
    activeRecipeId || PRESET_RECIPES[0]?.id || 'dashboard-loading'
  );

  const [useDesignerSpec, setUseDesignerSpec] = useState(true);
  const [sandboxStyle, setSandboxStyle] = useState<DesignStyle>(currentStyle);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Sync when activeRecipeId prop changes
  useEffect(() => {
    if (activeRecipeId) {
      setSelectedRecipeId(activeRecipeId);
      const matched = PRESET_RECIPES.find((r) => r.id === activeRecipeId);
      if (matched) {
        setSandboxStyle(matched.style);
      }
    }
  }, [activeRecipeId]);

  // Sync sandbox style when parent changes
  useEffect(() => {
    setSandboxStyle(currentStyle);
  }, [currentStyle]);

  const activeRecipe =
    PRESET_RECIPES.find((r) => r.id === selectedRecipeId) || PRESET_RECIPES[0];
  const activePrimitive: PrimitiveType =
    (activeRecipe?.archetype as PrimitiveType) || 'dashboard';
  const sandboxData = activeRecipe?.sandboxData || {};

  // Theme token classes
  const theme = getSandboxThemeClasses(sandboxStyle);

  // ==========================================
  // Primitive 1: Dashboard Loading & Ease-Out
  // ==========================================
  const targetCounter = sandboxData.metric1Target ?? 128420;
  const targetRevenue = sandboxData.metric2Target ?? 48290;
  const [counterVal, setCounterVal] = useState(0);
  const [revenueVal, setRevenueVal] = useState(0);
  const [chartProgress, setChartProgress] = useState(0);
  const [isReplayingDashboard, setIsReplayingDashboard] = useState(false);

  const runDashboardAwakening = () => {
    setIsReplayingDashboard(true);
    setCounterVal(0);
    setRevenueVal(0);
    setChartProgress(0);

    if (!useDesignerSpec) {
      setTimeout(() => {
        setCounterVal(targetCounter);
        setRevenueVal(targetRevenue);
        setChartProgress(100);
        setIsReplayingDashboard(false);
      }, 350);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeOut = 1 - Math.pow(1 - progress, 3.5);

      setCounterVal(Math.round(easeOut * targetCounter));
      setRevenueVal(Math.round(easeOut * targetRevenue));
      setChartProgress(Math.round(easeOut * 100));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setIsReplayingDashboard(false);
      }
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (activePrimitive === 'dashboard') {
      runDashboardAwakening();
    }
  }, [activePrimitive, useDesignerSpec, selectedRecipeId]);

  // ==========================================
  // Primitive 2: Modular Card Free Drag & Drop
  // ==========================================
  const defaultDragCards = [
    {
      id: 'c1',
      title: '🚀 核心交付里程碑 (v1.0.0)',
      badge: '进行中',
      desc: '包含 7 大原子交互原语的物理模型调优',
      stat: 'Sprint 1 · 100% 完成',
    },
    {
      id: 'c2',
      title: '⚡ API 网关高并发吞吐',
      badge: '健康',
      desc: 'Edge 边缘节点动态流式缓冲，压测延迟 12ms',
      stat: '99.98% 可用性 · 1.2k QPS',
    },
    {
      id: 'c3',
      title: '🎨 设计系统组件库审查',
      badge: '待审核',
      desc: 'Linear 暗黑与 Apple 极简白双主题 CSS Token 校准',
      stat: '14 个新组件待合并',
    },
    {
      id: 'c4',
      title: '👥 核心工程师资源分配',
      badge: '活跃',
      desc: '跨项目算力调度与 DeepSeek-Flash 模型监控',
      stat: '6 位资深工程师在线',
    },
  ];

  const [cards, setCards] = useState(sandboxData.cards || defaultDragCards);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dropHoverIdx, setDropHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    if (sandboxData.cards) {
      setCards(sandboxData.cards);
    } else {
      setCards(defaultDragCards);
    }
  }, [selectedRecipeId]);

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    setDropHoverIdx(idx);
  };

  const handleDrop = (idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) {
      setDraggedIdx(null);
      setDropHoverIdx(null);
      return;
    }

    const next = [...cards];
    const [moved] = next.splice(draggedIdx, 1);
    next.splice(idx, 0, moved);

    setCards(next);
    setDraggedIdx(null);
    setDropHoverIdx(null);
  };

  // ==========================================
  // Primitive 3: 3D Flip Card & Parallax Tilt
  // ==========================================
  const [isFlipped, setIsFlipped] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const card3dRef = useRef<HTMLDivElement>(null);

  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!useDesignerSpec || !card3dRef.current) return;
    const rect = card3dRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTiltX((-y / (rect.height / 2)) * 7);
    setTiltY((x / (rect.width / 2)) * 7);
  };

  const handleMouseLeave3D = () => {
    setTiltX(0);
    setTiltY(0);
  };

  // ==========================================
  // Primitive 4: Spatial Expansion (Shared Element)
  // ==========================================
  const [isExpanded, setIsExpanded] = useState(false);

  // ==========================================
  // Primitive 5: 3D Stacking & Radial Burst
  // ==========================================
  const [isStacked, setIsStacked] = useState(false);

  const getStackCardsForStyle = (st: DesignStyle, customList: any[]) => {
    if (st === 'minimal-clean') {
      return [
        {
          name: 'Apple Platinum Card (白金卡)',
          num: '•••• 8899',
          cardClass: 'bg-gradient-to-br from-white to-slate-100 border border-slate-300/80 shadow-xl',
          nameClass: 'text-slate-900 font-bold',
          numClass: 'text-slate-500 font-mono font-semibold',
        },
        {
          name: 'Apple Titanium Card (钛金卡)',
          num: '•••• 4201',
          cardClass: 'bg-gradient-to-br from-slate-50 to-slate-200 border border-slate-300 shadow-xl',
          nameClass: 'text-slate-900 font-bold',
          numClass: 'text-slate-500 font-mono font-semibold',
        },
        {
          name: 'Nordic Slate Card (北欧极简)',
          num: '•••• 7312',
          cardClass: 'bg-gradient-to-br from-slate-200 to-slate-300 border border-slate-400 shadow-xl',
          nameClass: 'text-slate-900 font-bold',
          numClass: 'text-slate-600 font-mono font-semibold',
        },
      ];
    }
    if (st === 'neo-brutalist') {
      return [
        {
          name: 'Yellow Brutalist Card (亮黄卡)',
          num: '•••• 8899',
          cardClass: 'bg-yellow-300 border-2 border-black shadow-[4px_4px_0_0_#000]',
          nameClass: 'text-black font-black',
          numClass: 'text-black font-mono font-black',
        },
        {
          name: 'Cyan Rebel Card (青蓝卡)',
          num: '•••• 4201',
          cardClass: 'bg-cyan-300 border-2 border-black shadow-[4px_4px_0_0_#000]',
          nameClass: 'text-black font-black',
          numClass: 'text-black font-mono font-black',
        },
        {
          name: 'Hot Pink Card (品红卡)',
          num: '•••• 7312',
          cardClass: 'bg-pink-300 border-2 border-black shadow-[4px_4px_0_0_#000]',
          nameClass: 'text-black font-black',
          numClass: 'text-black font-mono font-black',
        },
      ];
    }
    // Dark / Glass / SaaS
    return customList.map((c: any) => ({
      name: c.name,
      num: c.num,
      cardClass: `bg-gradient-to-br ${c.color} border ${c.border} shadow-2xl`,
      nameClass: 'text-white font-bold',
      numClass: 'text-slate-300 font-mono font-bold',
    }));
  };

  // ==========================================
  // Primitive 6: AI Streaming & Shimmer
  // ==========================================
  const [streamText, setStreamText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isStreamingActive, setIsStreamingActive] = useState(false);

  const fullAiResponse =
    sandboxData.sampleStream ||
    '为保证 60fps 丝滑帧率，系统采用 FLIP (First, Last, Invert, Play) 算法接管 DOM 几何变换，核心数值递增通过 requestAnimationFrame 驱动三次贝塞尔缓动，零生硬闪烁。已注入 prefers-reduced-motion 无障碍降级规范。';

  const triggerAiStreaming = () => {
    setIsStreamingActive(true);
    setStreamText('');

    if (!useDesignerSpec) {
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setStreamText(fullAiResponse);
        setIsStreamingActive(false);
      }, 500);
      return;
    }

    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < fullAiResponse.length) {
          setStreamText(fullAiResponse.slice(0, idx + 1));
          idx += 2;
        } else {
          clearInterval(interval);
          setIsStreamingActive(false);
        }
      }, 25);
    }, 900);
  };

  // ==========================================
  // Primitive 7: ⌘K Global Command Palette
  // ==========================================
  const [commandSearch, setCommandSearch] = useState('');
  const [selectedCommandIdx, setSelectedCommandIdx] = useState(0);

  const commandItems = sandboxData.commands || [
    { title: '重塑为工业级设计师提示词', shortcut: '↵ Enter', category: '核心操作' },
    { title: '切换视觉设计风格为 Linear.app 暗黑极客', shortcut: '⌥ 1', category: '设计流派' },
    { title: '启动交互沙盒物理双轨手感对比', shortcut: '⌥ S', category: '物理实验' },
    { title: '复制下游 Cursor .cursorrules 交付规则', shortcut: '⌘ C', category: 'AI 交付' },
    { title: '检索经典开源提示词预设库', shortcut: '⌘ P', category: '预设库' },
  ];

  const filteredCommands = commandItems.filter(
    (c: any) =>
      c.title.toLowerCase().includes(commandSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(commandSearch.toLowerCase())
  );

  // Copy current active prompt
  const getActivePromptForPrimitive = () => {
    return activeRecipe?.designerPrompt || result.enhancedPrompt;
  };

  const handleCopyCurrentPrompt = async () => {
    const prompt = getActivePromptForPrimitive();
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
    await copyTextToClipboard(prompt);
    onCopyPrompt?.(prompt, activeRecipe.shortTitle || activeRecipe.title);
  };

  const renderRecipeIcon = (iconName?: string) => {
    switch (iconName) {
      case 'BarChart3':
        return <TrendingUp className="w-3.5 h-3.5" />;
      case 'Move':
        return <GripVertical className="w-3.5 h-3.5" />;
      case 'Rotate3d':
        return <Rotate3d className="w-3.5 h-3.5" />;
      case 'Maximize2':
        return <Maximize2 className="w-3.5 h-3.5" />;
      case 'Layers':
        return <Layers className="w-3.5 h-3.5" />;
      case 'MessageSquare':
        return <MessageSquare className="w-3.5 h-3.5" />;
      case 'Search':
        return <Search className="w-3.5 h-3.5" />;
      default:
        return <Activity className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Header Toolbar: Dynamically Driven by presets.json */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl shadow-xs transition-colors">
        {/* Dynamic Presets Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 lg:pb-0">
          {PRESET_RECIPES.map((recipe) => {
            const isSelected = selectedRecipeId === recipe.id;
            return (
              <button
                key={recipe.id}
                type="button"
                onClick={() => {
                  setSelectedRecipeId(recipe.id);
                  setSandboxStyle(recipe.style);
                  onSelectRecipe?.(recipe);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                {renderRecipeIcon(recipe.icon)}
                <span>{recipe.shortTitle || recipe.title}</span>
              </button>
            );
          })}
        </div>

        {/* Dual Spec Toggle: Naive vs Designer */}
        <div className="flex items-center gap-2 self-start lg:self-auto bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setUseDesignerSpec(false)}
            className={`px-3 py-1 text-xs rounded-lg transition-all cursor-pointer ${
              !useDesignerSpec
                ? 'bg-red-500/10 text-red-700 dark:text-red-300 font-semibold border border-red-300 dark:border-red-500/30 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            小白实现 (Naive)
          </button>
          <button
            type="button"
            onClick={() => setUseDesignerSpec(true)}
            className={`px-3 py-1 text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              useDesignerSpec
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>设计师方案 (Designer)</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Sandbox Viewport Container */}
      <div
        className={`relative rounded-2xl ${theme.containerBg} ${theme.containerBorder} p-4 sm:p-6 min-h-[460px] flex flex-col justify-between overflow-hidden transition-all ${theme.glowEffect}`}
      >
        {/* Style Tokens Quick Pill Matrix */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 mb-4 border-b ${theme.divider}`}
        >
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Palette className="w-3.5 h-3.5" />
            </span>
            <span className={`text-xs font-semibold ${theme.titleText}`}>
              视觉风格流派实时渲染 (Design Style Tokens):
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'linear-dark', label: 'Linear.app 暗黑' },
              { id: 'minimal-clean', label: 'Apple 极简白' },
              { id: 'neo-brutalist', label: '新野兽派' },
              { id: 'glassmorphism', label: '毛玻璃晶体' },
              { id: 'saas-dense', label: '高密度SaaS' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSandboxStyle(st.id as DesignStyle)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  sandboxStyle === st.id
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            PRIMITIVE 1: Dashboard Loading & Ease-Out Roll-up
            ======================================================== */}
        {activePrimitive === 'dashboard' && (
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${theme.titleText}`}>
                  <span>{activeRecipe.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${theme.accentBadge}`}>
                    {sandboxData.badge || 'Ease Out 1.2s · SVG 描边生长 · 60ms 错峰'}
                  </span>
                </h3>
                <p className={`text-xs mt-0.5 ${theme.mutedText}`}>
                  页面挂载时核心指标数字从 0 平滑递增，趋势折线从左至右同步生长，依次错峰显现。
                </p>
              </div>

              <button
                type="button"
                onClick={runDashboardAwakening}
                disabled={isReplayingDashboard}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重播入场时序 (Replay)</span>
              </button>
            </div>

            {/* Parameterized Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className={`p-5 rounded-2xl border transition-all ${theme.cardBg}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`flex items-center gap-1.5 font-semibold ${theme.titleText}`}>
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    {sandboxData.metric1Label || '平台总活跃用户 (Active Users)'}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {sandboxData.metric1Gain || '+18.4%'}
                  </span>
                </div>
                <div className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight my-2.5 ${theme.statValue}`}>
                  {counterVal.toLocaleString()}
                </div>
                <div className={`flex items-center justify-between text-[11px] ${theme.mutedText}`}>
                  <span>{sandboxData.metric1Cycle || '采样周期: 24h'}</span>
                  <span className="font-medium">{useDesignerSpec ? '稳定态软着陆 (Soft Landing)' : '无缓动硬刹车'}</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className={`p-5 rounded-2xl border transition-all ${theme.cardBg}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`flex items-center gap-1.5 font-semibold ${theme.titleText}`}>
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    {sandboxData.metric2Label || '本月总营收 (Net Revenue)'}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {sandboxData.metric2Gain || '+24.1%'}
                  </span>
                </div>
                <div className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight my-2.5 ${theme.statValue}`}>
                  {sandboxData.metric2Prefix || '$'}{revenueVal.toLocaleString()}
                </div>
                <div className={`flex items-center justify-between text-[11px] ${theme.mutedText}`}>
                  <span>{sandboxData.metric2Rate || '转化效率: 99.4%'}</span>
                  <span className="font-medium">Ease-Out 闭环</span>
                </div>
              </div>
            </div>

            {/* SVG Progressive Stroke-Dashoffset Graph */}
            <div className={`p-4 rounded-xl ${theme.subCardBg} border ${theme.divider} overflow-hidden`}>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className={`flex items-center gap-1.5 ${theme.titleText}`}>
                  <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                  {sandboxData.chartLabel || '趋势折线自左向右描边绘制 (SVG Path Stroke-Dashoffset)'}
                </span>
                <span className="font-mono text-[11px] text-indigo-500 font-bold">{chartProgress}% 完成</span>
              </div>
              <div className="h-16 w-full relative flex items-center">
                <svg className="w-full h-12" viewBox="0 0 500 50" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={theme.chartStroke} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={theme.chartStroke} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 38 Q 125 10 250 30 T 500 12 L 500 50 L 0 50 Z"
                    fill="url(#chartGradient)"
                    opacity={chartProgress / 100}
                  />
                  <path
                    d="M 0 38 Q 125 10 250 30 T 500 12"
                    fill="none"
                    stroke={theme.chartStroke}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="520"
                    strokeDashoffset={520 - (520 * chartProgress) / 100}
                    style={{
                      transition: useDesignerSpec ? 'stroke-dashoffset 40ms linear' : 'none',
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            PRIMITIVE 2: Modular Card Free Drag & Drop
            ======================================================== */}
        {activePrimitive === 'dragdrop' && (
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${theme.titleText}`}>
                  <span>{activeRecipe.title}</span>
                  {useDesignerSpec ? (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${theme.accentBadge}`}>
                      {sandboxData.badge || '按压拾起 · FLIP 让位 · 弹簧磁吸网格'}
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                      生硬瞬切 · 缺乏位移物理反馈
                    </span>
                  )}
                </h3>
                <p className={`text-xs mt-0.5 ${theme.mutedText}`}>
                  鼠标按住任一卡片并拖拽到其他卡片上方，体验让位动画与松开吸附的区别。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {cards.map((card: any, idx: number) => {
                const isCurrentDragged = draggedIdx === idx;
                const isOver = dropHoverIdx === idx && draggedIdx !== idx;

                return (
                  <div
                    key={card.id || idx}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={() => handleDrop(idx)}
                    onDragEnd={() => {
                      setDraggedIdx(null);
                      setDropHoverIdx(null);
                    }}
                    style={{
                      transition: useDesignerSpec
                        ? 'transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 260ms ease, border-color 200ms ease'
                        : 'none',
                      transform: isCurrentDragged
                        ? useDesignerSpec
                          ? 'scale(1.04) translateY(-4px)'
                          : 'scale(1)'
                        : isOver && useDesignerSpec
                        ? 'translateY(6px)'
                        : 'translateY(0)',
                    }}
                    className={`cursor-grab active:cursor-grabbing select-none p-4 rounded-xl border ${
                      isCurrentDragged
                        ? 'opacity-85 border-indigo-500 shadow-2xl shadow-indigo-500/25 z-20'
                        : isOver
                        ? 'border-sky-500/80 bg-slate-800/80'
                        : ''
                    } ${theme.cardBg} flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${theme.subCardBg} text-slate-500`}>
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`text-xs block font-bold ${theme.titleText}`}>{card.title}</span>
                        <span className={`text-[11px] ${theme.mutedText} line-clamp-1 mt-0.5`}>{card.desc}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {card.badge || '活跃'}
                      </span>
                      <span className={`text-[10px] ${theme.mutedText}`}>{card.stat || `槽位 #${idx + 1}`}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`p-3 ${theme.subCardBg} border ${theme.divider} rounded-xl text-xs ${theme.mutedText} flex items-center justify-between`}>
              <span>💡 设计师核心约束：抬起 120ms 触发 scale(1.035)，释放触发 Spring(400, 25) 弹性吸附网格。</span>
            </div>
          </div>
        )}

        {/* ========================================================
            PRIMITIVE 3: 3D Parallax Tilt & 180° Flip Card
            ======================================================== */}
        {activePrimitive === 'card3d' && (
          <div className="flex flex-col items-center justify-center gap-4 flex-1 py-4">
            <div className="text-center">
              <h3 className={`text-sm font-bold flex items-center justify-center gap-2 ${theme.titleText}`}>
                <Rotate3d className="w-4 h-4 text-indigo-400" />
                <span>{activeRecipe.title}</span>
              </h3>
              <p className={`text-xs mt-1 ${theme.mutedText}`}>
                鼠标在卡片上晃动观察三维微倾斜视差；点击卡片翻转 180° 查看背面高密度明细。
              </p>
            </div>

            <div
              className="relative w-full max-w-[420px] h-[240px] cursor-pointer select-none"
              style={{ perspective: useDesignerSpec ? '1000px' : 'none' }}
              onClick={() => setIsFlipped(!isFlipped)}
              onMouseMove={handleMouseMove3D}
              onMouseLeave={handleMouseLeave3D}
              ref={card3dRef}
            >
              <div
                className="w-full h-full relative rounded-2xl"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: useDesignerSpec
                    ? `rotateX(${tiltX}deg) rotateY(${tiltY + (isFlipped ? 180 : 0)}deg)`
                    : isFlipped
                    ? 'rotateY(180deg)'
                    : 'none',
                  transition: useDesignerSpec ? 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                }}
              >
                {/* Front Face */}
                <div
                  className={`absolute inset-0 p-5 rounded-2xl border flex flex-col justify-between ${theme.cardBg}`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-semibold flex items-center gap-1.5 ${theme.titleText} truncate`}>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span className="truncate">正面：{sandboxData.front?.productName || '核心指标概览 (Click to Flip)'}</span>
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap ${theme.accentBadge}`}>
                      {sandboxData.front?.badge || 'Y-180°'}
                    </span>
                  </div>

                  <div className="my-auto">
                    <div className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${theme.statValue}`}>
                      {sandboxData.front?.price || '$942, 850'}
                    </div>
                    <div className={`text-xs mt-1 ${theme.mutedText}`}>
                      {sandboxData.front?.subtitle || '本季度全渠道 ARR · 触感平滑微倾角 ±7deg'}
                    </div>
                  </div>

                  <div className={`flex items-center justify-between text-[11px] border-t ${theme.divider} pt-2 mt-auto`}>
                    <span className={theme.mutedText}>点击卡片无缝翻转</span>
                    <span className="text-indigo-400 font-semibold cursor-pointer">
                      {sandboxData.front?.footerAction || '查看背面明细 →'}
                    </span>
                  </div>
                </div>

                {/* Back Face */}
                <div
                  className={`absolute inset-0 p-5 rounded-2xl border flex flex-col justify-between ${
                    theme.isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-xl'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      {sandboxData.back?.title || '背面：高密度数据明细'}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${theme.accentBadge}`}>
                      {sandboxData.back?.badge || 'Backface Active'}
                    </span>
                  </div>

                  {sandboxData.back?.timeline ? (
                    <div className="space-y-1.5 my-auto text-[11px]">
                      {sandboxData.back.timeline.map((node: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="font-mono text-indigo-400 font-semibold flex-shrink-0">{node.time}</span>
                          <span className={`${theme.bodyText} truncate`}>{node.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-7 gap-1 h-20 items-end bg-slate-900/60 p-2 rounded-lg my-auto">
                      {[40, 65, 30, 85, 95, 70, 80].map((h, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-indigo-500 rounded-t"
                            style={{ height: `${h * 0.5}px` }}
                          />
                          <span className="text-[9px] font-mono text-slate-500">M{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={`flex items-center justify-between text-[11px] border-t ${theme.divider} pt-2 mt-auto`}>
                    <span className={theme.mutedText}>点击再次翻回正面</span>
                    <span className="text-sky-400 font-semibold">返回概览 ↩</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            PRIMITIVE 4: Spatial Expansion (Shared Element Panel)
            ======================================================== */}
        {activePrimitive === 'expand' && (
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${theme.titleText}`}>
                  <Maximize2 className="w-4 h-4 text-indigo-400" />
                  <span>{activeRecipe.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${theme.accentBadge}`}>
                    {sandboxData.badge || 'Shared Element 原位平滑形变 · 4 列弹性折行'}
                  </span>
                </h3>
                <p className={`text-xs mt-0.5 ${theme.mutedText}`}>
                  点击卡片体验原位物理膨胀与背景高斯模糊退让。
                </p>
              </div>
            </div>

            {/* Expansion Container */}
            <div className="relative min-h-[220px] flex items-center justify-center">
              {!isExpanded ? (
                <div
                  onClick={() => setIsExpanded(true)}
                  className={`w-full max-w-md p-5 rounded-2xl border cursor-pointer hover:scale-[1.015] active:scale-[0.99] transition-all ${theme.cardBg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${theme.titleText}`}>
                      {sandboxData.cardTitle || '今日重点推进任务 (4 项紧急待交付)'}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${theme.accentBadge}`}>
                      点击展开
                    </span>
                  </div>
                  <p className={`text-xs mt-1.5 ${theme.mutedText}`}>
                    {sandboxData.cardSubtitle || '点击卡片体验原位物理膨胀与背景高斯模糊退让'}
                  </p>
                </div>
              ) : (
                <div
                  className={`w-full p-5 rounded-2xl border animate-in zoom-in-95 duration-200 ${theme.cardBg}`}
                >
                  <div className={`flex items-center justify-between pb-3 border-b ${theme.divider} mb-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${theme.titleText}`}>
                        {sandboxData.cardTitle || '今日重点推进任务'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                        全量展开态 (In-Place Expanded)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className={`p-1 rounded-lg ${theme.subCardBg} text-slate-400 hover:text-white transition-colors cursor-pointer`}
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {(sandboxData.missions || [
                      { title: '微交互弹性阻尼标定', tag: '动效系统', status: '进行中', priority: 'P0' },
                      { title: '跨框架适配规范文档', tag: '架构设计', status: '已完成', priority: 'P1' },
                      { title: '高对比暗黑主题色彩', tag: '视觉规范', status: '待审查', priority: 'P1' },
                      { title: '多端键盘无障碍 Tab', tag: 'A11y 体验', status: '排期中', priority: 'P2' },
                    ]).map((mission: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl ${theme.subCardBg} border ${theme.divider} flex flex-col justify-between`}
                      >
                        <span className="text-[10px] text-indigo-400 font-semibold">{mission.tag}</span>
                        <h4 className={`text-xs font-bold ${theme.titleText} my-1`}>{mission.title}</h4>
                        <div className={`flex items-center justify-between text-[10px] ${theme.mutedText} mt-2 pt-2 border-t ${theme.divider}`}>
                          <span>{mission.status}</span>
                          <span className="font-mono text-amber-400 font-bold">{mission.priority}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            PRIMITIVE 5: 3D Deck Stacking & Radial Burst
            ======================================================== */}
        {activePrimitive === 'stack' && (
          <div className="flex flex-col items-center justify-center gap-4 flex-1 py-4">
            <div className="text-center">
              <h3 className={`text-sm font-bold flex items-center justify-center gap-2 ${theme.titleText}`}>
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>{activeRecipe.title}</span>
              </h3>
              <p className={`text-xs mt-1 ${theme.mutedText}`}>
                点击按钮切换双稳态：向心 3D 纸牌微倾角叠放 vs 径向迸发散开。
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsStacked(!isStacked)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isStacked ? '点击触发径向弹性散开 (Radial Burst)' : '点击触发向心 3D 纸牌聚合 (Deck Stack)'}</span>
            </button>

            <div className="relative w-full max-w-md h-48 flex items-center justify-center my-4">
              {getStackCardsForStyle(sandboxStyle, sandboxData.cards || [
                { name: 'Black Obsidian VIP (无限黑卡)', num: '•••• 8899', color: 'from-slate-900 to-indigo-950', border: 'border-indigo-500/40' },
                { name: 'Apple Titanium Card (钛金卡)', num: '•••• 4201', color: 'from-slate-800 to-slate-900', border: 'border-slate-700' },
                { name: 'Emerald Private Reserve (翡翠私享)', num: '•••• 7312', color: 'from-emerald-950 to-slate-900', border: 'border-emerald-500/40' },
              ]).map((c: any, idx: number) => {
                const offsets = [
                  { x: -110, y: 0, r: -4 },
                  { x: 0, y: 0, r: 0 },
                  { x: 110, y: 0, r: 4 },
                ];
                const stackedAngles = [-3.5, 0, 3];

                const curOffset = offsets[idx % offsets.length];
                const angle = isStacked ? stackedAngles[idx % 3] : curOffset.r;
                const posX = isStacked ? 0 : curOffset.x;
                const posY = isStacked ? idx * -6 : curOffset.y;
                const zIndex = isStacked ? 10 + idx : 1;

                return (
                  <div
                    key={idx}
                    style={{
                      transform: `translate3d(${posX}px, ${posY}px, 0) rotate(${angle}deg)`,
                      zIndex,
                      transition: useDesignerSpec
                        ? 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 550ms ease'
                        : 'none',
                    }}
                    className={`absolute w-44 h-28 rounded-xl p-3 ${c.cardClass} flex flex-col justify-between select-none`}
                  >
                    <div className={`text-[10px] tracking-wider truncate ${c.nameClass}`}>{c.name}</div>
                    <div className={`text-xs tracking-widest ${c.numClass}`}>{c.num}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            PRIMITIVE 6: AI Streaming & Shimmer Pulse
            ======================================================== */}
        {activePrimitive === 'streaming' && (
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${theme.titleText}`}>
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>{activeRecipe.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${theme.accentBadge}`}>
                    {sandboxData.badge || 'Shimmer 呼吸骨架流光 · 字符打字机流 · 终端脉冲游标'}
                  </span>
                </h3>
                <p className={`text-xs mt-0.5 ${theme.mutedText}`}>
                  体验思考中的流体微光骨架屏脉冲，平滑转入打字机实时字符流与终端脉冲游标。
                </p>
              </div>

              <button
                type="button"
                onClick={triggerAiStreaming}
                disabled={isStreamingActive}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>触发 AI 流式思考</span>
              </button>
            </div>

            <div className={`p-4 rounded-xl ${theme.subCardBg} border ${theme.divider} min-h-[160px] flex flex-col justify-center`}>
              {isThinking && (
                <div className="space-y-2.5 animate-pulse">
                  <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>{sandboxData.aiRole || 'DesignCraftsman AI 架构智能体'} 正在分析物理动效与 FLIP 几何约束...</span>
                  </div>
                  <div className={`h-3.5 ${theme.isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded-full w-3/4`}></div>
                  <div className={`h-3.5 ${theme.isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded-full w-1/2`}></div>
                </div>
              )}

              {streamText && (
                <div className={`text-xs ${theme.bodyText} leading-relaxed font-sans`}>
                  {streamText}
                  {isStreamingActive && (
                    <span className="inline-block w-1.5 h-3.5 bg-indigo-500 ml-1 animate-pulse align-middle"></span>
                  )}
                </div>
              )}

              {!isThinking && !streamText && (
                <div className={`text-center py-6 text-xs ${theme.mutedText}`}>
                  点击右上角「触发 AI 流式思考」，亲身感受真实打字机与骨架屏时序体验。
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            PRIMITIVE 7: ⌘K Command Palette
            ======================================================== */}
        {activePrimitive === 'command-palette' && (
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${theme.titleText}`}>
                  <Search className="w-4 h-4 text-indigo-400" />
                  <span>{activeRecipe.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${theme.accentBadge}`}>
                    {sandboxData.badge || 'Spring 曲线 · 8px 高斯模糊 · 游标平滑滑动'}
                  </span>
                </h3>
                <p className={`text-xs mt-0.5 ${theme.mutedText}`}>
                  输入指令进行即时过滤，上下移动或悬浮选择指令，体验带弹性反馈的快捷指令中心。
                </p>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border max-w-xl mx-auto w-full transition-all ${theme.cardBg} ${
                useDesignerSpec ? 'backdrop-blur-md ring-1 ring-indigo-500/30' : 'shadow-none'
              }`}
            >
              {/* Search Bar */}
              <div className={`flex items-center gap-2.5 pb-3 border-b ${theme.divider}`}>
                <Search className={`w-4 h-4 ${theme.mutedText}`} />
                <input
                  type="text"
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  placeholder={sandboxData.placeholder || '输入指令或按上下方向键浏览...'}
                  className={`bg-transparent border-none outline-none text-xs w-full ${theme.titleText} placeholder:text-slate-400`}
                />
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${theme.accentBadge}`}>
                  ESC
                </span>
              </div>

              {/* Commands List */}
              <div className="mt-2 space-y-1">
                {filteredCommands.map((cmd: any, idx: number) => {
                  const isSelected = selectedCommandIdx === idx;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setSelectedCommandIdx(idx)}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-medium shadow-sm'
                          : `${theme.bodyText} hover:bg-slate-500/10`
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{cmd.title}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className={isSelected ? 'text-indigo-200' : theme.mutedText}>
                          {cmd.category}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-indigo-700 text-white' : `${theme.subCardBg} ${theme.mutedText}`
                          }`}
                        >
                          {cmd.shortcut}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. Bottom Prompt Bar: Direct Prompt Linkage & Copy Action */}
        <div
          className={`mt-5 pt-3.5 border-t ${theme.divider} flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${theme.subCardBg} p-3 rounded-xl`}
        >
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <Terminal className="w-3.5 h-3.5" />
            </span>
            <div className="truncate">
              <span className={`text-xs font-bold block truncate ${theme.titleText}`}>
                所见即所得：当前沙盒场景的专属重塑提示词 ({activeRecipe.shortTitle || activeRecipe.title})
              </span>
              <span className={`text-[11px] truncate block ${theme.mutedText}`}>
                已调教好所有 Spring、FLIP、Ease-Out 物理常数与业务语义，可直接粘贴喂给 Cursor / v0
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyCurrentPrompt}
            className="flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all cursor-pointer"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>已复制提示词！</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>一键复制该效果提示词</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
