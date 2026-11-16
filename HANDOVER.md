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
- Directory: mayor/VM from 2025 election results; 8 SB members (formal names from official SB page); ABC/SK/IPMR inferred from SB committee chairs; 17 municipal/agency offices with emails/phones; 17 barangays (names only); official site https://bagongbagabag.gov.ph.
- Statistics: population, 2nd-class income, FY2024 ARI totals, CMCI 2021 overall.
- Transparency nav + page link to `https://budget.betterbagabag.org`.
- `SOURCES.md` records every sourced fact.
- Baseline/verify: `npm run lint` clean; `npx vitest run` → **354** tests; `npm run build` OK.

## Martti must supply

1. **Contact email** for the portal (TBC). LGU mayor’s office email is already on the directory (`bagabagmo2022@gmail.com`); that is not the portal inbox.
2. **Punong barangay / officials** for the remaining 8: Nangalisan, San Pedro, Santa Cruz, Santa Lucia, Tuao North, Tuao South, Villa Coloma, Villaros (Bakir filled from DILG directory; 8 others from barangaydirectory captains only).
3. **Citizen’s Charter** ingestion — 16 office PDFs are live on bagongbagabag.gov.ph; services JSON still empty.
4. **Municipal office head names** beyond Treasurer Janette Santiago (emails/phones harvested; other heads still “Not yet listed”).
5. **Tourism spots + photos/videos**, with rights clearance (placeholder only for now). The mayor's Facebook page was suggested as a source, but it may be personal, so ask before using anything from it.
6. **Portal Facebook page**, if BetterBagabag gets one (left empty; the mayor's page is not used).

ABC/SK/IPMR and PhilGEPS org string are treated as confirmed enough for the directory (see `SOURCES.md`); MeiliSearch live check still optional.

## Harvested 2026-11-16 from bagongbagabag.gov.ph

- Official site set in config; mayor/VM contacts; 17 municipal/agency offices with email/phone; formal SB names; 17 standing committee chairs; emergency hotlines (PNP/BFP/RHU/MDRRMO/NUVELCO). See `SOURCES.md`.

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
