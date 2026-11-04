# Yellowtail Admin (`yt-admin`)

The Yellowtail team's desk plugin. It runs on the **Yellowtail Admin** MCP connector
(`https://www.yellowtail.club/api/mcp/admin`), which answers platform admins only.

Customers never install this. They get **Yellowtail Club**: the `yt` plugin
(`perryjsteward/yt`) on the customer connector, `/api/mcp`. The managed service's practice is
`yt-raise` (`perryjsteward/yt-raise`), also on the admin connector.

| Command | What it does |
| --- | --- |
| `/help` | Which command for what |
| `/fulfil-orders` | Work the order queue; build and deliver each project's List of 200 |
| `/invite-founder` | Invite a founder to a free account after a catalog check |
| `/signal-intake` | Event notes, posts, transcripts or a CSV into reviewed signals and firms |
| `/backfill-deal-signals` | Signals from investors' announced deals |
| `/catalog-hygiene` | Duplicates across the catalog, merged on approval; unreviewed auto-filed firms |

Install alongside `yt`: these skills point at `/yt:` commands (`/yt:find-investors`,
`/yt:create-investor`) for the work they share with customers.

See INSTALL.md to install and release, and AGENTS.md for the rules of this repo.
