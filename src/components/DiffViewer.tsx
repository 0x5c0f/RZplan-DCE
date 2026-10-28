import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Check,
  Copy,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Play,
  Pause,
  RotateCcw,
  Repeat,
  SkipBack,
  SkipForward,
  Gauge,
  Activity,
  Timer,
  Zap,
  Sliders,
} from 'lucide-react';
import { DesignerPromptResult } from '../utils/promptTransformer';
import { copyTextToClipboard } from '../utils/clipboard';
import {
  parseCubicBezier,
  solveCubicBezier,
  getMotionPhaseInfo,
} from '../utils/motionMath';

interface DiffViewerProps {
  result: DesignerPromptResult;
  onCopy: (text: string) => void;
  onOpenSandbox?: () => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ result, onCopy, onOpenSandbox }) => {
  const [copied, setCopied] = useState(false);

  // Motion Timeline Inspector States
  const rawDurationMs = Math.max(100, parseInt(result.motionSpec.duration, 10) || 320);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.1 | 0.25 | 0.5 | 1.0>(0.5); // Default to 0.5x for clear observation
  const [tactileState, setTactileState] = useState<'default' | 'hover' | 'active'>('default');

  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(380);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Parse control points from easing bezier
  const bezierPoints = parseCubicBezier(result.motionSpec.easingBezier);
  const [x1, y1, x2, y2] = bezierPoints;

  // Normalized time (0 to 1)
  const normalizedTime = Math.min(1, Math.max(0, currentTimeMs / rawDurationMs));

  // Designer curve displacement progress
  const designerProgress = solveCubicBezier(x1, y1, x2, y2, normalizedTime);

  // Linear contrast curve displacement progress
  const linearProgress = normalizedTime;

  // Phase diagnosis
  const phaseInfo = getMotionPhaseInfo(normalizedTime, designerProgress);

  // Dynamic travel distance: track width minus runner width (96px)
  const runnerWidth = 96;
  const travelDistance = Math.max(60, trackWidth - runnerWidth - 12);

  // ResizeObserver to calculate real track displacement
  useEffect(() => {
    if (!trackRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setTrackWidth(entry.contentRect.width);
      }
    });
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  // RequestAnimationFrame Timeline Loop
  const tick = useCallback(
    (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const deltaMs = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setCurrentTimeMs((prev) => {
        const next = prev + deltaMs * playbackSpeed;
        if (next >= rawDurationMs) {
          if (isLooping) {
            // Loop back to start smoothly
            return 0;
          } else {
            setIsPlaying(false);
            return rawDurationMs;
          }
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    },
    [playbackSpeed, rawDurationMs, isLooping]
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      lastTimeRef.current = null;
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, tick]);

  // Scrubbing & step handlers
  const handleScrub = (val: number) => {
    setIsPlaying(false);
    setCurrentTimeMs(Math.max(0, Math.min(rawDurationMs, val)));
  };

  const handleStep = (direction: 'back' | 'forward') => {
    setIsPlaying(false);
    const frameDuration = 16.666; // 60fps frame duration
    setCurrentTimeMs((prev) => {
      const next = direction === 'back' ? prev - frameDuration : prev + frameDuration;
      return Math.max(0, Math.min(rawDurationMs, Math.round(next * 10) / 10));
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTimeMs(0);
  };

  const handleTogglePlay = () => {
    if (!isPlaying && currentTimeMs >= rawDurationMs) {
      setCurrentTimeMs(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleCopy = async () => {
    const textToCopy = result.enhancedPrompt;
    const success = await copyTextToClipboard(textToCopy);
    onCopy(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Design Diagnosis & Gaps Bar */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4.5 flex flex-col gap-2.5 sm:gap-3 shadow-sm transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <Cpu className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-200">
              资深设计师 Agent 诊断报告 (Design Diagnosis)
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-2 sm:px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap">
            已补全 4 大维度
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {result.intentAnalysis.summary}
        </p>

        {/* Identified Gaps vs Injected Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="bg-red-50/60 dark:bg-red-500/5 border border-red-200 dark:border-red-500/15 rounded-xl p-3 flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-red-700 dark:text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              开发者原表达缺失的维度 (Identified Gaps):
            </span>
            <ul className="text-slate-600 dark:text-slate-400 space-y-1 pl-1 text-[11px]">
              {result.intentAnalysis.identifiedGaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-red-500">•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-50/60 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/15 rounded-xl p-3 flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              设计师注入的工程级约束 (Designer Injection):
            </span>
            <ul className="text-slate-600 dark:text-slate-400 space-y-1 pl-1 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500">•</span>
                <span>
                  精确缓动曲线: <code className="text-emerald-700 dark:text-emerald-300 font-mono font-medium">{result.motionSpec.easingBezier}</code> ({result.motionSpec.duration})
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500">•</span>
                <span>
                  物理回弹与阻尼: Spring stiffness: {result.motionSpec.springStiffness}, damping: {result.motionSpec.springDamping}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500">•</span>
                <span>
                  入场错峰与微触感: Stagger {result.motionSpec.staggerDelay}, Hover: {result.motionSpec.scaleHover}, Active: {result.motionSpec.scaleActive}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500">•</span>
                <span>视觉层级: {result.designTokens.surface} 配合 {result.designTokens.radius}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Side-by-Side Prompt Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Raw Developer Input */}
        <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"></span>
              原始输入 (开发者口语习惯)
            </span>
            <span className="text-[10px] text-slate-500 font-mono bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
              意图模糊 · 缺乏动效数学模型
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed min-h-[140px] flex flex-col justify-between shadow-xs">
            <p className="italic text-slate-500 dark:text-slate-400">"{result.rawInput}"</p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 dark:text-slate-500">
              ⚠️ 大模型若仅收到这段话，通常只能输出生硬的无过渡跳变或滥用简单的 transition: all 0.3s。
            </div>
          </div>
        </div>

        {/* Right: Enhanced Designer Prompt */}
        <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-indigo-50/60 dark:bg-gradient-to-br dark:from-indigo-950/30 dark:via-slate-900/80 dark:to-sky-950/20 border border-indigo-200 dark:border-indigo-500/30 shadow-md shadow-indigo-500/5 dark:shadow-indigo-950/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              设计师重塑提示词 (Designer-Grade Prompt)
            </span>
            <button
              onClick={handleCopy}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-600/30 hover:bg-indigo-200 dark:hover:bg-indigo-600/50 border border-indigo-300 dark:border-indigo-500/40 rounded-lg transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300">已复制提示词</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>一键复制提示词</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/90 border border-indigo-200 dark:border-indigo-500/20 text-xs text-slate-800 dark:text-slate-100 leading-relaxed min-h-[140px] flex flex-col justify-between shadow-xs">
            <p className="font-sans font-medium text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
              {result.enhancedPrompt}
            </p>

            {/* Injected Feature Badges */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
              {result.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 font-medium"
                >
                  #{tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Motion Parameters Matrix Table */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 flex flex-col gap-4 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            设计师数学模型与物理参数表 (Motion & Physics Specs)
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            已量化为工业级 CSS 物理属性
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl p-2.5">
            <span className="text-[11px] text-slate-500 block">缓动算法 (Easing)</span>
            <span className="text-slate-900 dark:text-slate-200 font-mono font-medium block truncate mt-0.5">
              {result.motionSpec.easingBezier}
            </span>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">{result.motionSpec.easing}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl p-2.5">
            <span className="text-[11px] text-slate-500 block">弹簧张力 / 阻尼</span>
            <span className="text-slate-900 dark:text-slate-200 font-mono font-medium block mt-0.5">
              {result.motionSpec.springStiffness} / {result.motionSpec.springDamping}
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">零生硬碰撞感</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl p-2.5">
            <span className="text-[11px] text-slate-500 block">阶梯错峰 (Stagger)</span>
            <span className="text-slate-900 dark:text-slate-200 font-mono font-medium block mt-0.5">
              {result.motionSpec.staggerDelay}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">节奏韵律递进</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl p-2.5">
            <span className="text-[11px] text-slate-500 block">悬浮 / 按压触感</span>
            <span className="text-slate-900 dark:text-slate-200 font-mono font-medium block mt-0.5">
              +{Math.round((result.motionSpec.scaleHover - 1) * 100)}% / -{Math.round((1 - result.motionSpec.scaleActive) * 100)}%
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">亚像素缩放反响</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* NEW: Motion Timeline Inspector (动效时间轴逐帧审查器) */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-1 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-4 bg-slate-50/80 dark:bg-slate-950/70 rounded-2xl p-3.5 sm:p-5">
          {/* Header & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Sliders className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  动效时间轴逐帧审查器 (Motion Timeline Inspector)
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full">
                    毫秒级微操 · 逐帧解算
                  </span>
                </h3>
              </div>
            </div>

            {/* Current Phase Pill */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">当前解算阶段:</span>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition-all ${
                  phaseInfo.phaseKey === 'burst'
                    ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500/30'
                    : phaseInfo.phaseKey === 'cruise'
                    ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-300 dark:border-sky-500/30'
                    : phaseInfo.phaseKey === 'landing'
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-500/30'
                    : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30'
                }`}
              >
                {phaseInfo.name}
              </span>
            </div>
          </div>

          {/* Interactive Timeline Track & Playhead */}
          <div className="flex flex-col gap-2 p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            {/* Timeline Header Telemetry */}
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Timer className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {currentTimeMs.toFixed(1)} ms
                </span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-500">{rawDurationMs} ms</span>
                <span className="text-[11px] font-sans text-slate-500 dark:text-slate-400 ml-1">
                  ({Math.round(normalizedTime * 100)}% 时间轴)
                </span>
              </div>

              {/* Progress & Lead Ratio */}
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
                  设计位移: <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{(designerProgress * 100).toFixed(1)}%</span>
                </span>
                <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
                  匀速位移: <span className="font-bold text-slate-600 dark:text-slate-400 font-mono">{(linearProgress * 100).toFixed(1)}%</span>
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-mono">
                  {phaseInfo.leadRatio}
                </span>
              </div>
            </div>

            {/* Custom Range Scrubber */}
            <div className="relative flex flex-col pt-1 pb-1">
              {/* Ruler Tick Marks */}
              <div className="relative w-full h-3 mb-1 flex items-center justify-between text-[9px] font-mono text-slate-400 select-none">
                <span>0ms</span>
                <span className="hidden sm:inline">{Math.round(rawDurationMs * 0.25)}ms</span>
                <span>{Math.round(rawDurationMs * 0.5)}ms</span>
                <span className="hidden sm:inline">{Math.round(rawDurationMs * 0.75)}ms</span>
                <span>{rawDurationMs}ms</span>
              </div>

              {/* Range Slider Track */}
              <div className="relative w-full flex items-center">
                {/* Background Progress bar */}
                <div className="absolute inset-y-0 left-0 right-0 h-2 my-auto bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden pointer-events-none">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-sky-500"
                    style={{ width: `${normalizedTime * 100}%` }}
                  />
                </div>

                <input
                  type="range"
                  min={0}
                  max={rawDurationMs}
                  step={0.5}
                  value={currentTimeMs}
                  onChange={(e) => handleScrub(parseFloat(e.target.value))}
                  className="relative z-10 w-full h-5 opacity-80 hover:opacity-100 cursor-ew-resize accent-indigo-600 dark:accent-indigo-500 focus:outline-hidden"
                  aria-label="动效时间轴进度滑块"
                />
              </div>

              {/* Phase regions indicator */}
              <div className="relative w-full h-1.5 mt-1 rounded-full overflow-hidden flex text-[8px]">
                <div
                  className="bg-amber-400/80 dark:bg-amber-500/60"
                  style={{ width: '25%' }}
                  title="0-25%: 爆发加速阶段"
                />
                <div
                  className="bg-sky-400/80 dark:bg-sky-500/60"
                  style={{ width: '40%' }}
                  title="25-65%: 极速过渡巡航"
                />
                <div
                  className="bg-indigo-400/80 dark:bg-indigo-500/60"
                  style={{ width: '33%' }}
                  title="65-98%: 阻尼软着陆阶段"
                />
                <div
                  className="bg-emerald-400/80 dark:bg-emerald-500/60"
                  style={{ width: '2%' }}
                  title="98-100%: 闭环停泊"
                />
              </div>
            </div>

            {/* Transport Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              {/* Left Playback Buttons */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* Reset to Start */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="复位至 0ms 起点"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Step Back (Single Frame: -16.7ms) */}
                <button
                  type="button"
                  onClick={() => handleStep('back')}
                  className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title="后退一帧 (-16.7ms 逐帧审查)"
                >
                  <SkipBack className="w-3 h-3" />
                  <span className="hidden sm:inline">-1帧</span>
                </button>

                {/* Play / Pause Toggle */}
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                  title={isPlaying ? '暂停动效 (空格)' : '播放动效'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>暂停</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>播放</span>
                    </>
                  )}
                </button>

                {/* Step Forward (Single Frame: +16.7ms) */}
                <button
                  type="button"
                  onClick={() => handleStep('forward')}
                  className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title="前进一帧 (+16.7ms 逐帧审查)"
                >
                  <span className="hidden sm:inline">+1帧</span>
                  <SkipForward className="w-3 h-3" />
                </button>

                {/* Loop Toggle */}
                <button
                  type="button"
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ml-1 ${
                    isLooping
                      ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30'
                      : 'text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={isLooping ? '循环播放已开启' : '开启循环播放'}
                >
                  <Repeat className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speed Multiplier Pills */}
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-slate-400 mr-1 text-[10px] hidden sm:inline">倍速:</span>
                {([0.1, 0.25, 0.5, 1.0] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold transition-all cursor-pointer ${
                      playbackSpeed === spd
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {spd === 0.1 ? '0.1x极慢' : `${spd}x`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dual-Track Visual Runners (Synchronized to Scrubber & Math) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4 items-center">
            {/* Tracks Container */}
            <div ref={trackRef} className="lg:col-span-2 flex flex-col gap-3">
              {/* Track A: Designer Easing Curve Runner */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] gap-0.5">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 flex-shrink-0" />
                    设计师物理曲线: {result.motionSpec.easing}
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] truncate">
                    位移: {(designerProgress * 100).toFixed(1)}% • <code className="text-indigo-600 dark:text-indigo-400">{result.motionSpec.easingBezier}</code>
                  </span>
                </div>

                <div className="relative w-full h-10 bg-slate-200/80 dark:bg-slate-900/90 rounded-xl p-1 overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-inner">
                  {/* Ruler graduation marks on track floor */}
                  <div className="absolute inset-x-2 top-0 bottom-0 flex justify-between items-center opacity-20 pointer-events-none text-[8px] font-mono">
                    <span>| 0%</span>
                    <span>| 25%</span>
                    <span>| 50%</span>
                    <span>| 75%</span>
                    <span>100% |</span>
                  </div>

                  {/* Designer Motion Runner (Calculated instantaneously via solveCubicBezier) */}
                  <div
                    className="h-8 w-24 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-sm flex items-center justify-center text-[10px] font-bold select-none cursor-default truncate px-1 z-10 relative"
                    style={{
                      transform: `translateX(${designerProgress * travelDistance}px)`,
                      // No CSS transition lag! Perfectly synchronized to the millisecond timeline playhead
                    }}
                  >
                    <span className="truncate">
                      {result.motionSpec.easing.includes('Apple')
                        ? 'Apple Ease'
                        : result.motionSpec.easing.includes('Spring')
                        ? 'Snappy Spring'
                        : result.motionSpec.easing.includes('Micro')
                        ? 'Micro-Delight'
                        : 'Subdued'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Track B: Stiff Linear Contrast */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] gap-0.5">
                  <span className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    ⚙️ 机械匀速动效 (无缓动 linear: 匀速运动 + 突兀刹停)
                  </span>
                  <span className="font-mono text-slate-400 text-[10px] sm:text-[11px]">
                    位移: {(linearProgress * 100).toFixed(1)}% • linear
                  </span>
                </div>

                <div className="relative w-full h-10 bg-slate-200/80 dark:bg-slate-900/90 rounded-xl p-1 overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-inner">
                  {/* Ruler graduation marks on track floor */}
                  <div className="absolute inset-x-2 top-0 bottom-0 flex justify-between items-center opacity-20 pointer-events-none text-[8px] font-mono">
                    <span>| 0%</span>
                    <span>| 25%</span>
                    <span>| 50%</span>
                    <span>| 75%</span>
                    <span>100% |</span>
                  </div>

                  {/* Linear Runner */}
                  <div
                    className="h-8 w-24 rounded-lg bg-slate-400 dark:bg-slate-600 text-slate-100 shadow-xs flex items-center justify-center text-[10px] font-medium select-none cursor-default truncate px-1 z-10 relative"
                    style={{
                      transform: `translateX(${linearProgress * travelDistance}px)`,
                    }}
                  >
                    匀速 (Linear)
                  </div>
                </div>
              </div>
            </div>

            {/* Tactile Micro-interaction Sandbox Card */}
            <div className="lg:col-span-1 flex flex-col justify-center">
              <div
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs cursor-pointer select-none transition-all flex flex-col gap-2"
                style={{
                  transform:
                    tactileState === 'active'
                      ? `scale(${result.motionSpec.scaleActive})`
                      : tactileState === 'hover'
                      ? `scale(${result.motionSpec.scaleHover})`
                      : 'scale(1)',
                  transition: `transform 180ms ${result.motionSpec.easingBezier}, box-shadow 180ms ${result.motionSpec.easingBezier}`,
                }}
                onMouseEnter={() => setTactileState('hover')}
                onMouseLeave={() => setTactileState('default')}
                onMouseDown={() => setTactileState('active')}
                onMouseUp={() => setTactileState('hover')}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-indigo-500" />
                    微触感交互测试区
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      tactileState === 'active'
                        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        : tactileState === 'hover'
                        ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {tactileState === 'active'
                      ? '按压 Active (-1.5%)'
                      : tactileState === 'hover'
                      ? '悬停 Hover (+1.5%)'
                      : '默认 Default'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  鼠标悬停/按压此卡片，体验亚像素缩放反响与弹性阻尼质感。
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                  <span>hover: {result.motionSpec.scaleHover}</span>
                  <span>•</span>
                  <span>active: {result.motionSpec.scaleActive}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Phase Diagnostic Explanation */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <Zap className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                当前帧物理动力学解析 · {phaseInfo.name} ({phaseInfo.leadRatio})
              </span>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                {phaseInfo.desc} 拖拽上方滑块或点击「-1帧 / +1帧」单步微调，可精确审查每一帧的亚像素级缓动衰减。
              </p>
            </div>
          </div>

          {/* Principle Clarification Banner */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-lg p-2.5 leading-relaxed">
            <strong className="text-slate-800 dark:text-slate-200">💡 为什么需要时间轴逐帧审查？</strong>{' '}
            上方推导出的 <code className="text-indigo-600 dark:text-indigo-400 font-mono font-medium">{result.motionSpec.easingBezier}</code> 是专业级物理缓动曲线，在初段具有快速响应爆发力，随后留出大半行程进行细腻平缓的阻尼吸附（Soft Landing）。而下方对比轨道的 <code className="text-slate-600 dark:text-slate-400 font-mono">linear</code> 则是数学物理上的<strong>「匀速运动曲线（无缓动）」</strong>，在动画停止时由于缺乏缓出减速，会导致突兀生硬的机械刹停感。通过逐帧审查器（-1帧/+1帧），开发者与设计师可以精确确认在关键帧（例如 50% 时间点）时，设计师曲线已经完成了 80%+ 的位移，剩余 50% 时间专门用于柔和吸附，这就是高级感的数学密码。
          </div>

          {/* Sandbox Callout */}
          {onOpenSandbox && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-sky-500/10 border border-amber-300/40 dark:border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🎮</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    想要在完整的卡片、拖拽看板、3D 翻转、空间抽屉中亲自把玩？
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    进入交互沙盒，即时把玩 7 大原子交互原语 × 5 款视觉风格，支持一键反向复制 Prompt
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenSandbox}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
              >
                <span>进入交互沙盒</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
