import { Outlet } from 'react-router-dom';

import { LangSwitch } from './LangSwitch';
import { ThemeSwitch } from './ThemeSwitch';

export function AppShell(): JSX.Element {
  return (
    <div className="min-h-screen bg-base-950 text-base-100">
      <header className="border-b border-base-800 bg-base-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-4 px-6 py-4">
          <LangSwitch />
          <ThemeSwitch />
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-1 flex-col gap-10 px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
