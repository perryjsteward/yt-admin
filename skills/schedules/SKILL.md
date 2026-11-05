---
name: schedules
description: Yellowtail Admin — the desk only (platform admins). The desk's recommended scheduled tasks - daily prospecting, lead enrichment and signal scan, and hourly order fulfilment - with the exact prompt, cadence and order for each, and sets them up in whatever scheduler this client has (a Claude Desktop scheduled task, a Claude Code cloud routine or loop), or lists them to add by hand. Also reports how yesterday's runs went from the research log. Use when someone says "set up the schedules", "what should run daily", "schedule the desk", "are the daily runs working", or after installing yt-admin.
argument-hint: "[--status]"
---

# /schedules

A plugin cannot start a schedule by itself: it ships skills, and a schedule belongs to the client
that runs them (Claude Desktop's scheduled tasks today, a cloud routine later). This skill is the
desk's one place for what should run and when, and it sets each one up where it can.

Read `${CLAUDE_PLUGIN_ROOT}/references/house-rules.md` §2 (the desk's scheduled research) first.

## The schedule

| Task | Prompt | When | What it does |
| --- | --- | --- | --- |
| Orders | `/yt-admin:fulfil-orders --deliver` | hourly | Builds and delivers each open order's List of 200 |
| Prospecting | `/yt-admin:prospecting --unattended` | daily, 06:00 | New investor firms (and their people) for the next 5 paying projects |
| Lead enrichment | `/yt-admin:lead-enrichment --unattended` | daily, 07:00 | Public details for the next 25 firms and 25 people; enrichment connectors and Lemlist for the rest |
| Signal scan | `/yt-admin:signal-scan --unattended` | daily, 08:00 | The next 50 subscribed customers' investors scanned (LinkedIn and X through Apify when connected); 1–2 signals each, published |

Run them in that order on a day: prospecting files new firms, enrichment fills them in, the scan
reads them. Times are the desk's local time; nothing customer-facing depends on them. Weekdays only
is fine for all three daily runs if the machine sleeps at weekends: the queues pick up where they
stopped.

Every daily run needs:

- the **Yellowtail Admin** connector (`/api/mcp/admin`) signed in as a platform admin, with writes
  allowed;
- **web search and fetch** in the client;
- for Lemlist, `LEMLIST_API_KEY` set on the Yellowtail server (`docs/SETUP.md`); without it
  `/lead-enrichment` uses the web and any enrichment connectors, and says so.

And, optional but worth it, connected **in the client that runs the schedule**
(`${CLAUDE_PLUGIN_ROOT}/references/research-connectors.md` §1):

- **enrichment connectors** (Apollo, Lemlist, Clay, Hunter or another) for `/lead-enrichment` and
  `/prospecting`;
- **Apify** for `/signal-scan`: LinkedIn and X posts in bulk, about 10 actor runs a day at the
  default batch.

## Steps

1. **Who.** `whoami`: a platform admin with a write key, or stop and say these are the desk's.
2. **What is connected.** Note which enrichment connectors are in this session, and whether Apify
   is (`research-connectors.md` §1); they must also be connected wherever the schedule will run.
3. **`--status`**: for each daily task, `list_research_checks { kind, since: <yesterday 00:00> }`
   — how many subjects were checked and how many found something — and `list_research_queue` for
   what is next. A task with no checks since yesterday has not run: say so first.
4. **Set them up.** Look at what this client can do, and use the first that applies:
   - **A scheduling tool is available** (Claude Desktop's scheduled tasks, or Claude Code's
     `/schedule` for a cloud routine): offer each task in the table as one item, "set up all four"
     as the default, and create the approved ones with the prompt and cadence exactly as written.
     Name each "Yellowtail · <Task>".
   - **Claude Code in a terminal** with no cloud routine: `/loop 1h /yt-admin:fulfil-orders
     --deliver` keeps orders moving while the session is open; the daily runs are better as a
     Desktop scheduled task or a cloud routine, so say so.
   - **Nothing to schedule with**: show the table and how to add each in Claude Desktop (Scheduled →
     New task → paste the prompt → set the time), on a machine that stays awake.
5. **Report** what was created, what was already there, and what needs a person (a connector to
   sign in, `LEMLIST_API_KEY`, an enrichment connector or Apify to connect).

## Output

Display: inline — the schedule table above, then one line per task: created, already set up, or what it needs (`${CLAUDE_PLUGIN_ROOT}/references/display.md` §2). `--status` adds yesterday's checks and finds per task.

```
**Desk schedules** · 4 scheduled tasks
Orders · hourly · already set up
Prospecting · daily 06:00 · created
Lead enrichment · daily 07:00 · created · Apollo connected · Lemlist not set up
Signal scan · daily 08:00 · created · Apify not connected (web only)
```

## What comes next

- `/schedules --status` tomorrow to see that each ran; `/catalog-hygiene` to review what
  `/prospecting` auto-filed.
