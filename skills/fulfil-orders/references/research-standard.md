# The order research standard

A customer paid for this List. They will email these people with their own name on the message,
and judge Yellowtail by who replies. So every firm on it has to be one a well-connected founder's
adviser would put there by hand, and every fact about it has to be true today. **Two hundred
excellent firms, each with a reason, beats two hundred and fifty of which thirty are dead funds.**
The number is a floor we earn, never one we pad to.

This is the bar for every firm, catalog or new. `SKILL.md` says when each part runs; this says
what "good enough" means.

## 1. The investor profile (written before any search)

Before looking at a single firm, write the order's **investor profile** from the `brief` and the
buyer's `targeting`, in this shape, and keep it in the run's working file
(`order-<number>/profile.md`, below) and the first research check's `details.profile`:

```
Startup:   Heatloop — industrial heat pumps for food processing (heatloop.io), UK
Raising:   $3M seed (targeting.raiseSize), no lead yet (targeting.lead) → leads first
Fits:      stage Seed (Pre-seed / Series A acceptable as edges)
           sector Energy › Industrial decarbonisation (+ parent Energy); Climate Tech focus
           geography United Kingdom, Europe (targeting.geographies)
           types  Early-stage VC, Corporate VC (targeting.investorTypes)
Cheque:    $500K–$2M to lead a $3M seed; followers $100K–$1M
Exclude:   "No Octopus Ventures, we've spoken" (targeting.notes); off-thesis: consumer, crypto
Comparable startups: 5–10 companies like this one that raised in the last 24 months
           (from the web: Dealroom/Crunchbase pages, press), and who backed them
```

**Comparable startups are the best source of fit there is.** A fund that led the seed of a
startup like this one in the last two years has proved its thesis with money. List them with
their round, date and investors, and source each line.

## 2. Where candidates come from

Build a **pool of at least twice the target** (400 for 200) before choosing, from all of these:

1. **The catalog.** `list_prospects` for the project, every page, `strong` and `good` bands. Then
   `list_companies` with the profile's tag facets for firms `list_prospects` ranked lower but that
   carry the stage and sector. Catalog firms are candidates, not answers: they go through the same
   checks as new ones (§4), because a firm filed a year ago may have stopped investing.
2. **Comparable startups' investors** (§1): every lead and named participant in their rounds.
3. **Recent deals in the sector, stage and geography**, last 12–18 months: trade press (Sifted,
   TechCrunch, EU-Startups, UKTN, Axios Pro, the sector's own press), firms' portfolio pages and
   announcements, LinkedIn posts by partners.
4. **Fund closes** in the last 24 months with a thesis that names the sector or stage: a new fund
   is deploying.
5. **Thesis pages**: firms whose own site says they back this sector at this stage.
6. **Credible curated lists** (a sector's "most active seed investors" from a data provider or a
   respected newsletter) as leads to check, never as evidence on their own.

Every new firm is searched in Yellowtail before it is treated as new (house rules §3).

## 3. Choosing: the scorecard

Score every candidate in the pool. A firm is a **candidate for the List** only if it passes all
four gates and scores 12 or more of 20.

**Gates (any fail = out):**

| Gate | Passes when |
| --- | --- |
| Live | a dated investment, fund close or partner post about investing within the last **12 months** (18 for a firm whose fund is less than two years old and says it is deploying) |
| On thesis | its own words (site, fund announcement, partner post) name the sector or its parent, or two or more portfolio companies in the last 3 years are in it |
| Stage | it invests at the round being raised, by its words or its recent rounds |
| Geography | it invests where the startup is based, by its words or two or more portfolio companies there |

**Score (0–4 each):**

| | 4 | 2 | 0 |
| --- | --- | --- | --- |
| **Thesis fit** | backed a comparable startup (§1) | sector named on its thesis page | adjacent only |
| **Recency** | invested in the sector in the last 6 months | in the last 12 | older |
| **Cheque & role** | its cheque fits the raise and it leads (when no lead) / follows (when led) | cheque fits | unknown |
| **Reachability** | a partner who covers this sector, with a verified work email | a named partner with an unverified email | nobody named |
| **Signal** | a dated signal in the last 6 months about this sector or stage | about investing generally | none |

The buyer's `investorTypes` and `geographies` decide order of preference, not a gate, unless
`notes` says "only". Firms named in `notes` to leave out are out, and so are their sister funds.

**Red flags: out, whatever the score.** The fund says it is not making new investments; the last
fund is more than six years old with no new one; the site is gone or parked; the partners named
have left (LinkedIn); portfolio is mostly the opposite stage (a Series B fund that did one seed);
a sector "focus" that is one company; it invests only through its own programme (an accelerator
cohort, a studio) the startup is not in; any legal or reputational problem in reputable press.

**Balance the List.** No more than a fifth from one investor type unless the buyer asked for that
type; with no lead yet, at least a third that lead rounds; no two vehicles of one manager unless
each is a real fit on its own (name both in the notes).

## 4. The three checks (every firm, by someone other than its researcher)

A firm goes on the List only after **three independent checks** pass, each from sources, never
from memory. The researcher builds the dossier; a **verifier** (another subagent where the client
has them, see `verification.md`) re-does each check from the sources and from fresh searches,
trying to prove the dossier wrong.

1. **Fit.** The gates and score in §3, each with the sentence and URL it rests on. The verifier
   opens each URL and confirms it says what the dossier claims, then searches once for evidence
   against ("<firm> not investing", "<firm> pivot", "<firm> stopped").
2. **Live.** The newest dated activity, opened and dated by the verifier. A firm's portfolio page
   with no dates is not evidence of when.
3. **Contacts.** For each person: still at the firm (current LinkedIn title or the firm's team
   page today), their role covers this sector or stage, and the email checked (`verify_email`, or
   `enrich_person` with `verifyEmail`). An email that verifies as `invalid` is removed; one that is
   `accept_all` or `unknown` stays `unverified`.

A check that fails is fixed (a better partner, a corrected date) or the firm is dropped with the
reason. Never put a firm on the List with a check marked "probably".

## 5. What each firm carries when it goes on the List

**The firm** (house rules §5, `get_company_kind` for the live keys):

| What | Where | Required |
| --- | --- | --- |
| Website | `websiteUrl` | yes |
| LinkedIn company page | `linkedinUrl` | yes, unless it has none (say where you searched) |
| X / Twitter | `attributes.twitter_url` | when it has one, linked from its own site |
| General email (hello@, info@, team@) | `attributes.general_email` | when published on its site, with the page in the profile note |
| Office phone | `attributes.phone` | when published, international format |
| HQ, description, tags (every applicable kind), cheque buckets, `leads_rounds`, `fund_size`, `notable_investments` | as `research-an-investor.md` in `../../signals/references/` says | what the sources support, nothing more |

**Its people: two or three**, the ones this founder should write to, in this order: the partner
who leads this sector or stage, a second partner or principal who covers it, then the person
who runs the firm's deal flow (a platform or investment team member who takes first meetings).
Not the fund's CFO, LPs, operating partners who don't invest, or a junior analyst when a partner
covers the sector. A two-person fund has two. Each person gets the five contact fields of house
rules §5, then enrichment for what the web did not give:

1. the web first: team page, their LinkedIn, their own site and posts;
2. `find_email` (Hunter, by name and the firm's domain), then `verify_email`;
3. `enrich_person` (Lemlist) for what is still missing: `findEmail`, `findPhone` (work only),
   `linkedin`, and `verifyEmail` for an address still unverified;
4. `domain_search` on the firm's domain to find partners the team page left out, and the
   address pattern (house rules §5 for when a pattern may be used).

Every value filed carries its source; only a deliverable check makes an email `verified`.

**Its primary contact** is the first of those people: the one the List tells the founder to
write to.

**Two signals, one about the firm and one about a person there** (Perry, 15 Nov 2026), each
recent, dated and public (`../../signals/references/what-is-a-signal.md`):

1. First look in Yellowtail: `list_signals` with the firm's `companyId`, then each person's
   `personId`, `status: all`. A published signal from the **last six months** that says
   something a founder would act on counts: reuse it, don't file another.
2. Only what is missing is researched: the firm's latest relevant deal, fund close or thesis
   statement; a partner's recent post, talk, podcast or deal. Filed with `file_signal` (dry run
   first), `company: { id }` and, for the person's, `person: { id }`, the source URL and the date
   it happened.
3. Nothing recent to find for the firm is a red flag for §3's Live gate; nothing for a person is
   fine: say so in the dossier.

## 6. The note: why it is on the List

Every entry gets a note, written for the founder, read in their List as **Why it's here**. Two or
three sentences, plain, specific and checkable:

> Led Kelvin Labs' £2.5M seed (industrial heat recovery) in June 2026, and its Fund II thesis
> names industrial decarbonisation. Leads seed rounds at £500K–£1.5M. Write to Anna Weiss,
> the partner who led Kelvin; she posted about process-heat electrification in October.

- **Lead with the strongest evidence**: a comparable deal, then the thesis, then a signal.
- **Name the person to write to** and why them.
- **Say what makes it fit this round**: leads or follows, cheque range, stage.
- Dates and numbers only from the dossier's sources. No hype ("top-tier", "perfect fit"), no
  promise ("will invest"), nothing internal (scores, "auto-filed", other customers), and nothing
  said in confidence.
- Under 400 characters where it can be; never more than 600.

## 7. The run's working file

A run keeps its dossiers in a working folder, so a long order survives a session ending and the
next run picks up where this one stopped: `order-<number>/` in the scratchpad or working
directory, with `profile.md` (§1), `pool.csv` (every candidate, its source and status:
`pool`, `researching`, `verified`, `rejected: <reason>`, `on list`) and one
`firms/<slug>.md` dossier per firm in the shape `verification.md` gives. Yellowtail is the record
that lasts: what is on the List is done, and each run's research check (`SKILL.md` step 11)
lists the firms it rejected and why, so a later run on a fresh machine skips them.
