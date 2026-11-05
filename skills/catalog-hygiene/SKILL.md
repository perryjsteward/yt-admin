---
name: catalog-hygiene
description: Yellowtail Admin — the desk only (platform admins). Sweep the whole investor catalog for duplicate firms and people, propose merge cards with a dry run first, and list the firms /find-investors and /prospecting filed unreviewed. Its only write is merge_companies, on approval. Use when someone on the team says "clean up the catalog", "catalog duplicates", "merge duplicate firms", "what did find-investors or prospecting auto-file", or before a catalog export.
argument-hint: "[kind, default investor]"
---

# /catalog-hygiene

The whole catalog, not one project: customers' `/yt:crm-hygiene` reports duplicates it can't fix,
and this is where they get fixed. It reads every firm of a kind, groups the likely duplicates,
dry-runs each merge and merges on approval. It never deletes.

Read `${CLAUDE_PLUGIN_ROOT}/references/house-rules.md` first.

## Tools

| Tool | For | Required? |
| --- | --- | --- |
| `whoami` | `isPlatformAdmin` and a write key: stop otherwise | yes |
| `list_companies`, `list_people` | The sweep, every page (`nextCursor`) | yes |
| `search_companies` | Name-only groups: keep a match with `name_similar` at 0.8 or more | yes |
| `merge_companies` | The merge, `dryRun` defaulting to true | on approval |
| `search_notes`, `update_note` | The firms `/find-investors` and `/prospecting` filed unreviewed (step 8) | yes |

## Steps

Only when `whoami.isPlatformAdmin` is true; anyone else is told catalog hygiene is for the
Yellowtail team, and pointed at `/yt:crm-hygiene` for their own project.

1. **Read.** `list_companies { kind: "investor", limit: 100 }` (or the kind the user names),
   following `nextCursor` to the end, keeping id, name, `websiteUrl`, `linkedinUrl`, scope
   (`workspaceId` null = shared) and people count. Say how many were read.
2. **Group firms.** Same website domain (strip `www.` and the path), same LinkedIn company URL, or
   names that are near-identical once "Ventures / Capital / Partners / VC / LLP" and punctuation are
   set aside. For a name-only group, `search_companies { q: <name>, kind }` and keep it only where a
   match has `name_similar` at 0.8 or more; below that it goes under **Look-alikes, not merged**.
3. **Group people.** `list_people` for the same kind (`companyKind`), all pages: the same LinkedIn
   URL, the same email, or the same full name at the same firm (or at two firms in one group above).
4. **Pick the keeper** in each firm group: the shared-catalog one over a workspace copy (the tool
   requires it), then the one with more people, deals and filled fields. Both must be the same kind.
5. **Dry run.** `merge_companies { keepId, mergeIds, dryRun: true, reason }` per group (`reason` in
   a sentence: "same website northwind.vc"). Show what would move: people, deals, signals, notes,
   tags unioned, fields filled.
6. **Cards**, one per group, then on approval `merge_companies` with the same ids and
   **`dryRun: false`**. Report what moved and the kept firm's link.
7. **People.** There is no people merge tool. A duplicate person at a firm that was just merged
   often resolves itself (both now sit at the keeper: list them again). What is left is a checklist
   for the admin panel, with the keeper suggested; never `delete_person` from here.
8. **Unreviewed firms.** `search_notes { scope: "all", q: "unreviewed" }`, all pages, keeping the
   notes whose first line is `Auto-filed by /find-investors, unreviewed` or `Auto-filed by
   /prospecting, unreviewed`: the firms those filed without a card. Report the count and list them
   (firm, filed when, for which workspace) after the duplicates, each pointing at
   `/yt:create-investor` (enrich) or a merge if it is also in a group above. Checking one is
   enriching it; once it is right, `update_note` drops the first line. Read-only here.

## Output

Display: inline — one Yellowtail widget in the chat, merge cards under it (`${CLAUDE_PLUGIN_ROOT}/references/display.md` §2). Yellowtail's reads draw nothing on the way; this output is the one thing shown (§ Only the answer is drawn).

```
**Catalog duplicates** · investors · 1,214 firms read · 6 groups

### 1. Northwind Capital ← Northwind Capital Partners
- Keep: Northwind Capital (shared) · 4 people, 3 deals
- Merge: Northwind Capital Partners (Atlas Advisory's own) · 1 person, 1 deal
- Why: same website northwind.vc
- Dry run: moves 1 person, 1 deal (Fernway · Seed 2026), 2 notes; adds tag Sweden; fills LinkedIn

**Look-alikes, not merged** · "Lantern Ventures" (lanternvc.com) ↔ "Lantern Capital" (lantern.de), 0.74
**People to resolve in the admin panel** · Sarah Lee ×2 at Northwind Capital (same LinkedIn) → keep the one on 3 deals
**Unreviewed, auto-filed by /find-investors and /prospecting** · 14 firms · Kiln Climate (12 Oct, Atlas Advisory) · … → `/yt:create-investor` to check

Reply with any of: `approve all` · `approve 1` · `reject 1` · `1: keep the other one`
```

## Rules specific to this skill

- Never deletes or removes a person, and merges only after a dry run and an approval, keeper first.
- A merge needs evidence: a shared domain, LinkedIn URL or a near-identical name confirmed by
  `search_companies`. Look-alikes are reported, never merged.

## What comes next

- `/yt:create-investor` to enrich an unreviewed firm; `/signals intake` to file what you learned.
