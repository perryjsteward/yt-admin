# Worked examples

All names are fictional. Tag names are real Yellowtail tags as of Oct 2026 (focus: Climate Tech,
Deep Tech, Generalist; stages: Pre-seed, Seed, Series A, Series B+; industries in about twenty groups,
from the climate ones (Energy, Carbon, Food & agriculture…) to AI & data, Software, Fintech, Health,
Robotics & hardware and more, with children such as Batteries, Hydrogen, Grid management, Carbon
removal, Farm robotics; geography by country). Always re-read `list_tags` — don't
trust this list.

These double as the skill's test cases: run each against a local Yellowtail and compare.

---

## 1. Event notes (Apple Notes paste)

**Input**

```
founders forum 6/10
- sarah lee northwind - doing preseed climate now, hydrogen is dead for them, uk + sweden/norway
  her new partner raj (ex halcyon) - intro next wk!!
- mira @ lantern, deploying new fund, grid stuff + batteries, leads seeds ~£1.5m
- tom from kestrel - founder, hilarious, raising A
- chatted w Jonas, nice
```

**Resolution** (what the tools returned, in this example)

- Northwind Capital — matched; carries Hydrogen, Seed. Sarah Lee — matched, Partner.
- Raj Patel — one match, at Halcyon Ventures → job move.
- "Lantern" — two candidates (Lantern Ventures, Lantern Capital) → question.
- Kestrel — a startup, Tom a founder → not a signal.
- Jonas — no firm, nothing actionable → not filed.

**Expected proposal**

- **1. Northwind Capital is now backing pre-seed climate companies in the UK and Scandinavia, and has
  stopped investing in hydrogen** — Sarah Lee · high
  - Signal: + Climate Tech · + Pre-seed · + United Kingdom · + Sweden · + Norway · − Hydrogen
  - Firm: add Climate Tech, Pre-seed · **remove Hydrogen** (own line)
  - Source note
- **2. Raj Patel has joined Northwind Capital as a Partner** — medium (second-hand)
  - Signal: + Climate Tech
  - Person: moves Halcyon Ventures → Northwind Capital, title Partner
  - Source note
- **Needs your input — A.** Mira @ Lantern: Lantern Ventures or Lantern Capital? (Card held until
  answered; it will carry + Grid management · + Batteries · + Seed and the fund detail.)
- **Not filed**: follow-up "intro to Raj next week"; Tom (founder, not an investor); "chatted w
  Jonas" (nothing actionable).
- Asks nothing about the date: "6/10" with this year is 6 Oct 2026.

Things that must NOT happen: a card for Tom; "hilarious" anywhere in a signal; Sarah's card and
Raj's card sharing one source note; Lantern filed against a guessed firm.

---

## 2. A pasted LinkedIn post

**Input**

```
https://www.linkedin.com/posts/elena-varga_...
Elena Varga · General Partner at Quarry Lane Ventures
Thrilled to announce Quarry Lane Fund II — €80m for pre-seed and seed deep tech across
Central Europe. We'll lead, cheques €500k–€2m. Robotics, industrial AI, new materials. DMs open.
3d
```

**Resolution**: Quarry Lane Ventures — no match by name → research → its site is quarrylane.vc;
re-search by domain, still no match → new firm. Elena Varga — no match by name or LinkedIn → new
person, at Quarry Lane.

**Research** (what the web gave, in this example): site says "We lead pre-seed and seed rounds in
deep tech companies from Austria, Czechia, Poland, Slovakia and Hungary", HQ Vienna, team page lists
Elena as General Partner; the Fund II press release says €80m; portfolio page lists 14 companies.

**Expected proposal**

- **1. Quarry Lane Ventures closed an €80m Fund II to lead pre-seed and seed deep tech rounds in
  Central Europe** — Elena Varga · high
  - Signal (type `linkedin`, sourceUrl = the post, occurredAt = 3 days before today):
    + Deep Tech · + Pre-seed · + Seed · + Austria · + Czechia · + Poland · + Slovakia · + Hungary
    (the countries come from the firm's site, which names them; the post alone said "Central Europe")
  - Firm **(new investor, researched)**: quarrylane.vc · HQ Austria · LinkedIn page · description from
    the site · Early-stage VC · Deep Tech · Pre-seed, Seed · the five countries · fund size
    "$50M to $200M" (€80m ≈ $87m) · cheque $250K to $1M – $1M to $3M (€500k–€2m) · leads rounds: yes ·
    notable investments from the portfolio page · **Not found**: parent company, climate investments,
    software only
  - Person **(new)**: Elena Varga, General Partner — at Quarry Lane, with all five contact lines:
    LinkedIn (the post's author profile, unverified) · email from the team page if listed, else
    Hunter if connected, else `not found — searched: quarrylane.vc/team, /contact` (no published
    address at the domain, so no pattern) · X if linked · phone · Vienna, AT
  - Industry: robotics maps to the existing Robotics & hardware group (or a child of it that fits,
    from `list_tags { kind: "industry" }`). **New tags (created on approve)**: "Industrial AI" (under
    AI & data) and "New materials" (under Industry), each with the post's sentence and the near
    misses checked (Deep Tech is a focus, not a sector), only if the tree lacks them. On approval
    each is created with `create_tag` before the card is filed (`created: false` → the existing tag,
    said so in the report), and the signal and the firm carry them.
  - Source note: the post text and URL · Profile note: site, press release, portfolio, LinkedIn,
    and where each contact field was searched

Things that must NOT happen: the firm or person as separate cards needing their own approval; an
industry tag chosen because it was "close" to robotics; `climate_investments` set to "0" because no
climate companies were spotted (it was never counted — leave it empty); an email address for Elena
built from a "usual" pattern when no address at quarrylane.vc is published; a new tag created
before the card was approved, or a "Robotic" next to an existing "Robotics"; a person line with no
LinkedIn line.

`rawText` here is the post itself — it is already public, so it can go in the signal verbatim.

---

## 3. A CSV

**Input**: `leads.csv`

```
name,firm,note,date,link
Priya Shah,Ember Capital,"Moving upstream to Series A only, no more pre-seed",2026-09-30,
Dan Okafor,Ember Capital,"Joined as Principal from Fernway",2026-09-28,https://x.com/danokafor/status/1
Liu Wen,,"Great panel on carbon removal",2026-10-01,
```

**Top line of the proposal**: "Read `name` as person, `firm` as firm, `note` as the intel, `date` as
when, `link` as the source URL."

**Expected proposal**

- **1. Ember Capital now invests at Series A only and has stopped doing pre-seed** — Priya Shah
  - Signal: + Series A · − Pre-seed
  - Firm: add Series A (if missing) · remove Pre-seed (own line)
  - Source note: "CSV leads.csv, row 1" + the row
- **2. Dan Okafor has joined Ember Capital as a Principal** — Dan Okafor
  - Signal (type `twitter`, sourceUrl from `link`): tags = Ember Capital's focus tags
  - Person: new, or a job move from Fernway if he's found there
  - Source note: row 2
- **Not filed**: row 3 — speaking on a panel isn't an investment signal, and there's no firm. Even
  if it were a signal, a person with no firm can't carry one. Say so, so the user can add detail.

---

## 4. A person whose firm isn't given

**Input**

```
voice memo, Slush 2026 (19 Nov)
"...and Kofi Mensah, he said they're only doing Series A now, he's done with seed..."
```

**Resolution**: no firm in the input. `search_people` "Kofi Mensah" → no match. Research: LinkedIn
shows a Kofi Mensah, Partner at Tidewater Capital, London; a second Kofi Mensah is a founder. The memo
is about an investor, so it's the first — but that is an inference, and Tidewater isn't in Yellowtail.

**Expected proposal**: a **question**, not a card — "B. Kofi Mensah (Series A only, done with seed):
is this Kofi Mensah, Partner at Tidewater Capital (London)? Tidewater isn't in Yellowtail; if yes,
I'll research it and propose a card with the firm as a new investor."

Things that must NOT happen: a signal on Kofi with no firm; a card that creates Tidewater on the
strength of a name match the user hasn't confirmed.

---

## 5. A list of investors to add (Job B)

**Input**: `climate-vcs.csv`, 42 rows

```
Fund,Website,Partner,Partner LinkedIn
Northwind Capital,northwind.vc,Sarah Lee,https://www.linkedin.com/in/sarahlee
Brightwater Ventures,brightwater.vc,Anna Holm,https://www.linkedin.com/in/annaholm
Lantern,,Mira Osei,
...
```

**Triage first** (Yellowtail searches only, no web):

> Read `Fund` as firm, `Website` as website, `Partner` + `Partner LinkedIn` as one person per row.
> 42 rows: **30** already in Yellowtail with their partner, **9** new firms, **2** existing firms with
> a new partner, **1** unclear ("Lantern" — Ventures or Capital?). Shall I research the 9 new firms
> and add the 2 partners? I can also fill gaps in the 30 existing ones — 11 of them have no LinkedIn
> page or cheque sizes. Five cards per round.

**Then investor cards**, five per round, as in `proposal-format.md` § Investor cards. Each new firm is
fully researched; each existing firm shows only Fill / ⚠ Change / Tags lines.

Things that must NOT happen: web research on all 42 before the user has seen the split; an existing
firm's description rewritten because the new one "reads better"; a person filed without a firm.
