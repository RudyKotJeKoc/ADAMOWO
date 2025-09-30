export type SymbolId = 7 | 4 | 8 | 13;
export type MythSymbol = {
  id: SymbolId;
  titleKey: string;
  subtitleKey: string;
  meaningKeys: string[];
  whenKeys: string[];
  actionKeys: string[];
  icon: 'seven' | 'four' | 'eight' | 'thirteen';
};
