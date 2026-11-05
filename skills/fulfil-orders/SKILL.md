---
name: fulfil-orders
description: Yellowtail Admin — Work the order queue. When a customer buys their investor list or the annual licence, Yellowtail makes an order that is due in 48 hours. This picks up the next open order (or the one you name), marks it in progress, builds a List in the customer's project of the 200 investors that fit their brief best (the project and interests frozen at purchase), researching and filing more from the web when the catalog is thin (as /yt:investors find does), gives it a pass over, then marks the order delivered with that List, which emails the customer a link to it. Built to run unattended on a schedule as well as by hand. Use when someone says "fulfil orders", "deliver order 1001", "work the order queue", "any orders waiting", or from a scheduled task that checks for orders.
argument-hint: "[order number] [--all] [--deliver] [--check]"
---

# Fulfil orders

An **order** is a customer paying for their investor list (`offer: list`, a one-off) or the annual
licence (`offer: licence`) for one project (the app: Sales › Orders). Paying unlocks what they
bought at once: every investor that fits the project's interests. Then the desk owes them a
**List** in that project: the `targetFirms` investors (200 unless the desk set otherwise) that fit
their brief best, each checked and with a primary contact, **within 48 hours** (`dueAt`). Marking
the order delivered with that List is what emails the customer a link to it. This command does that
work.

Read `${CLAUDE_PLUGIN_ROOT}/references/house-rules.md` first. The research and filing are
those of `/yt:investors find` (the `yt` plugin, steps 4 to 7), run for the
order's project.

## Arguments

- **order number** (`1001`): that order only. Without one, the open queue, soonest due first.
- `--all`: every open order in this run. Without it, one order per run, so a scheduled run never
  outlasts its slot.
- `--deliver`: deliver without asking when an order reaches its target. **Unattended runs pass it**
  (below); by hand, the command asks first.
- `--check`: report the queue (number, customer, due, firms now against target) and write nothing.

## Tools

| Tool | Used for | Writes |
| --- | --- | --- |
| `whoami` | step 1: platform admins only | no |
| `list_orders` | step 2: the open queue (`open: true`), or one by `number` | no |
| `get_order` | steps 3, 4 and 6: the order, its `brief` and the buyer's `targeting`, and `firmsNow`, its progress towards `targetFirms` | no |
| `update_order` | step 3: `in_progress` (assigns you); step 5: the `listId`; step 8: `delivered` with the List and a `deliveryNote`, or a `deskNote` | yes |
| `get_project`, `list_tags` | step 4: today's interests, to compare with the order's frozen `brief` | no |
| `list_lists`, `create_list`, `get_list` | steps 5 and 7: the List this order delivers | yes, the List |
| `list_prospects` | step 6: the catalog's fits for the project, best first | no |
| `add_many_to_list` | step 6: the chosen firms, each with a suggested primary contact | yes |
| `file_investor` | step 6: new firms from research, as `/yt:investors find` step 7 files them | yes, only on a clean dry run |
| `show_results` | output: the order as a card (`get_order`) | no |

## Steps

1. **Platform admins only.** `whoami`; if `isPlatformAdmin` is false, say orders are the Yellowtail
   team's and stop.
2. **Find the work.** With a number, `list_orders` with `number`. Otherwise `list_orders` with
   `open: true` (soonest due first). Nothing open: say "No orders waiting" and stop. A scheduled run
   stops here quietly almost every time, which is the point. With `--check`, report the queue and
   stop.
3. **Pick it up.** Take the first open order (or each, with `--all`). Skip one that is `in_progress`
   and assigned to someone else, unless it was named or is overdue: say who has it. Otherwise
   `update_order` with `status: in_progress` (it assigns you if nobody is assigned), then `get_order`
   for `firmsNow`, `targetFirms`, `projectName` and the desk's note.
4. **Read the brief.** The order's `brief` is what the customer paid for, frozen at purchase: the
   project's name, description and website, and its interests by tag kind (sector, stage,
   geography). Prospect for **those** interests, even if the project has changed since: they are
   the criteria, and the tags every new firm must carry to count. (A command copied from Sales ›
   Orders carries the same brief as text.) Read the website for anything the description leaves
   out. `get_project` gives today's interests (`interestTagIds`), and `list_tags` names them: if they
   differ from the brief, say so in the desk's note, and keep to the brief. An order with an empty
   brief (made before briefs were recorded) uses the project as it is. Never create a tag here
   (house rules §12).

   Then read the buyer's **targeting** on the order (`get_order`, `targeting`), their own answers
   from the purchase welcome, all optional: how much they are raising (`raiseSize`), whether they
   have a lead (`lead`), the investor types and regions they want (`investorTypes`,
   `geographies`, by name) and a note. They narrow the brief, never widen it past its interests:
   - **Investor types and regions** they picked go first: fill the List from firms carrying them
     before any others, and say in the desk's note if they ran short.
   - **Raise size** decides cheque size: skip firms whose typical cheque is plainly far from it.
   - **No lead yet** means firms that lead rounds come first; **has a lead** means followers.
   - **The note** is read as the customer's own words: follow it where it fits the brief, and say
     in the desk's note where it could not be.
   No `targeting` (they skipped the questions, or the order predates them) means the brief alone.
5. **Make the List.** The deliverable is a List in the customer's project, holding the
   `targetFirms` (200) investors that fit the brief best (Perry, 3 Nov 2026), not the whole catalog,
   which paying has already unlocked for them. If the order names a list already (`listId`, from an
   earlier run), keep filling that one. Otherwise `list_lists` for the project (a run that stopped
   halfway leaves one named for this order), else `create_list` in the project named
   `Your top <targetFirms> investors` with the description `Picked and checked by the Yellowtail team
   for order #<number>, <date>.` Record its id on the order straight away (`update_order` with
   `listId`), so a later run finds it.
6. **Fill it with the best fits.** `list_prospects` for the project gives the catalog's investors
   that match its interests and are on none of its lists, best fit first (`fit.band`,
   interests matched, recent signals, `bestContact`). Take the strong and good fits that match the
   brief, skipping any that look inactive (no investment in two years) or plainly off-thesis, and
   add them with `add_many_to_list` (`companyIds`; each gets a suggested primary contact) in
   batches of 50. While the List is short of the target, run `/yt:investors find` steps 5 to 7 for this
   project to find firms Yellowtail lacks (about 25 a batch), filing each kept firm exactly as
   `/yt:investors find` files them (firm only, existing tags including the brief's interest tags,
   `file_investor` dry run first, a profile note starting `Auto-filed by /find-investors,
   unreviewed`), then add those to the List too. Stop at the target, or when a research batch keeps
   fewer than 5 new firms: padding with weak fits is worse than an honest shortfall. Never put a
   possible-fit or may-be-inactive firm on the List to reach the number.
7. **Pass over it.** `get_list` and read it top to bottom as the customer will: every firm fits the
   brief, every firm has a primary contact (a firm with nobody goes in the desk's note; contacts are
   added with `/yt:investors contacts`, which files people on a card the user approves, so in a run by hand
   offer it for the strongest firms with nobody, and an unattended run lists them instead).
8. **Deliver, or say why not.**
   - **The List has `targetFirms` firms:** write a `deliveryNote`, one honest line for the customer
     about what was done ("We added 64 investors backing seed-stage climate software in Europe."): no
     prices, no promise of investment, nothing internal. By hand, show the order and the List and ask
     "Deliver order #N and email <buyer> now?"; with `--deliver`, don't ask. Then `update_order` with
     `status: delivered`, the `listId`, the `deliveryNote` and a `deskNote` that keeps the existing
     note and adds one line ("3 Nov: List of 200 built, 64 filed unreviewed; 12 firms with no
     contact."). The customer's email opens the List. Read `email`: `queued` is on its way;
     `disabled` means email is off on the server, so tell the user to email the customer themselves.
   - **Short of the target:** don't deliver. `update_order` with a `deskNote` that says where the List
     got to and why (the count, what was searched, what ran dry), and tell the user. The order stays
     in progress for a person to decide: deliver what there is, lower `targetFirms`, or widen the
     search. An overdue order shows red on the desk's page.
   - **An upgrade** (an order for the licence that is already delivered, with a desk note naming
     the list order) has nothing to build: skip it.

## Running it on a schedule

The point of this command is that orders get picked up without anyone watching the inbox. The desk
is also emailed about each new order (`DESK_ALERT_EMAIL`), so a person can always step in.

- **Claude Desktop:** a scheduled task, hourly, with the prompt `/yt-admin:fulfil-orders --deliver`, on a
  machine that stays awake, with the Yellowtail Admin connector signed in as a platform admin.
- **Claude Code:** `/loop 1h /yt-admin:fulfil-orders --deliver`, or `/schedule` for a cloud routine.

An unattended run never asks, so it never waits: it delivers only an order that reached its target,
and leaves everything else in progress with a note.

## Output

Display: inline — per order: its number, customer and project, the List's firms against the target,
how many were filed new (by name, in a run by hand), what was flagged, and whether it was
delivered and the email queued, or why not. One `show_results` card for an order delivered or left
short (`get_order`). A scheduled run with nothing to do says only "No orders waiting".

## What comes next

- The customer gets "Your investor list is ready", which opens the List.
- Review the auto-filed firms in `/catalog-hygiene`.
- An order left short is on Sales › Orders for a person to decide.
