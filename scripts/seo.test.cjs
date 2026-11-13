const { test } = require('node:test');
const assert = require('node:assert/strict');
test('canonical URLs remove queries and private routes stay out of search', async () => {
  const { metadata, publicPages } = await import('../src/seo/metadata.js');
  for (const path of Object.keys(publicPages)) {
    const m = metadata(path);
    assert.equal(m.index, true);
    assert.ok(m.description.length > 60);
    assert.match(m.canonical, /^https:\/\/zen-zephyr-social.netlify.app/);
  }
  for (const path of [
    '/signin',
    '/signup',
    '/messages',
    '/messages/abc',
    '/saved',
    '/settings',
    '/profile/me',
    '/dashboard/adminProfile',
    '/unknown',
  ])
    assert.equal(metadata(path).index, false, path);
  const search = metadata('/explore', '?q=private+query');
  assert.equal(search.index, false);
  assert.equal(search.canonical, 'https://zen-zephyr-social.netlify.app/explore');
});
test('public SEO excludes demo and private posts and escapes user HTML', async () => {
  const { resourceMetadata, metadataHtml, metadata } = await import('../src/seo/metadata.js');
  const post = {
    author: { name: '<script>bad()</script>' },
    content: '" onload="bad()',
    visibility: 'friends',
  };
  assert.equal(resourceMetadata('/post/123', post).index, false);
  assert.equal(
    resourceMetadata('/post/123', { ...post, visibility: 'public', isDemo: true }).index,
    false,
  );
  const html = metadataHtml(resourceMetadata('/post/123', { ...post, visibility: 'public' }));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  const payload = '</script><img src=x onerror=bad()>';
  const home = metadataHtml(metadata('/', '', { description: payload }));
  const json = home.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/)?.[1];
  assert.ok(json, 'homepage structured data must be present before JavaScript runs');
  assert.equal(JSON.parse(json).description, payload);
  assert.ok(!home.includes('<img src=x'));
});
test('public resource HTML preserves security headers and never forwards credentials', async () => {
  const { default: edge } = await import('../netlify/edge-functions/public-seo.js');
  const prior = global.fetch;
  const base = () =>
    new Response('<!--seo:start--><!--seo:end--><div id="root"></div>', {
      headers: {
        'content-type': 'text/html',
        'Content-Security-Policy': 'frame-ancestors https://sakib-studio.netlify.app;',
      },
    });
  try {
    global.fetch = async (url, options) => {
      assert.ok(!options.headers);
      assert.ok(!options.credentials);
      return Response.json({
        author: { name: 'Alice' },
        content: '<img src=x onerror=bad()>',
        visibility: 'public',
      });
    };
    const response = await edge(
      new Request('https://zen-zephyr-social.netlify.app/post/123', {
        headers: { authorization: 'Bearer must-not-forward' },
      }),
      { next: async () => base() },
    );
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(
      response.headers.get('content-security-policy'),
      'frame-ancestors https://sakib-studio.netlify.app;',
    );
    const html = await response.text();
    assert.ok(html.includes('&lt;img'));
    assert.ok(!html.includes('<img src=x'));
    assert.equal(response.headers.get('x-robots-tag'), 'index, follow');
    global.fetch = async () => new Response('{}', { status: 404 });
    const missing = await edge(new Request('https://zen-zephyr-social.netlify.app/post/123'), {
      next: async () => base(),
    });
    assert.equal(missing.status, 404);
    assert.equal(missing.headers.get('x-robots-tag'), 'noindex, follow');
    assert.ok(!(await missing.text()).includes('onerror'));
  } finally {
    global.fetch = prior;
  }
});
test('responsive image transforms stay within the configured image account', async () => {
  const { optimizedImage, imageSources } = await import('../src/utils/images.js');
  const own = 'https://res.cloudinary.com/wiooqx7y/image/upload/v123/example.jpg';
  assert.ok(optimizedImage(own, 800).includes('f_auto,q_auto,c_limit,w_800'));
  assert.equal(optimizedImage('https://example.com/photo.jpg'), 'https://example.com/photo.jpg');
  assert.equal(imageSources(own).split(', ').length, 3);
});
