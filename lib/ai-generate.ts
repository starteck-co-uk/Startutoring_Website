import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Question } from './types';
import type { AIProvider } from './ai-settings';

export function extractQuestions(raw: string): Question[] | null {
  const jsonStart = raw.indexOf('{');
  const jsonEnd = raw.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) return null;
  const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
  const questions: Question[] = parsed.questions?.filter(
    (q: any) =>
      q &&
      typeof q.text === 'string' &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correct === 'number'
  );
  return questions && questions.length > 0 ? questions : null;
}

export function extractJSON(raw: string): any | null {
  const jsonStart = raw.indexOf('{');
  const jsonEnd = raw.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) return null;
  return JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
}

async function callClaude(prompt: string, key: string, maxTokens = 4096): Promise<string> {
  const client = new Anthropic({ apiKey: key });
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }]
  });
  return msg.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('\n');
}

async function callOpenAI(prompt: string, key: string, maxTokens = 4096): Promise<string> {
  const client = new OpenAI({ apiKey: key });
  const chat = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: 'You are a UK curriculum quiz generator and examiner. Return strict JSON only.' },
      { role: 'user', content: prompt }
    ]
  });
  return chat.choices[0]?.message?.content || '';
}

async function callGemini(prompt: string, key: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callCopilot(prompt: string, key: string, maxTokens = 4096): Promise<string> {
  const client = new OpenAI({
    apiKey: key,
    baseURL: 'https://models.inference.ai.azure.com'
  });
  const chat = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: 'You are a UK curriculum quiz generator and examiner. Return strict JSON only.' },
      { role: 'user', content: prompt }
    ]
  });
  return chat.choices[0]?.message?.content || '';
}

export async function callProvider(
  prompt: string,
  provider: AIProvider,
  key: string,
  maxTokens = 4096
): Promise<string> {
  switch (provider) {
    case 'claude':
      return callClaude(prompt, key, maxTokens);
    case 'openai':
      return callOpenAI(prompt, key, maxTokens);
    case 'gemini':
      return callGemini(prompt, key);
    case 'copilot':
      return callCopilot(prompt, key, maxTokens);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export async function generateQuestions(
  prompt: string,
  provider: AIProvider,
  key: string
): Promise<Question[]> {
  const raw = await callProvider(prompt, provider, key);
  const questions = extractQuestions(raw);
  if (!questions) throw new Error(`${provider} returned no valid questions`);
  return questions;
}
