---
name: invite-founder
description: Yellowtail Admin — Invite a founder you met to create their own free Yellowtail account, after making sure the catalog has good investors for them. Saves the invite as a draft, reads the startup's website for its sector, stage and geography, checks how many investors in Yellowtail fit, researches and files more from the web when coverage is thin (as /yt:investors find does), then shows the invite and sends it on your approval. Their ten free investors are picked once, at onboarding, so the research comes first. Use when someone says "invite this founder", "send [name] a Yellowtail invite", "I met a founder at [event]", or after a call with a founder who should try the product.
argument-hint: "<email> <full name> [company website] [note]"
---

# Invite a founder

A **join invite** asks someone with no Yellowtail account to make one: an email with a link to
`/join`, their name and address filled in, then reminders until they sign up (the app sends them;
`docs` in the app: join invites). It is not `/yt:setup user`, which brings someone into an existing
project.

**The research comes before the email.** A free account's ten investors are picked once, when the
founder finishes onboarding, from the catalog as it is then, and never re-picked. A founder in a
sector Yellowtail covers thinly would get a weak ten for good. So this command saves the invite as
a draft, makes sure the catalog has strong firms for their raise, and only then sends.

Read `${CLAUDE_PLUGIN_ROOT}/references/house-rules.md` first. The research and filing are
`/yt:investors find`' (the `yt` plugin, steps 5 to 7), run on the
founder's criteria instead of an open project.

## Tools

| Tool | Used for | Writes |
| --- | --- | --- |
| `whoami` | step 1: platform admins only | no |
| `list_join_invites` | step 2: an open invite for this address already | no |
| `create_join_invite` | step 3: the draft, `send: false` | yes, a draft (nothing is emailed) |
| `list_tags` | step 4: the catalog's own words for their sector, stage and geography | no |
| `list_companies` | step 5: how many investor firms fit, before and after | no |
| `file_investor` | step 6: the new firms kept, as `/yt:investors find` step 7 files them | yes, only on a clean dry run |
| `update_join_invite` | step 7: the desk's note on the invite | yes |
| `send_join_invite` | step 8: the email, **only on the user's yes** | yes, sends |
| `show_results` | output: the invite as a card (`get_join_invite`) | no |

## Steps

1. **Platform admins only.** `whoami`; if `isPlatformAdmin` is false, say join invites are the
   Yellowtail team's and stop.
2. **One open invite per address.** `list_join_invites` with `q` set to the email. An open invite
   (status `draft` or `pending`) is not made again: offer to send it, or its next reminder, with
   `send_join_invite`. A `signed_up` one means they already have an account; say so and stop.
3. **Save the draft.** Need the email and full name (ask for whichever is missing; the company and
   website help a lot, so ask for the website once if it is missing). `create_join_invite` with
   `email`, `fullName`, `companyName`, `companyWebsite`, `note` (where you met, what they do) and
   **`send: false`**. Nothing is emailed yet.
4. **Read the startup.** From the website (and anything the user said): sector, stage, geography,
   and what they are raising if it says. Map each to the catalog's existing tags (`list_tags`):
   most specific tag plus its parent, as house rules § tags. Never create a tag here.
5. **Check coverage.** `list_companies` for investor firms carrying those tags (stage and sector
   together; geography as well when it narrows sensibly). Note the count.
   - **40 or more** matching firms: coverage is fine. Say so and go to step 7.
   - **Fewer than 40**: research more (step 6).
6. **Research and file.** Follow `/yt:investors find` steps 5 to 7 with the founder's criteria as the
   free-text criteria (no open project: skip its steps about the project's pipelines and lists).
   Aim for about 20 new firms that genuinely fit, each with evidence. File each kept firm exactly as
   `/yt:investors find` files them: firm only, existing tags, `file_investor` dry run first, and a
   profile note starting `Auto-filed by /find-investors, unreviewed`. Then re-run step 5's count.
7. **Note what was done.** `update_join_invite` with a `note` that keeps the user's note and adds
   one line, e.g. "Catalog checked 3 Nov: 18 → 41 firms for seed climate, UK."
8. **Show, then send on a yes.** Show the invite (`show_results` with `get_join_invite`) and the
   coverage before and after, then ask: "Send the invite to <email> now?" On a clear yes,
   `send_join_invite`. Read its `delivery`:
   - `queued`: the email is on its way, and reminders follow on their own until they sign up.
   - `disabled`: email is off on the server. Give the user the `joinUrl` to send themselves.
   On anything but a yes, leave the draft: it is on the admin Invites page to send later.

## Output

Display: inline — who was invited, the coverage before and after (and the firms filed, as names), and
what happened to the email. One `show_results` card for the invite. Never paste the `joinUrl` unless
`delivery` is `disabled`.

## What comes next

- The founder signs up from the link and onboards; their ten are picked then.
- Follow their progress on the admin Invites page (status, then their stage), or with
  `list_join_invites` and `list_email_sends`.
- Review the auto-filed firms in `/catalog-hygiene`.
