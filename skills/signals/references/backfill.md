# /signals backfill

The `backfill` action of `/signals`: signals from investors' announced deals.

Yellowtail promises investors who are leaning into a founder's space **right now**, and a recent
announced deal is the plainest evidence of that. Most firms in the catalog have none on file. This
skill reads what each firm has announced in the last 90 days and turns each deal into a signal,
one reviewed card at a time.

Read `${CLAUDE_PLUGIN_ROOT}/references/house-rules.md` first, then `what-is-a-signal.md`
and `research-an-investor.md` (this folder). The filing rules are `intake.md`'s; this action only
feeds them a different input.

## Desk only

`whoami` first. If `isPlatformAdmin` is false or `key.canWrite` is false, stop: say this is a
Yellowtail desk skill that files to the shared catalog, that `file_signal` is refused for other
accounts, and that nothing was read or written. Note today's date: the 90-day window ends today.

## Tools

| Tool | For | Required |
| --- | --- | --- |
| `whoami` | Platform admin with a write key | yes |
| `get_company`, `search_companies` | Each firm: name, website, existing tags | yes |
| `search_signals` | `{ companyId, from, to, status: "all" }`: what is already filed for the firm, to skip duplicates | yes |
| `list_tags`, `create_tag` | Industry and stage tags by real id; a missing tag proposed and created on approval | yes |
| `search_companies` (kind `account`) | Whether the startup that raised is in Yellowtail (context only) | optional |
| `file_signal` | `dryRun: true` for every card, then filing the approved ones | yes |
| Web search / fetch | The firm's news and portfolio pages, press releases, tech.eu, Sifted, Crunchbase news | yes |
| Apify (connector) | The firm's and its partners' LinkedIn and X posts announcing deals, and its portfolio page when it needs a browser; one run per batch of firms (`${CLAUDE_PLUGIN_ROOT}/references/research-connectors.md` §3) | optional |

## Steps

### 1. The batch

- **Firm ids or names** from the desk: resolve each with `get_company` / `search_companies`;
  ambiguous → ask. Investors only (kind `investor`).
- **`--next`**: the priority set in `reports/1.7-signal-backfill-set.md` (in the repo; or pasted),
  in its suggested order, skipping firms that already have a signal dated in the last 90 days.
- **At most 10 firms per batch.** More → take the first ten and say which are left for the next run.

### 2. Research each firm

For each firm, the deals it **announced** between today − 90 days and today, from public sources in
this order: the firm's own news or blog page, its portfolio page (new entries with a date), the
startup's or firm's press release, then tech.eu, Sifted and Crunchbase news. For each deal record:

- the startup, the round (pre-seed, seed, Series A…), whether the firm **led** or **participated**;
- the **announcement date** as published (the page's date, not when you read it);
- the URL of the page that says it, and the channel it appeared in.

A deal with no dated public source is not proposed: list it under **Not proposed** with why. Never
use today's date, a month without a day, or the round's closing date guessed from elsewhere. A
date older than 90 days is outside the window and left out.

### 3. Skip what is filed

`search_signals` for the firm over the window (`{ companyId, from: <today − 90 days>, status:
"all" }`) and, for each deal, `q` with the startup's name. A signal about the same deal (same
startup and round, whatever its wording) → **skip**, and the report lists it as "already filed".

### 4. The cards

One card per deal, built for `file_signal` with `company: { id }` (the firm on file):

- `signal.type`: **the channel** it was announced in: `news` (press, tech.eu, Sifted, Crunchbase
  news), `blog` (the firm's own site), `linkedin` (a post). There is **no `deal` type**.
- `signal.occurredAt`: the announcement date, `YYYY-MM-DD`.
- `signal.summary`: `Led Heatloop's €4m seed round` or `Invested in Heatloop's €4m seed round`, then
  one sentence on the startup. Amounts only as the source states them.
- `signal.sourceUrl`: the page.
- `signal.tags`: at least one, all `positive`: the startup's **industry** and the round's **stage**,
  real ids from `list_tags`. A missing industry tag is proposed under **New tags (created on
  approve)** with its group as `parentId` (house rules §12).
- `sourceNote`: the verbatim sentence from the source and its URL.

Dry-run every card (`file_signal` with `dryRun: true`). Show only cards that pass; a refusal goes in
the report with the reason.

### 5. The batch report

```
Backfill batch 3 of ~10 · 10 firms · window 12 Jul – 10 Oct 2026
Firms: Quarry Lane (3 deals), Kiln Climate (2), Halcyon (0) …

### 1. Quarry Lane — Led Heatloop's €4m seed round · news · 2026-09-18
  Source: sifted.eu/articles/… (Sifted) · "Quarry Lane led the €4m round…"
  Tags: Energy (industry), Seed (stage) · dry run: ok
### 2. …

New tags (created on approve): industry · "Heat pumps" (parent: Energy) — card 1
Already filed (skipped): Kiln Climate — Juniper Series A (signal 2026-08-02)
Not proposed: Halcyon — portfolio page lists Brightwork, no date found
```

Approval replies as house rules §2. **Nothing is filed before approval.**

## On approval

Per approved card: `create_tag` for any approved new tag first (on `created: false`, use the
existing tag and say so), then `file_signal` with `dryRun: false`. Then the report: one line per
card with the signal and firm links (`/investors/{companyId}`), what was skipped, what failed and
why, and which firms of the set are left.

## What comes next

- `/signals backfill --next` for the next ten firms.
- `/signals intake` for anything found that isn't a deal (a thesis post, a partner move).

