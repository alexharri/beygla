export enum Case {
  Nominative = 1,
  Accusative = 2,
  Genitive = 3,
  Dative = 4,
}

export interface DeclinedName {
  base: string;
  name: string;
  case: Case;
}

export interface UnprocessedName {
  base: string;
  name: string;
  case: string;
}
