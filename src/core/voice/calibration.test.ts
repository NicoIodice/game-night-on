import { describe, expect, it } from 'vitest';
import {
  accentFor,
  BASE_GRACE_MS,
  defaultCalibration,
  lateWordGraceMs,
  measureDelay,
  needsVoiceCheck,
  normalizeCalibration,
  TYPICAL_DELAY_MS,
  withAccent,
  withAlias,
  withDeckTested,
} from './calibration';

describe('needsVoiceCheck', () => {
  it('runs the full check the first time, then only the words of new themes', () => {
    expect(needsVoiceCheck(null, 'halloween', 'en-US')).toBe('full');
    const checked = withDeckTested(defaultCalibration(), 'halloween', 'en-US');
    expect(needsVoiceCheck(checked, 'halloween', 'en-US')).toBeNull();
    expect(needsVoiceCheck(checked, 'christmas', 'en-US')).toBe('words');
  });

  it('tests the words again in another language, since its cards are other words', () => {
    const checked = withDeckTested(defaultCalibration(), 'halloween', 'en-US');
    expect(needsVoiceCheck(checked, 'halloween', 'pt-PT')).toBe('words');
  });
});

describe('accentFor', () => {
  it("keeps one accent per language, defaulting to the language's own", () => {
    const british = withAccent(defaultCalibration(), 'en-US', 'en-GB');
    expect(accentFor(british, 'en-US')).toBe('en-GB');
    expect(accentFor(british, 'pt-PT')).toBe('pt-PT');
    expect(accentFor(null, 'en-US')).toBe('en-US');
  });
});

describe('measureDelay', () => {
  const beats = [0, 1000, 2000, 3000, 4000, 5000];

  it('takes the median time from each beat to the first word after it', () => {
    const arrivals = [420, 430, 1380, 2450, 2500, 3900 /* a slow one */, 4410];
    expect(measureDelay(beats, arrivals, 1000)).toBe(420);
  });

  it('needs a word on a few beats before trusting the result', () => {
    expect(measureDelay(beats, [400, 1400], 1000)).toBeNull();
    expect(measureDelay(beats, [], 1000)).toBeNull();
  });

  it('ignores words heard before the first beat', () => {
    expect(measureDelay([1000, 2000, 3000], [500, 1300, 2300, 3300], 1000)).toBe(300);
  });
});

describe('lateWordGraceMs', () => {
  it('keeps the usual timing when the device was not measured', () => {
    expect(lateWordGraceMs(null, 750)).toBe(BASE_GRACE_MS);
  });

  it('gives slower devices and relaxed scoring more time, but less than a beat', () => {
    const slow = { ...defaultCalibration(), delayMs: TYPICAL_DELAY_MS + 200 };
    expect(lateWordGraceMs(slow, 750)).toBe(BASE_GRACE_MS + 200);
    expect(lateWordGraceMs({ ...slow, strictness: 'relaxed' }, 750)).toBe(700);
    expect(lateWordGraceMs({ ...slow, delayMs: 3000 }, 750)).toBe(700);
  });

  it('never goes below a minimum for fast devices', () => {
    expect(lateWordGraceMs({ ...defaultCalibration(), delayMs: 0 }, 750)).toBe(150);
  });
});

describe('normalizeCalibration', () => {
  it('keeps good data and drops broken fields', () => {
    const saved = {
      // An English accent can't be Portugal's, and 'xx' isn't a language.
      accents: { 'en-US': 'en-GB', 'pt-PT': 'en-GB', xx: 'pt-PT' },
      delayMs: 512.4,
      strictness: 'relaxed',
      aliases: { bee: ['b', 3], cat: 'nope' },
      testedDecks: ['christmas:en-US', 7],
      checkedAt: '2026-10-08T10:00:00.000Z',
    };
    expect(normalizeCalibration(saved)).toEqual({
      accents: { 'en-US': 'en-GB' },
      delayMs: 512,
      strictness: 'relaxed',
      aliases: { bee: ['b'] },
      testedDecks: ['christmas:en-US'],
      checkedAt: '2026-10-08T10:00:00.000Z',
    });
  });

  it('reads data saved before there were languages as English', () => {
    expect(normalizeCalibration({ lang: 'en-GB', testedThemes: ['christmas', 7] })).toMatchObject({
      accents: { 'en-US': 'en-GB' },
      testedDecks: ['christmas:en-US'],
    });
  });

  it('falls back for unknown values, and rejects non-objects', () => {
    expect(normalizeCalibration({ lang: 'xx', delayMs: -5, strictness: 'loose' })).toMatchObject({
      accents: {},
      delayMs: null,
      strictness: 'strict',
    });
    expect(normalizeCalibration('hello')).toBeNull();
  });
});

describe('withAlias', () => {
  it('adds a learned word once', () => {
    const once = withAlias(defaultCalibration(), 'bee', 'b');
    expect(withAlias(once, 'bee', 'b').aliases).toEqual({ bee: ['b'] });
  });
});
