import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

    await screen.findByText('Broń Narcyza: architektura kłamstwa');

    const searchInput = screen.getByLabelText('Szukaj odcinka');
    fireEvent.change(searchInput, { target: { value: 'cyfrowe' } });

    await screen.findByText('Broń Narcyza: cyfrowe tropy');
    await waitFor(() => expect(screen.queryByText('Broń Narcyza: architektura kłamstwa')).toBeNull());

    fireEvent.change(searchInput, { target: { value: '' } });
    await screen.findByText('Broń Narcyza: architektura kłamstwa');

    const sledztwoCheckbox = screen.getByLabelText(/Śledztwo/);
    fireEvent.click(sledztwoCheckbox);
    await screen.findByText('Śledztwo: analiza sygnałów');
    await waitFor(() => expect(screen.queryByText('Broń Narcyza: architektura kłamstwa')).toBeNull());

    const terenTag = screen.getByLabelText(/#teren/);
    fireEvent.click(terenTag);
    await screen.findByText('Śledztwo: notatki terenowe');

    fireEvent.click(terenTag);
    fireEvent.click(sledztwoCheckbox);

    const sortSelect = screen.getByLabelText('Sortowanie');
    fireEvent.change(sortSelect, { target: { value: 'oldest' } });

    await screen.findByText('Akt Darowania: początki narracji');
    const cards = screen.getAllByRole('article');
    expect(cards[0]).toHaveTextContent('Akt Darowania: początki narracji');
  });

  it('updates player when selecting a different episode', async () => {
    await renderAnalysis();

    await screen.findByText('Broń Narcyza: architektura kłamstwa');
    const status = screen.getByText(/Odtwarzane:/);
    expect(status).toHaveTextContent('Broń Narcyza: architektura kłamstwa');

    const listenButton = screen.getByRole('button', {
      name: /Słuchaj: Śledztwo: analiza sygnałów/i
    });
    fireEvent.click(listenButton);

    await waitFor(() => {
      expect(status).toHaveTextContent('Śledztwo: analiza sygnałów');
    });
  });

  it('jumps to the requested chapter position', async () => {
    await renderAnalysis();

    await screen.findByText('Broń Narcyza: architektura kłamstwa');

    const chapterButton = screen.getByRole('button', {
      name: 'Przeskocz do rozdziału Reakcje społeczności'
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
