export const SITE_URL = 'https://zen-zephyr-social.netlify.app';
export const SOCIAL_IMAGE =
  'https://res.cloudinary.com/wiooqx7y/image/upload/f_png,w_512,h_512,c_fit/v1794505164/zen-zephyr/site-assets/1f0a9a6a165686c4b294.png';
export const publicPages = {
  '/': [
    'Zen Zephyr — A community for meaningful connections',
    'Share your world, meet curious people and join thoughtful conversations. Discover groups, stories, events and your community marketplace on Zen Zephyr.',
  ],
  '/explore': [
    'Explore conversations',
    'Discover fresh perspectives and conversations about design, technology, photography, art and everyday life in the Zen Zephyr community.',
  ],
  '/people': [
    'Meet the community',
    'Find people with shared interests, explore public profiles and make meaningful connections on Zen Zephyr.',
  ],
  '/groups': [
    'Community groups',
    'Find your circle on Zen Zephyr. Discover groups around shared interests and start thoughtful conversations with your community.',
  ],
  '/pages': [
    'Community pages',
    'Discover creators, projects and community pages on Zen Zephyr. Follow the ideas and people that inspire you.',
  ],
  '/events': [
    'Community events',
    'Discover upcoming Zen Zephyr community events. Meet up, learn something new and make time for meaningful connections.',
  ],
  '/marketplace': [
    'Community marketplace',
    'Discover useful items in the Zen Zephyr community marketplace and connect directly with sellers. Give something loved a new home.',
  ],
  '/stories': [
    'Community stories',
    'Explore thoughts, photos and little moments shared by the Zen Zephyr community. Stories are available for 24 hours.',
  ],
  '/discover': [
    'Discover your community',
    'Explore everything in Zen Zephyr: groups, pages, events, stories, people and the community marketplace.',
  ],
  '/guidelines': [
    'Community guidelines',
    'Read the Zen Zephyr community guidelines. Help build a welcoming space through kindness, respect, privacy and thoughtful conversations.',
  ],
};
const privateTitles = {
  signin: 'Log in',
  signup: 'Join the community',
  messages: 'Messages',
  saved: 'Saved posts',
  notifications: 'Notifications',
  settings: 'Privacy settings',
  moderation: 'Moderation',
  dashboard: 'Dashboard',
};
export function metadata(pathname = '/', search = '', overrides = {}) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const info = publicPages[path];
  const resourcePath =
    /^\/(post|profile|groups|pages|events|marketplace)\/[^/]+$/.test(path) &&
    path !== '/profile/me';
  const title = overrides.title || info?.[0] || privateTitles[path.split('/')[1]] || 'Zen Zephyr';
  return {
    title: title.includes('Zen Zephyr') ? title : `${title} · Zen Zephyr`,
    description:
      overrides.description?.slice(0, 160) ||
      info?.[1] ||
      'Your personal space in the Zen Zephyr community.',
    canonical: SITE_URL + path,
    image: overrides.image || SOCIAL_IMAGE,
    index: overrides.index ?? ((!!info || resourcePath) && !search),
    type: overrides.type || 'website',
  };
}
export function escapeHtml(value = '') {
  return String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
}
export function websiteSchema(meta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Zen Zephyr',
    url: SITE_URL,
    description: meta.description,
    inLanguage: 'en',
  };
}
export function metadataHtml(meta) {
  return (
    `<title data-rh="true">${escapeHtml(meta.title)}</title>\n` +
    Object.entries({
      description: meta.description,
      robots: meta.index ? 'index, follow, max-image-preview:large' : 'noindex, follow',
      'twitter:card': 'summary_large_image',
      'twitter:title': meta.title,
      'twitter:description': meta.description,
      'twitter:image': meta.image,
    })
      .map(
        ([name, content]) =>
          `<meta data-rh="true" name="${name}" content="${escapeHtml(content)}" />`,
      )
      .join('\n') +
    '\n' +
    Object.entries({
      'og:site_name': 'Zen Zephyr',
      'og:title': meta.title,
      'og:description': meta.description,
      'og:type': meta.type,
      'og:url': meta.canonical,
      'og:image': meta.image,
      'og:image:alt': 'Zen Zephyr community',
    })
      .map(
        ([property, content]) =>
          `<meta data-rh="true" property="${property}" content="${escapeHtml(content)}" />`,
      )
      .join('\n') +
    `\n<link data-rh="true" rel="canonical" href="${escapeHtml(meta.canonical)}" />` +
    (meta.canonical === SITE_URL + '/'
      ? `<script data-rh="true" type="application/ld+json">${JSON.stringify(websiteSchema(meta)).replace(/</g, '\\u003c')}</script>`
      : '')
  );
}
export function resourceMetadata(path, data) {
  const area = path.split('/')[1];
  if (area === 'post')
    return metadata(path, '', {
      title: `${data.author?.name || 'A member'} shared a conversation`,
      description: data.content,
      image: data.image || undefined,
      index: data.visibility !== 'friends' && !data.isDemo,
      type: 'article',
    });
  if (area === 'profile')
    return metadata(path, '', {
      title: data.name,
      description: data.bio || `Meet ${data.name} on Zen Zephyr.`,
      image: data.image || undefined,
      index: !data.isDemo && !path.endsWith('/me'),
    });
  return metadata(path, '', {
    title: data.title,
    description: data.description,
    image: data.image || data.images?.[0],
    index: data.visibility !== 'private',
  });
}
