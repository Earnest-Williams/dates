import fs from 'node:fs';
import path from 'node:path';

const readDirFiles = (dir) =>
  fs
    .readdirSync(dir)
    .map((name) => path.join(dir, name))
    .filter((filePath) => fs.statSync(filePath).isFile() && /\.(js|jsx|mjs)$/.test(filePath));

const actionFiles = readDirFiles('src/state/actions');
const reducerFiles = readDirFiles('src/state/reducers');

const dispatched = new Set();
for (const filePath of actionFiles) {
  const text = fs.readFileSync(filePath, 'utf8');
  for (const match of text.matchAll(/type:\s*['"`]([^'"`]+)['"`]/g)) {
    dispatched.add(match[1]);
  }
}

const handled = new Set();
for (const filePath of reducerFiles) {
  const text = fs.readFileSync(filePath, 'utf8');
  for (const match of text.matchAll(/case\s+['"`]([^'"`]+)['"`]/g)) {
    handled.add(match[1]);
  }
}

const missing = [...dispatched].filter((type) => !handled.has(type)).sort();
if (missing.length > 0) {
  console.error('Unhandled dispatched action types found:');
  for (const actionType of missing) {
    console.error(`- ${actionType}`);
  }
  process.exit(1);
}

console.log(`Action audit passed (${dispatched.size} dispatched, ${handled.size} handled cases).`);
