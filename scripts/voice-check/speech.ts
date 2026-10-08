import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import type { Localized } from '../../src/core/i18n/locales';

/**
 * Speech synthesis for the voice check, with the online neural voices of `edge-tts`
 * (pip install edge-tts): a female and a male voice per language. Only the card words are sent;
 * each clip is cached, so a word is only fetched once.
 */
export const VOICES: Localized<string[]> = {
  'en-US': ['en-US-AriaNeural', 'en-US-GuyNeural'],
  'pt-PT': ['pt-PT-RaquelNeural', 'pt-PT-DuarteNeural'],
};

/** "pt-PT-RaquelNeural" -> "Raquel". */
export const voiceName = (voice: string) => voice.split('-')[2].replace(/Neural$/, '');

const CACHE = join('node_modules', '.cache', 'voice-check', 'speech');
const PYTHON = process.env.PYTHON ?? 'python';
const run = promisify(execFile);

/** Fails early, with what to do, when edge-tts isn't installed. */
export async function checkSynthesizer(): Promise<void> {
  try {
    await run(PYTHON, ['-m', 'edge_tts', '--help']);
  } catch {
    throw new Error(`The voice check needs edge-tts: run "${PYTHON} -m pip install edge-tts" (or set PYTHON to your Python).`);
  }
}

/** An MP3 of the voice saying the text. */
export async function speak(voice: string, text: string): Promise<Buffer> {
  mkdirSync(CACHE, { recursive: true });
  const key = createHash('sha1').update(`${voice}\n${text}`).digest('hex').slice(0, 16);
  const file = join(CACHE, `${key}.mp3`);
  if (!existsSync(file)) await run(PYTHON, ['-m', 'edge_tts', '--voice', voice, '--text', text, '--write-media', file]);
  return readFileSync(file);
}
