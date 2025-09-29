import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';

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
