import type { IconProps } from './IconBase';
import { HeartIcon } from './HeartIcon';
import { PsychIcon } from './PsychIcon';
import { TeamIcon } from './TeamIcon';
import { WelcomeIcon } from './WelcomeIcon';

export const PROGRAM_ICON_MAP = {
  team: TeamIcon,
  heart: HeartIcon,
  psych: PsychIcon,
  welcome: WelcomeIcon
} satisfies Record<'team' | 'heart' | 'psych' | 'welcome', (props: IconProps) => JSX.Element>;

export { TeamIcon, HeartIcon, PsychIcon, WelcomeIcon };
export type { IconProps } from './IconBase';
