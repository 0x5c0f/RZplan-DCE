import type { IncomingMessage } from 'http';

const SYSTEM_ACCESS_KEY = process.env.SYSTEM_ACCESS_KEY;

function maskKey(key?: string): string {
  if (!key) return '';
  const trimmed = key.trim();
  if (trimmed.length <= 8) return 'sk-••••••••';
  return `${trimmed.slice(0, 3)}••••••••${trimmed.slice(-4)}`;
}

function getBuiltinModelSafeInfo() {
  const builtinKey = process.env.BUILTIN_LLM_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (builtinKey && builtinKey.trim()) {
    return {
      hasBuiltin: true,
      provider: process.env.BUILTIN_LLM_PROVIDER || 'DeepSeek',
      baseUrl: process.env.BUILTIN_LLM_BASE_URL || 'https://api.deepseek.com/v1',
      model: process.env.BUILTIN_LLM_MODEL || 'deepseek-flash',
      maskedKey: maskKey(builtinKey),
      message: '服务端已配置内置大模型',
    };
  }

  if (geminiKey && geminiKey.trim()) {
    return {
      hasBuiltin: true,
      provider: 'Google Gemini',
      baseUrl: 'https://generativelanguage.googleapis.com',
      model: 'gemini-2.5-flash',
      maskedKey: maskKey(geminiKey),
      message: '服务端已配置 Google Gemini 内置模型',
    };
  }

  return {
    hasBuiltin: false,
    provider: '未配置',
    baseUrl: '',
    model: '',
    maskedKey: '',
    message: '服务端环境变量未配置内置模型 (BUILTIN_LLM_API_KEY 或 GEMINI_API_KEY)',
  };
}

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

export default async function handler(req: any, res: any) {
  // CORS Headers
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

  // Support GET check if Authorization header or ?accessKey= is provided
  if (req.method === 'GET') {
    const authHeader = req.headers['authorization'];
    const queryKey = req.query?.accessKey;
    const bearerKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const keyToCheck = bearerKey || queryKey;

    if (SYSTEM_ACCESS_KEY && keyToCheck && keyToCheck.trim() === SYSTEM_ACCESS_KEY) {
      res.status(200).json({
        valid: true,
        message: '授权验证有效',
        systemModel: getBuiltinModelSafeInfo(),
      });
      return;
    }

    res.status(200).json({
      valid: false,
      message: SYSTEM_ACCESS_KEY ? '需要输入系统授权码' : '服务端未配置 SYSTEM_ACCESS_KEY',
      systemModel: {
        hasBuiltin: Boolean(process.env.BUILTIN_LLM_API_KEY || process.env.GEMINI_API_KEY),
        provider: process.env.BUILTIN_LLM_PROVIDER || (process.env.GEMINI_API_KEY ? 'Google Gemini' : '未配置'),
        model: process.env.BUILTIN_LLM_MODEL || (process.env.GEMINI_API_KEY ? 'gemini-2.5-flash' : ''),
        maskedKey: '登录后查看',
      },
    });
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

  const { accessKey } = body || {};

  if (!accessKey || typeof accessKey !== 'string') {
    res.status(400).json({ valid: false, error: '请输入授权码' });
    return;
  }

  if (!SYSTEM_ACCESS_KEY) {
    res.status(403).json({
      valid: false,
      error: '服务端未设置 SYSTEM_ACCESS_KEY 环境变量，未开启密码登录内置模型。请在前端配置个人自定义大模型 (BYOK) 使用。',
    });
    return;
  }

  const isValid = accessKey.trim() === SYSTEM_ACCESS_KEY;
  if (isValid) {
    res.status(200).json({
      valid: true,
      message: '授权验证成功',
      systemModel: getBuiltinModelSafeInfo(),
    });
  } else {
    res.status(401).json({ valid: false, error: '授权码错误，请重新输入' });
  }
}
