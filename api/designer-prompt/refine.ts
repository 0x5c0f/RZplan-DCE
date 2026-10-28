import type { IncomingMessage } from 'http';
import { GoogleGenAI, Type } from '@google/genai';
import { synthesizeDesignerPrompt } from '../../src/utils/promptTransformer.ts';

const SYSTEM_ACCESS_KEY = process.env.SYSTEM_ACCESS_KEY;

// Helper to parse JSON body in Vercel Serverless Function
async function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function buildDesignerSystemInstruction(style: string, motionTone: string, targetTool: string): string {
  return `你是一个专为前端开发者赋能的世界级资深 UI/UX 设计师、动效编排架构师 (Principal Motion & Product Designer Agent)。
你的职责是将粗糙口语、平铺直叙的自然语言前端需求，深度重塑为专业、具体、极富视觉纵深与物理动效质感的设计师级 Prompt 规范。

选定设计风格：${style}
选定动效调性：${motionTone}
目标交付平台：${targetTool}
核心技术理念：跨前端框架通用 (Framework-Agnostic: React, Vue, Svelte, 纯HTML/CSS/JS, Web Components, Flutter 等均可直接无缝落地)

【专业规范与落地要求】
1. 语言与框架通用性：提示词本身属于高阶设计师设计规范，必须基于 W3C 标准 CSS、数学缓动函数 (cubic-bezier)、通用弹簧动力学模型 (Spring Physics) 与状态机进行规范化描述，不将逻辑死锁绑定在单一框架上，确保任意前端框架的大模型开发者均能直接无缝生成。
2. 明确物理动效与微交互体系：具体的数学缓动曲线 (如 cubic-bezier(0.16, 1, 0.3, 1))、微触感缩放 (Hover 1.02~1.03, Active 0.97~0.98)、弹簧动力学参数 (stiffness 380~450, damping 22~28)、错峰时序 (Stagger 35~60ms) 与全生命周期状态机 (Default, Hover, Active, Focus-visible, Dragging/Settling)。
3. 空间连续性与 3D 光学约束：共享元素形态展开 (基于 Shared Element 原位展开原理)、FLIP 让位重排、3D 透视视距 (perspective: 1000px, preserve-3d, backface-visibility: hidden) 与动态反射高光。
4. GPU 渲染性能铁律：严禁对 width/height/top/left 做过渡引发浏览器重排 (Reflow)；强制只过渡 GPU 硬件加速的 transform 与 opacity，形变前注入 will-change: transform。
5. 必须输出纯 JSON 格式：
{
  "title": "项目重构标题",
  "designRole": "资深 UI/UX & 微动效架构师 (Principal Motion & Product Designer)",
  "intentAnalysis": {
    "summary": "意图深度解构",
    "identifiedGaps": ["缺失点1", "缺失点2"],
    "missingDimensions": ["触觉反馈缺失", "时序编排缺失", "空间连续性缺失"]
  },
  "enhancedPrompt": "按工业级模块组织的提示词：【项目】、【视觉基调】、【组件规范与五态交互】、【微交互与时序编排】、【物理与缓动体系】、【GPU渲染与性能准则】、【跨前端技术栈通用落地】、【无障碍与状态闭环】",
  "cursorPrompt": "针对 Cursor / Claude Code 的跨框架通用落地指令、.cursorrules 风格与严苛动效性能约束",
  "v0Prompt": "针对 v0.dev / Bolt.new / 任意前端组件生成工具的单次高保真生成 Prompt",
  "markdownPRD": "完整的 Markdown 格式跨框架设计评审与工业级规格文档",
  "motionSpec": {
    "easing": "Apple Ease-Out (0.16, 1, 0.3, 1)",
    "easingBezier": "cubic-bezier(0.16, 1, 0.3, 1)",
    "duration": "280ms",
    "springStiffness": 380,
    "springDamping": 28,
    "staggerDelay": "45ms",
    "scaleHover": 1.02,
    "scaleActive": 0.98,
    "choreographyRules": ["错峰进场规则", "共享指示器物理滑移", "GPU transform 硬件加速"]
  }
}`;
}

async function callOpenAIUpstream(
  baseUrl: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string
): Promise<any> {
  let cleanBase = baseUrl.trim();
  if (cleanBase.endsWith('/')) cleanBase = cleanBase.slice(0, -1);
  if (!cleanBase.endsWith('/v1') && !cleanBase.includes('/chat/completions')) {
    cleanBase = `${cleanBase}/v1`;
  }
  const endpoint = cleanBase.endsWith('/chat/completions')
    ? cleanBase
    : `${cleanBase}/chat/completions`;

  const payload: any = {
    model: model.trim(),
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.3,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upstream API error (${response.status}): ${errorText.slice(0, 150)}`);
  }

  const json = await response.json();
  const rawContent = json?.choices?.[0]?.message?.content || '';
  return extractJsonFromContent(rawContent);
}

function extractJsonFromContent(rawContent: string): any {
  if (!rawContent || typeof rawContent !== 'string') {
    throw new Error('模型返回内容为空');
  }
  const cleaned = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = rawContent.indexOf('{');
    const lastBrace = rawContent.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonSub = rawContent.slice(firstBrace, lastBrace + 1);
      return JSON.parse(jsonSub);
    }
    throw new Error(`无法从模型输出提取有效 JSON: ${rawContent.slice(0, 80)}`);
  }
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  let body = req.body;
  if (!body || typeof body === 'string') {
    body = await parseJsonBody(req);
  }

  const {
    input,
    style = 'linear-dark',
    motionTone = 'apple-ease',
    targetTool = 'cursor',
    accessKey,
    customModelConfig,
  } = body || {};

  if (!input || typeof input !== 'string' || !input.trim()) {
    res.status(400).json({ error: '请输入需求描述' });
    return;
  }

  const fallbackResult = synthesizeDesignerPrompt(input, {
    style,
    motionTone,
    targetTool,
  });

  // Verify authorization: Must have custom model OR system access key
  const hasCustomModel =
    customModelConfig &&
    customModelConfig.enabled &&
    customModelConfig.apiKey &&
    customModelConfig.baseUrl;

  const isAccessKeyValid = Boolean(
    SYSTEM_ACCESS_KEY &&
    accessKey &&
    typeof accessKey === 'string' &&
    accessKey.trim() === SYSTEM_ACCESS_KEY
  );

  if (!hasCustomModel && !isAccessKeyValid) {
    res.status(401).json({
      error: '未登录用户需在前端配置自定义大模型 (BYOK) 方可使用；或输入系统授权码登录以使用内置模型。',
      requiresAuth: true,
      data: fallbackResult,
    });
    return;
  }

  const systemPrompt = buildDesignerSystemInstruction(style, motionTone, targetTool);
  const userPrompt = `用户需求：\n"${input.trim()}"\n\n请进行资深设计师 Prompt 重塑，输出规范 JSON。`;

  // Pathway 1: User explicitly provided customModelConfig
  if (hasCustomModel) {
    try {
      const parsed = await callOpenAIUpstream(
        customModelConfig.baseUrl,
        customModelConfig.apiKey,
        customModelConfig.model || 'deepseek-flash',
        systemPrompt,
        userPrompt
      );

      const finalData = {
        ...fallbackResult,
        title: parsed.title || fallbackResult.title,
        designRole: parsed.designRole || fallbackResult.designRole,
        intentAnalysis: parsed.intentAnalysis || fallbackResult.intentAnalysis,
        enhancedPrompt: parsed.enhancedPrompt || fallbackResult.enhancedPrompt,
        cursorPrompt: parsed.cursorPrompt || fallbackResult.cursorPrompt,
        v0Prompt: parsed.v0Prompt || fallbackResult.v0Prompt,
        markdownPRD: parsed.markdownPRD || fallbackResult.markdownPRD,
        motionSpec: {
          ...fallbackResult.motionSpec,
          ...(parsed.motionSpec || {}),
        },
      };

      res.status(200).json({
        success: true,
        source: 'custom-model',
        data: finalData,
      });
      return;
    } catch (err: any) {
      console.warn('Custom model generation error:', err?.message || err);
      // Return error or fallback
      res.status(502).json({
        error: `自定义模型调用失败: ${err?.message || '上游超时'}`,
        data: fallbackResult,
      });
      return;
    }
  }

  // Pathway 2: System Built-in Model via BUILTIN_LLM_API_KEY (OpenAI compatible)
  const builtinKey = process.env.BUILTIN_LLM_API_KEY;
  if (builtinKey && builtinKey.trim()) {
    try {
      const baseUrl = process.env.BUILTIN_LLM_BASE_URL || 'https://api.deepseek.com/v1';
      const model = process.env.BUILTIN_LLM_MODEL || 'deepseek-flash';

      const parsed = await callOpenAIUpstream(
        baseUrl,
        builtinKey,
        model,
        systemPrompt,
        userPrompt
      );

      const finalData = {
        ...fallbackResult,
        title: parsed.title || fallbackResult.title,
        designRole: parsed.designRole || fallbackResult.designRole,
        intentAnalysis: parsed.intentAnalysis || fallbackResult.intentAnalysis,
        enhancedPrompt: parsed.enhancedPrompt || fallbackResult.enhancedPrompt,
        cursorPrompt: parsed.cursorPrompt || fallbackResult.cursorPrompt,
        v0Prompt: parsed.v0Prompt || fallbackResult.v0Prompt,
        markdownPRD: parsed.markdownPRD || fallbackResult.markdownPRD,
        motionSpec: {
          ...fallbackResult.motionSpec,
          ...(parsed.motionSpec || {}),
        },
      };

      res.status(200).json({
        success: true,
        source: `builtin-${model}`,
        data: finalData,
      });
      return;
    } catch (err: any) {
      console.warn('Built-in model generation error, falling back:', err?.message || err);
      res.status(200).json({
        success: false,
        source: 'designer-engine-fallback',
        errorNotice: `内置模型调用异常 (${err?.message?.slice(0, 80) || '上游超时'})，已启用本地设计师规则引擎兜底`,
        data: fallbackResult,
      });
      return;
    }
  }

  // Pathway 3: Native Google Gemini SDK (if GEMINI_API_KEY is provided)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim()) {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              designRole: { type: Type.STRING },
              intentAnalysis: {
                type: Type.OBJECT,
                properties: {
                  summary: { type: Type.STRING },
                  identifiedGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingDimensions: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['summary', 'identifiedGaps', 'missingDimensions'],
              },
              enhancedPrompt: { type: Type.STRING },
              cursorPrompt: { type: Type.STRING },
              v0Prompt: { type: Type.STRING },
              markdownPRD: { type: Type.STRING },
              motionSpec: {
                type: Type.OBJECT,
                properties: {
                  easing: { type: Type.STRING },
                  easingBezier: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  springStiffness: { type: Type.NUMBER },
                  springDamping: { type: Type.NUMBER },
                  staggerDelay: { type: Type.STRING },
                  scaleHover: { type: Type.NUMBER },
                  scaleActive: { type: Type.NUMBER },
                  choreographyRules: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: [
                  'easing',
                  'easingBezier',
                  'duration',
                  'springStiffness',
                  'springDamping',
                  'staggerDelay',
                  'scaleHover',
                  'scaleActive',
                  'choreographyRules',
                ],
              },
            },
            required: [
              'title',
              'designRole',
              'intentAnalysis',
              'enhancedPrompt',
              'cursorPrompt',
              'v0Prompt',
              'markdownPRD',
              'motionSpec',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const finalData = {
        ...fallbackResult,
        title: parsed.title || fallbackResult.title,
        designRole: parsed.designRole || fallbackResult.designRole,
        intentAnalysis: parsed.intentAnalysis || fallbackResult.intentAnalysis,
        enhancedPrompt: parsed.enhancedPrompt || fallbackResult.enhancedPrompt,
        cursorPrompt: parsed.cursorPrompt || fallbackResult.cursorPrompt,
        v0Prompt: parsed.v0Prompt || fallbackResult.v0Prompt,
        markdownPRD: parsed.markdownPRD || fallbackResult.markdownPRD,
        motionSpec: {
          ...fallbackResult.motionSpec,
          ...(parsed.motionSpec || {}),
        },
      };

      res.status(200).json({
        success: true,
        source: 'gemini-2.5-flash',
        data: finalData,
      });
      return;
    } catch (err: any) {
      console.warn('Gemini prompt refinement error:', err?.message || err);
      res.status(200).json({
        success: true,
        source: 'designer-engine-fallback',
        errorNotice: 'Gemini 响应异常，已自动启用本地设计师规则引擎',
        data: fallbackResult,
      });
      return;
    }
  }

  // If neither BUILTIN_LLM_API_KEY nor GEMINI_API_KEY is set on the server:
  res.status(200).json({
    success: true,
    source: 'designer-engine-local',
    notice: '服务端环境变量未配置 BUILTIN_LLM_API_KEY 或 GEMINI_API_KEY，当前通过本地高级确定性设计师引擎重塑',
    data: fallbackResult,
  });
}
