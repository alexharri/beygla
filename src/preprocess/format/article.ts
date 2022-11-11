export function isDefiniteArticle(caseString: string) {
  // If the case ends with 'gr', the name is in the definite article.
  //
  // For example:
  //
  //    Indefinite article:   drengur     (a boy)
  //    Definite article:     drengurinn  (the boy)
  //
  // A very small amount of words have two valid definite article
  // forms. For example:
  //
  //    köstulunum
  //    kastölunum
  //
  // These only appear in names
  //
  return caseString.endsWith("gr") || caseString.endsWith("gr2");
}
