import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '../../../i18n';
import AnalysisPage from '../AnalysisPage';
import { getEpisodes } from '../api';

async function renderAnalysis(): Promise<void> {
  await i18n.changeLanguage('pl');
  render(
    <I18nextProvider i18n={i18n}>
      <AnalysisPage />
    </I18nextProvider>
  );
}

/**
 * The default-selected episode's title renders both as a list card heading
 * and in the always-visible details panel, so plain screen.findByText/
 * queryByText on a title is ambiguous whenever that episode happens to be
 * selected. Scope "is this episode in the list" checks to the episode list
 * itself to avoid that.
 */
async function findEpisodeList(): Promise<HTMLElement> {
  return screen.findByRole('list', { name: 'Lista odcinków analiz' });
}

describe('AnalysisPage', () => {
  beforeAll(() => {
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
    vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  });

  beforeEach(async () => {
    await i18n.changeLanguage('pl');
  });

  it('filters episodes by search, category, tag and sort order', async () => {
    await renderAnalysis();

    await within(await findEpisodeList()).findByText('Broń Narcyza: architektura kłamstwa');

    const searchInput = screen.getByLabelText('Szukaj');
    fireEvent.change(searchInput, { target: { value: 'cyfrowe' } });

    // The list swaps for a loading placeholder while each filtered fetch is
    // in flight, so a stale `list` reference from before the change can point
    // at a detached node. Re-resolve the list after every filter mutation
    // instead of reusing one captured earlier.
    await within(await findEpisodeList()).findByText('Broń Narcyza: cyfrowe tropy');
    await waitFor(async () =>
      expect(
        within(await findEpisodeList()).queryByText('Broń Narcyza: architektura kłamstwa')
      ).toBeNull()
    );

    fireEvent.change(searchInput, { target: { value: '' } });
    await within(await findEpisodeList()).findByText('Broń Narcyza: architektura kłamstwa');

    const sledztwoCheckbox = screen.getByRole('checkbox', { name: /Śledztwo/ });
    fireEvent.click(sledztwoCheckbox);
    await within(await findEpisodeList()).findByText('Śledztwo: analiza sygnałów');
    await waitFor(async () =>
      expect(
        within(await findEpisodeList()).queryByText('Broń Narcyza: architektura kłamstwa')
      ).toBeNull()
    );

    const terenTag = screen.getByRole('checkbox', { name: /#teren/ });
    fireEvent.click(terenTag);
    await within(await findEpisodeList()).findByText('Śledztwo: notatki terenowe');

    fireEvent.click(terenTag);
    fireEvent.click(sledztwoCheckbox);

    const sortSelect = screen.getByLabelText('Sortuj');
    fireEvent.change(sortSelect, { target: { value: 'oldest' } });

    await within(await findEpisodeList()).findByText('Akt Darowania: początki narracji');
    const cards = screen.getAllByRole('article');
    expect(cards[0]).toHaveTextContent('Akt Darowania: początki narracji');
  });

  it('updates player when selecting a different episode', async () => {
    await renderAnalysis();

    const list = await findEpisodeList();
    await within(list).findByText('Broń Narcyza: architektura kłamstwa');
    const status = screen.getByText(/Teraz gramy:/);
    expect(status).toHaveTextContent('Broń Narcyza: architektura kłamstwa');

    const listenButton = screen.getByRole('button', {
      name: /Posłuchaj odcinka: Śledztwo: analiza sygnałów/i,
    });
    fireEvent.click(listenButton);

    await waitFor(() => {
      expect(status).toHaveTextContent('Śledztwo: analiza sygnałów');
    });
  });

  it('jumps to the requested chapter position', async () => {
    await renderAnalysis();

    const list = await findEpisodeList();
    await within(list).findByText('Broń Narcyza: architektura kłamstwa');

    const chapterButton = screen.getByRole('button', {
      name: 'Przejdź do 14:40',
    });
    fireEvent.click(chapterButton);

    const progress = screen.getByLabelText('Postęp odtwarzania') as HTMLInputElement;
    await waitFor(() => {
      expect(progress.value).toBe('880');
    });
  });
});

describe('analysis data client', () => {
  it('falls back to local JSON when Supabase env is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON', '');

    const result = await getEpisodes({ pageSize: 20 });

    expect(result.total).toBeGreaterThan(0);
    expect(result.metadata.categories.length).toBeGreaterThan(0);

    vi.unstubAllEnvs();
  });
});
