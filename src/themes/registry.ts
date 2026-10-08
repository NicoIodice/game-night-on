import type { Theme } from '../core/types';
import { birthday } from './birthday/theme';
import { christmas } from './christmas/theme';
import { halloween } from './halloween/theme';

/** Every festivity, in the order shown on the home screen. */
export const THEMES: Theme[] = [halloween, christmas, birthday];
