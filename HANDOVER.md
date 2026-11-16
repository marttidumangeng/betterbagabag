# Handover — BetterBagabag LGU Portal

Written 2026-11-15. Phases 1–5 done locally. Phase 6 waits for Martti’s go-ahead.

## Done

- Public fork: https://github.com/marttidumangeng/betterbagabag (local clone `C:\Github_Personal\betterbagabag`).
- Configured for Municipality of Bagabag / BetterBagabag / betterbagabag.org / green `#15803d`.
- Independence notice in the navbar on every page.
- Weather and LGU news widgets, the top ticker (weather and exchange rates) and the `/data/weather` and `/data/forex` pages are off: they call `/api` Pages Functions that the planned static Worker does not serve.
- Green theme: the Kapwa brand scale is overridden in `src/index.css` (600 = `#15803d`); `brandColor` in the config is not read by the code.
- Missing facts show as "Not yet listed" on the site; the list below is what to fill in.
- Seal-based logos under `public/logos/` (`betterbagabag` slug).
- Directory: mayor/VM from 2025 election results; 8 SB members; 17 barangays (names only).
- Statistics: population, 2nd-class income, FY2024 ARI totals, CMCI 2021 overall.
- Transparency nav + page link to `https://budget.betterbagabag.org`.
- `SOURCES.md` records every sourced fact.
- Baseline/verify: `npm run lint` clean; `npx vitest run` → **354** tests; `npm run build` OK.

## Martti must supply

1. **Contact email** for the portal (TBC).
2. **Working official LGU website URL**, if any (`lgu-bagabag.gov.ph` was unreachable).
3. **Punong barangay** for each of the 17 barangays.
4. **ABC president** and **SK federation president** for 2025–2028 (province page looks stale).
5. **Citizen’s Charter** (services) — Los Baños charter cleared; site has no services yet.
6. **Municipal office heads and phone numbers**.
7. **Tourism spots + photos/videos** from https://www.facebook.com/MayorBenCalauad with rights clearance (placeholder only for now).
8. Confirm **PhilGEPS org string** `MUNICIPALITY OF BAGABAG, NUEVA VIZCAYA` against live MeiliSearch results (Santo Tomas, Isabela also has a Bagabag barangay).
9. Confirm middle initials / formal names for councilors where PeoPlaid used nicknames (e.g. Chic Afan, Bebet Mercado).

## Phase 6 commands (do not run until Martti says go)

Order matters so neither site goes dark for long.

1. Push this repo: `git push -u origin HEAD` (from `C:\Github_Personal\betterbagabag`).
2. Replace `wrangler.jsonc` with a static-assets Worker named **`betterbagabag-lgu`** (no Los Baños KV/D1; no `routes` yet):

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "betterbagabag-lgu",
  "compatibility_date": "2026-10-01",
  "assets": { "directory": "./dist", "not_found_handling": "single-page-application" }
}
```

3. In `C:\Github_Personal\bagabag-transparency-portal`:
   - Add route `budget.betterbagabag.org` (keep existing routes).
   - Set `siteUrl` to `https://budget.betterbagabag.org` in `portal.config.ts`.
   - Update Bagabag link in `portals/nueva-vizcaya.config.ts` `related`.
   - `npm run build:share`, then lint/build/check scripts, then `npm run deploy:cloudflare` and `npm run deploy:nv`.
   - Confirm https://budget.betterbagabag.org loads.

4. Move root domain:
   - Remove `betterbagabag.org` from the budget Worker routes; keep `budget.betterbagabag.org` and `betterbagabag.dababon.pro`; redeploy budget.
   - Immediately add `"routes": [{ "pattern": "betterbagabag.org", "custom_domain": true }]` to the LGU Worker; `npm run build` && `npx wrangler deploy`.
   - Confirm https://betterbagabag.org shows the LGU portal.

5. Commit and push budget-repo changes (no Claude co-author).

6. Directory PR: wait until [jmacj/better-lgu-directory#409](https://github.com/jmacj/better-lgu-directory/pull/409) merges, then new branch for README + BUDGET.md (`🧩 Integrated`, portal `budget.betterbagabag.org`). Ask before opening the PR.

## Accounts checklist

- `gh auth status` → `marttidumangeng` active.
- Repo `user.email` → `24548913+marttidumangeng@users.noreply.github.com`.
- `npx wrangler whoami` → `bangwar@gmail.com`.
