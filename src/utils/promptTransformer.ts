export type DesignStyle = 'linear-dark' | 'minimal-clean' | 'neo-brutalist' | 'glassmorphism' | 'saas-dense';
export type MotionTone = 'apple-ease' | 'snappy-spring' | 'micro-delight' | 'subdued';
export type TargetTool = 'cursor' | 'v0' | 'claude' | 'bolt' | 'prd';

export interface MotionSpec {
  easing: string;
  easingBezier: string;
  duration: string;
  springStiffness: number;
  springDamping: number;
  staggerDelay: string;
  scaleHover: number;
  scaleActive: number;
  choreographyRules: string[];
}

export interface DesignTokens {
  primaryColor: string;
  surface: string;
  border: string;
  radius: string;
  elevation: string;
  typography: {
    heading: string;
    body: string;
    mono: string;
  };
}

export interface CodeRecipe {
  framerMotionCode: string;
  tailwindClasses: string[];
  cssKeyframes?: string;
}

export interface PromptTag {
  label: string;
  type: 'motion' | 'physics' | 'state' | 'optical' | 'a11y';
}

export interface DesignerPromptResult {
  id: string;
  title: string;
  rawInput: string;
  designRole: string;
  intentAnalysis: {
    summary: string;
    identifiedGaps: string[];
    missingDimensions: string[];
  };
  enhancedPrompt: string;
  cursorPrompt: string;
  v0Prompt: string;
  markdownPRD: string;
  designTokens: DesignTokens;
  motionSpec: MotionSpec;
  codeRecipe: CodeRecipe;
  tags: PromptTag[];
}

import {
  PRESET_RECIPES,
  PresetRecipe,
  QUICK_PICK_PRESETS,
} from '../config/presets';

export { PRESET_RECIPES, QUICK_PICK_PRESETS };
export type { PresetRecipe };

export const STYLE_DEFINITIONS: Record<DesignStyle, { label: string; tokens: DesignTokens }> = {
  'linear-dark': {
    label: 'Linear 暗黑极客 (Dark Elegance)',
    tokens: {
      primaryColor: '#6366f1 (Indigo)',
      surface: '#090a0f (Zinc-950/Black) 带 subtle 1px border-white/10',
      border: 'border-white/10, hover: border-indigo-500/40',
      radius: 'rounded-xl (12px) 连续平滑倒角',
      elevation: 'shadow-[0_8px_30px_rgb(0,0,0,0.45)]',
      typography: {
        heading: 'Inter / Plus Jakarta Sans (600/700)',
        body: 'Inter (400/500, leading-relaxed)',
        mono: 'JetBrains Mono (400)',
      },
    },
  },
  'minimal-clean': {
    label: 'Apple 极简浅色 (Clean Modern)',
    tokens: {
      primaryColor: '#0284c7 (Sky-600)',
      surface: '#ffffff (Pure White) + #f8fafc (Slate-50)',
      border: 'border-slate-200/80',
      radius: 'rounded-2xl (16px)',
      elevation: 'shadow-[0_4px_24px_rgba(15,23,42,0.06)]',
      typography: {
        heading: 'SF Pro Display / Inter (600)',
        body: 'SF Pro Text / Inter (400)',
        mono: 'SF Mono (400)',
      },
    },
  },
  'neo-brutalist': {
    label: '新野兽派质感 (Neo-Brutalism)',
    tokens: {
      primaryColor: '#f59e0b (Amber-500)',
      surface: '#fffbeb / #18181b',
      border: 'border-2 border-black dark:border-white',
      radius: 'rounded-lg (8px) 刚性硬角',
      elevation: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
      typography: {
        heading: 'Space Grotesk / Syne (700)',
        body: 'Public Sans (500)',
        mono: 'Space Mono (700)',
      },
    },
  },
  'glassmorphism': {
    label: '毛玻璃晶体质感 (Frosted Glass)',
    tokens: {
      primaryColor: '#a855f7 (Purple-500)',
      surface: 'bg-white/10 dark:bg-white/5 backdrop-blur-xl',
      border: 'border-white/20 dark:border-white/10',
      radius: 'rounded-3xl (24px)',
      elevation: 'shadow-[0_12px_40px_rgba(0,0,0,0.18)]',
      typography: {
        heading: 'Cabinet Grotesk / Inter (600)',
        body: 'Inter (400)',
        mono: 'Fira Code (400)',
      },
    },
  },
  'saas-dense': {
    label: '高密度 SaaS 仪表板 (High Density)',
    tokens: {
      primaryColor: '#2563eb (Blue-600)',
      surface: '#0f172a (Slate-900) / #ffffff',
      border: 'border-slate-700/60 dark:border-slate-800',
      radius: 'rounded-md (6px)',
      elevation: 'shadow-sm',
      typography: {
        heading: 'Inter (600, tracking-tight)',
        body: 'Inter (400, text-xs/sm)',
        mono: 'Geist Mono (400)',
      },
    },
  },
};

export const MOTION_DEFINITIONS: Record<MotionTone, MotionSpec> = {
  'apple-ease': {
    easing: 'Ease Out Smooth (Apple Style)',
    easingBezier: 'cubic-bezier(0.16, 1, 0.3, 1)',
    duration: '320ms ~ 480ms',
    springStiffness: 280,
    springDamping: 32,
    staggerDelay: '45ms',
    scaleHover: 1.015,
    scaleActive: 0.985,
    choreographyRules: [
      '所有进场动画遵循从微小透明度与Y轴偏移(opacity: 0, y: 12px)平滑滑入',
      '数值递增使用缓出函数，并在终点处平稳停靠，不产生晃动',
      '悬停态使用亚像素级柔和阴影漫射，避免生硬跳变',
    ],
  },
  'snappy-spring': {
    easing: 'Snappy Spring (物理弹性拟真)',
    easingBezier: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    duration: '260ms ~ 380ms',
    springStiffness: 420,
    springDamping: 24,
    staggerDelay: '35ms',
    scaleHover: 1.03,
    scaleActive: 0.96,
    choreographyRules: [
      '交互拖拽时利用物理弹簧模拟质量与张力',
      '松开时光标与物体之间呈现轻度阻尼振荡(1~2个波峰自然衰减)',
      '冲突让位采用 FLIP(First Last Invert Play) 算法平滑重排',
    ],
  },
  'micro-delight': {
    easing: 'Micro-Delight (愉悦微动效)',
    easingBezier: 'cubic-bezier(0.22, 1, 0.36, 1)',
    duration: '200ms ~ 300ms',
    springStiffness: 350,
    springDamping: 28,
    staggerDelay: '60ms',
    scaleHover: 1.04,
    scaleActive: 0.95,
    choreographyRules: [
      '图标具备悬停状态的微旋转(±8deg)或色彩渐变点亮',
      '按钮点击产生自按压中心向外扩散的细微水波纹',
      '流式生成时具备轻微打字机振幅与行末流光闪烁',
    ],
  },
  'subdued': {
    easing: 'Subdued Clean (克制专业)',
    easingBezier: 'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: '180ms ~ 240ms',
    springStiffness: 200,
    springDamping: 40,
    staggerDelay: '20ms',
    scaleHover: 1.008,
    scaleActive: 0.99,
    choreographyRules: [
      '纯粹专注信息清晰度，动效仅作为状态指示而非视觉主角',
      '颜色渐变与透明度过渡为主，极少使用位移形变',
      '适配 prefers-reduced-motion，无任何引起眩晕的连续循环',
    ],
  },
};

/**
 * Deterministic synthesis engine that translates raw developer text
 * into senior designer grade specifications and AI prompts.
 */
export function synthesizeDesignerPrompt(
  input: string,
  options: {
    style?: DesignStyle;
    motionTone?: MotionTone;
    targetTool?: TargetTool;
    includeA11y?: boolean;
    includeFramerMotion?: boolean;
  } = {}
): DesignerPromptResult {
  const style = options.style || 'linear-dark';
  const motionTone = options.motionTone || 'apple-ease';
  const targetTool = options.targetTool || 'cursor';

  const tokens = STYLE_DEFINITIONS[style]?.tokens || STYLE_DEFINITIONS['linear-dark'].tokens;
  const motion = MOTION_DEFINITIONS[motionTone] || MOTION_DEFINITIONS['apple-ease'];

  const trimmed = input.trim();

  // Check matching presets or build dynamic context
  const matchedPreset = PRESET_RECIPES.find(
    (p) =>
      trimmed.toLowerCase() === p.id ||
      trimmed === p.rawInput ||
      (trimmed.length >= 12 && p.rawInput.includes(trimmed)) ||
      (p.rawInput.length >= 12 && trimmed.includes(p.rawInput))
  );

  let title = '智能 UI/UX 动效与交互规范';
  let enhancedPrompt = '';
  let identifiedGaps = [
    '缺少具体物理缓动函数与微交互持续时间 (缺乏如 cubic-bezier, spring stiffness/damping 定义)',
    '缺乏多状态闭环定义 (Default / Hover / Active / Focus-Visible / Dragging / Empty / Loading)',
    '缺乏光学视觉层级与微间距系统 (缺少具体 border-opacity, elevation, tracking, leadings)',
    '缺少无障碍与响应式边界约束 (prefers-reduced-motion, 触摸热区)',
  ];
  let missingDimensions = ['动效编排 (Choreography)', '物理质感 (Tactile Physics)', '视觉深度 (Visual Depth)'];

  const isDashboard = /dashboard|仪表盘|数据|图表|指标|唤醒|递增/i.test(trimmed);
  const isDragDrop = /拖拽|drag|drop|排版|网格|吸附|让位|flip/i.test(trimmed);
  const is3DFlip = /3d|翻转|flip|透视|perspective|倾斜|tilt/i.test(trimmed);
  const isSpatialExpand = /展开|expand|任务面板|今日任务|退让|原位|连续性|morph/i.test(trimmed);
  const is3DStack = /聚合|堆叠|stack|散开|向中心|散射|纸牌|burst/i.test(trimmed);
  const isChat = /chat|对话|聊天|ai|流式|打字|思考/i.test(trimmed);
  const isSearchOrModal = /搜索|弹窗|modal|⌘k|快捷键|palette/i.test(trimmed);
  const isEcommerce = /商品|购买|购物车|电商|cta/i.test(trimmed);

  if (matchedPreset) {
    title = matchedPreset.title;
    enhancedPrompt = matchedPreset.designerPrompt;
    identifiedGaps = [
      '原描述仅提出通用意图，缺乏入场时序 (Stagger) 与过渡曲线',
      '未定义悬浮与拖动时的坐标跟随、位移形变及阴影深度',
      '缺少交互结束时的弹性吸附或稳定态定义',
    ];
  } else if (is3DFlip) {
    title = '03 卡片3D悬浮翻转与双轴视差倾斜规范';
    enhancedPrompt = `打造极具空间深度的 3D 悬浮视差与正反双面翻转卡片。【三维视距】父容器声明 perspective: 1000px，卡片容器开启 transform-style: preserve-3d，正反面元素设置 backface-visibility: hidden。【视差倾斜】悬停时卡片浮起 (translateZ: 12px)，依据光标相对中心坐标动态驱动 rotateX/rotateY (限幅 ±7deg)，并在表层映射动态径向反射光泽。【Y轴翻转】点击触发沿 Y 轴 180° 平滑翻转，采用 Spring 弹性缓动 (stiffness: ${motion.springStiffness}, damping: ${motion.springDamping}，耗时 650ms，带轻微回弹)；翻转过程中投射随角度形变的动态接触阴影；正面呈现核心指标概览，背面无缝呈现高密度趋势图表与明细数据。`;
    missingDimensions.push('Perspective透视矩阵', '光标视差倾斜', '3D动态光斑跟随', 'Y轴180°翻转');
  } else if (isSpatialExpand) {
    title = '05 卡片空间原位展开与共享元素规范';
    enhancedPrompt = `实现具备极高空间连续性的卡片原位形态扩展 (Shared Element Spatial Expansion)。【原位展开】点击触发卡片以 boundingClientRect 坐标为基准触发共享元素平滑形变 (基于 View Transitions / FLIP 几何变换原理)，直接由紧凑指标卡平滑膨胀为居中全尺寸「今日任务面板」，严禁弹出瞬切遮罩。【环境退让】周围兄弟卡片与背景在 200ms 内同步以 scale(0.97) 退让并叠加 8px 高斯模糊与 40% 减光遮罩。【多列折行】展开面板内任务子卡片采用 CSS Grid 弹性响应排版，固定单行 4 列布局，超出 4 个自动流式折行；任务项伴随 35ms Stagger 瀑布式入场。【逆向收折】点击关闭按钮或按 Escape 键，面板沿展开原物理轨迹逆向坍缩吸附回原位卡片槽位，背景退让瞬时复原，达成零断层空间闭环。`;
    missingDimensions.push('Shared Element共享元素连续性', '环境减光退让', '单行4列网格折行', '逆向轨迹收回');
  } else if (is3DStack) {
    title = '06 一键3D堆叠聚合与径向弹性散射规范';
    enhancedPrompt = `设计极具未来感的 Dashboard 一键聚合与径向散射双态状态机 (Bi-stable Morphing State Machine)。【状态 A -> B：向心堆叠】点击聚合按钮，全屏卡片利用 FLIP 机制向视口中心平滑向心位移并按 0.85 比例等比收拢；根据卡片索引自动分配 Z 轴层叠与伪随机物理微偏角 (如：Index 0: rotate 0deg, z: 24px; Index 1: rotate -3.5deg, z: 16px; Index 2: rotate 3deg, z: 8px)，呈现真实物理纸牌立体堆叠质感。【状态 B -> A：径向散射】再次点击时触发高刚度回弹物理弹簧 (stiffness: 450, damping: 22)，卡片呈径向弹性迸发散开，丝滑归位至各自原始网格坐标；全程基于 GPU transform/opacity 硬件加速，保证 60fps 丝滑连贯。`;
    missingDimensions.push('双态状态机设计', '向心3D纸牌堆叠', '微偏角物理层叠', '径向弹性散射归位');
  } else if (isDragDrop) {
    title = '02 模块自由拖拽与弹性网格重排规范';
    enhancedPrompt = `为组件容器添加高精度自由拖拽交互。按住卡片时触发轻微放大 (scale: ${motion.scaleHover}) 并平滑提升悬浮阴影 (${tokens.elevation})；拖动时卡片严格跟随光标平滑位移，并在原位保留虚线外框半透明占位符 (Ghosting)。相邻卡片遭遇碰撞时基于 FLIP 布局重排算法平滑让位 (缓动：${motion.easingBezier}，耗时 240ms)。松开鼠标后以物理弹簧 (stiffness: ${motion.springStiffness}, damping: ${motion.springDamping}) 弹性吸附到网格，支持跨行跨列拖拽，保持网格整洁连续。`;
    missingDimensions.push('碰撞检测与FLIP平滑重排', '松手弹性回弹', '半透明占位符');
  } else if (isDashboard) {
    title = '01 Dashboard 核心指标数据唤醒与图表绘制规范';
    enhancedPrompt = `为 Dashboard 构建专业级数据唤醒体验 (Data Awakening Choreography)。页面载入时，所有关键指标数字通过 requestAnimationFrame 从 0 平滑递增滚显至目标值，采用 Ease-Out 缓动 (${motion.easingBezier}，耗时 1.2s)；图表折线与柱状图采用 SVG stroke-dashoffset 与 scaleY 逐级生长，子卡片按 ${motion.staggerDelay} 错峰逐个呈现 (opacity: 0, y: 16px -> opacity: 1, y: 0px)。动画结束后保持数值静止并显示微弱脉冲绿/红色增益气泡，卡片悬浮时产生亚像素高光与深度阴影。`;
    missingDimensions.push('数字滚显 Ease-Out 缓动', 'SVG渐进绘制', '错峰Stagger入场', '稳定态微脉冲');
  } else if (isChat) {
    title = 'AI 对话流式渐显与深度思考微交互规范';
    enhancedPrompt = `为 AI 交互界面注入沉浸式动态生命力。思考等待状态使用微光脉冲骨架屏 (Shimmer，周期 1.6s，双层渐变反射)；生成正文时以 Token 字符块递进淡入 (每词延迟 18ms，伴随 Y 轴 3px 轻微浮现)，杜绝生硬机械刷屏；视口监听滚动并以平滑阻尼锁定最新内容底部；底部输入框激活时外发光渐变光圈呼吸微动，提供轻触回弹反馈 (active: scale(${motion.scaleActive}))。`;
    missingDimensions.push('思考态Shimmer流光', 'Token字符平滑浮现', '平滑贴底阻尼');
  } else if (isSearchOrModal) {
    title = '极速模态弹出与键盘交互编排规范';
    enhancedPrompt = `设计瞬时响应的全局浮层面板。激活触发时，背景施加 12px 亚克力高斯模糊与深色遮罩 (${motion.duration} 淡入)；弹窗容器采用弹性展开 (Spring stiffness: ${motion.springStiffness}, damping: ${motion.springDamping}，从 scale: 0.94 平滑放大至 1.0)；键盘导航时高亮指示条使用 spring 平滑滑动定位，各搜索结果项具备细微的左侧色彩指示线与悬浮微位移 (+4px X轴滑动)。`;
    missingDimensions.push('高斯模糊遮罩', '弹簧开窗物理曲线', '指示游标平滑滑动');
  } else if (isEcommerce) {
    title = '商品 3D 拟真微视差与磁吸按钮规范';
    enhancedPrompt = `构建极具转化吸引力的商品视觉交互。卡片区域感知鼠标位移计算 3D 偏转角度 (rotateX/rotateY 限幅 ±6deg)，并投射光泽反射层；主购买 CTA 按钮在鼠标移入 20px 阈值时触发微磁吸牵引，按压时产生 0.96 深度凹陷，释放后以弹性波纹展开并丝滑变形为对勾成功态，伴随状态文案从下方翻转替换。`;
    missingDimensions.push('3D视差偏转', '光斑反射跟随', '磁吸CTA与形态变形');
  } else {
    title = '现代前端设计系统与微交互重塑';
    enhancedPrompt = `将「${trimmed}」重构为资深设计师级交互方案。建立严密的视觉层级与微交互时序：默认容器采用 ${tokens.surface}，边框采用 ${tokens.border}，圆角设定为 ${tokens.radius}。所有可交互元素在悬浮态提升至 scale(${motion.scaleHover}) 并触发 ${tokens.elevation} 弥散阴影；激活点击时提供 scale(${motion.scaleActive}) 机械触感；状态切换时严格遵循 ${motion.easingBezier} (${motion.duration})，子元素进场以 ${motion.staggerDelay} 阶梯式错峰滑入，彻底消除突兀卡顿。`;
    missingDimensions.push('微交互时序', '触感回弹反馈', '光学层级重构');
  }

  // Construct tailored prompts for different AI tools
  const cursorPrompt = `/* ==========================================================================
   ROLE: Principal UI/UX & Motion Engineer (Design System Architect)
   TASK: ${title}
   TECH STACK: 跨前端框架通用 (Framework-Agnostic: React / Vue / Svelte / Vanilla HTML+CSS / Web Components / Mobile)
   ========================================================================== */

【设计规范与交互目标 (Design Intent)】
${enhancedPrompt}

【视觉设计令牌矩阵 (Design Tokens - W3C / CSS Variables / Tailwind 通用)】
- 表面与背景: ${tokens.surface}
- 边框与微分割: ${tokens.border}
- 连续倒角: ${tokens.radius}
- 空间层级投影: ${tokens.elevation}
- 主色与高光点缀: ${tokens.primaryColor}
- 字体系统: 标题采用 ${tokens.typography.heading}，正文采用 ${tokens.typography.body}

【微交互与物理动效体系 (Choreography & Motion Physics)】
- 缓动曲线 (Timing Function): transition-timing-function: ${motion.easingBezier};
- 推荐时长 (Duration): ${motion.duration}
- 弹性物理系数 (Spring Mechanics): { stiffness: ${motion.springStiffness}, damping: ${motion.springDamping} }
- 阶梯错峰 (Stagger): 子项进入以 ${motion.staggerDelay} 逐级级联
- 触感微交互 (Micro-Haptics): Hover 缩放 ${motion.scaleHover}，Active 按压 ${motion.scaleActive}

【GPU 硬件加速与性能准则 (GPU & Zero-Reflow Guidelines)】
1. 严禁在动效过渡中修改 width, height, top, left 等引发浏览器重排 (Reflow) 的盒模型属性。
2. 纯粹依赖 GPU 硬件加速的 transform (scale, translate, rotate) 与 opacity 属性。
3. 复杂连续形变或拖拽元素提前声明 will-change: transform 以激活 GPU 图层。

【跨前端技术栈落地指南 (Framework-Agnostic Implementation Blueprint)】
本规范基于 W3C 标准与物理动力学通用设计，支持在任意前端技术栈中直接落地：
- [React 生态]: 推荐使用 Framer Motion / Motion (layout, layoutId, AnimatePresence) 或 Tailwind CSS；
- [Vue 3 生态]: 推荐使用 @vueuse/motion、Vue 内置 <TransitionGroup> 或 Tailwind/UnoCSS；
- [Svelte 生态]: 推荐使用 svelte/transition (fly, scale) 与 svelte/animate (flip)；
- [原生 JS / 任意框架]: 推荐使用 Web Animations API (WAAPI)、CSS 自定义属性与原生 requestAnimationFrame；
- [移动端 (Flutter / React Native)]: 映射为标准 Spring 曲线 (Curves.easeInOutCubic / Animated.spring)。
- 无论何种技术栈，条件渲染与组件卸载必须确保具备退出过渡 (Exit Animation)，且严格适配 prefers-reduced-motion 优雅降级。`;

  const v0Prompt = `Create a high-fidelity, production-grade frontend component (Framework-Agnostic: React, Vue, Svelte, or Modern HTML/CSS):
Topic: "${title}"
Design Intent: ${enhancedPrompt}

Universal Design & Motion Specifications:
- Style System: ${STYLE_DEFINITIONS[style].label}
- Design Tokens: ${tokens.surface}, ${tokens.border}, ${tokens.radius}, ${tokens.elevation}
- Motion Physics: ease: ${motion.easingBezier}, spring: { stiffness: ${motion.springStiffness}, damping: ${motion.springDamping} }, duration: ${motion.duration}
- Micro-interactions: hover scale ${motion.scaleHover}, active press ${motion.scaleActive}, staggered enter children by ${motion.staggerDelay}
- Engineering Constraints: Framework-adaptable. Strictly animate transform & opacity only (GPU zero-reflow). Ensure full lifecycle states (loading, default, hover, active, dragging, settled). Adaptable to any project framework.`;

  const markdownPRD = `# PRD 设计与交互规范: ${title}

## 1. 原始需求与意图解析
- **原始开发者表达**: "${trimmed}"
- **设计师诊断**: 原始表达存在交互细节缺失，未对动效缓动曲线、触发时机、物理回弹与多状态闭环做明确定义。

## 2. 资深设计师提示词核心方案
> ${enhancedPrompt}

## 3. 设计令牌矩阵 (Design Tokens)
| 令牌类别 | 规范参数 | 说明 |
| :--- | :--- | :--- |
| **容器表面** | \`${tokens.surface}\` | 细腻背景质感与光学边界 |
| **边框微线** | \`${tokens.border}\` | 亚像素抗锯齿分割 |
| **圆角弧度** | \`${tokens.radius}\` | 现代连续曲率倒角 |
| **空间层级** | \`${tokens.elevation}\` | 悬浮与静止多层投影 |
| **主色系统** | \`${tokens.primaryColor}\` | 核心视觉焦点与高光强调 |

## 4. 动效编排时序图 (Motion Choreography)
- **缓动曲线 (Timing Function)**: \`${motion.easingBezier}\` (${motion.easing})
- **基准时长 (Duration)**: \`${motion.duration}\`
- **弹簧参数 (Spring)**: \`stiffness: ${motion.springStiffness}, damping: ${motion.springDamping}\`
- **阶梯错峰 (Stagger)**: \`${motion.staggerDelay}\`
- **悬停缩放 (Scale)**: \`hover: ${motion.scaleHover}, active: ${motion.scaleActive}\`

## 5. 跨前端技术栈落地规范 (Framework-Agnostic Architecture)
1. **GPU 硬件加速**: 仅使用 \`transform\` 与 \`opacity\` 驱动动效，禁止过渡 \`width/height/top/left\`。
2. **空间连续性**: 跨卡片形态展开基于共享元素坐标变换原理 (如 Web View Transitions API / 容器坐标反推)。
3. **FLIP 重排**: 网格与容器重排基于通用 FLIP (First, Last, Invert, Play) 自动计算边界差值。
4. **技术栈生态映射**:
   - **React**: Framer Motion (\`layout\`, \`layoutId\`, \`AnimatePresence\`) 或原生 Hooks
   - **Vue 3**: \`@vueuse/motion\` / 内置 \`<TransitionGroup>\`
   - **Svelte 5**: \`svelte/transition\` / \`svelte/animate\`
   - **原生 JS / 其他框架**: Web Animations API (WAAPI) / CSS Keyframes
5. **无障碍退化**: 适配 \`prefers-reduced-motion\`，提供纯透明度平滑过渡。

## 6. 编排规则与边缘场景
${motion.choreographyRules.map((r, i) => `${i + 1}. ${r}`).join('\n')}
`;

  const framerMotionCode = `// Framer Motion 物理动效配置示例
export const motionConfig = {
  transition: {
    duration: 0.35,
    ease: [0.16, 1, 0.3, 1], // ${motion.easingBezier}
  },
  spring: {
    type: "spring",
    stiffness: ${motion.springStiffness},
    damping: ${motion.springDamping},
  },
  hover: {
    scale: ${motion.scaleHover},
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: {
    scale: ${motion.scaleActive},
    transition: { duration: 0.1 }
  },
  containerStagger: {
    animate: {
      transition: {
        staggerChildren: 0.045, // ${motion.staggerDelay}
      }
    }
  }
};`;

  const tailwindClasses = [
    'transition-all',
    'duration-300',
    'ease-[cubic-bezier(0.16,1,0.3,1)]',
    'hover:scale-[1.02]',
    'active:scale-[0.98]',
    tokens.radius,
    'border',
    'border-white/10',
    'hover:border-white/20',
    'hover:shadow-xl',
  ];

  const tags: PromptTag[] = [
    { label: 'Ease-Out 缓动', type: 'motion' },
    { label: 'Spring 弹簧物理', type: 'physics' },
    { label: '全状态闭环', type: 'state' },
    { label: '光学层级', type: 'optical' },
    { label: 'A11y 无障碍', type: 'a11y' },
  ];

  return {
    id: `prompt-${Date.now()}`,
    title,
    rawInput: trimmed,
    designRole: '资深 UI/UX 动效与交互架构师 (Principal Product Designer & Motion Choreographer)',
    intentAnalysis: {
      summary: `从自然语言「${trimmed.slice(0, 32)}${trimmed.length > 32 ? '...' : ''}」中提炼出核心产品场景，填补了动效曲线、物理惯性、状态闭环及微间距系统等关键专业维度。`,
      identifiedGaps,
      missingDimensions,
    },
    enhancedPrompt,
    cursorPrompt,
    v0Prompt,
    markdownPRD,
    designTokens: tokens,
    motionSpec: motion,
    codeRecipe: {
      framerMotionCode,
      tailwindClasses,
    },
    tags,
  };
}
