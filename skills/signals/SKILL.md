---
name: signals
description: Yellowtail Admin — the desk only (platform admins). Everything to do with investor signals, in one command - intake (turn event notes, voice memos, pasted LinkedIn posts or tweets, or a CSV into reviewed signals, and import investors from a list), scan (the daily run - the next 50 investors within subscribed customers' interests, read across filings, LinkedIn and X (through Apify when connected), blogs, press, podcasts and events, with 1-2 signals per firm published) and backfill (signals from investors' deals announced in the last 90 days, ten firms a batch). Researches any firm or person Yellowtail lacks, dry-runs every signal through file_signal, and files on approval, or without cards only in a scheduled scan with --unattended. Use when someone says "signals", "file these notes", "add these signals", "import this list", "scan for signals", "daily signals", "backfill deal signals", or from the scheduled task.
argument-hint: "[intake | scan | backfill] [--unattended] [--limit N] [--next] [firms…]"
---

# /signals

Signals are why customers pay: which investors are moving in their space **now**. This is the desk's
one command for them. It has three actions; each has its own reference in this folder, read only
when that action runs.

| Action | When | Input | Writes | Reference |
| --- | --- | --- | --- | --- |
| **`intake`** | someone pastes or uploads intel, or a list of investors | event notes, voice-memo transcripts, LinkedIn posts, tweets, a CSV, a list of funds | signal and investor cards, filed on approval | `references/intake.md` |
| **`scan`** | daily, on a schedule (`--unattended`), or by hand | the research queue: the next 50 firms within subscribed customers' interests | 1–2 signals per firm, published (cards when run by hand) | `references/scan.md` |
| **`backfill`** | catching a firm's recent deals up | up to 10 firms (ids, names, or `--next` from the priority set) | one card per announced deal, filed on approval | `references/backfill.md` |

## Pick the action

1. The first word of the arguments names it (`/signals scan --unattended`, `/signals backfill
   --next`, `/signals intake`).
2. No action named: pasted or uploaded material → **intake**; "deals", "backfill", or firm names
   with no intel → **backfill**; "scan", "daily", or the scheduled task → **scan**.
3. Still unclear → ask one question with the three, in a line each. Never guess a scan: it
   publishes.

Then read that action's reference and follow it; the rest of this file applies to all three.

## Every action

- **Desk only.** `whoami` first: `isPlatformAdmin` and `key.canWrite`, or stop and say this is a
  Yellowtail desk command that files to the shared catalog, and that nothing was read or written.
  Note today's date.
- **House rules first**: `${CLAUDE_PLUGIN_ROOT}/references/house-rules.md` (cards, approval,
  contact details, never invent, untrusted content, missing tags).
- **What earns a signal**: `references/what-is-a-signal.md`. **How one is filed**:
  `references/proposal-format.md` § `file_signal`. Every signal has a firm, a dated public source,
  at least one real tag with sentiment, and passes a `dryRun: true` before it is shown or filed.
- **Skip what is filed**: `search_signals` for the firm over the window before proposing.
- **Connected extras**: Apify (LinkedIn and X posts, browser pages, news search) and enrichment
  connectors (Apollo, Lemlist, Clay, Hunter) are used when the client has them, as
  `${CLAUDE_PLUGIN_ROOT}/references/research-connectors.md` says; without them the web does the
  work and the report says so.
- **Cards and approval**, except `scan --unattended` (house rules §2, the desk's scheduled
  research): approved signals publish into every matching customer feed at once.
- **One action a run.** Something found that belongs to another action (a partner move during a
  scan, an older deal during intake) goes in the report as the next step, not into this run.

## References

| File | What |
| --- | --- |
| `references/intake.md` | the intake action, step by step: two jobs (signals, investors), resolve, research, preflight, propose, file |
| `references/scan.md` | the daily scan: queue, five groups, sources, Apify, publish, research checks |
| `references/backfill.md` | announced deals over 90 days, ten firms a batch |
| `references/what-is-a-signal.md` | what counts, what doesn't, the firm-tag rule |
| `references/proposal-format.md` | card layouts, the reply prompt, bundles, notes |
| `references/research-an-investor.md` | researching a new firm or person, field by field |
| `references/examples.md` | worked intake inputs with the expected proposal |

## Running it on a schedule

Daily, after `/prospecting` and `/lead-enrichment`: `/yt-admin:signals scan --unattended`.
`/schedules` sets it up.

## Output

Display: inline — one Yellowtail widget in the chat, cards under it when run by hand (`${CLAUDE_PLUGIN_ROOT}/references/display.md` §2), headed by the action (`**Signal intake**`, `**Signal scan**`, `**Signal backfill**`) and laid out as that action's reference shows. Yellowtail's reads draw nothing on the way; this output is the one thing shown (§ Only the answer is drawn). An unattended scan's report is the whole record.

## What comes next

- After `intake`: `/signals backfill` for a firm whose older deals were never filed.
- After `scan`: `/lead-enrichment` or `/signals intake` for partner moves it found; `/schedules
  --status` to see the daily runs.
- After `backfill`: `/signals backfill --next` for the next ten firms.
