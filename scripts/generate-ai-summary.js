const fs = require('fs');
const path = require('path');

const reportsDir = path.resolve(__dirname, '..', 'reports');
const outputFile = path.join(reportsDir, 'ai-failure-summary.md');

function readJsonIfExists(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

const payloads = [];

if (fs.existsSync(reportsDir)) {
  for (const entry of fs.readdirSync(reportsDir)) {
    if (entry.endsWith('.json')) {
      const filePath = path.join(reportsDir, entry);
      const data = readJsonIfExists(filePath);
      if (data) payloads.push(data);
    }
  }
}

const lines = [];
lines.push('# AI-Driven Failure Summary');
lines.push('');
lines.push('## Summary');
lines.push('');

if (payloads.length === 0) {
  lines.push('- No failure payloads were found.');
} else {
  for (const payload of payloads) {
    lines.push(`- Test: ${payload.testName || 'unknown'}`);
    lines.push(`  - Status: ${payload.status || 'unknown'}`);
    lines.push(`  - Error: ${payload.error || 'No error message'}`);
    lines.push(`  - Failed Selector: ${payload.failedSelector || 'Not available'}`);
    lines.push('');
  }
}

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(outputFile, lines.join('\n'), 'utf8');
console.log(`Wrote AI summary to ${outputFile}`);
