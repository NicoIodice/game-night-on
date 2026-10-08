import type { Theme } from '../core/types';
import { birthday } from './birthday/theme';
import { christmas } from './christmas/theme';
import { easter } from './easter/theme';
import { halloween } from './halloween/theme';
import { summer } from './summer/theme';

/** Every festivity, in the order shown on the home screen. */
export const THEMES: Theme[] = [halloween, christmas, birthday, easter, summer];
