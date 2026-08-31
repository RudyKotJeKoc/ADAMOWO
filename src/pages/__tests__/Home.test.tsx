import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Home from '../Home';

describe('Home', () => {
  it('prowadzi użytkownika przez trzy sytuacje zamiast dodatkowego menu', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /rozumiesz, co się dzieje/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /jestem w sporze lub postępowaniu/i })).toHaveAttribute(
      'href',
      '/ochrona'
    );
    expect(screen.getByRole('link', { name: /czuję presję albo manipulację/i })).toHaveAttribute(
      'href',
      '/mechanizmy'
    );
    expect(screen.getByRole('link', { name: /chcę uporządkować dowody/i })).toHaveAttribute(
      'href',
      '/anatomy'
    );
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('pokazuje rzeczywiste statystyki i ścieżkę dla nowicjusza', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('30 sierpnia 2026')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /zacznij od porządku/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /nazwij sytuację/i })).toHaveAttribute(
      'href',
      '/definicje'
    );
  });
});
