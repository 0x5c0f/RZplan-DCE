import type { IncomingMessage } from 'http';

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
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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

  const { endpoint, apiKey, payload } = body || {};

  if (!endpoint || !apiKey || !payload) {
    res.status(400).json({ error: '缺少必要的请求参数 (endpoint, apiKey, payload)' });
    return;
  }

  try {
    const upstreamRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!upstreamRes.ok) {
      const errText = await upstreamRes.text();
      res.status(upstreamRes.status).json({
        error: `上游模型 API 错误 (HTTP ${upstreamRes.status}): ${errText.slice(0, 150)}`,
      });
      return;
    }

    const data = await upstreamRes.json();
    const rawContent = data?.choices?.[0]?.message?.content || '';

    let parsed = null;
    try {
      const cleaned = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = null;
    }

    res.status(200).json({
      success: true,
      source: 'custom-openai',
      raw: rawContent,
      data: parsed,
    });
  } catch (err: any) {
    res.status(500).json({ error: `代理调用失败: ${err?.message || err}` });
  }
}
