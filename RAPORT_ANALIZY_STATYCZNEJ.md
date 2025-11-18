# Raport Analizy Statycznej Repozytorium

**Data generacji:** 2025-11-18
**Repozytorium:** Radio Adamowo (ADAMOWO)
**Branch:** claude/static-analysis-cleanup-016T88E5e67DRbiv9aPukqsu

---

## 1. ANALIZA LOKALIZACJI (i18n)

### 1.1 Znalezione pliki tłumaczeń

Zidentyfikowano 3 pliki tłumaczeń w katalogu `/home/user/ADAMOWO/src/i18n/`:

- **PL (Polski - referencyjny):** `/home/user/ADAMOWO/src/i18n/pl.json` - 2060 kluczy
- **EN (English):** `/home/user/ADAMOWO/src/i18n/en.json` - 1485 kluczy
- **NL (Nederlands):** `/home/user/ADAMOWO/src/i18n/nl.json` - 1420 kluczy

### 1.2 Braki w tłumaczeniach

#### Język: EN (English)
**Liczba brakujących kluczy: 612** (29.7% relative to PL)

<details>
<summary>🔴 Główne brakujące sekcje (kliknij aby rozwinąć pełną listę)</summary>

**Brakujące główne namespace'y:**
- `analizy.*` (33 kluczy) - cała sekcja archiwum analiz
- `anatomy.*` (323 kluczy) - cała sekcja anatomii manipulacji
- `programy.*` (8 kluczy) - sekcja programów radiowych
- `familyPsychology.*` (133 kluczy) - psychologia rodzinna
- `content.*` (27 kluczy) - sekcje treści
- `document.*` (26 kluczy) - powiadomienia o dokumentach
- `exploreMore.*` (49 kluczy) - sugestie eksploracji
- `violence.*` (22 kluczy) - ostrzeżenia o przemocy
- `media.error.*` (30 kluczy) - komunikaty błędów mediów
- `footer.helpline.*` (5 kluczy) - infolinie pomocy

**Przykładowe brakujące klucze:**
- `analizy.title` - brak w pliku: src/i18n/en.json
- `analizy.description` - brak w pliku: src/i18n/en.json
- `anatomy.hero.title` - brak w pliku: src/i18n/en.json
- `anatomy.hero.subtitle` - brak w pliku: src/i18n/en.json
- `programy.title` - brak w pliku: src/i18n/en.json
- `familyPsychology.title` - brak w pliku: src/i18n/en.json
- `navigation.analizy` - brak w pliku: src/i18n/en.json
- `navigation.programy` - brak w pliku: src/i18n/en.json

**⚠️ UWAGA:** Pełna lista 612 brakujących kluczy znajduje się w pliku `i18n-analysis-results.json` (klucz: `missing_in_en`)
</details>

#### Język: NL (Nederlands)
**Liczba brakujących kluczy: 668** (32.4% relative to PL)

<details>
<summary>🔴 Główne brakujące sekcje (kliknij aby rozwinąć pełną listę)</summary>

**Brakujące główne namespace'y:**
- `analizy.*` (33 kluczy) - cała sekcja archiwum analiz
- `anatomy.*` (323 kluczy) - cała sekcja anatomii manipulacji
- `programy.*` (8 kluczy) - sekcja programów radiowych
- `familyPsychology.*` (133 kluczy) - psychologia rodzinna
- `content.*` (30 kluczy) - sekcje treści (więcej niż EN)
- `document.*` (26 kluczy) - powiadomienia o dokumentach
- `exploreMore.*` (49 kluczy) - sugestie eksploracji
- `violence.*` (22 kluczy) - ostrzeżenia o przemocy
- `media.error.*` (30 kluczy) - komunikaty błędów mediów
- `footer.helpline.*` (5 kluczy) - infolinie pomocy
- `emergency.banner.*` (4 kluczy) - banner awaryjny
- `pages.help.*` (42 kluczy) - strona pomocy

**Przykładowe brakujące klucze:**
- `analizy.title` - brak w pliku: src/i18n/nl.json
- `anatomy.hero.title` - brak w pliku: src/i18n/nl.json
- `programy.title` - brak w pliku: src/i18n/nl.json
- `familyPsychology.title` - brak w pliku: src/i18n/nl.json
- `navigation.analizy` - brak w pliku: src/i18n/nl.json
- `pages.help.title` - brak w pliku: src/i18n/nl.json
- `emergency.banner.title` - brak w pliku: src/i18n/nl.json

**⚠️ UWAGA:** Pełna lista 668 brakujących kluczy znajduje się w pliku `i18n-analysis-results.json` (klucz: `missing_in_nl`)
</details>

### 1.3 Różnice w strukturze

#### Dodatkowe klucze w EN (nie występujące w PL)
**Liczba: 37 kluczy**

Wykryto klucze obecne w EN, których nie ma w PL (referencyjnym):
- `footer.backToTop`
- `footer.links.*` (6 kluczy)
- `footer.navigation`
- `footer.rights`
- `media.download.*` (9 kluczy)
- `media.fallback.*` (5 kluczy)
- `media.transcript.*` (9 kluczy)
- `multimedia.rating.starsCount` i warianty pluralizacji (4 kluczy)

**📝 Uwaga:** Te klucze mogą być nowymi tłumaczeniami, które nie zostały jeszcze dodane do PL, lub błędnymi/nieużywanymi kluczami.

#### Dodatkowe klucze w NL (nie występujące w PL)
**Liczba: 28 kluczy**

Podobne do EN, ale z mniejszą liczbą dodatkowych kluczy:
- `footer.backToTop`
- `footer.links.*` (6 kluczy)
- `footer.navigation`
- `footer.rights`
- `media.fallback.*` (5 kluczy)
- `media.transcript.*` (9 kluczy)
- `multimedia.rating.starsCount` i warianty pluralizacji (4 kluczy)

---

## 2. MARTWY KOD (Dead Code)

### 2.1 Entry points

Zidentyfikowano **2 główne entry points** aplikacji:

1. **`/home/user/ADAMOWO/index.html`**
   - Główny plik HTML aplikacji
   - Ładuje `/src/main.tsx` jako entry point React

2. **`/home/user/ADAMOWO/src/main.tsx`**
   - Główny entry point aplikacji React
   - Inicjalizuje routing, i18n, theme management

### 2.2 Statystyki użycia kodu

| Metryka | Wartość | Procent |
|---------|---------|---------|
| Całkowita liczba plików źródłowych | 183 | 100% |
| Pliki używane | 152 | 83.1% |
| Pliki nieużywane | 35 | **19.1%** |

### 2.3 Nieużywane pliki

Poniżej lista **35 plików**, które nie są importowane w żadnym miejscu aplikacji:

#### Grupa 1: Moduły danych i serwisy (7 plików)
```
src/data/playlist.ts
src/data/nowPlaying.ts
src/data/__mocks__/supabase.ts
src/features/media/PlaylistService.ts
src/features/media/ThemeEngine.ts
src/lib/localAudioClient.ts
src/state/player.ts
```
**Uzasadnienie do usunięcia:** Prawdopodobnie stare moduły, które zostały zastąpione nowszymi implementacjami.

#### Grupa 2: Komponenty UI nieużywane (17 plików)
```
src/features/media/Rating.tsx
src/features/media/Slideshow.tsx
src/features/whisper/WhisperSection.tsx
src/features/whisper/WhisperCurtain.tsx
src/features/curse-of-eight/CurseOfEightSection.tsx
src/components/DocumentNotice.tsx
src/components/HeroPlayer.tsx
src/components/MediaErrorFallback.tsx
src/components/ContentSection.tsx
src/components/ViolenceWarning.tsx
src/components/AudioViz.tsx
src/components/SafeReadingToggle.tsx
src/components/DownloadFallback.tsx
src/components/ContentWarning.tsx
src/components/MediaTranscript.tsx
src/components/Tooltip.tsx
src/components/ContentSummary.tsx
```
**Uzasadnienie do usunięcia:** Komponenty UI, które nie są używane w obecnej wersji aplikacji. Mogły być prototypami lub zostały zastąpione.

#### Grupa 3: Pomocnicze komponenty UI (3 pliki)
```
src/components/FAQSection.tsx
src/components/LazyImage.tsx
src/components/Accordion.tsx
```
**Uzasadnienie do usunięcia:** Komponenty pomocnicze, które nie są aktualnie używane.

#### Grupa 4: Pliki indeksowe (3 pliki)
```
src/features/media/index.ts
src/features/platform-info/index.ts
src/features/timeline/index.ts
```
**Uzasadnienie do usunięcia:** Pliki indeksowe dla modułów, które nie są importowane. Prawdopodobnie stara organizacja kodu.

#### Grupa 5: Dane i konfiguracja (1 plik)
```
src/features/curse-of-eight/curse-of-eight.data.ts
```
**Uzasadnienie do usunięcia:** Dane dla nieużywanej sekcji "Curse of Eight".

#### Grupa 6: Vendor i narzędzia (1 plik)
```
src/vendor/framer-motion.tsx
```
**Uzasadnienie do usunięcia:** Custom wrapper dla framer-motion, prawdopodobnie nieużywany lub zastąpiony bezpośrednim importem.

#### Grupa 7: Narzędzia testowe (2 pliki)
```
src/test/utils.tsx
src/test/setup.ts
```
**⚠️ UWAGA:** Te pliki są używane przez testy, mimo że nie są importowane bezpośrednio w kodzie aplikacji. **NIE USUWAĆ** bez weryfikacji, że testy nie są aktywne.

#### Grupa 8: Narzędzia pomocnicze (1 plik)
```
src/utils/anonymization.ts
```
**Uzasadnienie do usunięcia:** Narzędzie do anonimizacji, które nie jest używane w obecnej wersji.

### 2.4 Rekomendacja działań

**🔴 Pliki do natychmiastowego usunięcia (30 plików):**
Wszystkie pliki z grup 1-6 (bez plików testowych) mogą być bezpiecznie usunięte, ponieważ:
1. Nie są importowane w żadnym miejscu w kodzie
2. Nie są entry pointami
3. Nie są plikami konfiguracyjnymi

**⚠️ Pliki do weryfikacji przed usunięciem (2 pliki):**
- `src/test/utils.tsx`
- `src/test/setup.ts`

**Weryfikacja:** Sprawdź `vitest.config.ts` czy te pliki są używane jako setup dla testów.

**🟡 Pliki do decyzji biznesowej (3 pliki):**
- `src/features/whisper/WhisperSection.tsx` i `WhisperCurtain.tsx` - sekcja "Whisper"
- `src/features/curse-of-eight/CurseOfEightSection.tsx` - sekcja "Curse of Eight"

**Pytanie:** Czy te sekcje będą wykorzystywane w przyszłości? Jeśli nie, można je usunąć. Jeśli tak, należy je ponownie włączyć do routingu.

---

## 3. PODEJRZANE NAZWY PLIKÓW

### 3.1 Pliki do sprawdzenia/usunięcia

Znaleziono **3 pliki** z podejrzanymi nazwami sugerującymi backup lub template:

#### 🔴 Wysokie prawdopodobieństwo do usunięcia

1. **`/home/user/ADAMOWO/playlist-backup.json`**
   - **Powód:** Zawiera 'backup' w nazwie
   - **Typ:** Backup pliku JSON
   - **Rekomendacja:** Sprawdź czy jest nowsza wersja (`playlist.json`). Jeśli tak, usuń backup.

2. **`/home/user/ADAMOWO/src/lib/hlsClient.ts.backup`**
   - **Powód:** Rozszerzenie `.backup`
   - **Typ:** Backup pliku TypeScript
   - **Rekomendacja:** Sprawdź czy aktywny plik `hlsClient.ts` istnieje i działa poprawnie. Jeśli tak, usuń backup.

#### 🟡 Do weryfikacji

3. **`/home/user/ADAMOWO/template_config.json`**
   - **Powód:** Zawiera 'template' w nazwie
   - **Typ:** Plik konfiguracyjny (template)
   - **Rekomendacja:** Sprawdź czy ten plik jest wykorzystywany jako template dla generowania konfiguracji. Jeśli nie jest używany, można usunąć.

#### ✅ Wykluczone z listy (poprawne użycie)

Następujące pliki zawierają "podejrzane" słowa, ale są prawidłowo używane:
- `/home/user/ADAMOWO/scripts/cleanup/create-backup.sh` - skrypt do tworzenia backupów (OK)
- `/home/user/ADAMOWO/public/assets/docs/calendar-analysis-template.pdf` - template dokumentu (OK)
- `/home/user/ADAMOWO/src/features/mythology/SymbolDetails.tsx` - zawiera "Details", ale to normalna nazwa komponentu (OK)

---

## 4. REKOMENDACJE

### 4.1 Pliki do usunięcia (z uzasadnieniem)

#### Priorytety:

**🔴 WYSOKIE (32 pliki) - Bezpieczne do usunięcia od razu:**

1. **Backupy (2 pliki):**
   ```bash
   rm /home/user/ADAMOWO/playlist-backup.json
   rm /home/user/ADAMOWO/src/lib/hlsClient.ts.backup
   ```
   **Uzasadnienie:** Backupy, które nie są potrzebne w repozytorium (można je odtworzyć z historii git).

2. **Nieużywany kod - Moduły danych (7 plików):**
   ```bash
   rm src/data/playlist.ts
   rm src/data/nowPlaying.ts
   rm src/data/__mocks__/supabase.ts
   rm src/features/media/PlaylistService.ts
   rm src/features/media/ThemeEngine.ts
   rm src/lib/localAudioClient.ts
   rm src/state/player.ts
   ```
   **Uzasadnienie:** Stare moduły nieużywane w aplikacji.

3. **Nieużywany kod - Komponenty UI (20 plików):**
   ```bash
   rm src/features/media/Rating.tsx
   rm src/features/media/Slideshow.tsx
   rm src/features/media/index.ts
   rm src/features/whisper/WhisperSection.tsx
   rm src/features/whisper/WhisperCurtain.tsx
   rm src/features/platform-info/index.ts
   rm src/features/curse-of-eight/CurseOfEightSection.tsx
   rm src/features/curse-of-eight/curse-of-eight.data.ts
   rm src/features/timeline/index.ts
   rm src/utils/anonymization.ts
   rm src/components/DocumentNotice.tsx
   rm src/components/HeroPlayer.tsx
   rm src/components/MediaErrorFallback.tsx
   rm src/components/ContentSection.tsx
   rm src/components/ViolenceWarning.tsx
   rm src/components/AudioViz.tsx
   rm src/components/SafeReadingToggle.tsx
   rm src/components/DownloadFallback.tsx
   rm src/components/ContentWarning.tsx
   rm src/components/MediaTranscript.tsx
   rm src/components/Tooltip.tsx
   rm src/components/ContentSummary.tsx
   rm src/components/FAQSection.tsx
   rm src/components/LazyImage.tsx
   rm src/components/Accordion.tsx
   ```
   **Uzasadnienie:** Komponenty nieimportowane w żadnym miejscu aplikacji.

4. **Vendor (1 plik):**
   ```bash
   rm src/vendor/framer-motion.tsx
   ```
   **Uzasadnienie:** Nieużywany wrapper, prawdopodobnie zastąpiony bezpośrednim importem.

**🟡 ŚREDNIE (1 plik) - Sprawdzić przed usunięciem:**

```bash
# Sprawdź najpierw czy jest używany
rm /home/user/ADAMOWO/template_config.json
```
**Akcja:** Użyj `git grep "template_config.json"` aby sprawdzić użycie.

**⚠️ NISKIE (2 pliki) - Sprawdzić konfigurację testów:**

```bash
# Tylko po weryfikacji vitest.config.ts
rm src/test/utils.tsx
rm src/test/setup.ts
```
**Akcja:** Sprawdź `vitest.config.ts` czy te pliki są używane jako setup.

### 4.2 Akcje dla tłumaczeń

#### Wysokie priorytety:

1. **Dodać brakujące klucze do EN: 612 kluczy**
   - Priorytet: 🔴 KRYTYCZNY
   - Główne sekcje: `analizy.*`, `anatomy.*`, `programy.*`, `familyPsychology.*`
   - Akcja: Stworzyć task z przetłumaczeniem brakujących kluczy
   - Szacowany czas: 8-12 godzin pracy (w zależności od długości tekstów)

2. **Dodać brakujące klucze do NL: 668 kluczy**
   - Priorytet: 🔴 KRYTYCZNY
   - Główne sekcje: te same co EN + dodatkowo `pages.help.*`, `emergency.banner.*`
   - Akcja: Stworzyć task z przetłumaczeniem brakujących kluczy
   - Szacowany czas: 10-14 godzin pracy

#### Średnie priorytety:

3. **Ujednolicić strukturę kluczy**
   - Priorytet: 🟡 ŚREDNI
   - Akcja: Zweryfikować 37 dodatkowych kluczy w EN i 28 w NL
   - Zdecydować czy dodać je do PL, czy usunąć z EN/NL

### 4.3 Optymalizacje projektu

1. **Zmniejszenie rozmiaru bundle:**
   - Usunięcie 35 nieużywanych plików może zmniejszyć rozmiar bundle o ~5-10%
   - Akcja: Po usunięciu plików, uruchom `npm run build` i porównaj rozmiar

2. **Poprawa performance buildu:**
   - Mniej plików do analizy = szybszy build
   - Szacowane przyspieszenie: 2-5%

3. **Lepsza czytelność projektu:**
   - Mniej nieużywanych plików = łatwiejsza nawigacja
   - Lepsze zrozumienie struktury projektu

---

## 5. PODSUMOWANIE STATYSTYK

### 5.1 Lokalizacja (i18n)

| Metryka | Wartość |
|---------|---------|
| Całkowita liczba plików tłumaczeń | 3 |
| Języki obsługiwane | PL, EN, NL |
| Klucze w PL (referencyjny) | 2,060 |
| Klucze w EN | 1,485 (72.1%) |
| Klucze w NL | 1,420 (68.9%) |
| **Całkowita liczba brakujących kluczy EN** | **612 (29.7%)** |
| **Całkowita liczba brakujących kluczy NL** | **668 (32.4%)** |
| Dodatkowe klucze w EN | 37 |
| Dodatkowe klucze w NL | 28 |

### 5.2 Dead Code

| Metryka | Wartość | Procent |
|---------|---------|---------|
| Całkowita liczba plików źródłowych | 183 | 100% |
| Używane pliki | 152 | 83.1% |
| **Nieużywane pliki** | **35** | **19.1%** |
| Entry points | 2 | - |

#### Kategorie nieużywanych plików:

| Kategoria | Liczba plików |
|-----------|---------------|
| Moduły danych i serwisy | 7 |
| Komponenty UI | 17 |
| Pomocnicze komponenty | 3 |
| Pliki indeksowe | 3 |
| Dane i konfiguracja | 1 |
| Vendor | 1 |
| Narzędzia testowe | 2 |
| Narzędzia pomocnicze | 1 |

### 5.3 Podejrzane nazwy

| Metryka | Wartość |
|---------|---------|
| **Liczba plików z podejrzanymi nazwami** | **3** |
| Pliki backup | 2 |
| Pliki template | 1 |

---

## 6. PLAN DZIAŁANIA

### Faza 1: Szybkie wygraniewictwa (1-2 godziny)
1. ✅ Usunąć 2 pliki backup
2. ✅ Usunąć 28 nieużywanych plików (bez plików testowych)
3. ✅ Zweryfikować i usunąć `template_config.json`
4. ✅ Uruchomić testy: `npm run test`
5. ✅ Uruchomić build: `npm run build`
6. ✅ Zcommitować zmiany

### Faza 2: Tłumaczenia - EN (8-12 godzin)
1. ⏳ Przygotować plik z brakującymi kluczami EN
2. ⏳ Przetłumaczyć 612 kluczy na angielski
3. ⏳ Dodać tłumaczenia do `en.json`
4. ✅ Zweryfikować aplikację w języku EN
5. ✅ Zcommitować zmiany

### Faza 3: Tłumaczenia - NL (10-14 godzin)
1. ⏳ Przygotować plik z brakującymi kluczami NL
2. ⏳ Przetłumaczyć 668 kluczy na holenderski
3. ⏳ Dodać tłumaczenia do `nl.json`
4. ✅ Zweryfikować aplikację w języku NL
5. ✅ Zcommitować zmiany

### Faza 4: Walidacja i dokumentacja (2-3 godziny)
1. ⏳ Uruchomić pełne testy regresyjne
2. ⏳ Zweryfikować wszystkie sekcje aplikacji w 3 językach
3. ⏳ Zaktualizować dokumentację projektu
4. ✅ Zcommitować ostateczne zmiany

---

## 7. SZCZEGÓŁOWE PLIKI WYNIKOWE

Pełne wyniki analizy zostały zapisane w następujących plikach:

1. **`i18n-analysis-results.json`**
   - Pełna lista brakujących kluczy dla EN (612)
   - Pełna lista brakujących kluczy dla NL (668)
   - Lista dodatkowych kluczy w EN (37)
   - Lista dodatkowych kluczy w NL (28)

2. **`dead-code-analysis-results.json`**
   - Lista wszystkich 183 plików źródłowych
   - Lista 152 używanych plików
   - Lista 35 nieużywanych plików
   - Entry points aplikacji

3. **`RAPORT_ANALIZY_STATYCZNEJ.md`** (ten plik)
   - Kompleksowy raport analizy
   - Rekomendacje i plan działania

---

## 8. NARZĘDZIA ANALIZY

W repozytorium zostały stworzone 2 skrypty pomocnicze:

1. **`analyze-i18n.cjs`**
   - Analizuje strukturę plików tłumaczeń
   - Znajduje brakujące klucze
   - Użycie: `node analyze-i18n.cjs`

2. **`analyze-dead-code.cjs`**
   - Buduje graf importów
   - Znajduje nieużywane pliki
   - Użycie: `node analyze-dead-code.cjs`

**Uwaga:** Te skrypty mogą być uruchomione ponownie po wprowadzeniu zmian, aby zweryfikować poprawność działań.

---

**Koniec raportu**

*Wygenerowano automatycznie przez Claude Code Analyzer*
