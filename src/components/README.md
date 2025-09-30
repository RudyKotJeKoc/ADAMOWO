# Header component guidelines

The `Header` component (`src/components/Header.tsx`) renders the global navigation, language selector and theme selector for Radio Adamowo. When extending the menu:

1. Update the `NAV_ITEMS` array in `Header.tsx`. Each entry requires a `to` path and an i18n translation key (e.g. `navigation.live`).
2. Add the translated label to every locale file in `src/i18n` so that desktop and mobile menus stay in sync.
3. If the new link should open an external resource, pass a full URL in `to` and set `target="_blank" rel="noreferrer"` on the rendered link.
4. Keep focus order predictable: new controls that are not simple links should be appended after the existing language/theme groups and expose an accessible name via `aria-label` or visible text.
5. For mobile drawer changes, ensure new focusable elements live inside the dialog container so keyboard trapping continues to work.

The logo lives in `LogoGlasses.tsx` and is shared between desktop and mobile layouts. Theme and language switches are reusable controls that can be imported elsewhere if needed.
