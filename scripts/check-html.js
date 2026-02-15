const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'app', 'all-plan', 'all-plan.page.html');
const text = fs.readFileSync(file, 'utf8');
const lines = text.split(/\r?\n/);
const tagRegex = new RegExp('<!--([\\s\\S]*?)-->|<([a-zA-Z0-9-]+)([^>]*)>|<\\\/([a-zA-Z0-9-]+)[^>]*>', 'g');
const selfClosing = new Set(['br','img','input','meta','link','hr','area','base','col','embed','param','source','track','wbr']);
let stack = [];
let match;
let lineIndex = 0;
while ((match = tagRegex.exec(text)) !== null) {
  const full = match[0];
  const start = match.index;
  // compute line number
  while (lineIndex < lines.length && start >= lines.slice(0, lineIndex+1).join('\n').length) {
    lineIndex++;
  }
  const lineNumber = text.slice(0, start).split(/\r?\n/).length;
  if (match[1] !== undefined) {
    // comment, ignore
    continue;
  }
  if (match[2]) {
    const tag = match[2].toLowerCase();
    const attrs = match[3] || '';
    // skip self-closing like <tag />
    if (/\/$/.test(attrs.trim())) {
      continue;
    }
    if (selfClosing.has(tag)) continue;
    // treat ng-container as non-structural (not push?) but it does have closing tag
    stack.push({tag, line: lineNumber});
  } else if (match[4]) {
    const tag = match[4].toLowerCase();
    // pop until matching tag
    if (stack.length === 0) {
      console.log(`Unmatched closing </${tag}> at line ${lineNumber}`);
      continue;
    }
    const top = stack[stack.length-1];
    if (top.tag === tag) {
      stack.pop();
    } else {
      // try to find matching tag deeper
      let foundIndex = -1;
      for (let i = stack.length-1; i >=0; i--) {
        if (stack[i].tag === tag) { foundIndex = i; break; }
      }
      if (foundIndex === -1) {
        console.log(`Unexpected closing </${tag}> at line ${lineNumber}. Top of stack is </${top.tag}> opened at line ${top.line}`);
      } else {
        console.log(`Mismatched nesting: closing </${tag}> at line ${lineNumber} but top is </${top.tag}> opened at line ${top.line}. Will pop until match.`);
        stack.splice(foundIndex, 1);
      }
    }
  }
}
if (stack.length > 0) {
  console.log('Unclosed tags at end of file:');
  stack.forEach(s => console.log(`${s.tag} opened at line ${s.line}`));
} else {
  console.log('No mismatched tags detected.');
}
