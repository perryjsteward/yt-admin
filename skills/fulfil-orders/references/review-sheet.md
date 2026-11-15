# The review sheet

Nothing an order run finds goes into Yellowtail until a person has checked it (Perry, 15 Nov 2026).
The research runs write a **review sheet**; a person reads it, marks each row, and edits what is
wrong; `/fulfil-orders <number> --upload` then files exactly what they approved. The sheet is the
approval (house rules §2).

## Where it lives

- **The file:** `order-<number>/review-<number>.xlsx` in the order's working folder
  (research-standard §7), written with the client's spreadsheet skill (`xlsx`) or a short script
  (openpyxl). This is the copy `--upload` trusts.
- **Google Sheets**, when a Google Drive connector is connected: the same file uploaded with
  `create_file` (`contentMimeType` the xlsx type, converted to a Google Sheet), titled
  `Yellowtail order #<number> review: <project>`, and replaced with `update_file` after each run.
  Its link goes in the order's `deskNote` and the run's report, so whoever reviews can open it
  anywhere. Edits made in the Google Sheet are what `--upload` reads when the local file is older
  or missing (`search_files` by title, then `read_file_content`).
- No Drive: say so once; the reviewer opens the `.xlsx`.

Each run adds its batch to the sheet (new rows at the bottom, never reordering what a person may
already have marked), and refreshes **Summary**.

## Tabs and columns

Keep the columns in this order: the reviewer's columns first, so marking is quick.

**Summary** — the order (number, customer, project, due), the investor profile (research-standard
§1), firms ready / approved / dropped / held, the spend so far against its caps (budget.md), and the
three lines that tell a reviewer how to mark the sheet (below).

**Firms** — one row per firm that passed verification:

| Column | What |
| --- | --- |
| Decision | `approve`, `drop` or `hold`; empty until a person fills it |
| Reviewer note | anything they want to say; a `drop` needs a reason here |
| Rank, Score | from the scorecard (research-standard §3), score out of 20 |
| Firm, Source | name; `catalog` (with a link to `/investors/<companyId>`) or `new` |
| Website, LinkedIn, X, General email, Phone, HQ | the firm's details, each as filed |
| Type, Stages, Sectors, Geography | tag names |
| Cheque, Leads rounds, Fund size | the bucketed fields |
| Latest activity | date, what, URL |
| Thesis evidence | the sentence and URL |
| Comparable | the comparable startup it backed, if any |
| Verification | `PASS`, `PASS after fix: …`, or `light path` |
| Primary contact | the person to write to (editable: any name from People at this firm) |
| Why it's here | the note the customer will read (editable) |
| Firm signal, Person signal | `on file <date>: <summary>` or `new <date>: <summary> <URL>` |
| Key | `companyId`, or `new:<domain>`: never edited, it is how `--upload` finds the row |

**People** — one row per person proposed: Decision (`approve` / `drop`; empty means approve with
their firm), Firm, Name, Role, Primary (`yes` for the firm's primary), LinkedIn, Email, Email status
(`verified: Hunter, deliverable` or `unverified: <source>`), X, Phone, Location, Sources, Key
(`personId` or `new:<firm domain>:<name>`).

**Signals** — one row per signal to file (reused ones are only named on Firms): Decision, Firm,
Person, Date, Type, Summary, Source URL, Key.

**Rejected** — every firm rejected, with the reason (gates, red flags, verification), so a reviewer
can rescue one (`Decision: approve` here sends it back for research in the next run, not straight on
the List).

## How a reviewer marks it

1. Read **Firms** top to bottom. `approve` what you would put your name to, `drop` what you would
   not (and say why), `hold` what you want someone else to look at.
2. Fix anything wrong in place: a better note, a different primary contact, a corrected website.
   Change only the cells, never the Key column.
3. In **People** and **Signals**, `drop` anything you do not want filed. Then run
   `/yt-admin:fulfil-orders <number> --upload`, or write `Ready to upload: yes` on **Summary** and
   the next scheduled run uploads it.

## What `--upload` does with it

- Reads the sheet (the newer of the local file and the Google Sheet), and shows the counts first:
  approved, dropped, held, edited cells, and anything it cannot read (a missing Key, an unknown
  Decision word, a primary contact who is not in People): those rows are skipped and listed.
- **Approved firms only.** An edited cell is the reviewer's value: it is filed as written (an edited
  email is `unverified` with the source `edited by reviewer`, unless they wrote `verified`). Edited
  notes are used as written.
- Filing is `SKILL.md` steps U4–U5 (`file_investor` dry run, `file_signal` dry run, then
  `add_many_to_list` with `notes` and `primaryPersonIds`), now for the approved rows. A dry run that
  fails is reported with the row, never forced.
- Writes back to the sheet: a **Filed** column on each row (`filed`, `on list`, or the refusal).
- `drop` rows are recorded in the run's research check as rejected by the reviewer, so later runs
  do not research them again. `hold` rows wait for the next review.
