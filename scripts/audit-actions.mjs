import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const readDirFiles = (dir) =>
  fs
    .readdirSync(dir)
    .map((name) => path.join(dir, name))
    .filter((filePath) => fs.statSync(filePath).isFile() && /\.(js|jsx|mjs)$/.test(filePath));

const actionFiles = readDirFiles('src/state/actions');
const reducerFiles = readDirFiles('src/state/reducers');

const dispatched = new Set();
const actionTypePattern = /type:\s*['"`]([^'"`]+)['"`]/g;

for (const filePath of actionFiles) {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  for await (const line of rl) {
    let match;
    actionTypePattern.lastIndex = 0;
    while ((match = actionTypePattern.exec(line)) !== null) {
      dispatched.add(match[1]);
    }
  }
  
  fileStream.close();
}

const handled = new Set();
const casePattern = /case\s+['"`]([^'"`]+)['"`]/g;

for (const filePath of reducerFiles) {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  for await (const line of rl) {
    let match;
    casePattern.lastIndex = 0;
    while ((match = casePattern.exec(line)) !== null) {
      handled.add(match[1]);
    }
  }
  
  fileStream.close();
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
