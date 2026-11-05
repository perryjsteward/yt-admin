---
name: help
description: Yellowtail Admin — what the desk plugin does, how it works and which command to run. Routes a question about orders, founder invites, signals (intake, the daily scan, deal backfills), catalog clean-up, tag backfills, or the daily prospecting and enrichment runs to the right command; explains the daily schedule, which connectors it needs (Yellowtail Admin) and which make it better (Apollo, Lemlist, Clay, Hunter, Apify); and points customer work at the yt plugin. Use when someone on the team says "help", "what can yt-admin do", "how does the daily research work", "what should I connect", or "which command for…".
argument-hint: "[a question, or: commands | daily | connectors]"
---

# /help

Yellowtail Admin is the Yellowtail team's desk: it runs on the **Yellowtail Admin** connector
(`/api/mcp/admin`, platform admins only). Customer work — a founder's round, lists, pipelines,
outreach — is the `yt` plugin (Yellowtail Club); the managed service's practice is `yt-raise`.

Answer the question asked from the sections below, naming the command. With no question, show
**Commands**, then one line each for **The daily research** and **Connectors**, and offer either.

## Commands

| Ask for | Command |
| --- | --- |
| Work the order queue: build and deliver each paid project's List of 200 | `/fulfil-orders` |
| Invite a founder you met to make a free account, after checking the catalog fits them | `/invite-founder` |
| Turn event notes, posts, transcripts or a CSV into reviewed signals and firms; import a list of investors | `/signals intake` |
| Scan subscribed customers' investors for new signals, daily | `/signals scan` |
| Signals from investors' deals announced in the last 90 days | `/signals backfill` |
| Duplicate firms and people across the catalog, and the firms filed unreviewed | `/catalog-hygiene` |
| Find the firms that should carry a new tag, and retag them on approval | `/tag-backfill` |
| New investors (and their people) for paying customers, daily | `/prospecting` |
| Fill in missing websites, LinkedIns, emails and phones across the catalog, daily | `/lead-enrichment` |
| Set up the daily and hourly runs, or check they ran | `/schedules` |

One command per area, with actions inside it: `/signals` is intake, scan and backfill. Its name
alone works too; it picks the action from what you give it.

Not here: a customer's own project is `/yt:pipeline hygiene`; research a firm with `/yt:investors research`.

## The daily research

Four runs keep the catalog growing and the feed fresh. Each takes its next batch from a queue in
Yellowtail and records what it checked, so tomorrow starts where today stopped.

| When | Run | Does |
| --- | --- | --- |
| hourly | `/yt-admin:fulfil-orders --deliver` | builds and delivers each open order's List of 200 |
| 06:00 | `/yt-admin:prospecting --unattended` | new investor firms and their people for the next five paying projects |
| 07:00 | `/yt-admin:lead-enrichment --unattended` | websites, LinkedIns, emails and phones for the next 25 firms and 25 people |
| 08:00 | `/yt-admin:signals scan --unattended` | the next 50 investors scanned, 1–2 signals each published |

`--unattended` writes without cards because nobody is there to approve: only clean dry runs,
existing tags, empty or unverified fields, at most two signals a firm (house rules §2). Run by
hand without it, each shows cards first. A plugin cannot start a schedule itself: `/schedules` sets
them up in Claude Desktop's scheduled tasks or a Claude Code cloud routine, and `/schedules
--status` shows how yesterday's went.

## Connectors

| Connector | Needed for | Without it |
| --- | --- | --- |
| **Yellowtail Admin** (`/api/mcp/admin`, as a platform admin) | everything | nothing runs |
| Web search and fetch (in the client) | all research | nothing to research with |
| **Apollo**, **Lemlist**, **Clay**, **Hunter** or another enrichment connector | `/lead-enrichment`, `/prospecting`, `/signals intake`: work emails, phones and LinkedIns the web did not give; verified emails | the web, then Yellowtail's own Lemlist key |
| `LEMLIST_API_KEY` on the Yellowtail server | the last fallback for contact details | the web and any connectors only |
| **Apify** | `/signals`: LinkedIn and X posts of firms and partners in bulk, pages that need a browser, news search | web search reads LinkedIn and X less well |

The desk's runs find what is connected and use it in a set order (the web first, always), within a
budget per run (`--enrich-max`, `--apify-max`), and say in the report what they used. Connect them
in claude.ai or Claude Desktop under Settings → Connectors, and in the client that runs the
schedule. Apify only reads public data: never our login, never an actor that messages or connects.
The detail is `${CLAUDE_PLUGIN_ROOT}/references/research-connectors.md`.

## Output

Display: inline — a short answer naming the command, no card (`${CLAUDE_PLUGIN_ROOT}/references/display.md` §2).
