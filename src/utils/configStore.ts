export type ThemeMode = 'dark' | 'light';

export interface CustomModelConfig {
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
  model: string;
  providerName?: string;
}

export interface SystemModelInfo {
  hasBuiltin: boolean;
  provider?: string;
  baseUrl?: string;
  model?: string;
  maskedKey?: string;
  message?: string;
}

const THEME_KEY = 'dce_theme';
const AUTH_KEY = 'dce_auth_key';
const CUSTOM_MODEL_KEY = 'dce_custom_model';
const SYSTEM_MODEL_KEY = 'dce_system_model_cache';

export const POPULAR_PRESETS: Array<{
  name: string;
  baseUrl: string;
  defaultModel: string;
  description?: string;
}> = [
  {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    defaultModel: 'deepseek-flash',
    description: '官方 OpenAI 兼容端点，高性价比与出色中文/代码推理',
  },
];

export function maskApiKey(key?: string): string {
  if (!key) return '';
  const trimmed = key.trim();
  if (trimmed.length <= 8) return 'sk-••••••••';
  const prefix = trimmed.slice(0, 3);
  const suffix = trimmed.slice(-4);
  return `${prefix}••••••••${suffix}`;
}

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const val = localStorage.getItem(THEME_KEY);
    if (val === 'light' || val === 'dark') return val;
  } catch {}
  return 'dark';
}

export function setStoredTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {}
}

export function getStoredAuthKey(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(AUTH_KEY);
  } catch {
    return null;
  }
}

export function setStoredAuthKey(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_KEY, key.trim());
  } catch {}
}

export function clearStoredAuthKey(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {}
}

export function getStoredSystemModel(): SystemModelInfo | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SYSTEM_MODEL_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function setStoredSystemModel(info: SystemModelInfo): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SYSTEM_MODEL_KEY, JSON.stringify(info));
  } catch {}
}

export function clearStoredSystemModel(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SYSTEM_MODEL_KEY);
  } catch {}
}

export function getStoredCustomModel(): CustomModelConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CUSTOM_MODEL_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

export function setStoredCustomModel(config: CustomModelConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOM_MODEL_KEY, JSON.stringify(config));
  } catch {}
}

export function clearStoredCustomModel(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CUSTOM_MODEL_KEY);
  } catch {}
}

export function isUserAuthorized(authKey: string | null, customModel: CustomModelConfig | null): boolean {
  if (customModel && customModel.enabled && customModel.apiKey && customModel.baseUrl) {
    return true;
  }
  if (authKey && authKey.trim().length > 0) {
    return true;
  }
  return false;
}
