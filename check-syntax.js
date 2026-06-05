const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
let failed = false;
const walk = (dir, out = []) => {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name === 'node_modules') continue;
    const fullPath = path.join(dir, name.name);
    if (name.isDirectory()) walk(fullPath, out);
    else if (fullPath.endsWith('.js')) out.push(fullPath);
  }
  return out;
};
const files = walk(process.cwd());
for (const file of files) {
  try {
    execSync(`node --check "${file}"`, { stdio: 'ignore' });
    console.log(`OK ${path.relative(process.cwd(), file)}`);
  } catch (err) {
    console.error(`FAILED ${path.relative(process.cwd(), file)}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('ALL SOURCE CHECKS PASSED');
