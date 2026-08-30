export type AdamowoSectionId =
  | 'analiza'
  | 'definicje'
  | 'argumenty'
  | 'mechanizmy'
  | 'orzecznictwo'
  | 'wykladnie'
  | 'ochrona';

export type KnowledgeCategory = 'cywilne' | 'karne' | 'etyka' | 'psychologia';

export type KnowledgeKind =
  | 'przepis'
  | 'procedura'
  | 'pojecie-prawne'
  | 'etyka-zawodowa'
  | 'psychologia'
  | 'model-adamowo';

export interface KnowledgeSource {
  label: string;
  url: string;
}

export interface KnowledgeEntry {
  slug: string;
  title: string;
  shortTitle: string;
  category: KnowledgeCategory;
  kind: KnowledgeKind;
  areas: Exclude<AdamowoSectionId, 'definicje'>[];
  summary: string;
  explanation: string[];
  remember: string[];
  legalBasis?: string[];
  caution?: string;
  tags: string[];
  related?: string[];
  sources?: KnowledgeSource[];
}

export const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  cywilne: 'Prawo cywilne i notarialne',
  karne: 'Prawo karne i procedury',
  etyka: 'Etyka i reprezentacja prawna',
  psychologia: 'Mechanizmy psychologiczne i behawioralne',
};

export const KIND_LABELS: Record<KnowledgeKind, string> = {
  przepis: 'Przepis prawa',
  procedura: 'Procedura',
  'pojecie-prawne': 'Pojęcie prawne',
  'etyka-zawodowa': 'Etyka zawodowa',
  psychologia: 'Pojęcie psychologiczne',
  'model-adamowo': 'Model analityczny ADAMOWO',
};
