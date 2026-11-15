# New tags (Yellowtail Admin)

House rules §12 says when a missing tag is proposed and how it shows on a card. This is how the
desk and the Raise team, on Yellowtail Admin, create one once it is approved. Customers on
Yellowtail Club cannot: their cards list it under **Tags to ask the Yellowtail team for**, and
those requests are what to work from here.

1. **On approval** (`approve` on the card, or the tag line itself), call `create_tag`
   (`{ kind, name, parentId?, slug? }`) **first**, then put the returned id in the same card's
   bundle (`tagIds`, `tags.add`, a signal's `tags`, or the project's interests) and file. Approving
   the card is the explicit request `create_tag` needs.
2. **An industry tag names its group** as `parentId` (one of the groups `list_tags { kind:
   "industry" }` returns; never a hard-coded id). Never a new top-level group, never a child of a
   child.
3. **Alongside its parent, never instead.** A firm given a new specific tag keeps (or also gets)
   the broad tag above it: "Industrial AI" goes on next to "AI & data", not in its place. Other
   firms don't carry the new tag yet, so matching on the broad one must keep working.
4. `created: false` means the kind already had that tag (another case, plural or spelling): use the
   returned tag's id, and say so in the report ("used existing Farm robotics").
5. **A customer asked for one** (a **Tags to ask the Yellowtail team for** line passed on by the
   user): run it through the gate in house rules §12 like any other; if it passes, create it and
   add it to the firm they filed (alongside the parent they used meanwhile).
