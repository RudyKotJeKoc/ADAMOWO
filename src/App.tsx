import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';

/**
 * Root application component.
 *
 * Wraps the router in a Suspense boundary to handle lazy-loaded route
 * components. Displays a centered loading indicator while routes are
 * being loaded.
 *
 * @returns The root application element with router and suspense boundary
 */
export default function App(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-base-950 text-base-100">
          Loading…
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}
