import { describe, expect, it } from 'vitest';
import { detectLocale, formatNumber, plural } from './locales';

describe('detectLocale', () => {
  it("picks the browser's language when we speak it", () => {
    expect(detectLocale(['pt-PT', 'en-US'])).toBe('pt-PT');
    expect(detectLocale(['pt'])).toBe('pt-PT');
    expect(detectLocale(['en-GB'])).toBe('en-US');
  });

  it("skips languages we don't speak, Brazilian Portuguese included", () => {
    expect(detectLocale(['pt-BR'])).toBe('en-US');
    expect(detectLocale(['fr-FR', 'pt-PT'])).toBe('pt-PT');
    expect(detectLocale(['de-DE'])).toBe('en-US');
    expect(detectLocale([])).toBe('en-US');
  });
});

describe('plural', () => {
  it('follows each language', () => {
    expect(plural('en-US', 1, 'bat', 'bats')).toBe('bat');
    expect(plural('en-US', 0, 'bat', 'bats')).toBe('bats');
    expect(plural('pt-PT', 2, 'morcego', 'morcegos')).toBe('morcegos');
  });
});

describe('formatNumber', () => {
  it('writes decimals the way each language does', () => {
    expect(formatNumber('en-US', 0.4, 2)).toBe('0.40');
    expect(formatNumber('pt-PT', 0.4, 2)).toBe('0,40');
  });
});
