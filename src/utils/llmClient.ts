import { CustomModelConfig } from './configStore';
import {
  DesignerPromptResult,
  synthesizeDesignerPrompt,
  DesignStyle,
  MotionTone,
  TargetTool,
} from './promptTransformer';

export async function callOpenAICompatibleModel(
  config: CustomModelConfig,
  input: string,
  options: {
    style: DesignStyle;
    motionTone: MotionTone;
    targetTool: TargetTool;
  }
): Promise<DesignerPromptResult> {
  const { style, motionTone, targetTool } = options;
  const fallback = synthesizeDesignerPrompt(input, { style, motionTone, targetTool });

  // Standard clean base URL
  let baseUrl = config.baseUrl.trim();
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  if (!baseUrl.endsWith('/v1') && !baseUrl.includes('/chat/completions')) {
    // If user provided just hostname or prefix
    baseUrl = `${baseUrl}/v1`;
  }
  const endpoint = baseUrl.endsWith('/chat/completions')
    ? baseUrl
    : `${baseUrl}/chat/completions`;

  const systemPrompt = `你是一个世界级资深 UI/UX 设计师、动效编排架构师 (Principal Motion & Product Designer)。
用户（通常是普通开发者）提供了自然语言前端需求，你需要将其重塑为专业、具体、极富视觉与物理质感的设计师级 Prompt。
要求：
1. 像资深动效设计师一样思考，严禁泛泛而谈“加点动效”，必须明确给出物理数学模型：具体缓动曲线 (如 cubic-bezier(0.16, 1, 0.3, 1))、时长 (如 320ms)、弹簧系数 (Spring stiffness 380, damping 28)、微触感缩放 (Hover 1.02, Active 0.98)、交互全状态机 (Default, Hover, Active, Focus, Selected) 与进场时序错峰 (Stagger 45ms)。
2. 视觉基调必须严格契合用户当前选定的设计风格 (${style})：
   - 若为 apple-clean，使用纯白 #FFFFFF、浅灰 #F5F5F7、高对比 #1D1D1F 与高斯模糊 backdrop-blur-xl；
   - 若为 linear-dark，使用冷黑 #08090A、卡片 #101113、径向光晕光源纵深与微内高光 inset 0 1px 0 rgba(255,255,255,0.05)；
   - 其他风格同理，严禁色调风格与用户选择脱节。
3. enhancedPrompt 必须采用清晰严谨的工业级规范模块输出：
   【项目】...
   【视觉基调】...
   【组件规范与五态交互】(涵盖 Default / Hover / Active / Selected / Focus-visible)
   【共享元素与转场编排】(涵盖 FLIP 原理、Stagger 错峰)
   【加载与数据态】(骨架屏 Shimmer、tabular-nums 数字滚动、刷新防抖)
   【物理与缓动体系】(明确 cubic-bezier 与 Spring 参数)
   【推荐技术实现】(Framer Motion 属性与 Tailwind 类建议，如 layoutId, transition, group-hover)
   【无障碍与渲染性能】(prefers-reduced-motion、仅动画 transform 与 opacity 保证 60fps)
4. 必须返回纯 JSON 对象（不要输出 markdown 代码块），包含以下字段：
{
  "title": "项目/交互简短标题",
  "designRole": "资深 UI/UX 动效与交互架构师",
  "intentAnalysis": {
    "summary": "提炼概述",
    "identifiedGaps": ["缺失点1", "缺失点2"],
    "missingDimensions": ["维度1", "维度2"]
  },
  "enhancedPrompt": "专业设计师重塑提示词正文",
  "cursorPrompt": "针对 Cursor/Claude 的完整规则 Prompt（包含技术栈落地指导）",
  "v0Prompt": "针对 v0/Bolt 的一键组件生成 Prompt",
  "markdownPRD": "完整设计规范 Markdown",
  "motionSpec": {
    "easing": "Ease Out Smooth (Apple Style)",
    "easingBezier": "cubic-bezier(0.16, 1, 0.3, 1)",
    "duration": "320ms ~ 480ms",
    "springStiffness": 380,
    "springDamping": 28,
    "staggerDelay": "45ms",
    "scaleHover": 1.02,
    "scaleActive": 0.98,
    "choreographyRules": ["规则1", "规则2"]
  }
}`;

  const userContent = `用户自然语言前端需求:
"${input.trim()}"

选定的设计风格: ${style}
选定的动效调性: ${motionTone}
目标交付工具: ${targetTool}

请生成设计师级专业提示词 JSON:`;

  const requestBody: any = {
    model: config.model || 'deepseek-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
    temperature: 0.7,
  };

  // Try calling via server proxy to prevent CORS issues in browsers
  try {
    const proxyRes = await fetch('/api/designer-prompt/proxy-openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint,
        apiKey: config.apiKey,
        payload: requestBody,
      }),
    });

    if (proxyRes.ok) {
      const json = await proxyRes.json();
      if (json.data) {
        return {
          ...fallback,
          ...json.data,
          motionSpec: {
            ...fallback.motionSpec,
            ...(json.data.motionSpec || {}),
          },
        };
      }
    }
  } catch (err) {
    console.warn('Proxy call failed, trying direct browser fetch...', err);
  }

  // Direct fetch fallback if proxy is unavailable
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey.trim()}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API 请求失败 (${res.status}): ${errText.slice(0, 100)}`);
  }

  const json = await res.json();
  const rawText = json?.choices?.[0]?.message?.content || '';

  // Extract JSON from response
  let parsed: any = null;
  try {
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        parsed = JSON.parse(rawText.slice(firstBrace, lastBrace + 1));
      } else {
        throw new Error('No JSON brackets found');
      }
    }
  } catch (e) {
    console.warn('Failed to parse JSON response from custom model, using fallback:', e);
    return fallback;
  }

  return {
    ...fallback,
    title: parsed.title || fallback.title,
    designRole: parsed.designRole || fallback.designRole,
    intentAnalysis: parsed.intentAnalysis || fallback.intentAnalysis,
    enhancedPrompt: parsed.enhancedPrompt || fallback.enhancedPrompt,
    cursorPrompt: parsed.cursorPrompt || fallback.cursorPrompt,
    v0Prompt: parsed.v0Prompt || fallback.v0Prompt,
    markdownPRD: parsed.markdownPRD || fallback.markdownPRD,
    motionSpec: {
      ...fallback.motionSpec,
      ...(parsed.motionSpec || {}),
    },
  };
}
