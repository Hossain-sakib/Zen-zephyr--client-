import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiHome,
  FiCompass,
  FiUsers,
  FiBookmark,
  FiBell,
  FiSearch,
  FiArrowUpRight,
  FiArrowRight,
  FiChevronDown,
  FiLogOut,
  FiSun,
  FiMoon,
  FiEdit2,
  FiFlag,
  FiSmile,
  FiShield,
  FiMessageSquare,
  FiCalendar,
  FiShoppingBag,
  FiClock,
  FiSettings,
} from 'react-icons/fi';
import { Avatar } from './ui';
import { useCommunity, topics, topicEmojis } from './core-context';
export function Sidebar() {
  const { user, me, notifications, inbox, theme, setTheme, setGuidelines } = useCommunity();
  const links = [
    [FiHome, 'Your feed', '/'],
    [FiCompass, 'Explore', '/explore'],
    [FiUsers, 'People', '/people'],
    [FiMessageSquare, 'Messages', '/messages'],
    [FiBookmark, 'Saved posts', '/saved'],
    [FiBell, 'Notifications', '/notifications'],
  ];
  return (
    <aside className="cz-sidebar">
      <p className="cz-section-label">YOUR SPACE</p>
      <nav aria-label="Main navigation">
        {links.map(([Icon, label, href]) => (
          <NavLink
            end={href === '/'}
            key={href}
            to={href}
            className={({ isActive }) => `cz-nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon />
            <span>{label}</span>
            {href === '/messages' && inbox.data?.unread > 0 && (
              <span className="cz-badge">{inbox.data.unread}</span>
            )}
            {href === '/notifications' && notifications.data?.unread > 0 && (
              <span className="cz-badge">{notifications.data.unread}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <p className="cz-section-label">COMMUNITY</p>
      <nav aria-label="Community features">
        {[
          [FiUsers, '/groups', 'Groups'],
          [FiFlag, '/pages', 'Pages'],
          [FiCalendar, '/events', 'Events'],
          [FiShoppingBag, '/marketplace', 'Marketplace'],
          [FiClock, '/stories', 'Stories'],
          [FiSettings, '/settings', 'Privacy'],
        ].map(([Icon, href, label]) => (
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) => `cz-nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="cz-nav-link" onClick={() => setGuidelines(true)}>
        <FiShield />
        <span>Our shared values</span>
      </button>
      <Link className="cz-nav-link" to={user ? '/profile/me' : '/signup'}>
        <FiSmile />
        <span>{user ? 'My profile' : 'Find your people'}</span>
      </Link>
      <div className="cz-sidebar-invite">
        <span className="cz-spark">✳</span>
        <h3>A little more human.</h3>
        <p>A place for good ideas and the people behind them.</p>
        <Link to="/people">
          Meet the community <FiArrowUpRight />
        </Link>
      </div>
      <div className="cz-sidebar-bottom">
        <button
          className="cz-nav-link"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
          <span>{theme === 'light' ? 'Switch to dark' : 'Switch to light'}</span>
        </button>
        {user && (
          <Link to="/profile/me" className="cz-sidebar-profile">
            <Avatar person={me.data || { name: user.displayName, image: user.photoURL }} />
            <span>
              <strong>{me.data?.name || user.displayName || 'Your profile'}</strong>
              <small>Your little corner</small>
            </span>
            <FiArrowUpRight />
          </Link>
        )}
        <p className="cz-copyright">Zen Zephyr · Made for connection</p>
      </div>
    </aside>
  );
}
export function Header() {
  const { user, me, signOut, notifications, inbox, theme, setTheme } = useCommunity();
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  useEffect(() => {
    setSearch(params.get('q') || '');
  }, [params]);
  function submit(event) {
    event.preventDefault();
    navigate(
      `${location.pathname === '/people' ? '/people' : '/explore'}?q=${encodeURIComponent(search)}`,
    );
  }
  return (
    <header className="cz-header">
      <div className="cz-header-inner">
        <Link to="/" className="cz-brand" aria-label="Zen Zephyr home">
          <span className="cz-brand-symbol">
            z<span>✳</span>
          </span>
          <span>
            zen<span className="cz-brand-light">zephyr</span>
            <b>.</b>
          </span>
        </Link>
        <form className="cz-search" role="search" onSubmit={submit}>
          <FiSearch />
          <input
            aria-label="Search the community"
            placeholder="Search the community"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <FiArrowRight />
          </button>
        </form>
        <div className="cz-header-actions">
          <button
            className="cz-icon-button cz-theme-toggle"
            aria-label={
              theme === 'light' ? 'Switch to dark appearance' : 'Switch to light appearance'
            }
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
          <Link
            className="cz-icon-button cz-notification-link"
            to="/messages"
            aria-label={`Messages${inbox.data?.unread ? `, ${inbox.data.unread} unread` : ''}`}
          >
            <FiMessageSquare />
            {inbox.data?.unread > 0 && <i />}
          </Link>
          <Link
            className="cz-icon-button cz-notification-link"
            to="/notifications"
            aria-label="Notifications"
          >
            <FiBell />
            {notifications.data?.unread > 0 && <i />}
          </Link>
          {user ? (
            <details className="cz-account-menu">
              <summary aria-label="Account menu">
                <Avatar person={me.data || { name: user.displayName, image: user.photoURL }} />
                <FiChevronDown />
              </summary>
              <div>
                <Link to="/profile/me">
                  <FiSmile />
                  My profile
                </Link>
                <Link to="/settings">
                  <FiShield />
                  Privacy settings
                </Link>
                {me.data?.isAdmin && (
                  <Link to="/moderation">
                    <FiShield />
                    Moderation
                  </Link>
                )}
                <button onClick={signOut}>
                  <FiLogOut />
                  Sign out
                </button>
              </div>
            </details>
          ) : (
            <>
              <Link className="cz-login-link" to="/signin">
                Log in
              </Link>
              <Link className="cz-button primary small" to="/signup">
                Join us <FiArrowUpRight />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
export function RightRail() {
  const { api, user, me } = useCommunity();
  const stats = useQuery({
    queryKey: ['community', 'stats'],
    queryFn: async () => (await api.get('/community/stats')).data,
    retry: false,
    staleTime: 60000,
  });
  return (
    <aside className="cz-right-rail">
      <div className="cz-card cz-welcome-card">
        <div className="cz-panel-heading">
          <h3>Your kind of corner</h3>
          <span>✦</span>
        </div>
        <p>
          Curious minds. Everyday moments.
          <br />A community that feels like you.
        </p>
        <div className="cz-community-mark">
          <span>z.</span>
          <i>✦</i>
          <b>✳</b>
        </div>
        {stats.data && (
          <div className="cz-community-stats">
            <span>
              <strong>{stats.data.members.toLocaleString()}</strong>members
            </span>
            <span>
              <strong>{stats.data.posts.toLocaleString()}</strong>conversations
            </span>
          </div>
        )}
        <Link className="cz-button secondary" to={user ? '/profile/me' : '/signup'}>
          {user ? 'Make yourself at home' : 'Be part of something good'} <FiArrowUpRight />
        </Link>
      </div>
      <div className="cz-card cz-topic-panel">
        <div className="cz-panel-heading">
          <h3>Find your spark</h3>
          <FiCompass />
        </div>
        <p>A good conversation starts here.</p>
        {topics.slice(0, 5).map((topic, i) => (
          <Link
            className="cz-topic-link"
            key={topic}
            to={`/explore?topic=${encodeURIComponent(topic)}`}
          >
            <span>{topicEmojis[i]}</span>
            <div>
              <strong>{topic}</strong>
              <small>
                {
                  [
                    'Little moments, big connections',
                    'Ideas worth sharing',
                    'What’s next, together',
                    'See things a little differently',
                    'Ask away. We’re listening.',
                  ][i]
                }
              </small>
            </div>
            <FiArrowUpRight />
          </Link>
        ))}
      </div>
      <div className="cz-kindness-note">
        <span>✺</span>
        <div>
          <h3>Make someone’s day.</h3>
          <p>Leave a thoughtful comment. Welcome a new face. The little things matter.</p>
        </div>
      </div>
      {user && me.data && (
        <Link className="cz-complete-profile" to="/profile/me">
          <FiEdit2 />
          <span>
            {me.data.bio
              ? 'Keep your profile feeling like you'
              : 'A few words about you go a long way'}
          </span>
          <FiArrowRight />
        </Link>
      )}
      <footer className="cz-rail-footer">
        <Link to="/guidelines">Community guidelines</Link>
        <span>Built for people, not noise.</span>
      </footer>
    </aside>
  );
}
export function Hero() {
  const { user } = useCommunity();
  return (
    <section className="cz-hero">
      <div className="cz-hero-copy">
        <span className="cz-eyebrow">
          <i /> A COMMUNITY, NOT JUST A FEED
        </span>
        <h1>
          Good company.
          <br />
          Better conversations<span>.</span>
        </h1>
        <p>
          Share a little of your world.
          <br />
          Discover a little of someone else’s.
        </p>
        <Link className="cz-hero-link" to={user ? '/people' : '/signup'}>
          {user ? 'Find your people' : 'Find your place'} <FiArrowUpRight />
        </Link>
      </div>
      <div className="cz-hero-art" aria-hidden="true">
        <div className="cz-orbit orbit-one" />
        <div className="cz-orbit orbit-two" />
        <span className="cz-orbit-spark">✳</span>
        <span className="cz-orbit-star">✦</span>
        <span className="cz-orbit-dot" />
        <div className="cz-art-message one">
          <span>☺</span>
          <i />
          <i />
        </div>
        <div className="cz-art-message two">
          <span>♡</span>
          <i />
        </div>
        <div className="cz-art-sticker">
          a little more
          <br />
          <strong>connected.</strong>
        </div>
      </div>
    </section>
  );
}
