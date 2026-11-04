# Install and release Yellowtail Admin

Repository: `perryjsteward/yt-admin` (private). Marketplace: `yellowtail-admin`. Plugin: `yt-admin`.
For the Yellowtail team only: the connector refuses anyone who is not a platform admin.

```sh
claude plugin marketplace add perryjsteward/yt-admin
claude plugin install yt-admin@yellowtail-admin
```

Install `yt@yellowtail-club` too: the desk skills hand off to its commands. Sign the connector in
as your platform-admin account.

## Release

1. Edit this repo, bump `.claude-plugin/plugin.json` and add the version to CHANGELOG.md.
2. Run `pnpm check`.
3. For changed tool references, run `pnpm plugins:contracts` in the app repo with this repo cloned
   beside it, and commit the refreshed `data/plugin-contracts/yt-admin.json` there.
4. Commit and push. Users run `claude plugin marketplace update yellowtail-admin` and
   `claude plugin update yt-admin@yellowtail-admin`.

`tests/mcp-tools.json` is the admin connector's tool list (every tool); the app checks the exported
contract against its real registry.
