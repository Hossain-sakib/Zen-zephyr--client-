import { metadata, metadataHtml, resourceMetadata, escapeHtml } from '../../src/seo/metadata.js';
const resources = {
  post: 'community/posts',
  profile: 'community/profiles',
  groups: 'social/spaces',
  pages: 'social/spaces',
  events: 'social/events',
  marketplace: 'social/listings',
};
// Fetch only anonymous public data. Never forward cookies or Firebase tokens.
export default async function publicSeo(request, context) {
  const url = new URL(request.url);
  const [area, id, ...extra] = url.pathname.split('/').filter(Boolean);
  if (
    request.method !== 'GET' ||
    !resources[area] ||
    !id ||
    extra.length ||
    (area === 'profile' && id === 'me')
  )
    return context.next();
  const pagePromise = context.next();
  let data;
  let status = 200;
  try {
    const response = await fetch(
      `https://zen-zephyr-api.netlify.app/api/${resources[area]}/${encodeURIComponent(id)}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (response.ok) data = await response.json();
    else status = response.status === 404 || response.status === 400 ? 404 : 200;
  } catch {
    status = 200;
  }
  const page = await pagePromise;
  if (!page.headers.get('content-type')?.includes('text/html')) return page;
  const meta = data
    ? resourceMetadata(url.pathname, data)
    : metadata(url.pathname, '', { title: 'Community content', index: false });
  if (url.search) meta.index = false;
  let html = (await page.text()).replace(
    /<!--seo:start-->[\s\S]*?<!--seo:end-->/,
    `<!--seo:start-->${metadataHtml(meta)}<!--seo:end-->`,
  );
  if (data) {
    const content = data.content || data.description || data.bio || '';
    const title =
      data.title || data.name || `${data.author?.name || 'Community'} shared a conversation`;
    const preview = `<div class="community-app"><main class="cz-main" style="max-width:800px;margin:40px auto;padding:24px"><a href="/">Zen Zephyr community</a><article><h1>${escapeHtml(title)}</h1><p style="white-space:pre-wrap">${escapeHtml(content)}</p></article></main></div>`;
    html = html.replace('<div id="root"></div>', `<div id="root">${preview}</div>`);
  }
  const headers = new Headers(page.headers);
  headers.delete('content-length');
  headers.delete('etag');
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Robots-Tag', meta.index ? 'index, follow' : 'noindex, follow');
  return new Response(html, { status, headers });
}
export const config = {
  path: ['/post/*', '/profile/*', '/groups/*', '/pages/*', '/events/*', '/marketplace/*'],
};
