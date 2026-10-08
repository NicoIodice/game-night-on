import { existsSync } from 'node:fs';
import { chromium, type Browser, type Page } from 'playwright-core';

/**
 * Chrome's own speech recognition (the one the game uses), fed recorded speech instead of a
 * microphone: the clip plays through Web Audio into a track that `recognition.start(track)` listens
 * to. Needs Google Chrome 135 or newer installed; set CHROME_PATH if it isn't found.
 */

const CHROME_PATHS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
];

/** Speech recognition needs a secure page; this one is served by the check itself, no server needed. */
const PAGE_URL = 'https://voice-check.test/';

/** Room noise before the clip, for the recognizer to settle. */
const LEAD_MS = 800;
/** How long to keep listening after the clip ends, for the last words to arrive. */
const TAIL_MS = 2500;
/**
 * Quiet hiss under the clip (about -50 dB), like any real microphone picks up. With perfect digital
 * silence around it, Chrome doesn't even notice a short word ("bee") as sound.
 */
const NOISE = 0.003;

export interface Recognizer {
  /** What the browser heard in the clip, in the language given (e.g. 'pt-PT'). */
  hear(audio: Buffer, lang: string): Promise<string>;
  close(): Promise<void>;
}

export async function openRecognizer(pages = 4): Promise<Recognizer> {
  const executablePath = process.env.CHROME_PATH ?? CHROME_PATHS.find((path) => existsSync(path));
  if (!executablePath) throw new Error('Google Chrome not found: set CHROME_PATH to chrome.exe (or the Chrome binary).');
  const browser: Browser = await chromium.launch({ executablePath, args: ['--autoplay-policy=no-user-gesture-required'] });
  const context = await browser.newContext();
  await context.route(PAGE_URL, (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Voice check</title>' }));

  // A few pages listen at once; each clip waits for a free one.
  const free: Page[] = [];
  for (let i = 0; i < pages; i++) {
    const page = await context.newPage();
    await page.goto(PAGE_URL);
    free.push(page);
  }
  const waiting: ((page: Page) => void)[] = [];
  const take = () => new Promise<Page>((resolve) => (free.length ? resolve(free.pop()!) : waiting.push(resolve)));
  const give = (page: Page) => (waiting.length ? waiting.shift()!(page) : free.push(page));

  return {
    async hear(audio, lang) {
      const page = await take();
      try {
        return await page.evaluate(listen, { audio: audio.toString('base64'), lang, leadMs: LEAD_MS, tailMs: TAIL_MS, noise: NOISE });
      } finally {
        give(page);
      }
    },
    close: () => browser.close(),
  };
}

interface ListenOptions {
  audio: string;
  lang: string;
  leadMs: number;
  tailMs: number;
  noise: number;
}

/** Runs in the page: plays the clip, over room noise, into a recognition session and resolves with everything it heard. */
async function listen({ audio, lang, leadMs, tailMs, noise }: ListenOptions): Promise<string> {
  const context = new AudioContext();
  const bytes = Uint8Array.from(atob(audio), (char) => char.charCodeAt(0));
  const clip = await context.decodeAudioData(bytes.buffer);
  const output = context.createMediaStreamDestination();

  const scope = globalThis as unknown as Record<string, new () => SpeechRecognitionLike>;
  const recognition = new (scope.SpeechRecognition ?? scope.webkitSpeechRecognition)();
  recognition.lang = lang;
  recognition.continuous = true;
  recognition.interimResults = true;
  let finals: string[] = [];
  let interim = '';
  let failed = '';
  recognition.onresult = (event) => {
    finals = [];
    interim = '';
    for (let i = 0; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) finals.push(result[0].transcript);
      else interim = result[0].transcript;
    }
  };
  recognition.onerror = (event) => {
    if (event.error !== 'no-speech' && event.error !== 'aborted') failed = event.error;
  };
  const ended = new Promise<void>((resolve) => (recognition.onend = () => resolve()));
  recognition.start(output.stream.getAudioTracks()[0]);

  const hiss = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const samples = hiss.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = (Math.random() * 2 - 1) * noise;
  const room = context.createBufferSource();
  room.buffer = hiss;
  room.loop = true;
  room.connect(output);
  room.start();

  await new Promise((resolve) => setTimeout(resolve, leadMs));
  const source = context.createBufferSource();
  source.buffer = clip;
  source.connect(output);
  source.start();
  await new Promise((resolve) => setTimeout(resolve, clip.duration * 1000 + tailMs));
  recognition.stop();
  await Promise.race([ended, new Promise((resolve) => setTimeout(resolve, 3000))]);
  await context.close();
  if (failed) throw new Error(`Speech recognition failed: ${failed}`);
  // A last word may still be a guess when listening stops; it's what the game would have seen.
  return [...finals, interim].join(' ').trim();
}

/** The bits of the Web Speech API used here (`start(track)` is newer than the DOM types). */
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(track?: MediaStreamTrack): void;
  stop(): void;
}
