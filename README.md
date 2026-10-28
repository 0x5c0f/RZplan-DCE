# DesignCraftsman Engine (DCE)

<p align="center">
  <strong>智能 UI/UX 设计师提示词工程引擎 · 面向高水准 AI 前端开发的微交互与动效编排工作台</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
  <img src="https://img.shields.io/badge/Version-v1.0.0-indigo.svg" alt="Version: v1.0.0" />
  <img src="https://img.shields.io/badge/React-19-61dafb.svg?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/DeepSeek-Flash%20Ready-6366f1.svg" alt="DeepSeek Ready" />
  <img src="https://img.shields.io/badge/Tests-12%20Passed-emerald.svg" alt="12 Unit Tests Passed" />
  <img src="https://img.shields.io/badge/Vercel-Serverless%20Ready-black.svg?logo=vercel" alt="Vercel Ready" />
</p>

---

## 📖 什么是 DesignCraftsman Engine (DCE)?

在当下大模型驱动的 AI 前端编程时代（如 Cursor, v0.dev, Claude 3.7 Sonnet, Windsurf 等），开发者往往只需输入自然语言需求即可生成页面组件。然而，初学者或全栈开发者常常面临一个**致命鸿沟**：

> **“用户描述往往是模糊且口语化的（例如：‘做个数据加载动效，要平滑一点’），而大模型对模糊词汇的直接实现通常极其生硬（仅仅写一行 `transition: all 0.3s ease`），最终生成的界面充满浓重的人工智能粗糙感（AI Slop）。”**

**DesignCraftsman Engine (简称 DCE)** 正是为解决这一问题而设计的**专职设计师智能体引擎 (Principal Designer Agent)**。它在人与代码大模型之间建立了一道专业设计桥梁，将粗糙口语需求深度诊断重塑为具备**数学缓动曲线、弹簧物理参数、微交互状态机、时序编排 (Choreography) 与设计令牌 (Design Tokens)** 的工业级高保真提示词。

---

## ✨ 核心特性

### 1. 🔍 智能设计诊断与提示词重塑 (Designer Diagnosis & Reshaping)
- **语义鸿沟诊断**: 自动分析原始需求中的模糊词汇（“平滑”、“质感”、“现代”），诊断出缺失的状态机、物理参数与视觉规范。
- **高保真约束注入**: 自动注入具体的 CSS 变换属性、物理持续时间、阴影层级、微交互触觉反馈与无障碍规范。

### 2. ⏱️ 动效时间轴逐帧审查器 (Motion Timeline Inspector)
针对动效“只可意会不可量化”的痛点，DCE 独创工程级时间轴微操与物理诊断平台：
- **牛顿-拉弗森三次贝塞尔解算器 (`solveCubicBezier`)**: 内置纯数学求根算法，输入任意时刻毫秒时间，实时计算出当前帧的精确 Y 轴位移率与提前量。
- **60fps 单步逐帧微调**: 提供 `-1帧 (-16.7ms)` 与 `+1帧 (+16.7ms)` 微调键，支持亚像素级排查动效每一帧的阻尼衰减与形变。
- **4 大动态物理阶段诊断**:
  - `0% ~ 25%`: **初段爆发响应 (Burst Acceleration)**，快速释放能量建立跟手灵敏度。
  - `25% ~ 65%`: **极速过渡巡航 (Peak Velocity)**，速度峰值大幅拉开与机械匀速动画的差距。
  - `65% ~ 98%`: **阻尼软着陆 (Soft Landing)**，长程缓出衰减，避免生硬撞击。
  - `98% ~ 100%`: **稳定态闭环停泊 (Settled Rest)**，亚像素精确锁死，无多余二次弹跳。
- **多档播放倍速与循环**: 支持 `0.1x极慢放`（超慢镜头下观察尾部吸附微动作）、`0.25x`、`0.5x`、`1.0x` 原速与循环播放。
- **双轨瞬时位移跑道**: 上轨运行设计师曲线（如 Apple Ease / Snappy Spring），下轨运行机械匀速（Linear）对照轨。位移由数学公式直接驱动（彻底去除 CSS transition 带来的拖拽延迟，实现 1:1 即时响应）。
- **微触感交互测试区**: 实时响应鼠标悬停（Hover 缩放 +1.5%）与按压（Active -1.5%）亚像素反馈。

### 3. 🎨 5 维工业级设计风格系统 (Design System Token Matrices)
- **Linear Dark (暗黑极客)**: 极致暗黑底色、高对比度微渐变、微发光边框 (`ring-1 ring-white/10`)。
- **Apple Clean (极简现代)**: 精准负空间留白、优雅层级投影、圆角大卡片与高透光质感。
- **Neo-Brutalist (新野兽派)**: 粗边框 (`border-2 border-black`)、硬投影 (`shadow-[4px_4px_0_0_#000]`)、高饱和撞色。
- **Glassmorphism (晶体质感)**: 毛玻璃高斯模糊 (`backdrop-blur-md`)、半透明高光反光边缘。
- **High-Density SaaS (高密度工具)**: 精密紧凑布局、数据密集型排版、单色高对比微交互。

### 4. 🧠 双轨大模型安全架构 (Dual-Track Model Strategy)
- **轨道 1：服务端内置大模型 (Zero-Leakage & 团队口令认证)**
  - 服务端统一通过 `BUILTIN_LLM_*` 配置大模型（默认预设 **DeepSeek `deepseek-flash`**，亦支持 Gemini / OpenAI 等）。
  - 前端密钥脱敏显示（`sk-••••••••`），API Key 绝不下发浏览器。
  - 通过统一的 `SYSTEM_ACCESS_KEY` 授权码进行身份验证。
- **轨道 2：客户端个人模型 (BYOK - Bring Your Own Key)**
  - 访客或无服务端密钥环境可一键配置个人大模型端点（预设 DeepSeek 官方兼容端点）。
  - 密钥安全保存在用户本地浏览器 LocalStorage，服务端不记录；通过安全代理绕过跨域限制。

### 5. 🎯 跨前端框架通用与多工具编译器 (Universal & Multi-Target)
- **跨前端通用 (Framework-Agnostic)**: 设计师提示词基于 W3C 标准 CSS、数学物理动力学（Cubic-bezier、Spring 刚度与阻尼）与通用状态机编写，完全**独立于特定前端框架**。无论用户项目使用的是 **React、Vue 3、Svelte 5、Solid、原生 HTML/CSS/JS** 还是移动端 (Flutter / React Native)，均可直接投喂给 AI 落地生成。
- **Cursor / Claude Code**: 结构化 `.cursorrules` 风格与动效性能约束。
- **v0.dev / Bolt.new**: 单次高完成度组件级生成 Prompt + 精确设计令牌。
- **Claude 3.7 Sonnet / Gemini**: 包含设计决策过程的高级推理提示词。
- **Markdown PRD**: 适合团队设计评审与研发交付的标准化技术规范。

### 6. 🎮 7 大原子交互原语所见即所得沙盒 (Live Atomic Sandbox)
针对“前端千变万化，不能穷举所有场景”的行业痛点，DCE 创新性地提炼出**现代前端物理动效的 7 大原子交互原语 (Atomic Primitives)**：
1. **01 数据唤醒 (Data Awakening)**: `requestAnimationFrame` 驱动三次贝塞尔缓动数值滚显，搭配 SVG 渐变路径 `stroke-dashoffset` 矢量流体绘制。
2. **02 模块自由拖拽与避让 (Free Grid Drag & Drop)**: 抓取卡片三维抬升微倾斜、悬停物理弹性让位动画、松手网格磁吸重排。
3. **03 3D 悬浮视差与正反翻转 (3D Parallax & Flip)**: 亚像素透视 (`perspective: 1000px`) 随光标倾斜 ±7° 视差，点击 180° 翻转至背面高密度明细。
4. **04 空间原位展开 (Shared Element In-Place Expansion)**: 点击卡片从原始坐标丝滑延展为全局面板，周围模块同步退让减光，支持 Escape 零跳变折叠。
5. **05 一键 3D 扑克堆叠与径向迸发 (Bi-Stable 3D Deck Stack & Radial Burst)**: 状态机驱动多卡片在空间扑克牌叠放与径向展开之间往复跃迁。
6. **06 AI 流式思考与呼吸骨架脉冲 (Streaming Shimmer & Typewriter Pulse)**: 思考状态下的流体微光骨架屏，转入打字机实时字符流与脉冲游标。
7. **07 全局极速指令面板 (⌘K Command Palette)**: Spring 阻尼缩放弹出、背景 8px 高斯模糊遮罩、键盘方向键导航游标弹性定位滑动、按压触感反馈。

- **正交矩阵流派渲染 (Orthogonal Style Matrix)**: 任意原语均可一键在 **Linear 暗黑、Apple 极简白、新野兽派、毛玻璃晶体、高密度 SaaS** 之间毫秒级切换，实现 $7 \times 5 \times 2 = 70$ 种交互态的真实物理验证。
- **小白实现 vs 设计师方案深度对比**: 每项原语均提供“生硬无过渡实现”与“DCE 物理缓动方案”双模实测，优劣一目了然。
- **反向提取提示词 (WYSIWYG Prompt Extraction)**: 凡在沙盒中体验到的满意效果，均支持**一键复制专属重塑提示词**，无缝投喂给 Cursor / v0 / Claude / Bolt。

---

## 🛠️ 技术栈

| 层次 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **前端框架** | React 19 + TypeScript 5.7 | 现代化单页应用架构 |
| **构建与开发** | Vite 6 + Express (Dual Dev Server) | 秒级热更新与全栈代理 |
| **样式与动效** | Tailwind CSS v4 + Lucide React | 现代化原子类与高品质图标库 |
| **物理动力学** | 自研 `motionMath.ts` (Newton-Raphson Solver) | 高精度贝塞尔曲线求根、时间轴分段解算与位移映射 |
| **下拉与交互** | DCE 自研 `CustomSelect` 组件 | 具备外部点击、键盘支持、自适应弹窗的高品质下拉组件 |
| **服务端** | Node.js Express + Vercel Serverless | 双环境无缝适配（本地与云端无服务架构） |
| **默认大模型** | DeepSeek (`deepseek-flash`) | 官方兼容 OpenAI 规范端点，高性价比与强逻辑推理 |
| **自动化测试** | Node.js 原生 Test Runner (`tsx --test`) | 覆盖数学解算、提示词重塑、鉴权状态等 12 项测试 |

---

## 🚀 快速上手

### 1. 克隆代码仓库
```bash
git clone https://github.com/0x5c0f/RZplan-DCE.git
cd RZplan-DCE
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
复制环境配置模版：
```bash
cp .env.example .env
```
根据需要配置 `.env` 文件（详见下方环境变量说明）。

### 4. 启动本地开发服务
```bash
npm run dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始使用。

### 5. 运行自动化单元测试
```bash
npm test
```
执行三次贝塞尔数学解算器、提示词重塑转换器与系统鉴权存储的 12 项测试套件。

---

## ⚙️ 环境变量配置说明 (`.env`)

| 环境变量名称 | 必填 | 默认值 | 说明 |
| :--- | :---: | :--- | :--- |
| `SYSTEM_ACCESS_KEY` | 否 | `""` | **系统统一访问授权口令**。设置后，成员需输入该密码登录方可使用服务端内置大模型；若未配置，访问者可使用前端个人大模型 (BYOK)。 |
| `BUILTIN_LLM_PROVIDER` | 否 | `"DeepSeek"` | 服务端内置大模型提供商名称标识。 |
| `BUILTIN_LLM_BASE_URL` | 否 | `"https://api.deepseek.com/v1"` | 内置大模型的 API 基础端点地址（兼容 OpenAI 规范）。 |
| `BUILTIN_LLM_MODEL` | 否 | `"deepseek-flash"` | 内置大模型模型代号。推荐使用 DeepSeek 最新极速推理模型 `deepseek-flash`。 |
| `BUILTIN_LLM_API_KEY` | 否 | `""` | 内置大模型的 API 密钥（在服务端完全加密保护，前端仅脱敏显示）。 |
| `PORT` | 否 | `3000` | 本地服务端口。 |

---

## 📂 项目目录结构

```text
├── api/                             # Vercel Serverless 云函数入口
│   ├── auth/verify.ts               # 系统授权口令验证
│   └── designer-prompt/
│       ├── refine.ts                # 提示词重塑云端服务
│       └── proxy-openai.ts          # 客户端 BYOK 跨域代理
├── src/
│   ├── config/
│   │   ├── presets.json             # 经典交互场景预设库 (零代码改动，自由增删改)
│   │   └── presets.ts               # 预设数据加载与类型定义
│   ├── components/
│   │   ├── CustomSelect.tsx         # 高品质通用下拉选择器组件
│   │   ├── Header.tsx               # 顶部导航、品牌展示与状态栏
│   │   ├── InputConsole.tsx         # 自然语言输入、调优参数与操作台
│   │   ├── InspirationChips.tsx     # 经典场景快速填入（自适应折行、无横向滚动条）
│   │   ├── CommunityModal.tsx       # 完整预设场景库弹窗 (动态分类筛选)
│   │   ├── DiffViewer.tsx           # 动效时间轴逐帧审查器与双轨物理跑道
│   │   ├── InteractiveSandbox.tsx   # 7 大原子交互原语与正交风格矩阵对比实验室
│   │   ├── ModelSettingsModal.tsx   # 大模型与 DeepSeek 预设配置弹窗
│   │   ├── AuthModal.tsx            # 系统访问授权码输入弹窗
│   │   ├── AboutModal.tsx           # 项目理念与动效哲学弹窗
│   │   ├── AIExportPanel.tsx        # 下游 AI 工具定制化提示词导出面板
│   │   └── CodeRecipePanel.tsx      # 生产级代码实现配方 (React / CSS / Framer Motion)
│   ├── utils/
│   │   ├── motionMath.ts            # 三次贝塞尔方程牛顿迭代求根与动力学阶段诊断
│   │   ├── motionMath.test.ts       # 贝塞尔数学与阶段诊断单元测试
│   │   ├── promptTransformer.ts     # 核心提示词重塑与动效规则引擎 (框架无关通用规范)
│   │   ├── promptTransformer.test.ts# 规则引擎单元测试
│   │   ├── configStore.ts           # 本地持久化与预设配置管理
│   │   ├── configStore.test.ts      # 鉴权与预设单元测试
│   │   ├── clipboard.ts             # 跨浏览器剪贴板复制工具
│   │   └── llmClient.ts             # 客户端大模型调用客户端
│   ├── App.tsx                      # 应用核心装配入口
│   └── main.tsx                     # React 根挂载点
├── server.ts                        # 本地 Express 服务端（双栈运行）
├── .env.example                     # 环境变量范例
├── LICENSE                          # MIT 开源许可证
└── README.md                        # 项目官方文档
```

---

## 🎨 预设提示词库自定义与扩展 (`presets.json`)

为了避免将设计师预设硬编码在业务代码中，系统设计了**完全解耦的独立预设配置文件**：`src/config/presets.json`。

### 如何新增或编辑预设？
**无需改动任何 TypeScript 或 React 代码**，只需直接在 `src/config/presets.json` 中追加或修改 JSON 节点，应用即刻热生效并在界面各处（主界面快捷填入 Chips、完整预设库弹窗、交互沙盒案例选择器）同步呈现：

```json
{
  "id": "command-palette-k",
  "title": "07 全局快速指令面板 (⌘K Command Palette)",
  "shortTitle": "07 ⌘K 指令中心",
  "category": "系统导航",
  "rawInput": "加一个全局搜索弹出框，按快捷键出来，可以用方向键选。",
  "designerPrompt": "实现全局极速指令中心 (⌘K)。按下快捷键时，页面背景叠加上 8px 高斯模糊并以 120ms 淡入深色遮罩；中心搜索窗口以 Spring 曲线 (stiffness: 420, damping: 30) 从 scale(0.95) 展开至原尺寸...",
  "style": "linear-dark",
  "motionTone": "snappy-spring",
  "icon": "Search",
  "highlightTags": ["高斯模糊遮罩", "Spring弹出比例", "游标弹性定位", "高对比微渐变"],
  "isQuickPick": false,
  "archetype": "command-palette",
  "sandboxData": {
    "badge": "Spring 曲线 (stiffness: 420, damping: 30) · 8px 高斯模糊 · 游标平滑滑动",
    "placeholder": "输入指令或按上下方向键浏览...",
    "commands": [
      { "title": "重塑为工业级设计师提示词", "shortcut": "↵ Enter", "category": "核心操作" },
      { "title": "切换视觉设计风格为 Linear.app 暗黑极客", "shortcut": "⌥ 1", "category": "设计流派" }
    ]
  }
}
```

#### 关键字段说明：
- `shortTitle`: 主控制台快速填入 Chip 上的简写标题，精炼紧凑，杜绝冗余横向滚动条。
- `isQuickPick`: 设为 `true` 时，作为精选推荐直接出现在主输入控制台；设为 `false` 时，仅在点击「预设库」弹窗中收纳展示。
- `category`: 业务分类。预设库弹窗会**自动提取**所有配置项中的 category，动态生成分类切换标签。
- `icon`: 图标代号（支持 `BarChart3`、`Move`、`Rotate3d`、`Maximize2`、`Layers`、`MessageSquare`、`Search` 等）。
- `highlightTags`: 关键技术标签，在预设库卡片底部直观呈现（如 `#FLIP让位`、`#Spring曲线`）。
- `archetype`: **交互沙盒原语映射键**（如 `dashboard`、`dragdrop`、`card3d`、`expand`、`stack`、`streaming`、`command-palette`）。
- `sandboxData`: **沙盒动态数据载荷**。传递给对应交互原语的文本、数值、卡片列表、指标增益等，使交互沙盒完全由数据驱动，实现案例内容与渲染逻辑解耦。

---

## 🚢 部署指南

### 部署到 Vercel (推荐)
本项目原生支持 Vercel 部署。
1. 在 Vercel 控制台导入本项目 GitHub 仓库。
2. 在 Project Settings -> Environment Variables 中添加：
   - `SYSTEM_ACCESS_KEY` = 您的访问密码
   - `BUILTIN_LLM_API_KEY` = 您的 DeepSeek API Key
   - `BUILTIN_LLM_MODEL` = `deepseek-flash`
3. 部署即可完成，API 路由自动映射至 `api/*` 云函数。

### 部署到独立服务器 / Docker
```bash
# 1. 编译前端资源
npm run build

# 2. 启动生产服务器
npm start
```

---

## 📄 开源许可证

- [MIT License](LICENSE)
