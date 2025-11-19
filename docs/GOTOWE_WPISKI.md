# Gotowe wpisy do wklejenia

Ten dokument zawiera gotowe fragmenty tekstu do wykorzystania w artykułach na platformie ADAMOWO, zgodne z nowymi wytycznymi dotyczącymi struktury treści i anonimizacji.

## Notki o dokumentach

### 1. Podstawowa notka o dokumentacji

```
Dokumentacja źródłowa: akta notarialne i sądowe — szczegóły udostępnimy uprawnionym w celu weryfikacji; wersja publiczna została zanonimizowana.
```

### 2. Rozszerzona notka (do użycia w komponencie)

Użyj komponentu `DocumentNotice`:

```tsx
<DocumentNotice
  documentType="notarial"
  showAnonymizationNotice={true}
  showVerificationInstructions={true}
  contactEmail="kontakt@adamowo.com"
/>
```

Lub dla aktów sądowych:

```tsx
<DocumentNotice
  documentType="court"
  showAnonymizationNotice={true}
  showVerificationInstructions={true}
  contactEmail="kontakt@adamowo.com"
/>
```

### 3. Notka inline (wersja tekstowa)

```
📄 Dokumentacja źródłowa: akta notarialne i sądowe — szczegóły udostępnimy uprawnionym w celu weryfikacji; wersja publiczna została zanonimizowana.
```

---

## Ostrzeżenia przed artykułami

### 1. Ostrzeżenie o przemocy psychicznej (podstawowe)

```
⚠️ OSTRZEŻENIE: Treści dotyczące przemocy psychicznej

Poniższy artykuł zawiera opisy przemocy psychicznej, manipulacji i innych trudnych doświadczeń. Jeśli te treści mogą być dla Ciebie trudne lub wyzwalające, rozważ przeczytanie go w bezpiecznym dla siebie momencie.

🆘 Jeśli potrzebujesz pomocy, sprawdź sekcję Zasoby na górze strony lub zadzwoń:
- Niebieska Linia: 800 120 002 (24/7)
- Telefon Zaufania: 116 123
- Centrum Praw Kobiet: 600 070 717
```

### 2. Ostrzeżenie z komponentem

Użyj komponentu `ViolenceWarning`:

```tsx
<ViolenceWarning
  severity="severe"
  blocking={true}
  showResources={true}
  storageKey="violence-warning-article-nazwa"
>
  {/* Treść artykułu */}
</ViolenceWarning>
```

Lub w wersji uproszczonej:

```tsx
<ViolenceArticle title="Tytuł artykułu" severity="severe">
  {/* Treść artykułu */}
</ViolenceArticle>
```

---

## Sekcje w artykułach

### 1. Szablon sekcji "Fakty"

```tsx
<FactsSection>
  <h3>Kluczowe fakty</h3>
  <ul>
    <li>Data wydarzenia: [zanonimizowana do miesiąca/roku]</li>
    <li>Strony: [inicjały lub oznaczenia typu "Osoba A", "Osoba B"]</li>
    <li>Dokumenty: [typ dokumentu, częściowa sygnatura]</li>
    <li>Wartość: [przybliżona kwota, np. "~500K PLN"]</li>
  </ul>
</FactsSection>
```

### 2. Szablon sekcji "Chronologia"

```tsx
<ChronologySection>
  <ul>
    <li><strong>Maj 2023:</strong> Podpisanie aktu notarialnego dotyczącego darowizny nieruchomości</li>
    <li><strong>Czerwiec 2023:</strong> Ujawnienie zapisu o służebności w akcie</li>
    <li><strong>Lipiec 2023:</strong> Złożenie pozwu do sądu</li>
    <li><strong>Sierpień 2023:</strong> Pierwsza rozprawa</li>
  </ul>
</ChronologySection>
```

### 3. Szablon sekcji "Interpretacja"

```tsx
<InterpretationSection>
  <h3>Analiza psychologiczna</h3>
  <p>
    Ten przypadek ilustruje klasyczny wzorzec manipulacji rodzinnej,
    w którym osoba sprawcza wykorzystała:
  </p>
  <ul>
    <li>Zaufanie rodzinne</li>
    <li>Poczucie winy ofiary</li>
    <li>Izolację od innych członków rodziny</li>
    <li>Kontrolę finansową jako narzędzie władzy</li>
  </ul>
  <p>
    Zastosowane techniki odpowiadają opisanym w literaturze mechanizmom
    przemocy ekonomicznej i psychicznej...
  </p>
</InterpretationSection>
```

### 4. Szablon sekcji "Podsumowanie" (TL;DR)

```tsx
<SummarySection>
  <h3>Najważniejsze informacje</h3>
  <ul>
    <li><strong>Co:</strong> Akt darowizny z ukrytą służebnością</li>
    <li><strong>Kiedy:</strong> Maj 2023</li>
    <li><strong>Problem:</strong> Manipulacja prawna i psychiczna</li>
    <li><strong>Status:</strong> Postępowanie sądowe w toku</li>
    <li><strong>Znaczenie:</strong> Przykład wykorzystania prawa do kontroli rodziny</li>
  </ul>
</SummarySection>
```

### 5. Szablon sekcji "Zasoby i pomoc"

```tsx
<ResourcesSection>
  <h3>Gdzie szukać pomocy?</h3>

  <h4>📞 Linie telefoniczne (24/7)</h4>
  <ul>
    <li><strong>Niebieska Linia:</strong> 800 120 002 - wsparcie dla ofiar przemocy domowej</li>
    <li><strong>Telefon Zaufania:</strong> 116 123 - wsparcie emocjonalne</li>
    <li><strong>Pogotowie alarmowe:</strong> 112 - w sytuacji bezpośredniego zagrożenia</li>
  </ul>

  <h4>🏛️ Pomoc prawna i psychologiczna</h4>
  <ul>
    <li><strong>Centrum Praw Kobiet:</strong> 600 070 717 - pomoc prawna, psychologiczna</li>
    <li><strong>Punkty Nieodpłatnej Pomocy Prawnej:</strong> <a href="https://www.ms.gov.pl">ms.gov.pl</a></li>
  </ul>

  <h4>💻 Pomoc online</h4>
  <ul>
    <li><a href="https://www.niebieskalinia.pl">niebieskalinia.pl</a> - chat, informacje o przemocy</li>
    <li><a href="https://cpk.org.pl">cpk.org.pl</a> - Centrum Praw Kobiet</li>
  </ul>
</ResourcesSection>
```

---

## Przykłady anonimizacji w tekście

### Imiona i nazwiska

❌ **Niepoprawnie:** "Jan Kowalski podpisał umowę..."

✅ **Poprawnie:**
- "[Imię i nazwisko] podpisało umowę..."
- "Osoba A podpisała umowę..."
- "J.K. podpisał umowę..." (jeśli kontekst wymaga zachowania inicjałów)

### Adresy

❌ **Niepoprawnie:** "Nieruchomość przy ul. Kwiatowej 15, 00-001 Warszawa"

✅ **Poprawnie:**
- "Nieruchomość w [miejscowość]"
- "Nieruchomość w Warszawie" (zachowanie miasta, ukrycie ulicy)
- "Nieruchomość przy ul. [...], Warszawa"

### Kwoty pieniężne

❌ **Niepoprawnie:** "Wartość darowizny: 543,210.50 PLN"

✅ **Poprawnie:**
- "Wartość darowizny: [kwota]"
- "Wartość darowizny: ~500K PLN" (przybliżona)
- "Wartość darowizny: około pół miliona złotych"

### Numery dokumentów i sygnatury

❌ **Niepoprawnie:** "Sygnatura sprawy: I C 1234/23, PESEL: 12345678901"

✅ **Poprawnie:**
- "Sygnatura sprawy: I C ***/23"
- "Numer [PESEL]"
- "Numer identyfikacyjny: 123***789**" (częściowo widoczny)

### Daty

❌ **Niepoprawnie:** "15 maja 2023 roku o godzinie 14:30"

✅ **Poprawnie:**
- "W maju 2023 roku"
- "W [data]"
- "W połowie 2023 roku"

---

## Kompletny przykład artykułu

```tsx
import {
  SummarySection,
  FactsSection,
  ChronologySection,
  InterpretationSection,
  ResourcesSection
} from '@/components/ContentSection';
import { DocumentNotice } from '@/components/DocumentNotice';
import { ViolenceWarning } from '@/components/ViolenceWarning';

export function PrzykladowyArtykul() {
  return (
    <ViolenceWarning severity="severe" blocking={true}>
      <article>
        <h1>Służebność jako narzędzie kontroli: Analiza przypadku</h1>

        {/* Podsumowanie na początku */}
        <SummarySection>
          <ul>
            <li><strong>Co:</strong> Akt darowizny z ukrytą służebnością uwiązania</li>
            <li><strong>Kiedy:</strong> Maj 2023</li>
            <li><strong>Problem:</strong> Wykorzystanie konstrukcji prawnej do kontroli życia ofiary</li>
            <li><strong>Status:</strong> Postępowanie sądowe w toku</li>
          </ul>
        </SummarySection>

        {/* Fakty - ton neutralny */}
        <FactsSection>
          <h2>Fakty i źródła</h2>
          <p>
            W maju 2023 roku osoba A podpisała akt notarialny dotyczący darowizny nieruchomości
            na rzecz osoby B. Wartość nieruchomości oszacowano na około 500 tysięcy złotych.
          </p>
          <p>
            W akcie zawarto zapis o służebności osobistej (uwiązania), ograniczający możliwość
            dysponowania nieruchomością przez obdarowanego.
          </p>

          <DocumentNotice
            documentType="notarial"
            contactEmail="kontakt@adamowo.com"
          />
        </FactsSection>

        {/* Chronologia */}
        <ChronologySection>
          <h2>Chronologia wydarzeń</h2>
          <ul>
            <li><strong>Maj 2023:</strong> Podpisanie aktu darowizny</li>
            <li><strong>Czerwiec 2023:</strong> Odkrycie zapisu o służebności</li>
            <li><strong>Lipiec 2023:</strong> Złożenie pozwu o uchylenie darowizny</li>
            <li><strong>Sierpień 2023:</strong> Rozprawa wstępna</li>
          </ul>
        </ChronologySection>

        {/* Interpretacja */}
        <InterpretationSection>
          <h2>Analiza psychologiczna i symbolika</h2>
          <p>
            Przypadek ten ilustruje wykorzystanie konstrukcji prawnej jako narzędzia
            przemocy psychicznej i ekonomicznej. Służebność "uwiązania" nabiera tu
            symbolicznego znaczenia - dosłownie i w przenośni "uwiązuje" ofiarę.
          </p>
          <p>
            Mechanizm manipulacji polegał na:
          </p>
          <ul>
            <li>Pozornej hojności (darowizna nieruchomości)</li>
            <li>Ukrytej kontroli (służebność osobista)</li>
            <li>Wykorzystaniu zaufania rodzinnego</li>
            <li>Izolacji ekonomicznej ofiary</li>
          </ul>
        </InterpretationSection>

        {/* Zasoby */}
        <ResourcesSection>
          <h2>Gdzie szukać pomocy?</h2>
          <ul>
            <li><strong>Niebieska Linia:</strong> 800 120 002 (24/7)</li>
            <li><strong>Centrum Praw Kobiet:</strong> 600 070 717</li>
            <li><strong>Telefon Zaufania:</strong> 116 123</li>
          </ul>
        </ResourcesSection>
      </article>
    </ViolenceWarning>
  );
}
```

---

## Szybki checklist przed publikacją

✅ **Anonimizacja:**
- [ ] Imiona i nazwiska → inicjały lub [imię i nazwisko]
- [ ] Adresy → [adres] lub tylko miasto
- [ ] Kwoty → przybliżone lub [kwota]
- [ ] Numery dokumentów → częściowo ukryte
- [ ] Daty → miesiąc/rok zamiast dokładnej daty

✅ **Struktura:**
- [ ] Podsumowanie (TL;DR) na początku
- [ ] Sekcja "Fakty" - ton neutralny
- [ ] Sekcja "Interpretacja" - wyraźnie oznaczona
- [ ] Sekcja "Zasoby" - numery pomocy

✅ **Ostrzeżenia:**
- [ ] Trigger warning dla treści o przemocy
- [ ] Zasoby pomocowe wyeksponowane
- [ ] Informacja o możliwości powrotu później

✅ **Dokumentacja:**
- [ ] Notka o dostępie do dokumentów
- [ ] Informacja o anonimizacji
- [ ] Dane kontaktowe do weryfikacji

---

**Ostatnia aktualizacja:** 2025-01-14
**Kontakt:** kontakt@adamowo.com
