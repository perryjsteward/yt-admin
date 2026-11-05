# What counts as a signal

Yellowtail exists so founders raising money know which investors are looking for what, right now.
A signal is a dated, attributable piece of that: **who** (a person and/or firm), **what** they are or
aren't looking for, **when**, and **where we learned it**.

The test: *would a founder raising a round change who they contact, or what they say, because of
this?* If yes, it's a signal.

## Signals

| Kind | Example from notes | Tags it usually carries |
| --- | --- | --- |
| Thesis / sector, positive | "doing a lot of climate now" | + industry |
| Thesis / sector, negative | "not touching fintech anymore" | − industry |
| Stage | "only pre-seed now, moved down from A" | + stage, − old stage |
| Geography | "looking at Nordics for the first time" | + geography |
| Cheque size / lead vs follow | "will lead up to £1m" | stage / focus tags that fit; detail in summary |
| Deploying / new fund | "just closed Fund III, deploying hard" | + the fund's focus tags |
| Explicit ask | "send me anything in robotics" | + industry |
| People move | "Raj left Halcyon, now Partner at Northwind" | the new firm's focus tags |
| Announced investment | "Northwind led Heatloop's seed" (press release, the firm's blog or LinkedIn) | the startup's stage and industry tags |

An announced investment is filed as the channel it was announced in (`news`, `blog`, `linkedin`;
there is no `deal` type), with a summary starting "Invested in …" or "Led …", the announcement
date in `occurredAt` and the `sourceUrl`.

A people move is both a signal and a person update. File both in one card.

## Not signals

- **Our follow-ups**: "intro me to Raj", "send deck Monday". → report, "Your follow-ups".
- **Opinions about people**: "seemed distracted", "great guy". → nowhere (or the note, if it
  genuinely matters context, never the signal).
- **Founders and startups** rather than investors, unless the startup is the firm being tracked.
- **Vague**: "interesting chat with Sarah". Nothing a founder could act on. → "Not filed", with
  the reason, so the user can add detail if there was more.
- **No investor**: a statement you can't attach to a firm — a person with no known firm, "some
  fund in Berlin". → a question if research might settle it, otherwise "Not filed". Every signal
  names its investor firm; the server refuses one that doesn't.
- **Already known**: the firm already carries the tag and a signal saying the same thing exists
  recently. → "Already in Yellowtail".

## The firm-tag rule

A firm's tags say what the firm invests in. A signal says what moved. They're related but not the
same, so changes to the firm are proposed on their own line:

- **Add a tag to the firm** when a firm-level statement is positive and the firm doesn't carry the
  tag: "Northwind is doing climate now".
- **Remove a tag from the firm** when a firm-level statement is negative and the firm carries it:
  "Northwind isn't doing hydrogen anymore". The signal carries the tag as **negative**; the removal
  is a separate line the user can reject.
- **Leave the firm alone** when it's one partner's personal interest ("Sarah personally loves
  robotics"), a one-off deal, or hearsay. The signal can still be filed.
- Never remove a tag because the notes simply didn't mention it.

## Sentiment

- `positive` — into it, doing it, looking for it, moving into it.
- `negative` — not doing it, stopped, moving away, explicitly ruled out.

A firm "moving from Series A to pre-seed" is `+ Pre-seed` and `− Series A` on one signal.
