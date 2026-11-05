# Yellowtail Admin (`yt-admin`)

The Yellowtail team's desk plugin. It runs on the **Yellowtail Admin** MCP connector
(`https://www.yellowtail.club/api/mcp/admin`), which answers platform admins only.

Customers never install this. They get **Yellowtail Club**: the `yt` plugin
(`perryjsteward/yt`) on the customer connector, `/api/mcp`. The managed service's practice is
`yt-raise` (`perryjsteward/yt-raise`), also on the admin connector.

## The two connectors

| Connector | URL | Answers | Plugins |
| --- | --- | --- | --- |
| **Yellowtail Admin** | `https://www.yellowtail.club/api/mcp/admin` | platform admins only (403 for anyone else) | `yt-admin`, `yt-raise` |
| **Yellowtail Club** | `https://www.yellowtail.club/api/mcp` | customers (while `customer.mcp` is off, platform admins only) | `yt` |

Yellowtail Admin lists every Yellowtail Club tool plus the desk's: the global catalog, orders, join
invites, accounts, research queues and Lemlist enrichment, proposals and snapshots, and the
admin-only deletes. So these skills need only this connector, though they hand customer-side work to
`/yt:` commands, which is why `yt` is installed alongside.

## Install and connect

In Claude Code:

```
claude plugin marketplace add perryjsteward/yt-admin
claude plugin install yt-admin@yellowtail-admin
```

The plugin's `.mcp.json` brings the connector (server `yellowtail-admin`), so there is nothing to
configure: run `/mcp`, pick **yellowtail-admin**, choose **Authenticate**, and sign in to Yellowtail
with a platform admin account. In claude.ai or Claude Desktop, add it by hand: Settings → Connectors →
**Add custom connector**, name it **Yellowtail Admin**, paste the URL above, **Add**, **Connect**,
sign in and **Allow**. Ask Claude *"Who am I in Yellowtail?"*: `whoami` should say
`isPlatformAdmin: true`. Not a platform admin, every call is refused.

The scheduled research (`/prospecting`, `/lead-enrichment`, `/signals scan`, `/fulfil-orders`) runs
in a Claude Desktop scheduled task on a machine signed in to this connector: `/schedules` sets them
up. Connect any enrichment connectors (Apollo, Lemlist, Clay, Hunter) and **Apify** in that same
client too: the research skills find and use them, and run on the web alone without them
(`references/research-connectors.md`).

| Command | What it does |
| --- | --- |
| `/help` | Which command for what |
| `/fulfil-orders` | Work the order queue; build and deliver each project's List of 200 |
| `/invite-founder` | Invite a founder to a free account after a catalog check |
| `/signals` | Everything signals, one command: `intake` (event notes, posts, transcripts or a CSV into reviewed signals and firms), `scan` (daily: the next 50 subscribed customers' investors, LinkedIn and X through Apify when connected, 1–2 signals each published), `backfill` (investors' announced deals) |
| `/catalog-hygiene` | Duplicates across the catalog, merged on approval; unreviewed auto-filed firms |
| `/tag-backfill` | After a new tag, retag the catalog's firms that should carry it, on approval |
| `/prospecting` | Daily: new investor firms and their people for the next five paying projects |
| `/lead-enrichment` | Daily: public details for the next 25 firms and 25 people; enrichment connectors (Apollo, Lemlist, Clay, Hunter) for the rest |
| `/schedules` | Sets up the scheduled runs above, or shows how they went (`--status`) |

Install alongside `yt`: these skills point at `/yt:` commands (`/yt:find-investors`,
`/yt:create-investor`) for the work they share with customers.

See INSTALL.md to install and release, and AGENTS.md for the rules of this repo.
