---
name: lead-enrichment
description: Yellowtail Admin — the desk only (platform admins). The daily enrichment run over the global investor catalog - takes the next 25 firms (missing a website or LinkedIn page) and 25 people (missing an email, LinkedIn, phone or X, emptiest first, then those whose details are still unverified) from the research queue, finds what is public on the web for free first, then uses whatever enrichment connectors the client has (Apollo, Lemlist, Clay, Hunter or another) and Yellowtail's own Lemlist key only for what the web did not give, and fills the empty fields (and corrects stale unverified ones) with their sources. Records every firm and person it checked so tomorrow takes the next batch. Built to run unattended on a schedule (--unattended) as well as by hand with cards. Use when someone says "enrich the catalog", "fill in missing emails", "lead enrichment", "find LinkedIns for these people", or from the scheduled task.
argument-hint: "[--unattended] [--limit N] [--web-only] [--enrich-max N]"
---

# /lead-enrichment

A firm with no website and a partner with no email are a dead end for a founder. Every day this
takes the emptiest firms and people in the global investor catalog and fills in what is public:
a firm's **website** and **LinkedIn page**; a person's **LinkedIn**, **work email**, **work phone**
and **X**, and their location while you are there. It works the queue in order: people with
nothing at all first, then people missing some fields, then people whose details are all there but
still **unverified**, to check they are still right.

Free first. The public web (the firm's site and team page, LinkedIn and X found by search, press,
the person's own site) is always searched first. Then, for what the web did not give, the
**enrichment connectors** this client has connected (Apollo, a Lemlist connector, Clay, Hunter or
any other), and last **Yellowtail's Lemlist** (`enrich_person`, the server's key), because every
lookup spends credits.

Read `${CLAUDE_PLUGIN_ROOT}/references/house-rules.md` first: §5 is the whole rulebook for contact
details (where to search, pattern inference, verified vs unverified, work details only, sources).
Then `${CLAUDE_PLUGIN_ROOT}/references/research-connectors.md` §1–§2: how to find which enrichment
connectors are connected, their order, and what each result is worth.

## Arguments

- `--unattended`: the scheduled run. Writes what passes the rules below without cards, never asks,
  and ends with the report (house rules §2, the desk's scheduled research). Without it, every change
  is a card, written on approval.
- `--limit N`: firms and people each (default 25).
- `--web-only`: no enrichment connectors and no Lemlist (`--no-lemlist` still works and means the
  same).
- `--enrich-max N`: the most paid lookups in one run, across every provider (default 25;
  `--lemlist-max` still works and means the same).

## Tools

| Tool | For | Required? |
| --- | --- | --- |
| `whoami` | `isPlatformAdmin` and a write key: stop otherwise | yes |
| `list_research_queue` | `{ kind: "enrichment" }`: the next firms and people, with what each is missing and which values are unverified | yes |
| `get_company`, `get_person` | What is on file, and its sources | yes |
| `update_company` | A firm's `websiteUrl`, `linkedinUrl` (empty fields only) | yes |
| `update_person` | A person's fields, each with its status and `sources` line | yes |
| Enrichment connectors | Apollo, Lemlist, Clay, Hunter or another the client has connected: what the web did not give (`research-connectors.md` §2) | optional |
| `enrich_person`, `get_enrichment` | Yellowtail's Lemlist, last: what is still missing. Says so and stops being offered if the server has no key | optional |
| `create_research_checks` | One check per firm and per person, found or not | yes |
| Web search and fetch | The research | yes |

## Steps

1. **Who.** `whoami`: a platform admin with a write key, or stop and say so. Then note which
   enrichment connectors this session has (`research-connectors.md` §1), for the report.
2. **The batch.** `list_research_queue { kind: "enrichment", limit }`: `companies` (with `missing`)
   and `people` (with `missing` and `unverified`, and their firm and its website). Empty → "Nothing
   to enrich" and stop.
3. **Firms first** (a person's search needs the firm's domain). For each, the firm's own website
   (search its name with "venture capital" / "fund" and match on the people and portfolio you know),
   then its LinkedIn company page (`site:linkedin.com/company`, matched on name, site link and HQ).
   A value goes on only when it is clearly this firm. Note an X handle for the report (a firm has no
   X field).
4. **People.** For each, search every field in `missing` the house rules §5 way, in its order, and
   stop a field at the first good source:
   - **LinkedIn**: `"<full name>" "<firm>" site:linkedin.com/in`, the team page's links; match firm,
     title and city. It is the dedup key, so be sure.
   - **Work email**: an address they publish, or the firm's site naming them; then **pattern
     inference** only from a real published address at the firm's own domain. Never a role inbox,
     never a personal mailbox, never a "usual" format.
   - **Phone**: a work line they or the firm publish (the firm's office line is the firm's, not
     theirs, unless the page gives it as theirs).
   - **X**: linked from their site, the team page or their LinkedIn; a search hit only if the
     profile names the firm or their role.
   For each field in `unverified`: check the value still holds (the profile still shows them at
   this firm, the address still appears, the page still lists the number). Still right → leave it
   (the check is recorded). Changed → the new value, with its source. Gone with no replacement →
   leave it and say so in the report; never blank a value on absence of evidence.
5. **Enrichment, for what is left** (unless `--web-only`, up to `--enrich-max` lookups a run,
   people with the most missing first), in `research-connectors.md` §2's order:
   - **Connected enrichment connectors** (Apollo, Lemlist connector, Clay, Hunter, other): match on
     the LinkedIn URL, else full name and the firm's domain, asking only for the fields still
     missing; the next provider only for what the last did not return. A firm's missing website or
     LinkedIn page can come from an organisation lookup the same way.
   - **Yellowtail's Lemlist**, last, for what is still missing (and not when a Lemlist connector was
     used for this person): `enrich_person { personId, ... }` asking only for those fields —
     `findEmail` for no email, `verifyEmail` for an unverified email, `findPhone` for no phone,
     `linkedin` for no LinkedIn. `status: "in_progress"` → `get_enrichment` once at the end of the
     run. A refusal saying Lemlist is not set up → say so once and carry on.
   One lookup per person per provider, never twice in a run. A provider that refuses (not signed
   in, out of credits) is dropped for the rest of the run and named in the report.
6. **What goes on**, for each value:
   - its **status**: `unverified` for anything found by research or by a provider, except an email
     the provider reports deliverable or verified at the time, which is `verified` (house rules §5,
     `research-connectors.md` §2);
   - its **source**, one line in `sources` (`listed on kiln.vc/team`, `pattern from sarah@kiln.vc
     (kiln.vc/team)`, `apollo, verified`, `hunter, deliverable`, `lemlist`, `lemlist, deliverable`);
   - only fields that were empty, or unverified and found changed. Never overwrite a `verified`
     value; never touch a field you did not search.
7. **Write.**
   - `--unattended`: `update_company` / `update_person` for each firm and person with something to
     write.
   - By hand: one card per firm and per person (house rules §5's five-line person block, with what
     is new marked), then write the approved ones.
8. **Record** one check per firm and per person in the batch with `create_research_checks`,
   including those where nothing was found: `kind: "enrichment"`, `companyId` or `personId`, `found`
   (fields filled or changed), `summary` ("email and LinkedIn found on kiln.vc/team; no phone
   published"), and `details` `{ filled: { email: "listed on kiln.vc/team" }, searched: [...],
   providers: ["apollo", "lemlist"] }` (the providers looked up, empty for the web only). A subject that found nothing waits 30 days before it comes up again.
9. **Report** (below).

## Rules specific to this skill

- **Work details only, public only.** Nothing behind a login, nothing private, never a personal
  email or phone (house rules §5). The server refuses a personal mailbox anyway.
- **Never invent.** A field with no source stays empty, and the check says where you looked.
- **The firm on file is the firm.** A person found to have moved firm is not moved here: say so in
  the report for `/signal-intake` (a partner move is a signal).
- **Paid lookups come after the web and have a budget**: what the web did not give, the fields
  still missing, `--enrich-max` a run across every provider. A provider's match at another firm is a
  move to report, not a value to file.

## Running it on a schedule

Daily: `/yt-admin:lead-enrichment --unattended`. `/schedules` sets it up with the other two. At 25
firms and 25 people a day, about 750 of each a month; raise `--limit` once the run is trusted. The
enrichment connectors must be connected in the client that runs the schedule, or the run is the
web and Yellowtail's Lemlist only, and says so.

## Output

Display: inline — one Yellowtail widget in the chat (`${CLAUDE_PLUGIN_ROOT}/references/display.md` §2), cards under it when run by hand. Yellowtail's reads draw nothing on the way; this output is the one thing shown (§ Only the answer is drawn). An unattended run's report is the whole record.

```
**Lead enrichment** · 4 Nov 2026 · 25 firms · 25 people · 41 fields filled · 14 paid lookups
Connected: Apollo (11 lookups), Yellowtail Lemlist (3) · not connected: Clay, Hunter

Firms: 18 of 25 got something — Kiln Climate: website kiln.vc, LinkedIn /company/kiln-climate …
People: 21 of 25 got something
- Sarah Lee, Northwind Capital: email sarah@northwind.vc (unverified; listed on northwind.vc/team),
  LinkedIn /in/sarahlee (unverified; linked from northwind.vc/team), phone not found — searched:
  northwind.vc/contact, Apollo, Lemlist
- Tom Okafor, Helios Ventures: email tom@helios.vc (verified; apollo, verified)
- James Rowe, Kiln Climate: email james@kiln.vc → still on kiln.vc/team (checked)
Moved firm (for /signal-intake): Priya Raman — now at Saltmarsh Partners (LinkedIn)
Nothing found (back in 30 days): 4 firms, 4 people
```

## What comes next

- `/signal-intake` for anyone found to have moved firm; `/catalog-hygiene` if a search turned up a
  duplicate firm or person.
