export enum Case {
  Nominative = 1,
  Accusative = 2,
  Genitive = 3,
  Dative = 4,
}

export enum Gender {
  Male = 1,
  Female = 2,
  Neuter = 3,
}

export interface Name {
  base: string;
  names: [string, string, string, string];
  gender: Gender;
}

export interface DeclinedName {
  base: string;
  name: string;
  case: Case;
  gender: Gender;
}

export interface UnprocessedName {
  base: string;
  name: string;
  case: string;
  gender: string;
}
