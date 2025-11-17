import type { AnalysisMetadata, AnalysisCategoryInfo, AnalysisCategory } from './analizy.schema';

/**
 * Category definitions for the Analyses section.
 *
 * Provides hierarchical organization with clear visual identity for each category.
 */
export const ANALYSIS_CATEGORIES: AnalysisCategoryInfo[] = [
  {
    id: 'manipulacja',
    nameKey: 'analizy.categories.manipulacja.name',
    descriptionKey: 'analizy.categories.manipulacja.description',
    icon: '🎭',
    color: '#ff6b35',
  },
  {
    id: 'dokumentacja',
    nameKey: 'analizy.categories.dokumentacja.name',
    descriptionKey: 'analizy.categories.dokumentacja.description',
    icon: '📋',
    color: '#4c6ef5',
  },
  {
    id: 'psychologia',
    nameKey: 'analizy.categories.psychologia.name',
    descriptionKey: 'analizy.categories.psychologia.description',
    icon: '🧠',
    color: '#1dd1a1',
  },
  {
    id: 'prawo',
    nameKey: 'analizy.categories.prawo.name',
    descriptionKey: 'analizy.categories.prawo.description',
    icon: '⚖️',
    color: '#a855f7',
  },
  {
    id: 'wzorce',
    nameKey: 'analizy.categories.wzorce.name',
    descriptionKey: 'analizy.categories.wzorce.description',
    icon: '🔄',
    color: '#f59f00',
  },
  {
    id: 'inne',
    nameKey: 'analizy.categories.inne.name',
    descriptionKey: 'analizy.categories.inne.description',
    icon: '📚',
    color: '#64748b',
  },
];

/**
 * Analysis content library.
 *
 * Contains metadata for all deep-dive analyses available on the platform.
 * Following Single Source of Truth (SSOT) principle.
 */
export const ANALYSES: AnalysisMetadata[] = [
  {
    id: 'curse-of-eight',
    title: 'Klątwa Ósemki',
    subtitle: 'Anatomia symboliki numerycznej w sprawie Adamowo',
    category: 'wzorce',
    subcategory: 'Symbolika i wzorce numeryczne',
    teaser:
      'Głęboka analiza niezwykłych zbieżności numerycznych w sprawie rodziny Adamskich. Od adresu Adamowo 8, przez ośmioletni cykl konfliktu, aż po kluczowe daty w ósmym miesiącu – eksploracja tego, jak cyfra 8 przenika wszystkie wymiary tej historii.',
    icon: '♾️',
    readingTime: 25,
    date: '2024-11-15',
    tags: ['symbolika', 'numerologia', 'wzorce', 'analiza przypadku', 'Adamowo', 'ósemka', 'cykl'],
    featured: true,
    contentPath: '/curse-of-eight-content',
    badge: 'Popularne',
  },
  {
    id: 'timeline-adamowo',
    title: 'Oś Czasu: Sprawa Adamowo',
    subtitle: 'Chronologiczna rekonstrukcja wydarzeń',
    category: 'dokumentacja',
    subcategory: 'Studium przypadku',
    teaser:
      'Szczegółowa chronologia kluczowych wydarzeń w sprawie rodziny Adamskich, od aktu darowizny w 2017 roku po współczesność. Dokumentacja oparta na protokołach, zeznaniach i oficjalnych dokumentach.',
    icon: '📅',
    readingTime: 15,
    date: '2024-11-10',
    tags: ['chronologia', 'dokumentacja', 'Adamowo', 'studium przypadku'],
    featured: false,
    contentPath: '/timeline-content',
  },
  {
    id: 'violence-loop-theory',
    title: 'Teoria Pętli Przemocy',
    subtitle: 'Mechanizmy cyklicznej przemocy psychicznej',
    category: 'psychologia',
    subcategory: 'Wzorce relacyjne',
    teaser:
      'Analiza mechanizmów psychologicznych stojących za cyklami przemocy. Jak powstają pętle, dlaczego są tak trudne do przerwania i jakie narzędzia mogą pomóc w ich rozpoznaniu.',
    icon: '🔁',
    readingTime: 20,
    date: '2024-11-05',
    tags: ['pętla przemocy', 'cykle', 'psychologia', 'manipulacja', 'trauma'],
    featured: true,
    contentPath: '/violence-loop',
  },
];

/**
 * Get category information by ID.
 */
export function getCategoryInfo(categoryId: AnalysisCategory): AnalysisCategoryInfo | undefined {
  return ANALYSIS_CATEGORIES.find((cat) => cat.id === categoryId);
}

/**
 * Get all analyses by category.
 */
export function getAnalysesByCategory(categoryId: AnalysisCategory): AnalysisMetadata[] {
  return ANALYSES.filter((analysis) => analysis.category === categoryId);
}

/**
 * Get featured analyses.
 */
export function getFeaturedAnalyses(): AnalysisMetadata[] {
  return ANALYSES.filter((analysis) => analysis.featured);
}

/**
 * Search analyses by query string.
 * Searches in title, subtitle, teaser, and tags.
 */
export function searchAnalyses(query: string): AnalysisMetadata[] {
  const lowerQuery = query.toLowerCase();
  return ANALYSES.filter(
    (analysis) =>
      analysis.title.toLowerCase().includes(lowerQuery) ||
      analysis.subtitle?.toLowerCase().includes(lowerQuery) ||
      analysis.teaser.toLowerCase().includes(lowerQuery) ||
      analysis.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
