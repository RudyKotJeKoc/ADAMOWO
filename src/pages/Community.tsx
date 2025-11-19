import type { JSX } from 'react';

import { CommunitySection } from '../features/community/CommunitySection';

/**
 * Community page component.
 *
 * Displays community engagement features and resources for the ADAMOWO project.
 * This page serves as a hub for community interaction, discussion, and support
 * among users of the platform.
 *
 * @component
 * @returns {JSX.Element} The community page with engagement features
 */
export default function Community(): JSX.Element {
  return <CommunitySection />;
}
