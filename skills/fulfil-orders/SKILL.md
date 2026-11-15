---
name: fulfil-orders
description: Yellowtail Admin — Work the order queue. A customer who buys their investor list or the licence gets an order due in 48 hours. This picks up the next open order (or the one named), writes the investor profile from the brief and the buyer's targeting, builds a pool from the catalog and fresh web research, scores every firm, has each checked three ways (fit, live, contacts) by a verifier that did not research it, finds 2-3 people per firm with verified contacts (Hunter, Lemlist) plus the firm's website, LinkedIn, X, email and phone, makes sure each has a recent firm and person signal (reusing ones on file), fills a List in the customer's project with the 200+ that pass, each noted with why it is there, and delivers the order, which emails the customer. Resumable; runs unattended hourly or by hand. Use for "fulfil orders", "deliver order 1001", "work the order queue", "any orders waiting", or a scheduled task.
argument-hint: "[order number] [--all] [--deliver] [--check] [--batch N]"
---

# Fulfil orders

An **order** is a customer paying for their investor list (`offer: list`, a one-off) or the annual
licence (`offer: licence`) for one project (the app: Sales › Orders). Paying unlocks every investor
that fits the project at once. Then the desk owes them a **List** in that project: at least
`targetFirms` (200 unless the desk set otherwise) investors that fit their brief best, each checked,
with two or three people to write to and a note saying why it is there, **within 48 hours**
(`dueAt`). Marking the order delivered with that List emails the customer a link to it.

This is the most valuable thing the desk makes, and the customer pays for its quality. Read, before
anything else:

- `${CLAUDE_PLUGIN_ROOT}/references/house-rules.md` — every rule; §5 for contact details.
- `${CLAUDE_PLUGIN_ROOT}/skills/fulfil-orders/references/research-standard.md` — the bar: the
  investor profile, where candidates come from, the scorecard and red flags, the three checks,
  what each firm carries, the two signals and the note.
- `${CLAUDE_PLUGIN_ROOT}/skills/fulfil-orders/references/verification.md` — the dossier and the
  verifier.
- `${CLAUDE_PLUGIN_ROOT}/skills/signals/references/research-an-investor.md` — how a firm's fields
  and tags are filled, and `what-is-a-signal.md` beside it.
- `${CLAUDE_PLUGIN_ROOT}/references/research-connectors.md` — the enrichment connectors.

## Arguments

- **order number** (`1001`): that order only. Without one, the open queue, soonest due first.
- `--all`: every open order in this run. Without it, one order per run.
- `--deliver`: deliver without asking when the List reaches its target, and file without cards
  (house rules §2, the scheduled research). **Unattended runs pass it.** By hand, without it, every
  write is a card.
- `--check`: report the queue (number, customer, due, firms on the List against target) and write
  nothing.
- `--batch N`: the most firms to research and verify in this run (default 60). A run stops at the
  end of a batch so a scheduled run never outlasts its slot; the next run continues the same order.

## Tools

| Tool | Used for | Writes |
| --- | --- | --- |
| `whoami` | step 1: platform admins only | no |
| `list_orders`, `get_order` | steps 2–3: the queue, the order, its `brief`, `targeting`, `listId`, `firmsNow` | no |
| `update_order` | step 3 `in_progress`; step 5 `listId`; step 11 desk note; step 13 `delivered` | yes |
| `get_project`, `list_tags`, `get_company_kind` | step 4: today's interests, the tag tree, the investor fields | no |
| `list_lists`, `create_list`, `get_list` | steps 5, 6 and 12: the List | yes, the List |
| `list_research_checks`, `create_research_checks` | steps 6 and 11: what earlier runs did and rejected; this run's record | yes, the log |
| `list_prospects`, `list_companies`, `search_companies`, `get_company`, `search_people` | steps 7–8: the catalog's candidates and dedup | no |
| `list_signals` | step 8: signals already on file for each firm and person | no |
| `find_email`, `verify_email`, `domain_search`, `enrich_person`, `get_enrichment` | steps 8–9: people and their contact details | no |
| `file_investor` | step 10: new firms with their people; empty fields and new people on catalog firms | yes, dry run first |
| `file_signal` | step 10: the firm and person signals not already on file | yes, dry run first |
| `add_many_to_list` | step 10: the firms, with `primaryPersonIds` and `notes` (why it is here) | yes |
| `update_list_entry`, `remove_from_list` | step 12: a corrected note or primary; a firm that failed the final pass | yes |
| `show_results` | output: the order (`get_order`) | no |

## Steps

1. **Platform admins only.** `whoami`; if `isPlatformAdmin` is false, say orders are the Yellowtail
   team's and stop.
2. **Find the work.** With a number, `list_orders` with `number`. Otherwise `list_orders` with
   `open: true`. Nothing open: say "No orders waiting" and stop. With `--check`, report and stop.
3. **Pick it up.** The first open order (each, with `--all`). Skip one `in_progress` and assigned to
   someone else unless it was named or is overdue: say who has it. Otherwise `update_order` with
   `status: in_progress` (it assigns you), then `get_order`. **An upgrade** (a licence order already
   delivered, its desk note naming the list order) has nothing to build: skip it.
4. **Write the investor profile** (research-standard §1) from the order's `brief` (frozen at
   purchase: prospect for those interests even if the project changed since; say so in the desk
   note if `get_project` differs) and the buyer's `targeting`, which narrows, never widens. Read
   the startup's website. Find its comparable startups and their investors. An empty brief (an old
   order) uses the project as it is. Never create a tag (house rules §12).
5. **The List.** If the order has a `listId`, keep filling it. Otherwise `list_lists` for the project
   (a run that stopped leaves one named for this order), else `create_list` named
   `Your top <targetFirms> investors`, described `Picked and checked by the Yellowtail team for
   order #<number>, <date>.`, and `update_order` with its `listId` at once.
6. **Resume.** `get_list` for the firms already on it (done), and `list_research_checks` for the
   project for earlier runs of this order (`details.order`), with the firms they rejected. Open the
   working folder (research-standard §7) if this machine has it. Skip done and rejected firms.
7. **Build the pool and score it** (research-standard §2–3): the catalog first, then the web, to at
   least twice what the List still needs. Score each candidate; drop gate failures and red flags
   with the reason. Rank the rest. In parallel subagents where the client has them, one source or
   one slice of the pool each.
8. **Research the next batch** (`--batch`, best-ranked first): a dossier per firm
   (`verification.md`), with the firm's own details, its two or three people and every contact
   field, enrichment for what the web did not give, the firm and person signals (reuse anything on
   file from the last six months first), and the note. Subagents in parallel, about ten firms each,
   where the client has them.
9. **Verify the batch** with the verifier (`verification.md`), never the agent that researched it.
   PASS and fixed-and-rechecked firms go on; FAILs are rejected with the reason.
10. **File and add.** For each passing firm, in this order:
    - **New firm:** `file_investor` dry run with the firm (its fields, tags, attributes including
      `twitter_url`, `general_email`, `phone`), its people with sources and statuses, and a profile
      note whose first line is `Auto-filed by /fulfil-orders, unreviewed`, then which order it was
      found for, then each value's source. Strong duplicates block it (house rules §4): by hand, a
      question; unattended, treat it as the existing firm only if domain or LinkedIn match exactly,
      otherwise reject it for the desk to look at.
    - **Catalog firm:** `file_investor` with `company: { id, fill }` for empty fields only (never
      `change` unattended), and its new people. A `verified` value is never touched.
    - **Signals:** `file_signal` dry run, then filed, for each signal the dossier says to file.
    - **The List:** `add_many_to_list` in batches of up to 50, with `companyIds`, `primaryPersonIds`
      (each firm's first person) and `notes` (each firm's note, keyed by company id).

    By hand without `--deliver`, show the batch as cards first (one compact card per firm: the
    score, the gates' evidence, people, signals and the note) and write on approval.
11. **Record the run.** `create_research_checks` with one `prospecting` check for the project:
    `found` = firms added to the List this run, `summary` one sentence, and `details`
    `{ order: <number>, profile, added: [ids], filedNew: [ids], signals: [ids], rejected: [{ name,
    companyId?, reason }] }`. Then `update_order` with a `deskNote` keeping the old note and adding
    one line ("15 Nov: +58 (31 new, 27 catalog), 41 rejected; 176/200").
12. **Final pass** once the List holds the target: `get_list` and read it top to bottom as the
    customer will. Every firm fits, has a note and a primary contact with a way to reach them; the
    balance holds (research-standard §3); no two notes are the same text. Re-verify one passed firm in
    ten (`verification.md` § Deciding). A firm that fails now is removed (`remove_from_list`) and
    replaced from the pool.
13. **Deliver, or say why not.**
    - **The List holds at least `targetFirms` and passed step 12:** write a `deliveryNote`, one
      honest line for the customer ("We picked 212 investors backing seed-stage industrial
      decarbonisation in the UK and Europe; each has a note on why, and the partner to write to."):
      no prices, no promise of investment, nothing internal. By hand, show the order and the List and
      ask "Deliver order #N and email <buyer> now?"; with `--deliver`, don't ask. Then `update_order`
      with `status: delivered`, the `listId`, the `deliveryNote` and a final `deskNote` line. Read
      `email`: `queued` is on its way; `disabled` means email is off on the server, so tell the user
      to email the customer themselves.
    - **Short, and the pool still has candidates:** stop at the batch's end. The next run continues.
    - **Short, and the pool is exhausted** (two research rounds that each keep fewer than ten firms):
      don't deliver and don't pad. `deskNote` says where it got to and what ran dry, and the report
      says so: a person decides to deliver what there is, lower `targetFirms`, or widen the brief
      with the customer.
    - **Due within 12 hours and more than 30 firms short:** say so in the desk note and the report,
      every run, so a person can step in before it goes red.

## Running it on a schedule

Hourly, with the Yellowtail Admin connector signed in as a platform admin:

- **Claude Desktop:** a scheduled task with the prompt `/yt-admin:fulfil-orders --deliver`, on a
  machine that stays awake.
- **Claude Code:** `/loop 1h /yt-admin:fulfil-orders --deliver`, or `/schedule` for a cloud routine.

An order of 200 takes several runs (60 firms researched and verified per run by default). Each run
picks up where the last stopped (step 6), so the order is delivered within its 48 hours without
anyone watching. An unattended run never asks: it delivers only a List that reached its target and
passed the final pass.

## Output

Display: inline — per order: its number, customer and project, the List against the target, this
run's added (catalog and new), people filed, signals reused and filed, rejected with the top reasons,
emails verified, and whether it was delivered and the email queued, or what is next and when it is
due. One `show_results` card for the order (`get_order`). A scheduled run with nothing to do says
only "No orders waiting".

## What comes next

- The customer gets "Your investor list is ready", which opens the List with each firm's note.
- `/catalog-hygiene` lists the firms filed `Auto-filed by /fulfil-orders, unreviewed`, and any the
  run flagged as dead or off-thesis.
- An order left short is on Sales › Orders for a person to decide.
