# Zen Zephyr community

A responsive community platform deployed at https://zen-zephyr-social.netlify.app.
The frontend uses React 18, Vite, React Router, React Query, and Firebase Authentication.

## Community experience

- Responsive desktop navigation and mobile bottom navigation, with light/dark appearance.
- Searchable, topic-filtered, paginated feeds and a connections feed.
- Inline text/photo publishing with public or connections-only audiences.
- Appreciations, comments, saved posts, sharing, and author editing/deletion.
- Editable profiles, member discovery, connection requests and acceptance/removal.
- Personal activity notifications, read state, reporting and an admin moderation queue.
- Email/password signup/login and Google sign-in through Firebase.
- All image uploads use backend-signed Cloudinary uploads; no ImgBB key is needed.

## Configuration and checks

Copy `.env.example` to `.env.local` and fill the public Firebase web configuration.
Only `VITE_` settings go in this frontend: never add Cloudinary secrets, database
credentials, or deployment tokens here. The API URL includes `/api`.

```sh
npm ci
npm run lint
npm run build
```

Netlify builds with `npm run build`, publishes `dist`, and rewrites deep links to
`index.html` using `netlify.toml`. Frontend environment variables are build-time
values; rebuild after changing them. Add the frontend hostname to Firebase's
Authentication authorized domains and enable email/password and Google providers.

The matching API is in Hossain-sakib/Zen-zephyr--server. New community screens
use `/api/community`; authenticated requests carry refreshed Firebase ID tokens.
No fabricated users, posts, activity counts or notifications are seeded. Empty
states reflect the actual connected database. Payments, messaging, stories and
groups are outside this community release.

## Portfolio embedding

Netlify serves `public/_headers` as the HTTP response policy for every path:

```http
Content-Security-Policy: frame-ancestors https://sakib-studio.netlify.app;
```

Only that exact HTTPS origin may embed the site. `self`, wildcard origins,
other domains, and untrusted outer ancestors are not allowed. No
`X-Frame-Options` header is emitted. Existing HSTS is retained. The app handles
third-party storage denial by keeping appearance state in memory.

Verified against the deployed site in Chromium: the actual portfolio origin
renders the app; example.com, same-origin embedding, and a portfolio frame inside
an untrusted outer origin are blocked. `npm test` covers the configuration and
storage-denial regression. The new favicon and touch icon are served by Cloudinary.


## Community expansion

The deployed system includes public/private groups with membership approval,
public pages with owner updates, direct messages with photos and read receipts,
24-hour stories, events with RSVPs, marketplace listings and account blocking.
Messaging refreshes every three seconds while a conversation is open; inboxes
refresh every ten seconds. These are authenticated conversations, without
end-to-end encryption. Marketplace payments and video calls are not implemented.

Twelve fictional demo profiles, ten posts and thirty comments are clearly labeled.
Demo accounts cannot receive connection requests or messages. Photos are served
from Cloudinary; the demo helper is idempotent and is not exposed as a deployed
HTTP endpoint. Stories are hidden immediately at expiry and MongoDB TTL indexes
remove their records later; Cloudinary assets are not automatically erased.

The frontend permits framing only by `https://sakib-studio.netlify.app` through
its response CSP. Keep `public/_headers` in the published frontend build and do
not add a conflicting `X-Frame-Options` header.
