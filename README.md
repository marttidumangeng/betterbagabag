# BetterBagabag

A community-led, open-source civic portal for the **Municipality of Bagabag**, Nueva Vizcaya.

This project is a municipal fork of [Better Los Baños](https://github.com/BetterLosBanos/betterlb) / [BetterGov.ph](https://bettergov.ph), adapted for Bagabag. BetterBagabag is **independent and unofficial** — it is not a website of the Municipal Government of Bagabag.

Live site: [https://betterbagabag.org](https://betterbagabag.org)  
National budget lines that name Bagabag: [https://budget.betterbagabag.org](https://budget.betterbagabag.org)

---

### Inspirations

- [BetterGov.PH](https://github.com/bettergovph/bettergov)
- [Better Los Baños](https://github.com/BetterLosBanos/betterlb)
- [BetterSolano.org](https://github.com/BetterSolano/bettersolano)
- [Betterlocalgov](https://github.com/iyanski/betterlocalgov)

### Portal features

BetterBagabag aims to provide Bagabag with:

- **Public services directory** — municipal services with requirements, fees, and steps (Citizen’s Charter ingest still in progress)
- **Government directory** — elected officials, departments, and barangays
- **Transparency links** — procurement/infrastructure search plus the separate budget portal
- **Statistics** — population, municipal income (ARI), and CMCI where sourced
- **Multi-language support** — English and Filipino UI strings

---

## Forking for your LGU

This codebase is designed to be adapted for other Philippine LGUs.

### Quick start for other LGUs

1. **Edit configuration** — update `/config/lgu.config.json`
2. **Update translations** — modify `/public/locales/en/common.json` (and `fil` as needed)
3. **Add your data** — replace files under `/src/data/`
4. **Build and test** — `npm install && npm run build`

### Configuration files to edit

| File | What to change |
|------|----------------|
| `/config/lgu.config.json` | LGU settings (name, province, coordinates, branding, transparency) |
| `/public/locales/en/common.json` | UI text strings |
| `/src/data/directory/departments.json` | Municipal departments and offices |
| `/src/data/directory/barangays.json` | Barangay information |
| `/src/data/directory/executive.json` / `legislative.json` | Elected officials |
| `/src/data/services/` | Public services data |
| `/SOURCES.md` | Provenance for every sourced fact |

### Key configuration fields

| Field | Description | Example (Bagabag) |
|-------|-------------|-------------------|
| `lgu.name` | Short municipality name | `"Bagabag"` |
| `lgu.fullName` | Full official name | `"Municipality of Bagabag"` |
| `lgu.province` | Province name | `"Nueva Vizcaya"` |
| `lgu.region` | Region name | `"Region II"` |
| `lgu.regionCode` | Region label | `"Cagayan Valley"` |
| `lgu.type` | LGU type | `"municipality"` |
| `lgu.officialWebsite` | Official LGU website | `"https://bagongbagabag.gov.ph"` |
| `portal.name` | Portal name | `"BetterBagabag"` |
| `portal.baseUrl` | Portal base URL | `"https://betterbagabag.org"` |
| `portal.brandColor` | Brand accent | `"#15803d"` |

See [`FORKING.md`](./FORKING.md) for fuller forking notes (some Better LB OpenLGU/D1 steps do not apply to this static Worker deploy).

## Technical stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4 + `@bettergov/kapwa`
- **Production deploy**: Cloudflare Worker static assets (`betterbagabag-lgu`) via Wrangler — SPA, no Pages Functions on the live root domain
- **Data**: Structured JSON under `/src/data/`
- **Search**: Meilisearch (procurement/infrastructure) with Fuse.js where used
- **Localization**: i18next (English & Filipino)
- **Testing**: Vitest + Playwright
- **Code quality**: ESLint, Prettier

Weather, forex, and OpenLGU admin APIs from the Better LB template are turned off for this static deploy.

---

## Project structure

```
betterbagabag/
├── config/                      # lgu.config.json
├── public/                      # Static assets, locales, logos
├── scripts/                     # Merge and maintenance scripts
├── src/
│   ├── components/
│   ├── data/                    # Directory, services, statistics, transparency
│   ├── hooks/
│   ├── lib/
│   ├── pages/                   # Route-level pages
│   └── types/
├── SOURCES.md                   # Sourced facts for Bagabag content
├── HANDOVER.md                  # Operator notes
├── wrangler.jsonc               # Cloudflare Worker (static assets)
└── (root config files)
```

### Bagabag-specific data

| Data type | Location | Notes |
|-----------|----------|--------|
| **Departments** | `/src/data/directory/departments.json` | Contacts harvested from bagongbagabag.gov.ph; many heads still TODO |
| **Barangays** | `/src/data/directory/barangays.json` | 17 barangays; 8 punong barangays filled (2023–2026) |
| **Executive / legislative** | `/src/data/directory/executive.json`, `legislative.json` | 2025–2028 officials + SB committees |
| **Services** | `/src/data/services/` | Cleared of Los Baños charter; Bagabag PDFs not ingested yet |
| **Statistics** | `/src/data/statistics/` | Population, ARI, partial CMCI |
| **Transparency SRE** | `/src/data/transparency/sre.json` | Empty until quarters are sourced |
| **Sources** | `/SOURCES.md` | Every public fact with URL and read date |

---

## How to run locally

### 1. Clone and install

```bash
git clone https://github.com/marttidumangeng/betterbagabag
cd betterbagabag
npm install
```

### 2. Start development server

```bash
npm run dev
```

Portal: `http://localhost:5173`

### 3. Tests and quality

```bash
npx vitest run
npm run lint
npm run build
```

---

## Bagabag government structure (portal view)

### Executive

- **Mayor** — Benigno B. Calauad (2025–2028)
- **Vice Mayor** — Nestor Sevillena (2025–2028)
- Municipal departments listed under `/government/departments`

### Legislative (Sangguniang Bayan)

- Vice Mayor (presiding officer)
- 8 regular councilors
- Ex-officio: Liga ng mga Barangay President, SK Federation President, IPMR

Live directory: [https://betterbagabag.org/government](https://betterbagabag.org/government)

---

## Contribute

1. **Non-developers** — use `/contribute` on the live site (GitHub Issues).
2. **Developers** — [Issues](https://github.com/marttidumangeng/betterbagabag/issues).
3. **Data** — prefer sourced facts; update `SOURCES.md` when you add public data.

### Development workflow

- Follow [Conventional Commits](https://www.conventionalcommits.org/) — e.g. `fix(ui): …`, `feat(directory): …`, `chore(deps): …`
- Do not add `Co-authored-by` trailers for Cursor/Claude on this public repo
- Keep PRs focused; run lint/tests before merge

---

## Deployment

### Production (BetterBagabag)

- **Worker**: `betterbagabag-lgu` (static assets from `./dist`)
- **Domain**: `betterbagabag.org`
- **Budget portal** (separate repo): `budget.betterbagabag.org`

```bash
npm run build
npx wrangler deploy
```

See [`HANDOVER.md`](./HANDOVER.md) for operator checklist and Cloudflare account notes.

---

## License and data sources

### Code license

[Creative Commons CC0](https://creativecommons.org/publicdomain/zero/1.0/) — public domain dedication.

### Data attribution

| Source | Type |
|--------|------|
| [bagongbagabag.gov.ph](https://bagongbagabag.gov.ph) | Official LGU site (contacts, SB committees, charter PDFs) |
| COMELEC / election result pages | 2025 local winners |
| PhilGEPS / BetterGov mirrors | Procurement organization name |
| PSA / Scene.ph atlas, BLGF, DTI CMCI | Statistics |
| [barangaydirectory.com](https://www.barangaydirectory.com/) | Selected 2023–2026 punong barangays |

Always verify critical facts with official LGU sources. Provenance detail lives in [`SOURCES.md`](./SOURCES.md).

---

## Contact

- **Website**: https://betterbagabag.org
- **Budget portal**: https://budget.betterbagabag.org
- **GitHub**: https://github.com/marttidumangeng/betterbagabag
- **Discord**: https://discord.gg/dA6tkU4FYS (BetterGov.ph community)
- **Portal contact email**: TBD (not the LGU mayor’s office inbox)
