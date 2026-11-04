---
name: tag-backfill
description: Yellowtail Admin — the desk only (platform admins). After a new tag is made, find the firms across the catalog that should carry it, check each against its own description and portfolio, and propose retag cards in batches; it retags only on approval and never removes a tag. Use when someone on the team says "backfill this tag", "who else should be tagged Industrial AI", "retag the catalog for…", or after /yt:create-investor made a tag.
argument-hint: "<tag name or id>"
---

# /tag-backfill

A new tag is only as useful as the firms carrying it. Customers tag the firms they file as they
file them; going back over the whole catalog for one tag is the desk's job, and this is it. It
moved here from `/yt:create-investor` (Perry, 4 Nov 2026): a desk process never ships in `yt`.

Read `${CLAUDE_PLUGIN_ROOT}/references/house-rules.md` first (§12 on tags).

## Tools

| Tool | For | Required? |
| --- | --- | --- |
| `whoami` | `isPlatformAdmin` and a write key: stop otherwise | yes |
| `list_tags`, `get_tag` | The tag (by name or id), its kind and its parent | yes |
| `list_companies` | Candidates: firms carrying the parent tag, every page (`nextCursor`) | yes |
| `search_notes` | Candidates from research notes that use the tag's words (`scope: "all"`) | yes |
| `get_company` | Each candidate's description, `notable_investments` and site | yes |
| `file_investor` | The retag: `company: { id, tags }`, `dryRun` first | on approval |

## Steps

Only when `whoami.isPlatformAdmin` is true; anyone else is told backfilling a tag is for the
Yellowtail team. A customer who just made a tag retags the firms they are working on as they file
them (`/yt:create-investor`).

1. **The tag.** Resolve the argument with `list_tags` (or `get_tag` for an id): name, kind, parent.
   No parent → the candidates come from notes and the user's own suggestions only; say so.
2. **Candidates.** Firms carrying the parent tag: `list_companies { kind: "investor", tags: [parent
   id] }`, every page (a parent filter includes its children), dropping any that already carry the
   tag. Then `search_notes { scope: "all", q: <the tag's words> }` for firms whose research mentions
   it. Say how many candidates there are, and from where.
3. **Check each one** against the firm's own description and portfolio (`get_company`, its
   `notable_investments`, its site when they are thin). A tag goes on only with a sentence that
   supports it, and its source; "parent tag matches" is not a reason. Firms you cannot decide go
   under **Not enough to say**.
4. **Retag cards in batches of about 15**: one line per firm, `tags { add: [tag id] }` (the parent
   stays), with the reason and its source. Dry run each batch (`file_investor` with `company: { id,
   tags }`, `dryRun: true`; the firm's own `workspaceId` where it has one) and show anything it
   refuses.
5. **File on approval**, the same calls with `dryRun: false`. Then the next batch, until the
   candidates run out or the user stops.
6. **Report**: how many retagged, how many checked and left, the **Not enough to say** list, and a
   link to the investors filtered by the tag.

## Output

Display: inline — one Yellowtail widget per batch, retag cards under it (`${CLAUDE_PLUGIN_ROOT}/references/display.md` §2). Yellowtail's reads draw nothing on the way; this output is the one thing shown (§ Only the answer is drawn).

```
**Backfill Industrial AI** · industry · parent Deep tech · 84 candidates (79 by parent, 5 from notes) · batch 1 of 6

1. Kiln Ventures → + Industrial AI · "backs software for factories and supply chains" (kiln.vc/thesis) · dry run ok
2. Northwind Capital → + Industrial AI · 3 of 9 listed investments are manufacturing AI (Formic, Bright Machines, Instrumental) · dry run ok

**Not enough to say** · Lantern Ventures (deep tech generalist, no industrial portfolio named)

Reply with any of: `approve all` · `approve 1` · `reject 2` · `stop`
```

## Rules specific to this skill

- Adds the one tag, and nothing else: no other field, no removal, no new tag.
- Every retag carries the sentence and source that justify it; a parent tag alone never does.
- Cards and a dry run before every write; a batch is filed only on approval.

## What comes next

- `/catalog-hygiene` if the sweep turned up duplicates; `/yt:create-investor` to enrich a firm
  that was too thin to judge.
