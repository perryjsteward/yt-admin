---
name: fulfil-orders
description: Yellowtail Admin — Work the order queue. A customer who buys their investor list or the licence gets an order due in 48 hours. Research runs write the investor profile from the brief and targeting, build a pool from the catalog and fresh web research, score every firm, check each three ways (fit, live, contacts) with a separate verifier, find 2-3 people per firm with verified contacts (Hunter, Lemlist), the firm's website, LinkedIn, X, email and phone, a firm and a person signal, and a note on why each fits - and put it all in a review spreadsheet (xlsx, and a Google Sheet when Drive is connected), writing nothing to Yellowtail. A person marks each row approve, drop or hold and edits what is wrong; then --upload files only the approved rows, fills the customer's List of 200+ with their notes and delivers the order, which emails the customer. About $10 of model spend an order. Use for "fulfil orders", "deliver order 1001", "upload the order sheet", "work the order queue", or a scheduled task.
argument-hint: "[order number] [--upload] [--all] [--deliver] [--check] [--batch N]"
---

# Fulfil orders

An **order** is a customer paying for their investor list (`offer: list`, a one-off) or the annual
licence (`offer: licence`) for one project (the app: Sales › Orders). Paying unlocks every investor
that fits the project at once. Then the desk owes them a **List** in that project: at least
`targetFirms` (200 unless the desk set otherwise) investors that fit their brief best, each checked,
with two or three people to write to and a note saying why it is there, **within 48 hours**
(`dueAt`). Marking the order delivered with that List emails the customer a link to it.

This is the most valuable thing the desk makes, and the customer pays for its quality: killer
investors and data that is true today, for about $10 of model spend an order. It runs in two
halves with a person in between (Perry, 15 Nov 2026):

1. **Research** (steps 1–10, by hand or hourly): find, check and write up the firms in a **review
   sheet**. Nothing is written to Yellowtail but the order's status, its desk note and the research
   log.
2. **A person reviews the sheet**: approve, drop or hold each firm, fix anything wrong.
3. **Upload** (`--upload`, steps U1–U7): file exactly what was approved, fill the List, deliver.

Read, before anything else:

- `${CLAUDE_PLUGIN_ROOT}/references/house-rules.md` — every rule; §5 for contact details.
- `${CLAUDE_PLUGIN_ROOT}/skills/fulfil-orders/references/research-standard.md` — the bar: the
  investor profile, where candidates come from, the scorecard and red flags, the three checks,
  what each firm carries, the two signals and the note.
- `${CLAUDE_PLUGIN_ROOT}/skills/fulfil-orders/references/verification.md` — the dossier and the
  verifier.
- `${CLAUDE_PLUGIN_ROOT}/skills/fulfil-orders/references/review-sheet.md` — the sheet's tabs and
  columns, where it lives, how a reviewer marks it, and what `--upload` does with it.
- `${CLAUDE_PLUGIN_ROOT}/skills/fulfil-orders/references/budget.md` — **$10 of model spend per
  order of 200**: Haiku reads the web, Sonnet runs the order, the caps (200 searches, 260 firms
  researched, 10 spot-checks), the light path for complete catalog firms, and how spend is counted.
- `${CLAUDE_PLUGIN_ROOT}/skills/signals/references/research-an-investor.md` — how a firm's fields
  and tags are filled, and `what-is-a-signal.md` beside it.
- `${CLAUDE_PLUGIN_ROOT}/references/research-connectors.md` — the enrichment connectors.

## Arguments

- **order number** (`1001`): that order only. Without one, the open queue, soonest due first.
- `--upload`: the second half for that order: read the reviewed sheet and file what it approves.
- `--all`: every open order in this run. Without it, one order per run.
- `--deliver`: with `--upload`, deliver without asking once the List reaches its target and passes
  the final pass. **Unattended runs pass it.**
- `--check`: report the queue (number, customer, due, firms in the sheet, approved, on the List)
  and write nothing.
- `--batch N`: the most firms to research and verify in this run (default 60). A run stops at the
  end of a batch so a scheduled run never outlasts its slot; the next run continues the same order.

## Tools

| Tool | Used for | Writes |
| --- | --- | --- |
| `whoami` | step 1: platform admins only | no |
| `list_orders`, `get_order` | steps 2–3: the queue, the order, its `brief`, `targeting`, `listId` | no |
| `update_order` | step 3 `in_progress`; steps 10 and U7 desk note; U3 `listId`; U7 `delivered` | yes |
| `get_project`, `list_tags`, `get_company_kind` | step 4: today's interests, the tag tree, the investor fields | no |
| `list_research_checks`, `create_research_checks` | steps 5 and 10: what earlier runs did, rejected and spent; this run's record | yes, the log |
| `list_prospects`, `list_companies`, `search_companies`, `get_company`, `search_people` | steps 6–7: the catalog's candidates and dedup | no |
| `list_signals` | step 7: signals already on file for each firm and person | no |
| `find_email`, `verify_email`, `domain_search`, `enrich_person`, `get_enrichment` | steps 7–8: people and their contact details | no |
| `create_file`, `update_file`, `search_files`, `read_file_content` | steps 9 and U1: the Google Sheet copy, when Google Drive is connected | yes, the sheet |
| `list_lists`, `create_list`, `get_list` | steps U3 and U6: the List | yes, the List |
| `file_investor` | step U4: approved new firms with their people; empty fields and new people on catalog firms | yes, dry run first |
| `file_signal` | step U4: approved signals | yes, dry run first |
| `add_many_to_list` | step U5: approved firms, with `primaryPersonIds` and `notes` (why it is here) | yes |
| `update_list_entry`, `remove_from_list` | step U6: a corrected note or primary; a firm that failed the final pass | yes |
| `show_results` | output: the order (`get_order`) | no |

## Research (steps 1–10)

1. **Platform admins only.** `whoami`; if `isPlatformAdmin` is false, say orders are the Yellowtail
   team's and stop.
2. **Find the work.** With a number, `list_orders` with `number`. Otherwise `list_orders` with
   `open: true`. Nothing open: say "No orders waiting" and stop. With `--check`, report and stop.
3. **Pick it up.** The first open order (each, with `--all`). Skip one `in_progress` and assigned to
   someone else unless it was named or is overdue: say who has it. Otherwise `update_order` with
   `status: in_progress` (it assigns you), then `get_order`. **An upgrade** (a licence order already
   delivered, its desk note naming the list order) has nothing to build: skip it. **A sheet whose
   Summary says `Ready to upload: yes`** goes to the upload (U1) instead, in a scheduled run too:
   that line is the reviewer's go-ahead.
4. **Write the investor profile** (research-standard §1) from the order's `brief` (frozen at
   purchase: prospect for those interests even if the project changed since; say so in the desk
   note if `get_project` differs) and the buyer's `targeting`, which narrows, never widens. Read
   the startup's website. Find its comparable startups and their investors. An empty brief (an old
   order) uses the project as it is. Never create a tag (house rules §12).
5. **Resume.** Open the review sheet if there is one (review-sheet.md § Where it lives): its firms
   are done, its Rejected firms and anything a reviewer dropped are not researched again.
   `list_research_checks` for the project gives earlier runs of this order (`details.order`), their
   rejections and the spend so far (`details.spend`, budget.md § Keeping count). The research is
   finished when the sheet holds `targetFirms` firms that are not dropped: go to step 10.
6. **Build the pool and score it** (research-standard §2–3): the catalog first (no searches: its
   data is already here), then the web with searches that each name many firms (budget.md), to
   about 1.3× what the sheet still needs. Score each candidate from what is known; drop gate
   failures and red flags with the reason. Rank the rest, and mark the catalog firms that take the
   light path (budget.md).
7. **Research the next batch** (`--batch`, best-ranked first): a dossier per firm
   (`verification.md`), with the firm's own details, its two or three people and every contact
   field (contact tools first), the firm and person signals (reuse anything on file from the last
   six months first), and the note. **Haiku subagents, five firms each, in parallel**; at most one
   search per new firm and none for a catalog firm; known URLs fetched instead. Light-path firms are
   built from Yellowtail without research. This run reads the dossiers, never the pages.
8. **Verify the batch** with **Haiku verifier subagents** (`verification.md`), ten dossiers each,
   never the ones that researched them. PASS and fixed-and-rechecked firms go on; FAILs are rejected
   with the reason. Then a **Sonnet spot-check** of one passed firm in twenty (at most 10 an order).
   Check the batch against what is already in the sheet: the balance (research-standard §3), and no
   two notes the same text.
9. **Write the review sheet** (review-sheet.md): the batch's passing firms on **Firms**, their
   people on **People**, signals to file on **Signals**, rejections on **Rejected**, and refresh
   **Summary**. Append; never reorder or overwrite a row a person may have marked. Save the `.xlsx`
   and, with Google Drive connected, create or replace the Google Sheet. **Nothing is filed in
   Yellowtail here.**
10. **Record the run and say where it stands.** `create_research_checks` with one `prospecting`
    check for the project: `found` = firms added to the sheet this run, `summary` one sentence, and
    `details` `{ order: <number>, profile, sheet: <path and Google Sheet link>, inSheet: <count>,
    rejected: [{ name, companyId?, reason }], spend: { searches, researched, verified, spotChecks,
    runs } }` (spend is the order's running total). Then `update_order` with a `deskNote` keeping the
    old note and adding one line:
    - still researching: "15 Nov: +58 to the sheet (31 new, 27 catalog), 41 rejected; 176/200; 140
      searches";
    - research finished: "15 Nov: review sheet ready, 212 firms: <link>. Mark approve/drop/hold, then
      run /yt-admin:fulfil-orders <number> --upload, or set Ready to upload: yes on Summary." Say the
      same in the report, as the one thing a person needs to do.
    - short at a budget cap or with the pool exhausted (two rounds each keeping fewer than ten):
      stop researching, say so, and leave the sheet for review as it is: a person decides whether to
      deliver fewer, spend more, or widen the brief with the customer.
    - due within 12 hours and the sheet not reviewed: say so every run, so a person steps in.

## Upload (`--upload`, steps U1–U7)

U1. **Read the reviewed sheet** (review-sheet.md § What `--upload` does): the newer of the `.xlsx`
    and the Google Sheet. Show the counts first: approved, dropped, held, edited cells, and the rows
    it cannot read (listed and skipped). Fewer approved firms than `targetFirms`: say so and ask
    whether to upload them and keep researching for the rest (by hand), or stop (a scheduled run
    uploads what is approved and goes back to research for the difference).
U2. **Nothing unapproved.** Only rows marked `approve` are filed; an edited cell is the reviewer's
    value. `drop` rows go into this run's research check as rejected by the reviewer; `hold` rows wait.
U3. **The List.** If the order has a `listId`, keep filling it. Otherwise `list_lists` for the project
    (a stopped upload leaves one named for this order), else `create_list` named
    `Your top <targetFirms> investors`, described `Picked and checked by the Yellowtail team for
    order #<number>, <date>.`, and `update_order` with its `listId` at once.
U4. **File the approved firms**, in this order:
    - **New firm:** `file_investor` dry run with the firm (its fields, tags, attributes including
      `twitter_url`, `general_email`, `phone`), its approved people with sources and statuses, and a
      profile note whose first line is `Reviewed by <reviewer or "the desk"> for order #<number>`,
      then each value's source. Strong duplicates (house rules §4): use the existing firm only if
      its domain or LinkedIn match exactly; otherwise skip the row and report it.
    - **Catalog firm:** `file_investor` with `company: { id, fill }` for empty fields only, and its
      approved new people. A `verified` value is never overwritten; a reviewer's edit to a filled
      field is reported for the desk to change by hand, not forced.
    - **Signals:** `file_signal` dry run, then filed, for each approved signal.
U5. **Fill the List:** `add_many_to_list` in batches of up to 50, with `companyIds`,
    `primaryPersonIds` (each firm's primary from the sheet) and `notes` (each firm's "Why it's
    here", keyed by company id). Write the **Filed** column back to the sheet.
U6. **Final pass:** `get_list` and read it top to bottom as the customer will: every firm has its
    note and a primary contact with a way to reach them. Fix with `update_list_entry`; a firm that
    turns out wrong now is removed (`remove_from_list`) and reported.
U7. **Deliver, or say why not.**
    - **The List holds at least `targetFirms`:** write a `deliveryNote`, one honest line for the
      customer ("We picked 212 investors backing seed-stage industrial decarbonisation in the UK and
      Europe; each has a note on why, and the partner to write to."): no prices, no promise of
      investment, nothing internal. By hand, show the order and the List and ask "Deliver order #N
      and email <buyer> now?"; with `--deliver`, don't ask. Then `update_order` with `status:
      delivered`, the `listId`, the `deliveryNote` and a final `deskNote` line. Read `email`:
      `queued` is on its way; `disabled` means email is off on the server, so tell the user to email
      the customer themselves.
    - **Short:** don't deliver. The desk note says how many are on the List and what is next (more
      research, then another review).

## Running it on a schedule

Hourly, on **Sonnet 5.5** (it orchestrates; its subagents read the web on Haiku, budget.md), with the
Yellowtail Admin connector signed in as a platform admin, and Google Drive connected so the sheet can
be reviewed from anywhere:

- **Claude Desktop:** a scheduled task with the prompt `/yt-admin:fulfil-orders --deliver`, on a
  machine that stays awake.
- **Claude Code:** `/loop 1h /yt-admin:fulfil-orders --deliver`, or `/schedule` for a cloud routine.

The research takes about three to five runs (60 firms a run) and about $10, then the order waits for
its review. Once the reviewer sets `Ready to upload: yes` on the sheet's Summary, the next run
uploads and delivers. Allow time for the review inside the 48 hours: the research should finish in
the first day.

## Output

Display: inline — per order: its number, customer and project, the sheet against the target (or,
after an upload, the List against it), this run's firms added to the sheet (catalog, new, light
path), rejected with the top reasons, emails verified, signals reused and found, the order's spend
against its caps, the sheet's link, and the one thing a person needs to do next; after an upload,
what was filed, skipped and why, and whether it was delivered and the email queued. One
`show_results` card for the order (`get_order`). A scheduled run with nothing to do says only "No
orders waiting".

## What comes next

- A person reviews the sheet, then `/yt-admin:fulfil-orders <number> --upload` (or `Ready to upload:
  yes` for the scheduled run).
- The customer gets "Your investor list is ready", which opens the List with each firm's note.
- An order left short is on Sales › Orders for a person to decide.
