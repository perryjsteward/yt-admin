---
name: help
description: Yellowtail Admin — what the desk plugin does and which command to run. Routes a question about orders, founder invites, signal intake, deal backfills or catalog clean-up to the right command, and points customer work at the yt plugin. Use when someone on the team says "help", "what can yt-admin do", or "which command for…".
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

Not here: a customer's own project is `/yt:crm-hygiene`; research a firm with `/yt:create-investor`.

## Output

Display: inline — a short answer naming the command, no card (`${CLAUDE_PLUGIN_ROOT}/references/display.md` §2).
