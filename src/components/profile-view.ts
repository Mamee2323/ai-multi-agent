/**
 * View helpers on top of loadProfile() — presentation only, no parsing of
 * docs/PROFILE.md here (that stays in src/lib/profile.ts).
 */

/** Split Bio into paragraphs on blank lines; single newlines join with a space. */
export function bioParagraphs(bio: string): string[] {
  return bio
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}

/** "13หมาหมี · 13Mamee" -> { primary: "13หมาหมี", alternate: "13Mamee" } */
export function splitName(name: string): { primary: string; alternate?: string } {
  const [primary, ...rest] = name.split(/\s*[·•|]\s*/).map((s) => s.trim()).filter(Boolean);
  const alternate = rest.join(' ').trim();
  return { primary: primary || name.trim(), alternate: alternate || undefined };
}

/**
 * Stable anchors for interests. Known items map to fixed ASCII slugs
 * (e.g. /interests#cooking) that don't depend on list order. Unknown items
 * fall back to an ASCII slug, or — if the label has no ASCII letters (Thai) —
 * a URL-safe Unicode slug. Renaming a known label changes its slug: update
 * KNOWN_SLUGS alongside PROFILE.md.
 */
const KNOWN_SLUGS: Record<string, string> = {
  'ai agents': 'ai-agents',
  cloud: 'cloud',
  'การทำอาหาร': 'cooking',
  'ท่องเที่ยว': 'travel',
  'การเงินส่วนบุคคล': 'personal-finance',
};

export function interestSlug(label: string): string {
  const key = label.trim().toLowerCase();
  if (KNOWN_SLUGS[key]) return KNOWN_SLUGS[key];
  const ascii = key.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (ascii) return ascii;
  const unicode = key
    .normalize('NFC')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{M}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return unicode || 'interest';
}

/** Finance item gets a fixed disclaimer on the Interests page. */
export function isFinance(label: string): boolean {
  return interestSlug(label) === 'personal-finance' || /การเงิน|finance/i.test(label);
}

export type Interest = { label: string; slug: string; finance: boolean };

export function toInterests(labels: string[]): Interest[] {
  const seen = new Map<string, number>();
  return labels.map((label) => {
    let slug = interestSlug(label);
    const n = seen.get(slug) ?? 0;
    seen.set(slug, n + 1);
    if (n > 0) slug = `${slug}-${n + 1}`;
    return { label, slug, finance: isFinance(label) };
  });
}
