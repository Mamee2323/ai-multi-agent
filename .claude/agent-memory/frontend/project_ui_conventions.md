---
name: project-ui-conventions
description: Non-obvious FE choices from the first UI build (2026-09-25) — interest slug map, design tokens, honeypot, inlined /api/ in scripts, fallback leak risk
metadata:
  type: project
---

Choices made while closing issues #1–#4 + D8 (2026-09-25). They aren't obvious from reading one file.

- **Interest slugs** come from a fixed map `KNOWN_SLUGS` in `src/components/profile-view.ts` (ai-agents, cloud, cooking, travel, personal-finance). Unknown labels fall back to an ASCII slug, then a Unicode slug. **Why:** the Thai labels can't be turned into ASCII slugs automatically, and anchors must stay stable. **How to apply:** if a label in PROFILE `## Interests` gets renamed, update the map too, otherwise the anchor turns into a Unicode slug. The finance disclaimer is keyed on slug `personal-finance` or the regex /การเงิน|finance/.
- **Theme tokens** are in `src/styles/global.css`: cream bg #fffaf2, text #2b2233, muted #5b4f66, links #b0205a, buttons #c2185b with white text, and 5 pastel colors. The AA contrast ratios are noted in the CSS header. Keep new colors at 4.5:1 or better.
- **Honeypot** field is `website` on both forms, hidden with the off-screen `.hp` class (not display:none) and sent in the JSON body. The BE filter is Lab 05 (#5). Check the name against `docs/handoffs/05-opencode-to-claude.md` once that file exists.
- **Astro inlines small client scripts**, so the HTML of /contact and /guestbook contains the string `/api/...` inside `fetch()`. It's not visible text. If QA greps the raw HTML, expect this match.
- **Profile FALLBACK** in `src/lib/profile.ts` has the headline "Personal branding site" and English "coming soon" text. If PROFILE.md goes missing, those render publicly. FE can't edit that file, so flag it to the owner or BE.
- The layout loads the profile itself and emits the JSON-LD Person (D8 fields only). Pages must pass `title` + `description`. Pass `noindex` only on guestbook.
