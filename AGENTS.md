# Plugin repository rules

This repo owns one Claude plugin, the Yellowtail team's desk (`yt-admin`); the application and its
MCP servers live in `perryjsteward/investor-signals`. Read README.md and INSTALL.md first.

- Desk processes only: anything a customer would run on their own data belongs in `yt`, which runs
  on the customer connector and must reference customer tools only.
- Bump `.claude-plugin/plugin.json` and CHANGELOG.md together for every change. Run `pnpm check`.
- MCP tool names must match the app's admin registry (`tests/mcp-tools.json`). Refresh the app's
  contract snapshots with `pnpm plugins:contracts` there. Keep `references/house-rules.md` and
  `references/display.md` byte-identical with `yt` and `yt-raise`.
- Cards and approval precede writes; never send email without the user's instruction.
- Do not make this private repo public without an explicit instruction.
