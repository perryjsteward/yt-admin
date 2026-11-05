# Proposal format

The proposal is plain markdown in the chat. It must read well on a phone: short lines, no tables wider
than three columns, no HTML.

## Layout

```
**Signals from Founders Forum, 6 Oct 2026** — 3 to file (1 with a new investor), 1 question, 2 not filed
<one line on how a CSV's columns were read, if the input was a CSV>

---

### 1. Northwind Capital is now leading pre-seed climate rounds
**Sarah Lee**, Partner · Northwind Capital · Founders Forum, 6 Oct · confidence: high
> "doing pre-seed climate now, not fintech anymore, wants UK + Nordics"

- **Signal** · tags: + Climate Tech · + Pre-seed · + United Kingdom · + Sweden · + Norway · − Fintech
- **New tag** · industry · "Fintech" — her words: "not fintech anymore" · near misses: none in
  industry (checked Fintech, FinTech, Financial services, Payments)
- **Firm** · Northwind Capital (existing): add Climate Tech, Pre-seed
- **Person** · Sarah Lee (existing, Partner at Northwind) · LinkedIn, email on file · add X
  @sarahlee_vc (northwind.vc/team) · phone not found — searched: northwind.vc/contact · London, GB (on file)
- **Source note** · summary + the excerpt above, linked to this signal

### 2. Raj Patel has joined Northwind Capital as a Partner
**Raj Patel** · Northwind Capital · Founders Forum, 6 Oct · confidence: medium
> "her new partner Raj, ex-Halcyon"

- **Signal** · tags: + Climate Tech
- **Person** · Raj Patel — **moves job**: Halcyon Ventures → Northwind Capital, title Partner
  LinkedIn on file · Email raj@northwind.vc (unverified; pattern from sarah@northwind.vc,
  northwind.vc/team) · X not found — searched: northwind.vc/team, LinkedIn · Phone not found —
  searched: northwind.vc/contact · Location London, GB (LinkedIn)
- **Source note** · linked to this signal

### 3. Brightwater Ventures is raising a €40m seed fund for Nordic energy software
**Anna Holm**, Founding Partner · Brightwater Ventures · Founders Forum, 6 Oct · confidence: high
> "anna holm brightwater - new fund, 40m, seed energy software nordics"

- **Signal** · tags: + Seed · + Energy · + SaaS · + Sweden · + Denmark · + Finland · + Norway
- **Firm** · Brightwater Ventures — **new investor**, researched:
  - brightwater.vc · HQ Sweden · linkedin.com/company/brightwater-vc
  - "Seed-stage fund backing Nordic software for the energy transition."
  - Type: Early-stage VC · Focus: Climate Tech · Stage: Seed
  - Industries: Energy, SaaS · Invests in: Sweden, Denmark, Finland, Norway
  - Leads rounds: yes · Cheque: $250K to $1M – $1M to $3M · Fund: not found (fund I unannounced)
  - Notable: Gridly, Voltframe, Heatloop
  - Not found: fund size, parent company, climate investments, software only
- **Person** · Anna Holm — **new**: Founding Partner at Brightwater
  - LinkedIn linkedin.com/in/anna-holm (unverified; brightwater.vc/team link)
  - Email anna@brightwater.vc (verified: Hunter, deliverable)
  - X @annaholm (linked from brightwater.vc/team)
  - Phone not found — searched: brightwater.vc/contact, Hunter
  - Location Stockholm, SE (LinkedIn)
- **Source note** · linked to this signal · **Profile note** · 4 sources, linked to the firm

---

**Needs your input**
- **A.** "Mira from Lantern" — two firms match: *Lantern Ventures* (London) and *Lantern Capital*
  (Berlin). Which one, or a new firm?


**Not filed**
- Follow-up for you: intro to Raj via Sarah.
- "Great dinner, Tom was hilarious" — not a signal.

---

Reply with any of: `approve all` · `approve 1 3` · `reject 2` · `2: <change>` · `3: investor only` · `A: <answer>`
```

### Card rules

- **Heading** is the signal's `summary` — the sentence that will appear in customers' feeds. If it
  reads badly here, it reads badly there.
- **Byline**: person (title if known), firm, source, confidence.
  - `high` — firm and person matched or researched exactly, the statement is explicit.
  - `medium` — the statement is second-hand or inferred ("her partner said…").
  - `low` — say why. Low-confidence cards are allowed, but consider a question instead.
- **Quote**: the slice of the input this card came from, verbatim, trimmed. This is how the user checks
  you didn't invent it.
- **Lines underneath**, only those that apply, always in this order: Signal, Firm, Person, notes. Mark
  every entity `(existing)`, **new**, or **moves job**.
- **Tags** always with `+` / `−`. Firm tag changes are listed separately from signal tags so the user can
  approve the signal but reject the retag (`1: no firm changes`).
- **New tag** line for a tag the source supports and `list_tags` lacks (house rules §12): kind, name,
  parent if any (an industry tag always names its group), the source sentence, the near misses
  ruled out, under **New tags (created on approve)**. It is created with `create_tag` when the card
  is approved, before the card is filed (`created: false` → the existing tag is used, and the report
  says so); `1: no new tag` doesn't create it and files the card without it. A new tag
  several cards want is proposed on the first and referred to on the others.
- **Every person** shows LinkedIn, email, X, phone and location, each with its status and source, or
  `not found — searched: <where>` (research-an-investor.md § Contact search). For an existing person,
  "on file" for what Yellowtail has; only new values are written.
- Don't print ids in the card — names only. Keep ids in your working state.

### A new firm or person inside a signal card

The profile sits under **Firm** / **Person**, indented, so the whole card is one approval: the signal
cannot be filed without its investor, and an investor approved on its own card while its signal was
rejected would be a decision the user never meant to make. If they want the investor without the
signal, that's `3: investor only`.

- One line per group, in this order: links + HQ · description · type/focus/stage · industries +
  geography · cheque/fund/leads · notable investments · **Not found:** the fields left empty.
- "Not found" is not optional. It is what tells the user the empty fields are deliberate.
- Fields that came from inference rather than a stated source are not shown — they aren't filed.
- When a new firm appears on several cards, show the profile on the first and write
  "Brightwater Ventures (**new** — see card 3)" on the others.

## Investor cards (Job B)

```
**Investors from "climate-vcs.csv"** — 4 new, 2 to enrich, 1 question; 31 already complete, skipped
Read `Fund` as firm, `Website` as website, `Partner` and `Partner LinkedIn` as one person per row.

---

### 1. Brightwater Ventures — new investor
- brightwater.vc · HQ Sweden · linkedin.com/company/brightwater-vc
- "Seed-stage fund backing Nordic software for the energy transition."
- Type: Early-stage VC · Focus: Climate Tech · Stage: Seed
- Industries: Energy, SaaS · Invests in: Sweden, Denmark, Finland, Norway
- Leads rounds: yes · Cheque: $250K to $1M – $1M to $3M
- Notable: Gridly, Voltframe, Heatloop
- Not found: fund size, parent company, climate investments, software only
- **People**
  - Anna Holm — **new**, Founding Partner
    LinkedIn linkedin.com/in/anna-holm (unverified; brightwater.vc/team link)
    Email anna@brightwater.vc (verified: Hunter, deliverable)
    X @annaholm (brightwater.vc/team) · Phone not found — searched: brightwater.vc/contact, Hunter
    Location Stockholm, SE (LinkedIn)
  - Erik Lund — **new**, Partner
    LinkedIn linkedin.com/in/erik-lund (unverified; web search, firm and title match)
    Email erik@brightwater.vc (unverified; pattern from anna@brightwater.vc, Hunter)
    X not found — searched: brightwater.vc/team, LinkedIn · Phone not found — searched: brightwater.vc/contact
    Location Stockholm, SE (LinkedIn)
- **Profile note** · 4 sources

### 2. Northwind Capital — fill gaps (existing)
- Fill: LinkedIn page · min cheque $250K to $1M · leads rounds: yes
- ⚠ Change: HQ United Kingdom → Ireland (northwind.vc/contact: "Dublin office, est. 2019")
- Tags: + Sweden · + Norway (northwind.vc/thesis)
- **People** · Sarah Lee (existing): all five on file, no change · Tom Reid — **new**, Associate
  (five contact lines as above)
- **Profile note** · 2 sources

---

Reply with any of: `approve all` · `approve 1` · `2: keep HQ as UK` · `reject 2`
```

- One card per firm. Its people are lines on that card; the user can drop one (`1: not Erik`).
- Enrichment shows only what would change: **Fill** (empty → value), **⚠ Change** (old → new, with the
  source, on its own line), **Tags** (`+` / `−`, removals on their own line).

## Bundles

What one approved card becomes. Built from your working state, not from the rendered card. Send the
same bundle with `dryRun: true` to preflight it before the card is shown.

### `file_signal`

```jsonc
{
  "dryRun": false,
  "company": { "id": "…" }                          // existing — required, one of these two
          // or { "new": <company profile>, "confirmNew": true }
  ,
  "companyChanges": {                               // optional; existing firm only, firm-level statements only
    "tags": { "add": ["tagId"], "remove": ["tagId"] }
  },
  "person": { "id": "…" }                           // existing, already at this firm
         // or { "id": "…", "update": { "roleTitle": "Partner", "moveToCompany": true } }   // job move to this card's firm
         // or { "new": <person profile>, "confirmNew": true }   // created at this card's firm
         // or omitted
  ,
  "signal": {                                       // omitted for `investor only`
    "type": "field_note",
    "occurredAt": "2026-10-06",
    "summary": "…",
    "rawText": "…",
    "sourceUrl": null,
    "tags": [{ "tagId": "…", "sentiment": "positive" }, { "tagId": "…", "sentiment": "negative" }]
  },
  "sourceNote": { "body": "…" },                    // with the signal
  "profileNote": { "body": "…" }                    // required when company or person is new
}
```

`file_signal` can't change an existing person's contact details (its `update` takes only `roleTitle`
and `moveToCompany`). A signal card that adds them — Raj's email in card 2 — files them with a second
call straight after the signal: `file_investor` with `company: { "id": <the card's firm> }` and
`people: [{ "id": …, "update": { <the new contact fields> } }]`, dry-run first like any bundle. A
**new** person on a signal card carries everything in their `new` profile.

The server links everything to the card's firm: a new person is created at it, `moveToCompany` moves an
existing person to it, and an existing person who works somewhere else with no `moveToCompany` is
refused — the bundle can't attach a person to a firm they aren't at.

### `file_investor`

```jsonc
{
  "dryRun": false,
  "company": { "new": <company profile>, "confirmNew": true }
          // or { "id": "…", "fill": { <only fields that are empty today> },
          //      "change": { <fields the user approved overwriting> },
          //      "tags": { "add": ["tagId"], "remove": ["tagId"] } }
  ,
  "people": [
    { "new": <person profile>, "confirmNew": true },
    { "id": "…", "update": { "roleTitle": "Partner", "email": "…", "emailStatus": "unverified",
                             "twitterHandle": "…" } }
  ],
  "profileNote": { "body": "…" }
}
```

### Profiles

```jsonc
// company profile — no kind: file_signal / file_investor file an investor
{
  "name": "Brightwater Ventures",
  "websiteUrl": "https://brightwater.vc", "linkedinUrl": "https://www.linkedin.com/company/brightwater-vc",
  "hqCountry": "SE", "description": "Seed-stage fund backing Nordic software for the energy transition.",
  "tagIds": ["…"],                                  // investor_type, stage, focus, industry (+ parents), geography,
                                                    // plus the id create_tag returned for an approved new tag
  "attributes": { "leads_rounds": true, "min_check": "$250K to $1M", "max_check": "$1M to $3M",
                  "notable_investments": "Gridly, Voltframe, Heatloop" }   // empty fields omitted, not null
}

// person profile — companyId is never sent; the server sets it to the card's firm
{
  "fullName": "Anna Holm", "roleTitle": "Founding Partner",
  "linkedinUrl": "https://www.linkedin.com/in/anna-holm", "linkedinStatus": "unverified",
  "email": "anna@brightwater.vc", "emailStatus": "verified",      // Hunter: deliverable
  "twitterHandle": "annaholm",
  // "phone": "+46 8 123 456", "phoneStatus": "unverified"       — when a source gives one
  "locationCity": "Stockholm", "locationCountry": "SE",
  "sources": { "linkedinUrl": "linked from brightwater.vc/team",  // one line per contact field filed
               "email": "Hunter: valid, score 96", "twitterHandle": "linked from her LinkedIn" }
}
// a field the search found nothing for is omitted; never "" and never a guess
```

## Notes

Both are admin-only, so they can hold context the public fields can't.

**Source note** — one per signal, linked to the signal, firm and person:

```
<One or two sentences: what we learned and why it matters.>

Source: <Founders Forum, 6 Oct 2026 — notes by Ben> | <LinkedIn post, URL> | <CSV "leads.csv", row 14>

> <the verbatim slice of the input this signal came from>
```

**Profile note** — one per researched firm (new or enriched), linked to the firm: where each field
came from and what wasn't found. Format in `research-an-investor.md` § Provenance.

## When an MCP App review card is available

If the server offers an interactive review tool (an MCP App), call it with the same cards instead of
rendering markdown, and treat what it returns exactly like a typed reply. The cards, bundles and rules
above don't change — only how they are shown.
