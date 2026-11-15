# The order budget

An order of 200 investors has **$10 of model spend** (Perry, 15 Nov 2026), five cents a firm on the
List, rejected firms included. That holds the research standard only if the expensive models never
read the web and searches are spent where nothing else will do. Prices behind these numbers
(Anthropic API, 15 Nov 2026): Haiku 5.5 $0.10 / $0.50 per million tokens in / out (cache reads
$0.01; a prompt over 100K tokens costs 5×), Sonnet 5.5 $2 / $10 (cache reads $0.10), Opus 5.5
$4 / $20; web search **$10 per 1,000 searches** (a cent each) plus the tokens it returns; fetching a
page costs only its tokens. Hunter and Lemlist credits are billed by them, not counted here.

## Who does what

| Work | Model | Why |
| --- | --- | --- |
| The run itself: the profile, the scorecard, deciding, filing, the List | **Sonnet 5.5** (the scheduled task's model) | it reads one-line summaries and dossiers, never web pages |
| Reading the web for a firm: research and its dossier | **Haiku 5.5** subagents | pages are most of the tokens; Haiku reads them at 1/20 of Sonnet's price |
| The verifier's three checks | **Haiku 5.5** subagents, separate from the researchers | the checks are specific: open these URLs, confirm these facts |
| Spot-check of one passed firm in twenty (`verification.md` § Deciding) | **Sonnet 5.5** subagent | the judgement check on the cheap model's work |
| Opus | never, for orders | twice Sonnet's price for work Sonnet does |

Where the client lets a subagent's model be chosen (Claude Code's agents take `model: haiku` or
`sonnet`), choose as above. Where it does not, keep the same split of work and the caps below, and
say in the run's report that the model could not be chosen, since the order will cost more.

## Caps per order

| | Cap | Est. cost |
| --- | --- | --- |
| Web searches, whole order | **200**: about 60 for the pool, at most one per new firm researched, none for catalog firms or the Haiku verifier, one per Sonnet spot-check | $2.00 |
| Firms researched (dossiers written) | **260** (200 kept, 60 rejected), catalog first | Haiku ≈ $1.50 |
| Firms verified | every researched firm that passed the scorecard | Haiku ≈ $0.75 |
| Sonnet spot-checks | **10** | ≈ $1.00 |
| The run (Sonnet: profile, pool, decisions, filing, notes) | three or four runs, each starting fresh | ≈ $3.00 |
| Margin (retries, large MCP results) | | ≈ $1.75 |
| **Order** | | **≈ $10** |

## How to stay inside it

- **The catalog first, by far.** Yellowtail's catalog is already researched, enriched daily and
  free to read. Fill the List from catalog firms that pass, and research new firms from the web only
  for what the catalog cannot supply, best-ranked first. An order that needs more than 80 new firms
  is a sign the catalog is thin in that sector: say so in the desk note, so `/prospecting` covers it.
- **The light path for complete catalog firms.** A catalog firm with its website and LinkedIn, two or
  more people with a `verified` email, and a published signal from the last six months skips
  research: its dossier is built from Yellowtail (`get_company`, `list_signals`), and the verifier
  opens only its newest dated activity and each person's current title. No search.
- **Search once for many.** Pool searches each name many firms at once: a sector's deal round-up for
  the quarter, comparable startups' rounds, a fund-close list. Never a search for a URL Yellowtail
  already has.
- **Fetch, don't search, when the URL is known.** The firm's site, team, portfolio and news pages,
  and LinkedIn, are fetched directly.
- **Contacts from tools, not pages.** For people, `domain_search`, `find_email`, `verify_email` and
  `enrich_person` before reading pages: they answer in a few hundred tokens what a team page takes
  thousands for.
- **Small subagents, short answers.** A researcher takes five firms, a verifier ten dossiers, so no
  Haiku prompt passes 100K tokens. Each writes its dossiers to files and returns one line per firm
  (`PASS · Northwind Climate · 18/20 · 3 people · signals 1 reused 1 new`), never page text.
- **Fresh runs.** Each run starts from the List, the research log and the working folder (step 6),
  not from the last run's conversation, so the run never carries a long history it pays to re-read.
- **Stop early on a weak pool.** If after 120 firms researched fewer than half passed, the pool is
  the problem: stop, say so in the desk note, and rebuild the pool before spending more.

## Keeping count

Each run counts its searches, firms researched, firms verified and spot-checks, adds them to what
earlier runs recorded (the research check's `details.spend` for this order, `SKILL.md` step 10), and
writes the new totals back: `{ searches, researched, verified, spotChecks, runs }`. A run that would
pass a cap stops at it. At a cap with the List short, it does not deliver: the desk note says how far
it got and that the order's budget is spent, so a person decides whether to spend more.
