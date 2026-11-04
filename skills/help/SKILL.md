---
name: help
description: Yellowtail Admin — what the desk plugin does and which command to run. Routes a question about orders, founder invites, signal intake, deal backfills, catalog clean-up, tag backfills, or the daily prospecting, enrichment and signal runs to the right command, and points customer work at the yt plugin. Use when someone on the team says "help", "what can yt-admin do", or "which command for…".
---

# /help

Yellowtail Admin is the Yellowtail team's desk: it runs on the **Yellowtail Admin** connector
(`/api/mcp/admin`, platform admins only). Customer work — a founder's round, lists, pipelines,
outreach — is the `yt` plugin (Yellowtail Club); the managed service's practice is `yt-raise`.

## Commands

| Ask for | Command |
| --- | --- |
| Work the order queue: build and deliver each paid project's List of 200 | `/fulfil-orders` |
| Invite a founder you met to make a free account, after checking the catalog fits them | `/invite-founder` |
| Turn event notes, posts, transcripts or a CSV into reviewed signals and firms | `/signal-intake` |
| Signals from investors' deals announced in the last 90 days | `/backfill-deal-signals` |
| Duplicate firms and people across the catalog, and the firms filed unreviewed | `/catalog-hygiene` |
| Find the firms that should carry a new tag, and retag them on approval | `/tag-backfill` |
| New investors (and their people) for paying customers, daily | `/prospecting` |
| Fill in missing websites, LinkedIns, emails and phones across the catalog, daily | `/lead-enrichment` |
| Signals for subscribed customers' investors, daily | `/signal-scan` |
| Set up the daily and hourly runs, or check they ran | `/schedules` |

Not here: a customer's own project is `/yt:crm-hygiene`; research a firm with `/yt:create-investor`.

## Output

Display: inline — a short answer naming the command, no card (`${CLAUDE_PLUGIN_ROOT}/references/display.md` §2).
