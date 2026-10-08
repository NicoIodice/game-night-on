/**
 * Continuous speech-to-text via the browser's Web Speech API (Chrome and Edge).
 * Collects every word heard, including not-yet-final guesses, so games can react quickly.
 */

interface RecognitionResultList {
  length: number;
  [index: number]: { 0: { transcript: string } };
}

interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: { results: RecognitionResultList }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}

type RecognitionConstructor = new () => Recognition;

function recognitionConstructor(): RecognitionConstructor | undefined {
  const scope = globalThis as unknown as Record<string, RecognitionConstructor | undefined>;
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition;
}

/** Lowercase words without punctuation: "Cat, rat!" -> ["cat", "rat"]. */
export function toWords(text: string): string[] {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s']/gu, ' ').split(/\s+/).filter(Boolean);
}

/** Errors after which listening cannot continue. */
const FATAL_ERRORS = new Set(['not-allowed', 'service-not-allowed', 'audio-capture', 'network', 'language-not-supported']);
const START_TIMEOUT_MS = 10000;

export type ListenResult = 'listening' | 'unsupported' | 'denied' | 'failed';

export class SpeechListener {
  static isSupported(): boolean {
    return recognitionConstructor() !== undefined;
  }

  /** Called whenever the list of heard words changes. */
  onWords: ((words: string[]) => void) | null = null;

  private readonly recognition: Recognition | null;
  private finished: string[] = [];
  private current: string[] = [];
  private active = false;
  /** Set by reset() until the aborted session ends, so its late results are dropped. */
  private discarding = false;

  constructor(lang = 'en-US') {
    const Constructor = recognitionConstructor();
    this.recognition = Constructor ? new Constructor() : null;
    if (!this.recognition) return;

    this.recognition.lang = lang;
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.onresult = (event) => {
      if (this.discarding) return;
      const parts: string[] = [];
      for (let i = 0; i < event.results.length; i++) parts.push(event.results[i][0].transcript);
      this.current = toWords(parts.join(' '));
      this.onWords?.(this.words);
    };
    this.recognition.onend = () => {
      // Browsers end recognition after silences; keep going until stopped.
      if (!this.discarding) this.finished.push(...this.current);
      this.current = [];
      this.discarding = false;
      if (this.active) this.recognition?.start();
    };
  }

  get words(): string[] {
    return [...this.finished, ...this.current];
  }

  /** Asks for the microphone (first time only) and resolves once listening has begun or failed. */
  start(): Promise<ListenResult> {
    const recognition = this.recognition;
    if (!recognition) return Promise.resolve('unsupported');

    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve('failed'), START_TIMEOUT_MS);
      const settle = (result: ListenResult) => {
        clearTimeout(timeout);
        resolve(result);
      };
      recognition.onstart = () => settle('listening');
      recognition.onerror = (event) => {
        if (!FATAL_ERRORS.has(event.error)) return;
        this.active = false;
        settle(event.error.includes('not-allowed') ? 'denied' : 'failed');
      };
      this.active = true;
      try {
        recognition.start();
      } catch {
        settle('failed');
      }
    });
  }

  /** Forgets every word heard so far, including ones still being recognised, and keeps listening. */
  reset(): void {
    this.finished = [];
    this.current = [];
    if (!this.active) return;
    this.discarding = true;
    this.recognition?.abort();
  }

  stop(): void {
    this.active = false;
    this.recognition?.abort();
  }
}
