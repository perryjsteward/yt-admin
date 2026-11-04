import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const root = dirname(dirname(fileURLToPath(import.meta.url)));
export const readJson = path => JSON.parse(readFileSync(join(root, path), 'utf8'));
export const manifest = readJson('.claude-plugin/plugin.json');
export const skills = readdirSync(join(root, 'skills')).filter(name => statSync(join(root, 'skills', name)).isDirectory());
export const toolVerb = /^(whoami|about|list|get|search|create|update|delete|remove|add|set|file|capture|comment|import|invite|revoke|merge|export|find|verify|domain|show)_[a-z_]+$/;
export const external = new Set(readJson('tests/external-tools.json'));
export function markdownFiles(dir) {
  return readdirSync(dir).flatMap(name => {
    if (name.startsWith('.') || ['node_modules', 'tests', 'scripts'].includes(name)) return [];
    const path = join(dir, name);
    return statSync(path).isDirectory() ? markdownFiles(path) : name.endsWith('.md') ? [path] : [];
  });
}
export function contract() {
  const tools = [];
  // The changelog is history: a tool it names may have moved to another plugin since.
  for (const file of markdownFiles(root).filter(f => !f.endsWith('CHANGELOG.md'))) {
    for (const [, tool] of readFileSync(file, 'utf8').matchAll(/`([a-z][a-z_]+)(?:[ (`{]|`)/g)) {
      if (toolVerb.test(tool) && !external.has(tool)) tools.push({ file: relative(root, file), tool });
    }
  }
  const help = readFileSync(join(root, 'skills/help/SKILL.md'), 'utf8');
  const table = help.split('## Help centre articles')[1]?.split('\n## ')[0] ?? '';
  const helpSlugs = [...new Set([
    ...[...table.matchAll(/`([a-z0-9-]+)`/g)].map(match => match[1]),
    ...[...help.matchAll(/help centre: `([a-z0-9-]+)`/g)].map(match => match[1]),
  ])].sort();
  const sharedReferences = Object.fromEntries(['house-rules.md', 'display.md'].map(file => [file,
    createHash('sha256').update(readFileSync(join(root, 'references', file))).digest('hex'),
  ]));
  return {
    plugin: manifest.name, version: manifest.version, repository: manifest.repository,
    tools: [...new Map(tools.map(ref => [`${ref.file}:${ref.tool}`, ref])).values()].sort((a, b) => `${a.file}:${a.tool}`.localeCompare(`${b.file}:${b.tool}`)),
    helpSlugs, sharedReferences,
  };
}
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  process.stdout.write(JSON.stringify(contract(), null, 2) + '\n');
}
