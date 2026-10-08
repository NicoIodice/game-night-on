/**
 * Can Chrome's speech recognition hear every Sing on the Beat card, in every theme and language?
 * Neural voices say each card (and each deck in one go, like a round); the browser listens in the
 * language's default accent, and the game's own word matching judges what it heard.
 *
 *   npm run check:voices                      every theme and language
 *   VOICE_CHECK_LOCALES=pt-PT npm run check:voices
 *   VOICE_CHECK_THEMES=christmas npm run check:voices
 *
 * Fails when a card is a problem (see `isProblem`); the report (also saved as
 * node_modules/.cache/voice-check/report.md) lists what each voice was heard as.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { LOCALES, type Locale } from '../../src/core/i18n/locales';
import type { Card, Theme } from '../../src/core/types';
import { ACCENTS } from '../../src/core/voice/calibration';
import { THEMES } from '../../src/themes/registry';
import { isProblem, judgeSequence, judgeWord, type Judgement } from './judge';
import { openRecognizer, type Recognizer } from './recognizer';
import { checkSynthesizer, speak, voiceName, VOICES } from './speech';

const only = (name: string) => process.env[name]?.split(',').map((value) => value.trim());
const locales = LOCALES.map((locale) => locale.id).filter((id) => only('VOICE_CHECK_LOCALES')?.includes(id) ?? true);
const themes = THEMES.filter((theme) => theme.enabled && (only('VOICE_CHECK_THEMES')?.includes(theme.id) ?? true));

const MARK: Record<Judgement['verdict'], string> = { exact: '✓', relaxed: '≈', 'other-card': '✗', missed: '?' };
const SEQUENCE_MARK = (heard: boolean) => (heard ? '✓' : '?');

let recognizer: Recognizer;
const report: string[] = [
  '# Voice check: can the browser hear the cards?',
  '',
  'Each card is said alone (left columns), then each deck is said in one go like a round (right columns).',
  '',
  '✓ heard exactly · ≈ only relaxed scoring counts it · ✗ taken for another card (a problem) ·',
  '? something else or nothing (the in-game voice check can learn a word; a lone short word often gets nothing)',
  '',
  '⚠️ marks a problem: taken for another card, or never heard right, alone or in a round.',
];

beforeAll(async () => {
  await checkSynthesizer();
  recognizer = await openRecognizer();
}, 60_000);

afterAll(async () => {
  await recognizer?.close();
  const dir = join('node_modules', '.cache', 'voice-check');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'report.md'), `${report.join('\n')}\n`);
  console.log(`\n${report.join('\n')}\n\nReport saved to ${join(dir, 'report.md')}`);
});

describe('Sing on the Beat cards', () => {
  for (const theme of themes) {
    for (const locale of locales) {
      it(`${theme.id} (${locale})`, async () => {
        const problems = await checkDecks(theme, locale);
        expect(problems, 'cards the browser mishears (see the report)').toEqual([]);
      });
    }
  }
});

async function checkDecks(theme: Theme, locale: Locale): Promise<string[]> {
  const voices = VOICES[locale];
  const lang = ACCENTS[locale][0].id;
  const hear = async (voice: string, text: string) => recognizer.hear(await speak(voice, text), lang);
  const problems: string[] = [];

  const names = voices.map(voiceName);
  report.push('', `## ${theme.name[locale]} · ${locale}`, '');
  report.push(
    `| Deck | Card | ${names.map((name) => `${name}, alone`).join(' | ')} | ${names.map((name) => `${name}, in a round`).join(' | ')} |`,
    `|---|---|${voices.map(() => '---|---|').join('')}`,
  );

  for (const [index, deck] of theme.decks[locale].entries()) {
    // Every card with every voice, and every voice saying the whole deck, all at once
    // (the recognizer runs a few at a time).
    const [alone, rounds] = await Promise.all([
      Promise.all(deck.map((card) => Promise.all(voices.map(async (voice) => judgeWord(card, deck, await hear(voice, card.label)))))),
      Promise.all(voices.map(async (voice) => judgeSequence(deck, await hear(voice, sayInARow(deck))))),
    ]);
    deck.forEach((card, i) => {
      const inARound = rounds.map((round) => round[i]);
      const problem = isProblem(alone[i], inARound);
      const cells = [
        ...alone[i].map((j) => `${MARK[j.verdict]} ${j.heard ? `“${j.heard}”` : '(nothing)'}`),
        ...inARound.map(SEQUENCE_MARK),
      ];
      report.push(`| ${index + 1} | ${card.label}${problem ? ' ⚠️' : ''} | ${cells.join(' | ')} |`);
      if (problem) problems.push(describeProblem(card, alone[i], voices));
    });
  }
  return problems;
}

/** "Gato, rato, pato, sapato." — said like a round, one card after the other. */
function sayInARow(deck: readonly Card[]): string {
  return `${deck.map((card) => card.label).join(', ')}.`;
}

function describeProblem(card: Card, judgements: readonly Judgement[], voices: readonly string[]): string {
  const heard = judgements.map((j, i) =>
    j.verdict === 'other-card' ? `${voiceName(voices[i])} heard "${j.heard}" = ${j.other}` : `${voiceName(voices[i])} heard "${j.heard}"`,
  );
  return `${card.label}: ${heard.join(', ')}`;
}
