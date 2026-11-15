# Dossiers and the verifier

Every firm considered for an order gets a dossier. The researcher writes it; a verifier who did
not write it re-checks it. Nothing reaches the List, or Yellowtail, without both.

## The dossier

One file per firm, `order-<number>/firms/<slug>.md`:

```
# Northwind Climate (northwind.vc) — catalog | new
companyId: <id, or "new">

## Gates
Live:      Led Kelvin Labs seed, 12 Jun 2026 — https://sifted.eu/…  (press release)
On thesis: "We back industrial decarbonisation from seed" — https://northwind.vc/thesis
Stage:     Seed lead, £500K–£1.5M — https://northwind.vc/faq
Geography: UK and Nordics — https://northwind.vc/about
## Score  (thesis 4 · recency 4 · cheque 4 · reach 4 · signal 2 = 18/20)
Comparable: Kelvin Labs (industrial heat recovery), seed 2026 — source
## Red flags searched
"Northwind Climate" layoffs | stopped investing | fund wind down — nothing (searched 15 Nov 2026)
## Firm
website https://northwind.vc · LinkedIn https://linkedin.com/company/northwind-climate
X https://x.com/northwindvc (linked from site footer) · email hello@northwind.vc (northwind.vc/contact)
phone +44 20 7946 0000 (northwind.vc/contact) · HQ GB · fund Fund II £120M (2025, source)
tags: Early-stage VC · Seed, Series A · Climate Tech · Energy › Industrial decarbonisation · UK, Nordics
## People
1. Anna Weiss — Partner, leads industrial (primary)
   LinkedIn … (current title checked 15 Nov) · Email anna@northwind.vc (verified: Hunter, deliverable)
   X @annaweiss (her LinkedIn) · Phone not found — searched: site, Lemlist · Location London, GB
2. …
## Signals
Firm:   on file 4 Sep 2026 "Closed Fund II at £120M" (signal <id>) — reused
Person: new — 2 Oct 2026, Anna Weiss on LinkedIn: "process heat is the next big electrification
        market" — https://linkedin.com/posts/… (to file)
## Note (Why it's here)
Led Kelvin Labs' £2.5M seed (industrial heat recovery) in June 2026, and its Fund II thesis names
industrial decarbonisation. Leads seed rounds at £500K–£1.5M. Write to Anna Weiss, the partner who
led Kelvin; she posted about process-heat electrification in October.
## Verification
(the verifier's section, below)
```

## The verifier

Where the client has subagents, verification runs in **separate subagents from research**, on
**Haiku 5.5** (`budget.md`), ten dossiers each, several in parallel. The verifier gets the investor
profile and the dossiers, never the researcher's reasoning, and this brief:

> You are checking another researcher's work before it goes to a paying customer. Assume each
> dossier contains at least one mistake and find it. For every firm: open every URL and confirm it
> says what the dossier claims, with the date; open the firm's own portfolio, news or LinkedIn page
> for its newest investment and compare; look there for evidence against the fit (stopped investing,
> pivoted, partner left, fund wound down); confirm each person's current title on LinkedIn or the firm's team page today; check
> each email with `verify_email` (or `enrich_person` with `verifyEmail`) unless it already shows a
> deliverable check from today; and read the note as the founder will: is every fact in it in the
> dossier, sourced and current? Return, per firm, PASS, FIX (with the exact corrections and their
> sources) or FAIL (with the reason). Do not soften a FAIL. Write nothing to Yellowtail. Fetch pages
> directly; do not web search (searches are the order's scarcest budget).

Without subagents, the same agent runs the verifier pass itself, **after** the whole batch is
researched, from the dossiers alone, re-opening each firm's sources rather than trusting its notes.

The verifier's answer is written into the dossier's last section:

```
## Verification — 15 Nov 2026
Fit: PASS (thesis page and Kelvin deal confirmed)
Live: PASS (Kelvin 12 Jun 2026 confirmed; also co-led Thermon pre-seed, 3 Sep 2026)
Contacts: FIX — Ben Ortiz left in August (LinkedIn: now at Pale Blue); replaced by Mia Clarke,
          Principal (northwind.vc/team), email mia@northwind.vc (verified: Hunter, deliverable)
Note: PASS
Result: PASS after fix
```

## Deciding

- **PASS**, or **FIX** whose fixes the researcher applied and the verifier re-checked: the firm
  goes into the review sheet (`SKILL.md` step 9).
- **FAIL**: rejected, with the reason, in `pool.csv` and the run's research check. A firm rejected
  for being dead or off-thesis is a catalog question too: say so in the run's report, so the desk
  can review it in `/catalog-hygiene` (never delete or untag it here).
- **Two FIX rounds** without a pass: rejected. A firm that needs three attempts to describe is not
  one to stake the List on.
- A sample of **one firm in twenty that passed** is re-verified by a **Sonnet 5.5** subagent (at most
  10 an order, `budget.md`), with the same brief and one search allowed per firm. Two failures in a
  batch's sample mean its verifier missed things: re-verify that whole batch on Haiku.
- **Light-path firms** (`budget.md`) get a shorter check: the newest dated activity opened, each
  person's current title confirmed, emails already `verified` left as they are.
