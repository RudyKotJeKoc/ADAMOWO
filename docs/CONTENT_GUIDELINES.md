# Wytyczne dotyczące struktury treści i anonimizacji

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Wydzielanie sekcji](#wydzielanie-sekcji)
3. [Anonimizacja danych](#anonimizacja-danych)
4. [Ostrzeżenia o treści (Trigger Warnings)](#ostrzeżenia-o-treści)
5. [Dokumentacja źródłowa](#dokumentacja-źródłowa)
6. [Multimedia - Fallbacki](#multimedia---fallbacki)
7. [Przykłady użycia](#przykłady-użycia)

---

## Wprowadzenie

Niniejszy dokument zawiera wytyczne dotyczące publikacji treści na platformie ADAMOWO, ze szczególnym uwzględnieniem:

- **Struktury treści** - wyraźne oddzielenie faktów od interpretacji
- **Anonimizacji** - ochrona danych osobowych
- **Ostrzeżeń** - trigger warnings dla treści wrażliwych
- **Transparentności** - dostęp do weryfikacji dokumentów
- **Dostępności** - fallbacki dla multimediów

---

## Wydzielanie sekcji

### Dostępne typy sekcji

Używaj komponentu `ContentSection` aby wyraźnie oddzielić różne typy treści:

#### 1. Fakty i źródła (`facts`)

```tsx
import { FactsSection } from '@/components/ContentSection';

<FactsSection>
  <p>W dniu 15 maja 2023 roku...</p>
  <p>Dokumenty dostępne: akta notarialne sygn. [...]</p>
</FactsSection>
```

**Zasady:**
- Ton **neutralny, reporterski**
- Brak emocjonalnego języka
- Fakty potwierdzone dokumentami
- Dane osobowe **zanonimizowane**

#### 2. Chronologia (`chronology`)

```tsx
import { ChronologySection } from '@/components/ContentSection';

<ChronologySection>
  <ul>
    <li><strong>Maj 2023:</strong> Podpisanie aktu notarialnego</li>
    <li><strong>Czerwiec 2023:</strong> Złożenie pozwu</li>
    <li><strong>Lipiec 2023:</strong> Rozprawa</li>
  </ul>
</ChronologySection>
```

**Zasady:**
- Format: lista punktowana lub oś czasu
- Daty zanonimizowane do miesiąca/roku (jeśli potrzeba)
- Skrótowy opis wydarzeń

#### 3. Interpretacja i symbolika (`interpretation`)

```tsx
import { InterpretationSection } from '@/components/ContentSection';

<InterpretationSection>
  <p>
    Ten przypadek ilustruje klasyczny wzorzec manipulacji...
  </p>
</InterpretationSection>
```

**Zasady:**
- Wyraźne oznaczenie jako **OPINIA**
- Styl literacki dozwolony
- Analiza psychologiczna, symboliczna
- Automatyczne ostrzeżenie o charakterze interpretacyjnym

#### 4. Zasoby i pomoc (`resources`)

```tsx
import { ResourcesSection } from '@/components/ContentSection';

<ResourcesSection>
  <h4>Jeśli potrzebujesz pomocy:</h4>
  <ul>
    <li>Niebieska Linia: 800 120 002</li>
    <li>Centrum Praw Kobiet: 600 070 717</li>
  </ul>
</ResourcesSection>
```

#### 5. Podsumowanie (TL;DR) (`summary`)

```tsx
import { SummarySection } from '@/components/ContentSection';

<SummarySection>
  <ul>
    <li>Akt darowizny z maja 2023</li>
    <li>Służebność uwiązania - kluczowy element manipulacji</li>
    <li>Postępowanie sądowe w toku</li>
  </ul>
</SummarySection>
```

---

## Anonimizacja danych

### Zakaz pseudonimów przypisanych do osób

Nie zastępuj danych osobowych stałym, powtarzalnym przezwiskiem lub pseudonimem przypisanym do konkretnej osoby (np. nadanym jej w narracji przydomkiem zwierzęcym lub bajkowym). Taki pseudonim, używany konsekwentnie w wielu miejscach serwisu, sam staje się identyfikatorem i pozwala rozpoznać osobę tak samo jak imię i nazwisko. Do anonimizacji używaj wyłącznie neutralnych ról funkcyjnych (np. "matka", "opiekun", "pełnomocnik") lub generycznych oznaczeń wygenerowanych funkcjami poniżej — nigdy trwałej ksywki.

### Funkcje pomocnicze

```tsx
import {
  anonymizeName,
  anonymizeAddress,
  anonymizeMonetaryValue,
  anonymizeIdNumber,
  anonymizePhoneNumber,
  anonymizeEmail,
  anonymizeDocumentSignature,
  anonymizeDate,
  anonymizeObject
} from '@/utils/anonymization';
```

### Przykłady użycia

#### Imiona i nazwiska

```tsx
// Pełna anonimizacja
anonymizeName("Jan Kowalski")
// → "[imię i nazwisko]"

// Częściowa anonimizacja
anonymizeName("Jan Kowalski", { partial: true })
// → "J. K."
```

#### Adresy

```tsx
// Pełna anonimizacja
anonymizeAddress("ul. Kwiatowa 15, 00-001 Warszawa")
// → "[adres]"

// Częściowa (zachowaj miasto)
anonymizeAddress("ul. Kwiatowa 15, 00-001 Warszawa", { partial: true })
// → "ul. [...], Warszawa"
```

#### Kwoty pieniężne

```tsx
// Pełna anonimizacja
anonymizeMonetaryValue("1234567.89 PLN")
// → "[kwota]"

// Przybliżona wartość
anonymizeMonetaryValue("1234567.89 PLN", { partial: true })
// → "~1.2M PLN"
```

#### Numery identyfikacyjne

```tsx
// PESEL
anonymizeIdNumber("12345678901", "PESEL")
// → "[PESEL]"

// Częściowa
anonymizeIdNumber("12345678901", "PESEL", { partial: true, preserveFormat: true })
// → "123***789**"

// NIP, REGON, KRS
anonymizeIdNumber("1234567890", "NIP")
anonymizeIdNumber("123456789", "REGON")
anonymizeIdNumber("0000123456", "KRS")
```

#### Sygnatury aktowe

```tsx
// Pełna
anonymizeDocumentSignature("I C 1234/23")
// → "[sygnatura akt]"

// Częściowa (zachowaj rok i wydział)
anonymizeDocumentSignature("I C 1234/23", { partial: true, preserveFormat: true })
// → "I C ***/23"
```

#### Daty

```tsx
// Pełna anonimizacja
anonymizeDate("2023-05-15")
// → "[data]"

// Częściowa (miesiąc i rok)
anonymizeDate("2023-05-15", { partial: true })
// → "maj 2023"
```

#### Anonimizacja całych obiektów

```tsx
const documentData = {
  ownerName: "Jan Kowalski",
  address: "ul. Kwiatowa 15, 00-001 Warszawa",
  pesel: "12345678901",
  value: "500000 PLN",
  signature: "I C 1234/23"
};

const anonymized = anonymizeObject(documentData, {
  ownerName: 'name',
  address: 'address',
  pesel: { type: 'PESEL', options: { partial: true, preserveFormat: true } },
  value: 'monetary',
  signature: { type: 'signature', options: { partial: true, preserveFormat: true } }
});

// Result:
// {
//   ownerName: "[imię i nazwisko]",
//   address: "[adres]",
//   pesel: "123***789**",
//   value: "[kwota]",
//   signature: "I C ***/23"
// }
```

---

## Ostrzeżenia o treści

### Ostrzeżenia dotyczące przemocy

Używaj `ViolenceWarning` dla treści zawierających opisy przemocy:

```tsx
import { ViolenceWarning } from '@/components/ViolenceWarning';

<ViolenceWarning
  severity="severe"
  blocking={true}
  showResources={true}
  storageKey="violence-warning-article-name"
>
  <article>
    {/* Treść artykułu o przemocy */}
  </article>
</ViolenceWarning>
```

**Parametry:**
- `severity`: `'mild'` | `'moderate'` | `'severe'`
- `blocking`: czy wymagać potwierdzenia przed pokazaniem treści
- `showResources`: czy pokazać sekcję z pomocą
- `storageKey`: klucz do zapamiętania wyboru użytkownika
- `topics`: dodatkowe tematy ostrzeżenia

### Szybka wersja dla artykułów

```tsx
import { ViolenceArticle } from '@/components/ViolenceWarning';

<ViolenceArticle title="Tytuł artykułu" severity="severe">
  {/* Treść */}
</ViolenceArticle>
```

### Niestandardowe ostrzeżenia

Dla innych typów wrażliwych treści:

```tsx
import { ContentWarning } from '@/components/ContentWarning';

<ContentWarning
  topics={['trauma', 'śmierć', 'choroba psychiczna']}
  severity="moderate"
  message="Ten artykuł zawiera opisy trudnych doświadczeń związanych z..."
  blocking={false}
/>
```

---

## Dokumentacja źródłowa

### Notka o dostępie do dokumentów

```tsx
import { DocumentNotice } from '@/components/DocumentNotice';

<DocumentNotice
  documentType="notarial"
  showAnonymizationNotice={true}
  showVerificationInstructions={true}
  contactEmail="kontakt@adamowo.com"
/>
```

**Typy dokumentów:**
- `'notarial'` - Akta notarialne
- `'court'` - Akta sądowe
- `'administrative'` - Dokumenty administracyjne
- `'financial'` - Dokumenty finansowe
- `'other'` - Inne (własny label)

### Wersja inline

```tsx
import { InlineDocumentNotice } from '@/components/DocumentNotice';

<InlineDocumentNotice>
  Akta notarialne z maja 2023 - szczegóły dostępne dla uprawnionych stron.
</InlineDocumentNotice>
```

---

## Multimedia - Fallbacki

### Obsługa błędów odtwarzania

```tsx
import { MediaErrorFallback } from '@/components/MediaErrorFallback';

<MediaErrorFallback
  mediaType="audio"
  error={audioError}
  mediaUrl="https://example.com/audio.mp3"
  alternativeFormats={[
    { format: 'mp3', url: '/downloads/audio.mp3', label: 'Pobierz MP3' },
    { format: 'ogg', url: '/downloads/audio.ogg', label: 'Pobierz OGG' }
  ]}
  transcript="[Transkrypcja nagrania...]"
  showTroubleshooting={true}
  onRetry={() => reloadAudio()}
/>
```

### Prosta wersja

```tsx
import { SimpleMediaError } from '@/components/MediaErrorFallback';

<SimpleMediaError
  mediaType="audio"
  onRetry={() => reloadAudio()}
/>
```

---

## Przykłady użycia

### Kompletny artykuł o przemocy z dokumentacją

```tsx
import { ViolenceWarning } from '@/components/ViolenceWarning';
import {
  SummarySection,
  FactsSection,
  ChronologySection,
  InterpretationSection,
  ResourcesSection
} from '@/components/ContentSection';
import { DocumentNotice } from '@/components/DocumentNotice';
import { anonymizeName, anonymizeAddress, anonymizeDocumentSignature } from '@/utils/anonymization';

export function ArticleExample() {
  return (
    <ViolenceWarning
      severity="severe"
      blocking={true}
      showResources={true}
      storageKey="violence-warning-example-article"
    >
      <article>
        <h1>Tytuł artykułu</h1>

        {/* Podsumowanie na początku */}
        <SummarySection>
          <ul>
            <li>Kluczowy punkt 1</li>
            <li>Kluczowy punkt 2</li>
            <li>Kluczowy punkt 3</li>
          </ul>
        </SummarySection>

        {/* Fakty - ton neutralny */}
        <FactsSection>
          <p>
            W {anonymizeDate('2023-05-15', { partial: true })} osoba{' '}
            {anonymizeName('Jan Kowalski', { partial: true })} podpisała akt notarialny
            sygn. {anonymizeDocumentSignature('I C 1234/23', { partial: true, preserveFormat: true })}.
          </p>
          <p>
            Wartość nieruchomości oszacowano na{' '}
            {anonymizeMonetaryValue('500000 PLN', { partial: true })}.
          </p>

          <DocumentNotice
            documentType="notarial"
            contactEmail="kontakt@adamowo.com"
          />
        </FactsSection>

        {/* Chronologia */}
        <ChronologySection>
          <ul>
            <li><strong>Maj 2023:</strong> Podpisanie aktu</li>
            <li><strong>Czerwiec 2023:</strong> Złożenie pozwu</li>
            <li><strong>Lipiec 2023:</strong> Rozprawa</li>
          </ul>
        </ChronologySection>

        {/* Interpretacja - styl literacki */}
        <InterpretationSection>
          <p>
            Ten przypadek ilustruje klasyczny wzorzec manipulacji psychicznej,
            w którym wykorzystano zaufanie rodzinne...
          </p>
        </InterpretationSection>

        {/* Zasoby pomocowe */}
        <ResourcesSection>
          <h4>Jeśli doświadczasz podobnej sytuacji:</h4>
          <ul>
            <li>Niebieska Linia: 800 120 002 (24/7)</li>
            <li>Centrum Praw Kobiet: 600 070 717</li>
            <li>Telefon Zaufania: 116 123</li>
          </ul>
        </ResourcesSection>
      </article>
    </ViolenceWarning>
  );
}
```

---

## Checklist publikacji

Przed opublikowaniem artykułu sprawdź:

- [ ] **Anonimizacja**
  - [ ] Wszystkie imiona i nazwiska zanonimizowane
  - [ ] Adresy ukryte lub częściowo ukryte
  - [ ] Numery identyfikacyjne (PESEL, NIP, etc.) zamaskowane
  - [ ] Kwoty pieniężne przybliżone
  - [ ] Sygnatury aktowe częściowo ukryte

- [ ] **Struktura treści**
  - [ ] Sekcja "Fakty" - ton neutralny, reporterski
  - [ ] Sekcja "Interpretacja" - wyraźnie oznaczona jako opinia
  - [ ] Podsumowanie (TL;DR) na początku długich artykułów
  - [ ] Chronologia w formie listy punktowanej

- [ ] **Ostrzeżenia**
  - [ ] Trigger warning dla treści o przemocy
  - [ ] Zasoby pomocowe wyeksponowane
  - [ ] Severity level odpowiednio ustawiony

- [ ] **Dokumentacja**
  - [ ] Notka o dostępie do dokumentów dla uprawnionych
  - [ ] Informacja o anonimizacji
  - [ ] Kontakt do weryfikacji

- [ ] **Multimedia**
  - [ ] Alternatywne formaty (MP3, OGG, etc.)
  - [ ] Transkrypcje dla audio
  - [ ] Fallbacki dla błędów odtwarzania

- [ ] **Prawne**
  - [ ] Konsultacja z prawnikiem (jeśli publikowane są szczegóły dokumentów)
  - [ ] Informacja o interesie publicznym
  - [ ] Możliwość zgłoszenia naruszenia praw

---

## Kontakt

W razie pytań dotyczących publikacji treści:
- Email: kontakt@adamowo.com
- Dokumentacja: /docs

**Ostatnia aktualizacja:** 2025-01-14
