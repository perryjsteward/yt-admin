import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { contract, manifest, markdownFiles, readJson, root, skills } from '../scripts/plugin-contract.mjs';

test('the root marketplace installs this plugin independently', () => {
  const market = readJson('.claude-plugin/marketplace.json');
  assert.equal(market.plugins.length, 1);
  assert.equal(market.plugins[0].name, manifest.name);
  assert.equal(market.plugins[0].source, './');
  assert.equal(manifest.dependencies?.length ?? 0, 0);
  for (let old of Object.keys(market.renames ?? {})) {
    const seen = new Set();
    while (old in market.renames) {
      assert.ok(!seen.has(old), 'rename cycle');
      seen.add(old); old = market.renames[old];
    }
    assert.equal(old, manifest.name);
  }
});

test('skill MCP references match the verified server contract', () => {
  const known = new Set(readJson('tests/mcp-tools.json'));
  assert.deepEqual(contract().tools.filter(ref => !known.has(ref.tool)), []);
});

test('every skill has accepted frontmatter, a README row, /help routing and an output mode', () => {
  const readme = readFileSync(join(root, 'README.md'), 'utf8');
  const help = readFileSync(join(root, 'skills/help/SKILL.md'), 'utf8');
  for (const name of skills) {
    const body = readFileSync(join(root, 'skills', name, 'SKILL.md'), 'utf8');
    const front = /^---\n([\s\S]*?)\n---/.exec(body)?.[1] ?? '';
    assert.match(front, new RegExp(`^name: ${name}$`, 'm'));
    const description = /^description: (.*)$/m.exec(front)?.[1] ?? '';
    assert.ok(description.length > 40 && description.length <= 1024, `${name}: ${description.length} characters`);
    assert.doesNotMatch(description, /[<>]/);
    assert.match(readme, new RegExp(`\`/?${name}[\` ]`), `README: ${name}`);
    if (name !== 'help') assert.match(help, new RegExp(`\`/${name}[\` ]`), `help: ${name}`);
    assert.match(/^## Output[^\n]*\n\s*\n(.*)$/m.exec(body)?.[1] ?? '', /^Display: (inline|dashboard|document) — /, `output: ${name}`);
  }
});

test('all referenced shipped files exist', () => {
  for (const file of markdownFiles(root)) {
    if (file.endsWith('CHANGELOG.md')) continue;
    const text = readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /`\.\.\/\.\.\/(\.\.\/)?references\//);
    for (const [, rel] of text.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([\w./-]+\.(?:md|py|html|json))/g)) {
      assert.ok(statSync(join(root, rel)).isFile(), `${file}: ${rel}`);
    }
  }
});

test('the changelog describes the manifest version', () => {
  assert.ok(readFileSync(join(root, 'CHANGELOG.md'), 'utf8').includes(`## ${manifest.version}`));
});
