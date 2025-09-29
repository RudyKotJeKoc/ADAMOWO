import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it } from 'vitest';

import i18n from '../../i18n';
import { EightSinsPage } from './EightSinsPage';

describe('EightSinsPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const renderPage = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <EightSinsPage />
      </I18nextProvider>
    );

  it('renders all module cards and shows progress bar', () => {
    renderPage();

    expect(screen.getByText('8 grzechów toksycznych osób')).toBeInTheDocument();
    expect(screen.getByText('Postęp')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Branie pieniędzy/ })).toHaveLength(1);
  });

  it('updates score after answering a question', async () => {
    renderPage();

    const questionCard = screen.getByText(
      'Czy ktoś bliski pobiera świadczenia lub granty, ale nie przeznacza ich na realną pomoc Tobie?'
    ).closest('div');

    expect(questionCard).not.toBeNull();

    const yesOption = within(questionCard).getAllByLabelText('Tak')[0];
    fireEvent.click(yesOption);

    await waitFor(() => {
      expect(screen.getByText('Wynik modułu: 2 pkt')).toBeInTheDocument();
    });
  });
});
