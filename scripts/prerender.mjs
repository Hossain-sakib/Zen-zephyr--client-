import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { metadata, metadataHtml, publicPages, SITE_URL } from '../src/seo/metadata.js';
process.env.NODE_ENV = 'production';
const server = await createServer({
  mode: 'production',
  server: { middlewareMode: true },
  appType: 'custom',
});
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx');
  const template = await readFile('dist/index.html', 'utf8');
  const routes = [
    ...Object.keys(publicPages),
    '/signin',
    '/signup',
    '/messages',
    '/saved',
    '/notifications',
    '/settings',
    '/moderation',
  ];
  for (const path of routes) {
    const html = template
      .replace(
        /<!--seo:start-->[\s\S]*?<!--seo:end-->/,
        `<!--seo:start-->${metadataHtml(metadata(path))}<!--seo:end-->`,
      )
      .replace('<!--app-->', await render(path));
    await writeFile(path === '/' ? 'dist/index.html' : `dist/${path.slice(1)}.html`, html);
  }
  const fallback = template
    .replace(
      /<!--seo:start-->[\s\S]*?<!--seo:end-->/,
      `<!--seo:start-->${metadataHtml(metadata('/unavailable'))}<!--seo:end-->`,
    )
    .replace('<!--app-->', '');
  await writeFile('dist/app.html', fallback);
  await writeFile('dist/404.html', fallback);
  await writeFile(
    'dist/sitemap.xml',
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      Object.keys(publicPages)
        .map((path) => `<url><loc>${SITE_URL}${path}</loc></url>`)
        .join('') +
      '</urlset>\n',
  );
  await writeFile(
    'dist/robots.txt',
    `User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /messages\nDisallow: /saved\nDisallow: /notifications\nDisallow: /settings\nDisallow: /moderation\nDisallow: /profile/me\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  );
  console.log(`Pre-rendered ${routes.length} routes; generated sitemap and robots.txt.`);
} finally {
  await server.close();
}
