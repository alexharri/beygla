export enum Case {
  Nominative = 1,
  Accusative = 2,
  Genitive = 3,
  Dative = 4,
}

// See https://bin.arnastofnun.is/gogn/k-snid
export enum WordCategory {
  PersonNames = "ism",
  NonIcelandicPersonNames = "erm",
  MythicalName = "hetja",
  PlaceNames = "örn",
  Nicknames = "gæl",
  FamilyNames = "ætt",
  GeographicalNames = "bær",
  NonIcelandicGeographicalNames = "erl",
  CountryNames = "lönd",
  CategoriesOfPeoples = "ffl",
  StreetNames = "göt",
  CompanyOrOrganizationName = "fyr",
  OtherNames = "heö",
  AstrologicalNames = "stja",
  Animals = "dýr",
  General = "alm",
  Structures = "mvirk",
  UrbanAreas = "þor",
  CountiesOrNeighborhoodsOrRegions = "svaedi",
}

export interface DeclinedName {
  base: string;
  name: string;
  case: Case;
  gender: string;
  categories: WordCategory[];
}

export interface UnprocessedName {
  base: string;
  name: string;
  case: string;
  gender: string;
  categories: WordCategory[];
}
