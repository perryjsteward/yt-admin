# Changelog

## 0.4.0

- **`/signals`, one command for signals** (Perry, 5 Nov 2026), replacing `/signal-intake`,
  `/signal-scan` and `/backfill-deal-signals`: fewer skills that each do more, with the detail in
  references read only for the action being run. `/signals intake`, `/signals scan` and `/signals
  backfill` (or `/signals` alone, which picks the action from what it is given). The three
  procedures are unchanged, now `skills/signals/references/intake.md`, `scan.md` and
  `backfill.md`, beside the references `/signal-intake` had.
  - **Scheduled tasks**: the daily scan's prompt is now `/yt-admin:signals scan --unattended`.
    Re-run `/schedules` (or edit the "Yellowtail · Signal scan" task) after updating.
  - House rules §2 still names `/yt-admin:signal-scan`: it is shared byte-for-byte with `yt` and
    `yt-raise`, and changes with them.
- **`/help` explains the desk**, not only the commands: the daily research and its schedule, what
  `--unattended` may write, and which connectors are needed (Yellowtail Admin) and which make the
  runs better (Apollo, Lemlist, Clay, Hunter, Apify).

## 0.3.0

- **Research connectors** (Perry, 5 Nov 2026): a new desk reference,
  `references/research-connectors.md`, for finding which extra connectors a session has and using
  them. It is not one of the references shared with `yt` and `yt-raise`.
  - **Enrichment connectors**: `/lead-enrichment` uses whatever the client has connected (Apollo, a
    Lemlist connector, Clay, Hunter or another) after the public web and before Yellowtail's own
    Lemlist key (`enrich_person`). It keeps only matches whose firm and role agree with the record,
    files `verified` only for an email the provider reports deliverable or verified, and names the
    provider in each value's source. `--web-only` and `--enrich-max` (a budget across every
    provider) replace `--no-lemlist` and `--lemlist-max`, which still work. `/prospecting` and
    `/signal-intake` follow the same order.
  - **Apify**: `/signal-scan` reads the LinkedIn and X posts of firms and their partners in bulk
    through Apify actors, one LinkedIn and one X run per group of ten firms (`--apify-max`, default
    10; `--no-apify`), and falls back to the web. Actors read public data only: never a login,
    cookie or session of ours, never an actor that messages, connects, likes or follows. Each
    research check records the actor and run, so the desk can pin its choices in the reference's
    **Pinned actors** table. `/signal-intake` and `/backfill-deal-signals` may use Apify too.
- `/schedules` lists the enrichment connectors and Apify as optional for the daily runs. They must
  be connected in the client that runs the schedule.

## 0.2.0

- **`/tag-backfill`** (Perry, 4 Nov 2026): after a new tag, find the catalog's firms that should
  carry it, check each against its own description and portfolio, and retag in batches of about 15
  on approval. Moved from `yt`'s `/create-investor`, where it was offered to platform admins only:
  a desk process does not ship in the customer plugin, even behind an admin check.
- `/catalog-hygiene` points at `/yt:create-investor` by its full name.
- **The desk's daily research, built to run on a schedule** (Perry, 4 Nov 2026), each taking its
  next batch from a queue in Yellowtail and recording what it checked, so tomorrow starts where
  today stopped:
  - **`/prospecting`**: new investor firms, with their partners and public contact details, for the
    next five paying projects, researched in up to five parallel groups by shared interests, so
    every project in the batch gets at least one new investor. Files to the global catalog with
    `Auto-filed by /prospecting, unreviewed`.
  - **`/lead-enrichment`**: the next 25 firms (website, LinkedIn) and 25 people (email, LinkedIn,
    phone, X), emptiest first, then unverified details checked again; the public web first, Lemlist
    for what it did not give.
  - **`/signal-scan`**: the next 50 investors within subscribed customers' interests, scanned across
    filings, LinkedIn and X, blogs, press, podcasts and events; one or two signals each, published.
  - **`/schedules`**: sets the three up with `/fulfil-orders` in the client's scheduler (a plugin
    cannot start a schedule itself), or reports how yesterday's runs went (`--status`).
- House rules §2: the desk's scheduled research is the fourth exception to cards, run with
  `--unattended` only, and what it may and may not write.
- `/catalog-hygiene` lists firms auto-filed by `/prospecting` as well as `/find-investors`.
- New tools on the Yellowtail Admin connector: `list_research_queue`, `list_research_checks`,
  `get_research_check`, `create_research_checks`, `update_research_check`,
  `delete_research_check`, `enrich_person` and `get_enrichment` (Lemlist).
- The Yellowtail Admin connector now lists `delete_access_request` (it was documented but missing).
- **`/fulfil-orders` reads the buyer's targeting** (`get_order`'s `targeting`: raise size, lead, investor types, regions, a note) and builds the List to it within the frozen brief.
- The plugin contract now covers tools named `enrich_`, `publish_`, `send_` and `resend_`.

## 0.1.0

- First release (Perry, 4 Nov 2026): the desk split out of the customer plugin, on the Yellowtail
  Admin connector (`/api/mcp/admin`, platform admins only). `/fulfil-orders` and `/invite-founder`
  from `yt` 0.9.0; `/signal-intake` and `/backfill-deal-signals` from `yt-raise` 0.13.2;
  `/catalog-hygiene` from `yt`'s `/crm-hygiene --catalog`; and `/help`.
