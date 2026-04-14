import { getSupabase, getAdminSupabase } from './supabase';

export type AIProvider = 'claude' | 'openai' | 'gemini' | 'copilot';

export interface AISettings {
  provider: AIProvider;
  claude_key: string;
  openai_key: string;
  gemini_key: string;
  copilot_key: string;
}

const DEFAULT_SETTINGS: AISettings = {
  provider: 'claude',
  claude_key: '',
  openai_key: '',
  gemini_key: '',
  copilot_key: ''
};

// In-memory store for demo mode
let memorySettings: AISettings = { ...DEFAULT_SETTINGS };

export async function getAISettings(): Promise<AISettings> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb
        .from('ai_settings')
        .select('*')
        .eq('id', 'global')
        .single();
      if (data) {
        return {
          provider: data.provider || 'claude',
          claude_key: data.claude_key || '',
          openai_key: data.openai_key || '',
          gemini_key: data.gemini_key || '',
          copilot_key: data.copilot_key || ''
        };
      }
    } catch {}
  }
  // Also check env vars as initial fallback
  if (!memorySettings.claude_key && process.env.ANTHROPIC_API_KEY) {
    memorySettings.claude_key = process.env.ANTHROPIC_API_KEY;
  }
  return memorySettings;
}

export async function saveAISettings(settings: Partial<AISettings>): Promise<AISettings> {
  const current = await getAISettings();
  const updated: AISettings = { ...current, ...settings };

  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      await sb.from('ai_settings').upsert({
        id: 'global',
        ...updated,
        updated_at: new Date().toISOString()
      });
    } catch {}
  }

  memorySettings = updated;
  return updated;
}

export function getActiveKey(settings: AISettings): { provider: AIProvider; key: string } | null {
  const map: Record<AIProvider, string> = {
    claude: settings.claude_key,
    openai: settings.openai_key,
    gemini: settings.gemini_key,
    copilot: settings.copilot_key
  };
  const key = map[settings.provider];
  if (!key) return null;
  return { provider: settings.provider, key };
}
