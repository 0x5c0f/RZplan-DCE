import React from 'react';
import { X, Sparkles, Wand2, Compass, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-800 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                项目初衷与设计哲学 (The Core Philosophy)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                为什么在 AI 编程时代，我们需要一个专职「设计师 Agent」？
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              痛点：自然语言与高品质 UI/UX 之间的鸿沟
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              对于很多初学者或全栈开发者而言，他们可能没有系统学习过动效与交互设计。当他们在编写提示词时，往往只能用口语模糊描述：“加点动效”、“让页面看起来平滑一点”、“卡片可以拖动”。
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              然而，大模型虽然拥有海量代码记忆，但对于模糊词汇的理解是随机且宽泛的。如果只输入“加点动效”，大模型往往只会写一个生硬的 <code className="text-indigo-600 dark:text-indigo-300 font-mono">transition: all 0.3s</code>，导致组件卡顿生硬。
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20">
            <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              解决方案：专职设计师角色 (Designer-in-the-Loop)
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              本项目正是为了承担<strong>资深产品设计师与动效编排师</strong>的角色而诞生：
            </p>
            <ul className="mt-2.5 space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>数学缓动函数注入:</strong> 将“平滑”转化为精确的 <code className="text-emerald-700 dark:text-emerald-300 font-mono font-medium">cubic-bezier(0.16, 1, 0.3, 1)</code> 或 Spring 弹簧参数。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>时序编排 (Choreography):</strong> 明确数值从 0 平滑递增滚显、SVG 路径从左向右逐步绘制、错峰 Stagger 呈现。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>物理触感与状态闭环:</strong> 明确卡片按住悬浮放大、阴影分层、FLIP 让位重排、松开弹性吸附网格等微交互细节。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>动效时间轴逐帧审查器 (Motion Timeline Inspector):</strong> 内置牛顿迭代贝塞尔解算器，提供 60fps 逐帧单步微调 (-1帧/+1帧)、0.1x~1.0x 慢放与双轨物理跑道，让动效的高级感在数学和微秒层面清晰可审计。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>7 大原子交互原语所见即所得沙盒:</strong> 提炼数据唤醒、自由拖拽、3D翻转、空间展开、扑克堆叠、AI流式思考、⌘K指令面板等 7 大原子原语，支持 5 款工业级流派实时正交渲染与反向提取 Prompt。
                </span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            💡 把这种工业级设计师 Prompt 投喂给 Claude 3.7 / Cursor / v0 / Gemini 时，模型就能直接写出惊艳、高完成度、生产就绪的工业级前端界面！
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
          >
            开始体验设计师提示词工程
          </button>
        </div>
      </div>
    </div>
  );
};
