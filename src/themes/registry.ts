import type { Theme } from '../core/types';
import { birthday } from './birthday/theme';
import { carnival } from './carnival/theme';
import { christmas } from './christmas/theme';
import { easter } from './easter/theme';
import { halloween } from './halloween/theme';
import { newYear } from './newyear/theme';
import { space } from './space/theme';
import { summer } from './summer/theme';
import { valentine } from './valentine/theme';

/** Every festivity, in the order shown on the home screen. */
export const THEMES: Theme[] = [halloween, christmas, birthday, easter, summer, valentine, newYear, carnival, space];
