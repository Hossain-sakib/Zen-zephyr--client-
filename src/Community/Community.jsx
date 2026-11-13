import { Suspense, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PageMetadata from '../seo/PageMetadata';
import {
  FiHome,
  FiUsers,
  FiBell,
  FiArrowRight,
  FiX,
  FiCheckCircle,
  FiMessageSquare,
  FiGrid,
} from 'react-icons/fi';
import useAuth from '../Hooks/useAuth';
import useAxiosPublic from '../Hooks/useAxiosPublic';
import { StoryShelf } from './Stories';
import { readLocal, writeLocal } from '../utils/storage';
import { Modal, Empty, Skeleton } from './ui';
import { Sidebar, Header, RightRail, Hero } from './Shell';
import { Composer, Feed, RequireSignIn } from './Feed';
import { Guidelines } from './Guidelines';
import { PageHeading } from './ui';
import { CommunityContext } from './core-context';
import { lazy } from 'react';
import './community.css';
const NetworkApp = lazy(() => import('./Network'));
const PeoplePage = lazy(() =>
  import('./People').then((module) => ({ default: module.PeoplePage })),
);
const ProfilePage = lazy(() =>
  import('./People').then((module) => ({ default: module.ProfilePage })),
);
const NotificationPage = lazy(() =>
  import('./Activity').then((module) => ({ default: module.NotificationPage })),
);
const PostPage = lazy(() => import('./Activity').then((module) => ({ default: module.PostPage })));
const ModerationPage = lazy(() =>
  import('./Activity').then((module) => ({ default: module.ModerationPage })),
);
const AuthPage = lazy(() => import('./AuthPage').then((module) => ({ default: module.AuthPage })));
export default function CommunityApp() {
  const { user, loading, signOutUser } = useAuth();
  const api = useAxiosPublic();
  const cache = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => readLocal('zen-appearance', 'light'));
  const [guidelines, setGuidelines] = useState(false);
  const [message, setMessage] = useState('');
  const timeout = useRef();
  const me = useQuery({
    queryKey: ['community', 'me', user?.uid],
    enabled: !!user,
    queryFn: async () => (await api.get('/community/me')).data,
    retry: false,
  });
  const inbox = useQuery({
    queryKey: ['social', 'inbox', user?.uid],
    enabled: !!user,
    queryFn: async () => (await api.get('/social/conversations/unread')).data,
    retry: false,
    refetchInterval: user ? 10000 : false,
  });
  const notifications = useQuery({
    queryKey: ['community', 'notifications', user?.uid],
    enabled: !!user,
    queryFn: async () => (await api.get('/community/notifications')).data,
    retry: false,
    refetchInterval: user ? 60000 : false,
  });
  useEffect(() => {
    document.documentElement.dataset.communityTheme = theme;
    writeLocal('zen-appearance', theme);
    return () => {
      delete document.documentElement.dataset.communityTheme;
    };
  }, [theme]);
  useEffect(() => () => clearTimeout(timeout.current), []);
  function toast(value) {
    setMessage(value);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setMessage(''), 5000);
  }
  async function signOut() {
    try {
      await signOutUser();
      cache.clear();
      navigate('/');
      toast('See you around.');
    } catch {
      toast('Couldn’t sign out. Please try again.');
    }
  }
  const networkContext = { api, user, me, toast, loading };
  const path = location.pathname.replace(/\/+$/, '') || '/';
  const authPage = path === '/signin' || path === '/signup';
  let content;
  if (path === '/')
    content = (
      <>
        {!user && <Hero />}
        <StoryShelf context={networkContext} />
        <div className="cz-feed-heading">
          <div>
            <span className="cz-eyebrow">THE LITTLE THINGS, SHARED</span>
            <h2>Your daily dose of connection</h2>
          </div>
          <span className="cz-handwritten">stay curious ✦</span>
        </div>
        <Composer />
        <Feed />
      </>
    );
  else if (
    /^\/(messages|groups|pages|events|marketplace|stories|settings|discover)(\/|$)/.test(path)
  ) {
    content = (
      <Suspense fallback={<Skeleton />}>
        <NetworkApp context={networkContext} />
      </Suspense>
    );
  } else if (path === '/explore') {
    content = (
      <>
        <PageHeading
          eyebrow="FOLLOW YOUR CURIOSITY"
          title="A world of little discoveries."
          description="Fresh perspectives, shared passions, and conversations worth your time."
        />
        <Feed />
      </>
    );
  } else if (path === '/people') {
    content = <PeoplePage />;
  } else if (path === '/saved') {
    content = (
      <RequireSignIn>
        <PageHeading
          eyebrow="KEEP THE GOOD STUFF"
          title="Worth coming back to."
          description="The ideas, moments and conversations you saved for later."
        />
        <Feed view="saved" />
      </RequireSignIn>
    );
  } else if (path === '/notifications') {
    content = (
      <RequireSignIn>
        <NotificationPage />
      </RequireSignIn>
    );
  } else if (path.startsWith('/profile/')) {
    content = <ProfilePage id={decodeURIComponent(path.split('/')[2] || 'me')} />;
  } else if (path.startsWith('/post/')) {
    content = <PostPage id={path.split('/')[2]} />;
  } else if (path === '/moderation') {
    content = (
      <RequireSignIn>
        <ModerationPage />
      </RequireSignIn>
    );
  } else if (path === '/guidelines') {
    content = (
      <div className="cz-card">
        <h1 className="cz-subheading">Community guidelines</h1>
        <Guidelines />
      </div>
    );
  } else if (authPage) {
    content = <AuthPage signup={path === '/signup'} />;
  } else
    content = (
      <div className="cz-card">
        <Empty
          title="A little off the beaten path."
          action={
            <Link className="cz-button primary" to="/">
              Back to your community <FiArrowRight />
            </Link>
          }
        >
          We couldn’t find this page. There’s plenty to explore back home.
        </Empty>
      </div>
    );
  return (
    <CommunityContext.Provider
      value={{
        user,
        loading,
        api,
        me,
        notifications,
        inbox,
        toast,
        signOut,
        theme,
        setTheme,
        setGuidelines,
      }}
    >
      <div className="community-app">
        <PageMetadata />
        <Header />
        {authPage ? (
          <main className="cz-auth-layout">
            <Suspense fallback={<Skeleton />}>{content}</Suspense>
          </main>
        ) : (
          <div className="cz-layout">
            <Sidebar />
            <main className="cz-main">
              <Suspense fallback={<Skeleton />}>{content}</Suspense>
            </main>
            <RightRail />
          </div>
        )}
        <nav className="cz-mobile-nav" aria-label="Mobile navigation">
          {[
            [FiHome, '/', 'Feed'],
            [FiUsers, '/groups', 'Groups'],
            [FiMessageSquare, '/messages', 'Messages'],
            [FiBell, '/notifications', 'Updates'],
            [FiGrid, '/discover', 'Menu'],
          ].map(([Icon, href, label]) => (
            <NavLink
              key={label}
              end={href === '/'}
              to={href}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <Icon />
              <span>{label}</span>
              {href === '/messages' && inbox.data?.unread > 0 && (
                <i className="nz-mobile-badge">
                  {inbox.data.unread > 99 ? '99+' : inbox.data.unread}
                </i>
              )}
            </NavLink>
          ))}
        </nav>
        {message && (
          <div className="cz-toast" role="status">
            <FiCheckCircle />
            <span>{message}</span>
            <button aria-label="Dismiss notification" onClick={() => setMessage('')}>
              <FiX />
            </button>
          </div>
        )}
        {guidelines && (
          <Modal title="Our shared values" close={() => setGuidelines(false)}>
            <Guidelines />
          </Modal>
        )}
      </div>
    </CommunityContext.Provider>
  );
}
