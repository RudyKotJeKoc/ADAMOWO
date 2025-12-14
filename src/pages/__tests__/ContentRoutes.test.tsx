import { screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Suspense } from 'react';

import { router } from '../../router';
import { renderWithI18n } from '../../test/utils';
import { ThemeProvider } from '../../state/theme';
import { initTheme } from '../../utils/theme';

async function renderRoute(path: string) {
  const memoryRouter = createMemoryRouter(router.routes, {
    initialEntries: [path],
  });

  const initialTheme = initTheme();

  await renderWithI18n(
    <ThemeProvider initialTheme={initialTheme}>
      <Suspense fallback={<div role="status">Loading</div>}>
        <RouterProvider router={memoryRouter} />
      </Suspense>
    </ThemeProvider>
  );
}

describe('analysis content routes', () => {
  it('renders the Curse of Eight analysis content', async () => {
    await renderRoute('/curse-of-eight-content');

    expect(
      await screen.findByRole('heading', {
        name: /klątwa ósemki/i,
      })
    ).toBeInTheDocument();
  });

  it('renders the timeline analysis content', async () => {
    await renderRoute('/timeline-content');

    expect(
      await screen.findByRole('heading', {
        name: /kalendarz jako broń: anatomia zaplanowanego konfliktu/i,
      })
    ).toBeInTheDocument();
  });
});
