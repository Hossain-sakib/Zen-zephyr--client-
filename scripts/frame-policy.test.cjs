const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
test('all paths allow only the exact portfolio as a frame ancestor', () => {
  const headers = fs.readFileSync(path.join(root, 'public/_headers'), 'utf8');
  assert.match(headers, /^\/\*\s*$/m);
  const policy = headers.match(/Content-Security-Policy:\s*(.+)/i)?.[1];
  assert.ok(policy, 'CSP must be an HTTP response header');
  const directives = new Map(
    policy
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const [name, ...values] = s.split(/\s+/);
        return [name, values];
      }),
  );
  assert.deepEqual(directives.get('frame-ancestors'), ['https://sakib-studio.netlify.app']);
  assert.doesNotMatch(headers, /X-Frame-Options\s*:/i);
});
test('favicon is a PNG delivered from the configured Cloudinary account', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const icon = html.match(/<link rel="icon"[^>]*href="([^"]+)"/);
  assert.ok(icon);
  const url = new URL(icon[1]);
  assert.equal(url.origin, 'https://res.cloudinary.com');
  assert.match(url.pathname, /^\/wiooqx7y\/image\/upload\//);
  assert.match(html, /rel="apple-touch-icon"/);
});
test('denied third-party storage does not crash the embedded app', async () => {
  const prior = global.window;
  const isolated = {};
  Object.defineProperty(isolated, 'localStorage', {
    get() {
      throw new Error('Storage access denied');
    },
  });
  global.window = isolated;
  try {
    const { readLocal, writeLocal, removeLocal } = await import('../src/utils/storage.js');
    assert.equal(readLocal('appearance', 'light'), 'light');
    assert.equal(writeLocal('appearance', 'dark'), false);
    assert.equal(removeLocal('access-token'), false);
  } finally {
    if (prior === undefined) delete global.window;
    else global.window = prior;
  }
});
