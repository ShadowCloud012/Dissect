// Dependency-free, so client search code can share it.
// Predictable exact matching: case, accents, punctuation, possessive "'s" and
// spacing are ignored, and nothing else. UK/US variants (appendicectomy /
// appendectomy) match only through explicit aliases.
export function normaliseTerm(term: string) {
  return term
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’‘`]s\b/g, '')
    .replace(/['’‘`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
