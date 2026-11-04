# Researching an investor

Used whenever a firm or person isn't in Yellowtail yet — whether a signal card needs it or a list is
being imported — and when filling the empty fields of one that is. The aim is a profile as complete as
the public web supports, and **not one field more**. An empty field is honest; a guessed one is a bug
every customer sees.

## Order of work

1. **Pin the firm down first.** Find its own website. Two firms with one name are common ("Lantern
   Ventures" London vs "Lantern Capital" Berlin); the website domain and LinkedIn company page are what
   tell them apart, and they are what `file_signal` / `file_investor` dedup on. If you can't tell which
   firm the intel means, stop and ask — don't research both.
2. **Re-check Yellowtail with what you found.** `search_companies` again with the domain and the exact
   legal-ish name. Research often turns a "new" firm into an existing one under a different spelling.
3. **Read the firm's own site**: home, about/thesis, team, portfolio, any "what we invest in" or FAQ
   page. This is the primary source for everything below.
4. **Then a second source** for what the site doesn't say: LinkedIn company page, the firm's fund-close
   press release, Crunchbase / Dealroom / PitchBook public profile pages, reputable trade press.
5. **People**: the firm's team page first, then the person's LinkedIn. Only professional facts. Then
   the **contact search** (§ Contact search) for every person on the card.

Stop when the remaining fields have no source. Five minutes per firm is plenty; this runs one card at a
time and the user would rather wait than review guesses.

## What to fill, and from what

Read the live definitions with `get_company_kind` (`investor`) and `list_tags` — field keys, select
options and tag names change. This is how to map evidence onto them.

### Firm — core

| Field | Fill from | Rule |
| --- | --- | --- |
| `name` | the firm's site / LinkedIn | the name the firm uses, not the legal entity ("Northwind Capital", not "Northwind Capital Partners LLP") |
| `websiteUrl` | the firm's site | the root, `https://northwind.vc` |
| `linkedinUrl` | LinkedIn company page | the company page, never a person's. Always searched (`"<firm>" site:linkedin.com/company`, the site's footer link) |
| `hqCountry` | site footer, about page, LinkedIn | ISO code. Where the firm is based, not where it invests |
| `description` | the firm's own words, rewritten | 1–2 plain factual sentences: who they back, at what stage, where. **Public** — no adjectives they didn't earn, nothing from the intel that was said in confidence |
| X handle (no field) | linked from the site's header or footer | on the card and in the profile note only |

### Firm — tags

Tags are what matching runs on: a firm with the wrong industry, or none, never reaches the
founders it should. So tagging is a required step with its own check, not what is left over.

**Read the whole tree first.** `list_tags` for every kind `get_company_kind` says applies, the
industry kind with its children (`parentId`). Most sectors a thesis names are already there one
level down: "therapeutics" is *Biotech*, "chips" is *Semiconductors*, "agbio" is *Ag biotech*.

**Every applicable kind is answered.** For each kind, the card shows its tags, or `not stated —
searched: <where>`. Never a kind left off silently. The dry run's `tagGaps` lists the kinds still
empty; each must be on the card as not stated (with where you looked), or mapped before the card
is shown.

| Tag kind (Oct 2026) | Evidence | Notes |
| --- | --- | --- |
| `investor_type` | how the firm describes itself: VC, CVC, angel network, family office, university fund… | many-of. Almost always findable: a corporation's fund is *Corporate VC*; a university's fund is typed by what it does (usually *Early-stage VC*); a state body is *Government* |
| `stage` | stated stages, or the rounds they say they lead | Pre-seed, Seed, Series A, Series B+. A stated range covers the stages inside it ("seed to Series B" is Seed, Series A, Series B+); "all stages" / "multi-stage" is all four. "Early stage" alone is not a stage: look for the rounds or the cheque size and say which |
| `focus` | Generalist only if they say so; Climate Tech / Deep Tech if that is the thesis | |
| `industry` | sectors named on the thesis page | the **most specific** tag the source names, **and its parent** |
| `geography` | where they say they invest | countries when named; a region tag only when the region is named. A fund that backs one university's or one country's companies invests in that country. "DACH", "Nordics" are not tags: list the countries only if a source lists them |
| `business_model` | B2B, B2C, marketplace… if the thesis states it | |

Mapping rules, each one a mistake made in a real filing:

- **Most specific, plus its parent.** A semiconductor and photonics fund is *Semiconductors* +
  *Robotics & hardware*, not *Industry*. A life-sciences fund is *Health* + *Biotech* (and
  *Medtech* if devices are named), not untagged because no tag says "life sciences". A parent
  alone, when a child the source names exists, is under-tagging.
- **The main sector first.** "Mainly therapeutics, also agbio" is *Health* + *Biotech* first, and
  *Food & agriculture* + *Ag biotech* second. Never the secondary sector alone.
- **Words, not vibes.** Every tag has a sentence that states it. Portfolio patterns are not a
  thesis: "three of their companies are batteries" does not make them a batteries investor.
- **No padding.** A firm naming twelve sectors gets the ones its thesis leads with, not every
  child in the tree. Eight or more industry tags on one firm means you are tagging its portfolio,
  not its thesis: cut back to what it says it focuses on.
- **Synonyms map; they don't create.** "Life sciences", "biopharma", "therapeutics" → Biotech.
  "Cleantech", "energy transition" → Energy (and Climate Tech focus if that is the thesis).
  "Mobility" → Mobility & logistics or Transportation, whichever the thesis means. "Quantum",
  "photonics" → Semiconductors only if that is how the firm groups them; otherwise the parent
  (Robotics & hardware) and the word in the description.

If a source names a sector with no tag under any spelling or synonym, check it against the gate
in `${CLAUDE_PLUGIN_ROOT}/references/house-rules.md` §12 (it is strict). A term that passes goes under the card's **New tags (created
on approve)**; one that fails gets the nearest existing tag at the level that is true (usually
the parent) and the specific word goes in the description. **Never substitute a vaguer tag when
a specific one exists, and never leave the sector untagged.**

- **industry** and **focus** tags anyone may create. An industry tag needs its group as `parentId`
  (one of the groups `list_tags { kind: "industry" }` returns; never a hard-coded id). On
  approval, `create_tag { kind, name, parentId? }` runs first and the card files with the returned
  id. `created: false` means the kind already has that tag under another spelling: use the returned
  tag's id and say so in the report ("used existing *Grid management*: same tag, plural").
- **Other kinds** (`stage`, `geography`, `investor_type`, `business_model`) are the Yellowtail
  team's. A platform admin's `create_tag` works; for anyone else, don't propose it as created on
  approve: the card files without it and lists it under **Tags to ask the Yellowtail team for**
  (kind, name, the source), suggesting the user mentions it to the team.
- **Alongside the parent.** A new specific tag goes on the firm next to its broad parent, never in
  its place, so matching on the parent keeps working for every firm.

### Firm — custom fields (`attributes`)

These are **buckets**, so map a stated figure to the bucket that contains it.

| Key | Evidence | Rule |
| --- | --- | --- |
| `fund_size` | the latest fund's size, from a close announcement | convert to USD at a rough current rate; if the figure sits within ~10% of a bucket edge, leave it empty and say why |
| `min_check` / `max_check` | stated cheque range | same conversion rule. A single "typical cheque" fills neither — put it in the description |
| `leads_rounds` | "we lead", "we take board seats" → true; "we co-invest / follow" → false | silence → empty, never false |
| `climate_investments` | count of climate companies in their published portfolio | only if you actually counted the portfolio page; otherwise empty |
| `software_only` | an explicit "software only" / "no hardware" | silence → empty |
| `parent_company` | CVCs and fund-of-funds arms: the parent | |
| `notable_investments` | 3–5 portfolio names from their own site | names only, comma-separated |

### Person

| Field | Fill from | Rule |
| --- | --- | --- |
| `fullName` | team page / LinkedIn | as they write it |
| `roleTitle` | team page first, LinkedIn second | their title at **this** firm. If the two disagree, prefer the newer and say so |
| `linkedinUrl` + `linkedinStatus` | LinkedIn | **always searched** (below); the dedup key, so get the right one (match firm, title, city) |
| `email` + `emailStatus` | the contact search's email order (below) | work address only; its source, or the published address its pattern came from, on the card and in the profile note |
| `twitterHandle` | linked from their site, the team page or LinkedIn | only if it is clearly theirs |
| `phone` + `phoneStatus` | the firm's contact page, a work number they publish, enrichment | work numbers only |
| `locationCity` / `locationCountry` | LinkedIn / team page | |
| `notes` | — | leave empty; context belongs in the note |

A person is always filed **at a firm**. If you can't establish their current firm, they don't go in —
the card becomes a question, or the row goes under "Not filed".

### Contact search

Required for every person on a card (`${CLAUDE_PLUGIN_ROOT}/references/house-rules.md` §5). Write down where you looked: that list is the
card's `not found — searched: …`.

1. **LinkedIn**, always: web search `"<full name>" "<firm>" site:linkedin.com/in`, the team page's
   LinkedIn links, the person's own site. Take a profile only when firm, title and city match. A
   person with no LinkedIn line is an unfinished card.
2. **Work email**, stopping at the first that gives one:
   1. the firm's team or contact page, a press release naming them as contact, or an address the
      person publishes themselves;
   2. an enrichment connector, if connected: Hunter (domain + name → find, then verify), Apollo or
      Clay. Reported **deliverable / valid** → may be filed `verified`, naming the tool;
      otherwise `unverified`;
   3. **pattern inference**, only when at least one real, published address at the firm's own domain
      shows the pattern (`sarah@kiln.vc` on kiln.vc/team → `james@kiln.vc`). Filed `unverified`;
      the card and profile note say `pattern from sarah@kiln.vc (kiln.vc/team)`. No published
      address, or two that disagree → no email.
3. **X / Twitter**: linked from their site, the team page or LinkedIn.
4. **Work phone**: the firm's contact page, a work number they publish, enrichment.
5. **Location**: LinkedIn, the team page.

From the user's own input (an email signature, a card they pasted) → `verified`. Every value filed
carries one line in the person's `sources` saying where it came from. Never a personal address
(gmail.com, outlook.com…; the server refuses a personal-mailbox email) or a personal number.

## Provenance: the profile note

Every new firm (and every firm you enrich) gets one admin-only **profile note**, linked to the firm,
listing where each field came from. It is how a later reviewer checks a value without redoing the work.

```
Profile researched 7 Oct 2026 for <card 1: Quarry Lane Fund II signal | import of "climate-vcs.csv">.

- Website, HQ, description, stages, leads rounds: https://quarrylane.vc/about
- Fund size (Fund II, €80m ≈ $87m → $50M to $200M): https://quarrylane.vc/news/fund-ii
- Industries, notable investments: https://quarrylane.vc/portfolio
- Investor type: https://www.linkedin.com/company/quarry-lane-ventures
- Not found: climate investments, parent company, software only.
- Elena Varga — General Partner (team page), Vienna (LinkedIn): https://www.linkedin.com/in/…
  Email elena@quarrylane.vc (unverified): listed on https://quarrylane.vc/team
  X @elenavarga: linked from her LinkedIn · Phone: not found (searched quarrylane.vc/contact, Hunter)
- Tomas Novak — Principal (team page), Prague (LinkedIn): https://www.linkedin.com/in/…
  Email tomas@quarrylane.vc (unverified): pattern first@, from elena@quarrylane.vc on
  https://quarrylane.vc/team · X: not found (site, LinkedIn) · Phone: not found
- New tag proposed and created on approval: "Industrial AI" (industry, under AI & data) — https://quarrylane.vc/thesis
```

## Existing firms: filling gaps, not rewriting

When a firm is already in Yellowtail:

- **Empty fields** you found a source for → propose filling them.
- **A filled field that disagrees with the source** → propose the change as its own ⚠ line,
  `old → new`, with the source. Never overwrite silently; the catalog was hand-cleaned.
- **Tags**: add what a source states. Remove only on explicit evidence ("we no longer invest in…"),
  as its own line. Never remove a tag because you didn't find it mentioned.
