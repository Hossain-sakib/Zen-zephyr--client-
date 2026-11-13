import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { FiHome, FiCompass, FiUsers, FiBookmark, FiBell, FiSearch, FiArrowUpRight, FiArrowRight, FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal, FiImage, FiGlobe, FiLock, FiX, FiCheck, FiChevronDown, FiLogOut, FiSun, FiMoon, FiMapPin, FiEdit2, FiTrash2, FiFlag, FiArrowLeft, FiSmile, FiSend, FiShield, FiCheckCircle, FiEye, FiEyeOff, FiUserPlus, FiMessageSquare, FiCalendar, FiShoppingBag, FiClock, FiSettings, FiGrid } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../Hooks/useAuth';
import useAxiosPublic from '../Hooks/useAxiosPublic';
import { uploadProfileImage } from '../utils/cloudinary';
import './community.css';
import NetworkApp, { StoryShelf } from './Network';
import { readLocal, writeLocal } from '../utils/storage';
import { Avatar, Modal, Empty, QueryError, Skeleton } from './ui';

const CommunityContext = createContext(null);
const useCommunity = () => useContext(CommunityContext);
const topics = ['Everyday life', 'Design', 'Technology', 'Photography', 'Questions', 'Art & culture'];
const topicEmojis = ['☀️', '✳️', '💡', '📷', '💬', '🎨'];
const errorMessage = error => error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
function relativeTime(value) {
  if (!value) return 'Just now';
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function Sidebar() {
  const { user, me, notifications, theme, setTheme, setGuidelines } = useCommunity();
  const links = [[FiHome, 'Your feed', '/'], [FiCompass, 'Explore', '/explore'], [FiUsers, 'People', '/people'], [FiMessageSquare, 'Messages', '/messages'], [FiBookmark, 'Saved posts', '/saved'], [FiBell, 'Notifications', '/notifications']];
  return <aside className="cz-sidebar"><p className="cz-section-label">YOUR SPACE</p><nav aria-label="Main navigation">{links.map(([Icon, label, href]) => <NavLink end={href === '/'} key={href} to={href} className={({ isActive }) => `cz-nav-link ${isActive ? 'active' : ''}`}><Icon /><span>{label}</span>{href === '/notifications' && notifications.data?.unread > 0 && <span className="cz-badge">{notifications.data.unread}</span>}</NavLink>)}</nav>
    <p className="cz-section-label">COMMUNITY</p><nav aria-label="Community features">{[[FiUsers, "/groups", "Groups"], [FiFlag, "/pages", "Pages"], [FiCalendar, "/events", "Events"], [FiShoppingBag, "/marketplace", "Marketplace"], [FiClock, "/stories", "Stories"], [FiSettings, "/settings", "Privacy"]].map(([Icon, href, label]) => <NavLink key={href} to={href} className={({ isActive }) => `cz-nav-link ${isActive ? "active" : ""}`}><Icon /><span>{label}</span></NavLink>)}</nav><button className="cz-nav-link" onClick={() => setGuidelines(true)}><FiShield /><span>Our shared values</span></button>
    <Link className="cz-nav-link" to={user ? '/profile/me' : '/signup'}><FiSmile /><span>{user ? 'My profile' : 'Find your people'}</span></Link>
    <div className="cz-sidebar-invite"><span className="cz-spark">✳</span><h3>A little more human.</h3><p>A place for good ideas and the people behind them.</p><Link to="/people">Meet the community <FiArrowUpRight /></Link></div>
    <div className="cz-sidebar-bottom"><button className="cz-nav-link" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <FiMoon /> : <FiSun />}<span>{theme === 'light' ? 'Switch to dark' : 'Switch to light'}</span></button>{user && <Link to="/profile/me" className="cz-sidebar-profile"><Avatar person={me.data || { name: user.displayName, image: user.photoURL }} /><span><strong>{me.data?.name || user.displayName || 'Your profile'}</strong><small>Your little corner</small></span><FiArrowUpRight /></Link>}<p className="cz-copyright">Zen Zephyr · Made for connection</p></div>
  </aside>;
}
function Header() {
  const { user, me, signOut, notifications, theme, setTheme } = useCommunity();
  const location = useLocation(); const navigate = useNavigate();
  const [params] = useSearchParams(); const [search, setSearch] = useState(params.get('q') || '');
  useEffect(() => { setSearch(params.get('q') || ''); }, [params]);
  function submit(event) { event.preventDefault(); navigate(`${location.pathname === '/people' ? '/people' : '/explore'}?q=${encodeURIComponent(search)}`); }
  return <header className="cz-header"><div className="cz-header-inner"><Link to="/" className="cz-brand" aria-label="Zen Zephyr home"><span className="cz-brand-symbol">z<span>✳</span></span><span>zen<span className="cz-brand-light">zephyr</span><b>.</b></span></Link>
    <form className="cz-search" role="search" onSubmit={submit}><FiSearch /><input aria-label="Search the community" placeholder="Search the community" value={search} onChange={e => setSearch(e.target.value)} /><button type="submit" aria-label="Search"><FiArrowRight /></button></form>
    <div className="cz-header-actions"><button className="cz-icon-button cz-theme-toggle" aria-label={theme === 'light' ? 'Switch to dark appearance' : 'Switch to light appearance'} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <FiMoon /> : <FiSun />}</button><Link className="cz-icon-button cz-notification-link" to="/notifications" aria-label="Notifications"><FiBell />{notifications.data?.unread > 0 && <i />}</Link>{user ? <details className="cz-account-menu"><summary aria-label="Account menu"><Avatar person={me.data || { name: user.displayName, image: user.photoURL }} /><FiChevronDown /></summary><div><Link to="/profile/me"><FiSmile />My profile</Link><Link to="/settings"><FiShield />Privacy settings</Link>{me.data?.isAdmin && <Link to="/moderation"><FiShield />Moderation</Link>}<button onClick={signOut}><FiLogOut />Sign out</button></div></details> : <><Link className="cz-login-link" to="/signin">Log in</Link><Link className="cz-button primary small" to="/signup">Join us <FiArrowUpRight /></Link></>}</div>
  </div></header>;
}
function RightRail() {
  const { api, user, me } = useCommunity();
  const stats = useQuery({ queryKey: ['community', 'stats'], queryFn: async () => (await api.get('/community/stats')).data, retry: false, staleTime: 60000 });
  return <aside className="cz-right-rail"><div className="cz-card cz-welcome-card"><div className="cz-panel-heading"><h3>Your kind of corner</h3><span>✦</span></div><p>Curious minds. Everyday moments.<br />A community that feels like you.</p><div className="cz-community-mark"><span>z.</span><i>✦</i><b>✳</b></div>{stats.data && <div className="cz-community-stats"><span><strong>{stats.data.members.toLocaleString()}</strong>members</span><span><strong>{stats.data.posts.toLocaleString()}</strong>conversations</span></div>}<Link className="cz-button secondary" to={user ? '/profile/me' : '/signup'}>{user ? 'Make yourself at home' : 'Be part of something good'} <FiArrowUpRight /></Link></div>
    <div className="cz-card cz-topic-panel"><div className="cz-panel-heading"><h3>Find your spark</h3><FiCompass /></div><p>A good conversation starts here.</p>{topics.slice(0, 5).map((topic, i) => <Link className="cz-topic-link" key={topic} to={`/explore?topic=${encodeURIComponent(topic)}`}><span>{topicEmojis[i]}</span><div><strong>{topic}</strong><small>{['Little moments, big connections', 'Ideas worth sharing', 'What’s next, together', 'See things a little differently', 'Ask away. We’re listening.'][i]}</small></div><FiArrowUpRight /></Link>)}</div>
    <div className="cz-kindness-note"><span>✺</span><div><h3>Make someone’s day.</h3><p>Leave a thoughtful comment. Welcome a new face. The little things matter.</p></div></div>
    {user && me.data && <Link className="cz-complete-profile" to="/profile/me"><FiEdit2 /><span>{me.data.bio ? 'Keep your profile feeling like you' : 'A few words about you go a long way'}</span><FiArrowRight /></Link>}
    <footer className="cz-rail-footer"><Link to="/guidelines">Community guidelines</Link><span>Built for people, not noise.</span></footer>
  </aside>;
}
function Hero() {
  const { user } = useCommunity();
  return <section className="cz-hero"><div className="cz-hero-copy"><span className="cz-eyebrow"><i /> A COMMUNITY, NOT JUST A FEED</span><h1>Good company.<br />Better conversations<span>.</span></h1><p>Share a little of your world.<br />Discover a little of someone else’s.</p><Link className="cz-hero-link" to={user ? '/people' : '/signup'}>{user ? 'Find your people' : 'Find your place'} <FiArrowUpRight /></Link></div><div className="cz-hero-art" aria-hidden="true"><div className="cz-orbit orbit-one" /><div className="cz-orbit orbit-two" /><span className="cz-orbit-spark">✳</span><span className="cz-orbit-star">✦</span><span className="cz-orbit-dot" /><div className="cz-art-message one"><span>☺</span><i /><i /></div><div className="cz-art-message two"><span>♡</span><i /></div><div className="cz-art-sticker">a little more<br /><strong>connected.</strong></div></div></section>;
}
function Composer() {
  const { user, me, api, toast } = useCommunity(); const cache = useQueryClient(); const navigate = useNavigate();
  const [content, setContent] = useState(''); const [topic, setTopic] = useState(topics[0]); const [audience, setAudience] = useState('public');
  const [file, setFile] = useState(null); const [preview, setPreview] = useState(''); const [error, setError] = useState(''); const input = useRef(null); const field = useRef(null); const [params] = useSearchParams();
  useEffect(() => { if (params.get('compose') && user) field.current?.focus(); }, [params, user]);
  useEffect(() => { if (!file) { setPreview(''); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  const mutation = useMutation({ mutationFn: async () => {
    if (!user) return navigate('/signin');
    const image = file ? await uploadProfileImage(file, user) : '';
    return api.post('/community/posts', { content, topic, visibility: audience, image });
  }, onSuccess: () => { setContent(''); setFile(null); setError(''); if (input.current) input.current.value = ''; cache.invalidateQueries({ queryKey: ['community'] }); toast('Your conversation is out in the world.'); }, onError: error => setError(errorMessage(error)) });
  function pickFile(event) { const chosen = event.target.files?.[0]; if (!chosen) return; if (!['image/jpeg', 'image/png', 'image/webp'].includes(chosen.type) || chosen.size > 5 * 1024 * 1024) { setError('Choose a JPG, PNG or WebP image under 5 MB.'); event.target.value = ''; return; } setError(''); setFile(chosen); }
  return <form className="cz-card cz-composer" id="composer" onSubmit={event => { event.preventDefault(); if (!user) navigate('/signin'); else mutation.mutate(); }}><div className="cz-composer-row"><Avatar person={me.data || { name: user?.displayName || 'You', image: user?.photoURL }} />{user ? <textarea ref={field} aria-label="Write a post" placeholder={`What’s on your mind${me.data?.name ? ', ' + me.data.name.split(' ')[0] : ''}?`} value={content} onChange={e => setContent(e.target.value)} maxLength={20000} rows={content ? 3 : 1} required /> : <button type="button" className="cz-composer-placeholder" onClick={() => navigate('/signup')}>A thought, a question, a little life update…</button>}</div>
    {preview && <div className="cz-upload-preview"><img src={preview} alt="Your selected photo" /><button type="button" className="cz-icon-button" aria-label="Remove selected photo" onClick={() => setFile(null)}><FiX /></button></div>}
    {error && <p className="cz-inline-error" role="alert">{error}</p>}
    <div className="cz-composer-bottom"><label className="cz-photo-button"><FiImage /><span>Photo</span><input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={pickFile} disabled={!user || mutation.isPending} aria-label="Attach a photo" /></label><label className="cz-select-label"><span className="sr-only">Topic</span><select aria-label="Post topic" value={topic} onChange={e => setTopic(e.target.value)}>{topics.map(t => <option key={t}>{t}</option>)}</select></label><label className="cz-audience-select">{audience === 'public' ? <FiGlobe /> : <FiUsers />}<select aria-label="Post audience" value={audience} onChange={e => setAudience(e.target.value)}><option value="public">Everyone</option><option value="friends">Connections</option></select></label><button type={user ? 'submit' : 'button'} onClick={!user ? () => navigate('/signup') : undefined} className="cz-button primary small" disabled={!!user && (!content.trim() || mutation.isPending)}>{mutation.isPending ? 'Sharing…' : user ? 'Post' : 'Join in'}<FiArrowUpRight /></button></div>
  </form>;
}
function Comments({ postId }) {
  const { api, user, toast } = useCommunity(); const cache = useQueryClient(); const [content, setContent] = useState('');
  const query = useQuery({ queryKey: ['community', 'comments', postId], queryFn: async () => (await api.get(`/community/posts/${postId}/comments`)).data, retry: false });
  const mutation = useMutation({ mutationFn: () => api.post(`/community/posts/${postId}/comments`, { content }), onSuccess: () => { setContent(''); cache.invalidateQueries({ queryKey: ['community'] }); }, onError: error => toast(errorMessage(error)) });
  return <section className="cz-comments" aria-label="Comments">{query.isPending ? <p>Loading replies…</p> : query.isError ? <QueryError compact retry={query.refetch} /> : query.data.length ? query.data.map(comment => <div className="cz-comment" key={comment.id}><Avatar person={comment.author} size="small" /><div><strong>{comment.author.name}{comment.author.isDemo && <span className="cz-demo-badge">Demo</span>}</strong><p>{comment.content}</p><time>{relativeTime(comment.createdAt)}</time></div></div>) : <p className="cz-quiet">Be the first to leave a thoughtful reply.</p>}
    {user ? <form className="cz-comment-form" onSubmit={e => { e.preventDefault(); mutation.mutate(); }}><input aria-label="Write a comment" placeholder="Add to the conversation…" value={content} maxLength={5000} onChange={e => setContent(e.target.value)} required /><button className="cz-icon-button" aria-label="Send comment" disabled={!content.trim() || mutation.isPending}><FiSend /></button></form> : <Link className="cz-text-link" to="/signin">Sign in to join the conversation <FiArrowRight /></Link>}
  </section>;
}
Comments.propTypes = { postId: PropTypes.string.isRequired };
function PostCard({ post, expanded = false }) {
  const { api, user, toast } = useCommunity(); const cache = useQueryClient(); const navigate = useNavigate();
  const [comments, setComments] = useState(expanded); const [edit, setEdit] = useState(false); const [content, setContent] = useState(post.content); const [report, setReport] = useState(false); const [reason, setReason] = useState('');
  const mutation = useMutation({ mutationFn: async ({ action, body, method = 'put' }) => api[method](`/community/posts/${post.id}${action ? '/' + action : ''}`, body), onSuccess: (result, variables) => { cache.invalidateQueries({ queryKey: ['community'] }); setEdit(false); setReport(false); if (variables.action === 'report') toast('Thank you. Your report will be reviewed.'); }, onError: error => toast(errorMessage(error)) });
  function act(action, body) { if (!user) { navigate('/signin'); return; } mutation.mutate({ action, body }); }
  async function share() { try { await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`); toast('Link copied. Send a little inspiration.'); } catch { toast(`Share this post: ${window.location.origin}/post/${post.id}`); } }
  return <article className="cz-card cz-post"><div className="cz-post-top"><Link to={post.author.id ? `/profile/${post.author.id}` : '/people'} className="cz-author"><Avatar person={post.author} /><span><strong>{post.author.name}{post.isDemo && <span className="cz-demo-badge">Demo</span>}</strong><small><time dateTime={post.createdAt}>{relativeTime(post.createdAt)}</time><span>·</span>{post.visibility === 'friends' ? <FiUsers aria-label="Connections only" /> : <FiGlobe aria-label="Public" />}</small></span></Link><details className="cz-post-menu"><summary aria-label="Post options"><FiMoreHorizontal /></summary><div>{post.canEdit ? <><button onClick={() => { setContent(post.content); setEdit(true); }}><FiEdit2 />Edit post</button><button className="danger" onClick={() => { if (window.confirm('Remove this post and its comments?')) mutation.mutate({ method: 'delete' }); }}><FiTrash2 />Remove post</button></> : <button onClick={() => user ? setReport(true) : navigate('/signin')}><FiFlag />Report post</button>}</div></details></div>
    <Link className="cz-post-topic" to={`/explore?topic=${encodeURIComponent(post.topic)}`}>{post.topic}</Link><div className="cz-post-content">{post.content || post.title}</div>{post.image && <Link to={`/post/${post.id}`} className="cz-post-image"><img src={post.image} alt="Photo shared with this post" loading="lazy" /></Link>}
    <div className="cz-post-counts"><span>{post.likes > 0 && <><span className="cz-like-dot">♥</span>{post.likes} {post.likes === 1 ? 'appreciation' : 'appreciations'}</>}</span><button onClick={() => setComments(!comments)}>{post.comments ? `${post.comments} ${post.comments === 1 ? 'reply' : 'replies'}` : 'Start a conversation'}</button></div>
    <div className="cz-post-actions"><button className={post.liked ? 'selected' : ''} aria-pressed={post.liked} disabled={mutation.isPending} onClick={() => act('like', { liked: !post.liked })}><FiHeart /><span>{post.liked ? 'Appreciated' : 'Appreciate'}</span></button><button className={comments ? 'selected' : ''} aria-expanded={comments} onClick={() => setComments(!comments)}><FiMessageCircle /><span>Comment</span></button><button onClick={share}><FiShare2 /><span>Share</span></button><button className={post.saved ? 'selected' : ''} aria-label={post.saved ? 'Unsave post' : 'Save post'} aria-pressed={post.saved} disabled={mutation.isPending} onClick={() => act('save', { saved: !post.saved })}><FiBookmark /></button></div>
    {comments && <Comments postId={post.id} />}
    {edit && <Modal title="A little edit" close={() => setEdit(false)}><form className="cz-modal-form" onSubmit={e => { e.preventDefault(); mutation.mutate({ method: 'patch', body: { content } }); }}><label>Your post<textarea value={content} maxLength={20000} onChange={e => setContent(e.target.value)} rows={6} required /></label><button className="cz-button primary" disabled={mutation.isPending}>Save changes <FiCheck /></button></form></Modal>}
    {report && <Modal title="Help keep this a good place" close={() => setReport(false)}><form className="cz-modal-form" onSubmit={e => { e.preventDefault(); mutation.mutate({ action: 'report', method: 'post', body: { reason } }); }}><p>Tell us what concerns you. Reports go to community moderators.</p><label>Reason<textarea rows={4} maxLength={1000} required value={reason} onChange={e => setReason(e.target.value)} /></label><button className="cz-button primary" disabled={mutation.isPending}>Send report <FiFlag /></button></form></Modal>}
  </article>;
}
PostCard.propTypes = { post: PropTypes.object.isRequired, expanded: PropTypes.bool };
function Feed({ view = 'all', author = null }) {
  const { api, user } = useCommunity(); const [params, setParams] = useSearchParams();
  const query = params.get('q') || ''; const topic = params.get('topic') || ''; const [filter, setFilter] = useState('all');
  const actualView = view === 'all' ? filter : view;
  const feed = useInfiniteQuery({ queryKey: ['community', 'feed', actualView, author, query, topic, user?.uid], initialPageParam: '',
    queryFn: async ({ pageParam }) => (await api.get('/community/feed', { params: { view: actualView, author: author || undefined, cursor: pageParam || undefined, q: query || undefined, topic: topic || undefined } })).data,
    getNextPageParam: last => last.nextCursor || undefined, retry: false });
  function pickTopic(value) { const next = new URLSearchParams(params); value ? next.set('topic', value) : next.delete('topic'); setParams(next); }
  const items = feed.data?.pages.flatMap(page => page.items) || [];
  return <>{view === 'all' && !author && <div className="cz-feed-controls"><div className="cz-tabs"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>For you</button>{user && <button className={filter === 'friends' ? 'active' : ''} onClick={() => setFilter('friends')}>Your connections</button>}</div><span className="cz-feed-order">Latest conversations <FiChevronDown /></span></div>}
    {view === 'all' && !author && <div className="cz-topic-chips" aria-label="Filter by topic"><button className={!topic ? 'active' : ''} onClick={() => pickTopic('')}>✦ All topics</button>{topics.map((t, i) => <button className={topic === t ? 'active' : ''} key={t} onClick={() => pickTopic(t)}>{topicEmojis[i]} {t}</button>)}</div>}
    {query && <div className="cz-search-summary">Conversations matching “{query}”<button aria-label="Clear search" onClick={() => { const next = new URLSearchParams(params); next.delete('q'); setParams(next); }}><FiX /></button></div>}
    {feed.isPending ? <Skeleton /> : feed.isError ? <QueryError retry={feed.refetch} /> : items.length ? <div className="cz-post-list">{items.map(post => <PostCard key={post.id} post={post} />)}{feed.hasNextPage && <button className="cz-button secondary cz-load-more" disabled={feed.isFetchingNextPage} onClick={() => feed.fetchNextPage()}>{feed.isFetchingNextPage ? 'Finding more conversations…' : 'A little more to explore'}<FiArrowRight /></button>}</div> : <div className="cz-card"><Empty icon={view === 'saved' ? FiBookmark : FiMessageCircle} title={view === 'saved' ? 'Good things, kept close.' : 'Every conversation starts somewhere.'} action={view !== 'saved' && !author && <Link className="cz-button primary" to={user ? '/?compose=1' : '/signup'}>{user ? 'Share the first thought' : 'Join the conversation'}<FiArrowUpRight /></Link>}>{view === 'saved' ? 'Save a post with the bookmark button. You’ll find it right here.' : topic || query ? 'No conversations match yet. Try another topic or share something of your own.' : 'A thought, a question, a little life update. Make this space your own.'}</Empty></div>}
  </>;
}
Feed.propTypes = { view: PropTypes.string, author: PropTypes.string };
function RequireSignIn({ children }) {
  const { user, loading } = useCommunity();
  if (loading) return <Skeleton />;
  return user ? children : <div className="cz-card"><Empty icon={FiLock} title="Your little corner is waiting." action={<Link className="cz-button primary" to="/signin">Log in <FiArrowRight /></Link>}>Log in to see your connections, saved conversations and updates.</Empty></div>;
}
RequireSignIn.propTypes = { children: PropTypes.node };
function ConnectionButton({ person }) {
  const { api, user, toast } = useCommunity(); const navigate = useNavigate(); const cache = useQueryClient();
  const mutation = useMutation({ mutationFn: method => api[method](`/community/connections/${person.id}`), onSuccess: () => cache.invalidateQueries({ queryKey: ['community'] }), onError: error => toast(errorMessage(error)) });
  if (person.isDemo) return <span className="cz-demo-badge">Demo profile</span>;
  if (person.id === user?.uid) return <Link className="cz-button secondary small" to="/profile/me">Your profile <FiArrowUpRight /></Link>;
  return <div className="cz-connect-actions">{person.incoming && person.connection === 'pending' ? <><button className="cz-button primary small" disabled={mutation.isPending} onClick={() => mutation.mutate('patch')}>Accept <FiCheck /></button><button className="cz-icon-button" aria-label="Decline request" disabled={mutation.isPending} onClick={() => mutation.mutate('delete')}><FiX /></button></> : <button className={`cz-button ${person.connection ? 'secondary' : 'primary'} small`} disabled={mutation.isPending || person.canConnect === false} onClick={() => {
    if (!user) return navigate('/signin');
    if (person.connection === 'accepted' && !window.confirm(`Remove your connection with ${person.name}?`)) return;
    mutation.mutate(person.connection ? 'delete' : 'post');
  }}>{mutation.isPending ? 'One moment…' : person.connection === 'accepted' ? 'Connected' : person.connection === 'pending' ? 'Cancel request' : person.canConnect === false ? 'Not active yet' : 'Connect'}{person.connection ? <FiCheck /> : <FiUserPlus />}</button>}</div>;
}
ConnectionButton.propTypes = { person: PropTypes.object.isRequired };
function PeoplePage() {
  const { api, user } = useCommunity(); const [params] = useSearchParams(); const [tab, setTab] = useState('discover');
  const people = useQuery({ queryKey: ['community', 'people', params.get('q'), user?.uid], queryFn: async () => (await api.get('/community/people', { params: { q: params.get('q') || '' } })).data, retry: false });
  const connections = useQuery({ queryKey: ['community', 'connections', user?.uid], enabled: !!user, queryFn: async () => (await api.get('/community/connections')).data, retry: false });
  const list = tab === 'discover' ? people.data : connections.data?.filter(c => tab === 'requests' ? c.status === 'pending' && c.incoming : c.status === 'accepted').map(c => ({ ...c.person, connection: c.status, incoming: c.incoming }));
  const query = tab === 'discover' ? people : connections;
  const incoming = connections.data?.filter(c => c.status === 'pending' && c.incoming).length || 0;
  return <><PageHeading eyebrow="BETTER, TOGETHER" title="Find your people." description="A familiar interest. A different perspective. A new connection." /><div className="cz-tabs cz-page-tabs"><button className={tab === 'discover' ? 'active' : ''} onClick={() => setTab('discover')}>Discover</button>{user && <><button className={tab === 'connections' ? 'active' : ''} onClick={() => setTab('connections')}>Your connections</button><button className={tab === 'requests' ? 'active' : ''} onClick={() => setTab('requests')}>Requests {incoming > 0 && <span className="cz-badge">{incoming}</span>}</button></>}</div>
    {query.isPending ? <Skeleton /> : query.isError ? <QueryError retry={query.refetch} /> : !list?.length ? <div className="cz-card"><Empty icon={FiUsers} title={tab === 'requests' ? 'All caught up.' : 'Good connections take a first hello.'}>{tab === 'requests' ? 'New connection requests will appear here.' : 'Explore the community and connect with someone who sparks your curiosity.'}</Empty></div> : <div className="cz-people-grid">{list.map(person => <article className="cz-card cz-person-card" key={person.id}><div className="cz-person-cover" /><Link to={`/profile/${person.id}`}><Avatar person={person} size="large" /><h3>{person.name}</h3></Link><p>{person.bio || 'Here for the conversations and connections.'}</p>{person.location && <small><FiMapPin />{person.location}</small>}<ConnectionButton person={person} /></article>)}</div>}
  </>;
}
function PageHeading({ eyebrow, title, description }) {
  return <div className="cz-page-heading"><span className="cz-eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>;
}
PageHeading.propTypes = { eyebrow: PropTypes.string, title: PropTypes.string, description: PropTypes.string };
function ProfilePage({ id }) {
  const { api, me, user, toast } = useCommunity(); const cache = useQueryClient();
  const own = id === 'me' || id === user?.uid; const uid = own ? user?.uid : id;
  const profile = useQuery({ queryKey: ['community', 'profile', uid], enabled: !!uid && (!own || !!me.data), queryFn: async () => (await api.get(`/community/profiles/${encodeURIComponent(uid)}`)).data, retry: false });
  const [editing, setEditing] = useState(false); const [form, setForm] = useState({ name: '', bio: '', location: '' }); const [photo, setPhoto] = useState(null);
  const mutation = useMutation({ mutationFn: async () => api.patch('/community/me', { ...form, image: photo ? await uploadProfileImage(photo, user) : undefined }), onSuccess: () => { setEditing(false); cache.invalidateQueries({ queryKey: ['community'] }); toast('A little more you. Profile updated.'); }, onError: e => toast(errorMessage(e)) });
  if (own && !user) return <RequireSignIn />;
  if (own && me.isError) return <QueryError retry={me.refetch} />;
  if (profile.isPending) return <Skeleton />;
  if (profile.isError) return <QueryError retry={profile.refetch} />;
  const person = profile.data;
  return <><section className="cz-card cz-profile-card"><div className="cz-profile-cover"><span>your own kind of wonderful.</span><b>✳</b><i>✦</i></div><div className="cz-profile-body"><Avatar person={person} size="xl" /><div className="cz-profile-top-actions">{own ? <button className="cz-button secondary small" onClick={() => { setForm({ name: person.name, bio: person.bio || '', location: person.location || '' }); setPhoto(null); setEditing(true); }}><FiEdit2 />Edit profile</button> : <><ConnectionButton person={person} />{!person.isDemo && <><Link className="cz-button secondary small" to={`/messages?to=${encodeURIComponent(person.id)}`}><FiMessageSquare />Message</Link><Link className="cz-icon-button" aria-label="Block member" to={`/settings?block=${encodeURIComponent(person.id)}`}><FiShield /></Link></>}</>}</div><h1>{person.name}{person.isDemo && <span className="cz-demo-badge">Demo profile</span>}</h1><p className="cz-profile-bio">{person.bio || (own ? 'Tell the community a little about your world.' : 'Here to share a little of their world.')}</p><div className="cz-profile-meta">{person.location && <span><FiMapPin />{person.location}</span>}<span><strong>{person.postCount}</strong> conversations</span><span><strong>{person.connectionCount}</strong> connections</span></div></div></section><h2 className="cz-subheading">{own ? 'Your conversations' : `From ${person.name.split(' ')[0]}`}</h2><Feed author={person.id} />
    {editing && <Modal title="Make it feel like you" close={() => setEditing(false)}><form className="cz-modal-form" onSubmit={e => { e.preventDefault(); mutation.mutate(); }}><label>Name<input autoComplete="name" value={form.name} maxLength={120} required onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>A little about you<textarea rows={3} value={form.bio} maxLength={240} placeholder="The things you love. What makes you, you." onChange={e => setForm({ ...form, bio: e.target.value })} /><small>{form.bio.length}/240</small></label><label>Location<input value={form.location} maxLength={100} placeholder="Your corner of the world" onChange={e => setForm({ ...form, location: e.target.value })} /></label><label>Profile photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { const f = e.target.files?.[0]; if (f && f.size > 5 * 1024 * 1024) { toast('Choose an image under 5 MB.'); e.target.value = ''; } else setPhoto(f || null); }} /></label><button className="cz-button primary" disabled={mutation.isPending}>{mutation.isPending ? 'Saving…' : 'Save profile'}<FiCheck /></button></form></Modal>}
  </>;
}
ProfilePage.propTypes = { id: PropTypes.string.isRequired };
function NotificationPage() {
  const { notifications, api, toast } = useCommunity(); const cache = useQueryClient();
  const read = useMutation({ mutationFn: () => api.patch('/community/notifications/read'), onSuccess: () => cache.invalidateQueries({ queryKey: ['community', 'notifications'] }), onError: e => toast(errorMessage(e)) });
  const words = { like: 'appreciated your post.', comment: 'added to your conversation.', friend_request: 'would like to connect with you.', friend_accepted: 'accepted your connection request.', group_request: 'asked to join your group.', group_accepted: 'welcomed you to the group.', space_comment: 'replied in your community.', message: 'sent you a message.' };
  return <><div className="cz-notifications-heading"><PageHeading eyebrow="A LITTLE CONNECTION" title="You’re in the loop." description="The conversations and people that make this place yours." />{!!notifications.data?.unread && <button className="cz-button secondary small" onClick={() => read.mutate()} disabled={read.isPending}><FiCheck />Mark all read</button>}</div>{notifications.isPending ? <Skeleton /> : notifications.isError ? <QueryError retry={notifications.refetch} /> : notifications.data?.items.length ? <div className="cz-card cz-notification-list">{notifications.data.items.map(item => <Link to={item.link || (item.postId ? `/post/${item.postId}` : '/people')} className={`cz-notification ${!item.read ? 'unread' : ''}`} key={item.id}><Avatar person={item.actor} /><div><p><strong>{item.actor.name}</strong> {words[item.kind] || 'shared an update.'}</p><time>{relativeTime(item.createdAt)}</time></div>{!item.read && <i />}</Link>)}</div> : <div className="cz-card"><Empty icon={FiBell} title="A quiet moment. Enjoy it.">Connection requests, appreciations and replies will find you here.</Empty></div>}</>;
}
function PostPage({ id }) {
  const { api, user } = useCommunity();
  const query = useQuery({ queryKey: ['community', 'post', id, user?.uid], queryFn: async () => (await api.get(`/community/posts/${id}`)).data, retry: false });
  return <><Link className="cz-back-link" to="/"><FiArrowLeft />Back to your community</Link>{query.isPending ? <Skeleton cards={1} /> : query.isError ? <QueryError retry={query.refetch} /> : <PostCard post={query.data} expanded />}</>;
}
PostPage.propTypes = { id: PropTypes.string.isRequired };
function ModerationPage() {
  const { api, me, toast } = useCommunity(); const cache = useQueryClient();
  const reports = useQuery({ queryKey: ['community', 'moderation'], enabled: !!me.data?.isAdmin, queryFn: async () => (await api.get('/community/moderation/reports')).data, retry: false });
  const action = useMutation({ mutationFn: ({ id, remove }) => api.delete(`/community/moderation/${remove ? 'content' : 'reports'}/${id}`), onSuccess: () => { cache.invalidateQueries({ queryKey: ['community'] }); toast('Report reviewed. Thank you for looking out for the community.'); }, onError: e => toast(errorMessage(e)) });
  if (me.isPending) return <Skeleton />;
  if (!me.data?.isAdmin) return <div className="cz-card"><Empty icon={FiShield} title="This corner is for moderators.">You can help by reporting content that doesn’t belong.</Empty></div>;
  return <><PageHeading eyebrow="LOOKING OUT FOR EACH OTHER" title="Community moderation." description="Review reports thoughtfully. Keep the community a welcoming place." />{reports.isPending ? <Skeleton /> : reports.isError ? <QueryError retry={reports.refetch} /> : !reports.data.length ? <div className="cz-card"><Empty icon={FiShield} title="Nothing to review right now.">New reports will appear here.</Empty></div> : reports.data.map(report => <article className="cz-card cz-report-card" key={report.id}><span className="cz-eyebrow">REPORTED {report.type}</span><h3>{report.reason}</h3>{report.content && <p>{report.content}</p>}<div>{report.postId && <Link to={`/post/${report.postId}`} className="cz-button secondary small">View conversation <FiArrowUpRight /></Link>}<button className="cz-button secondary small" disabled={action.isPending} onClick={() => action.mutate({ id: report.id, remove: false })}>Dismiss</button><button className="cz-button primary small" disabled={action.isPending} onClick={() => { if (window.confirm('Remove the reported content?')) action.mutate({ id: report.id, remove: true }); }}>Remove content</button></div></article>)}</>;
}
function Guidelines() {
  return <div className="cz-guidelines"><span className="cz-guidelines-art">✳</span><h3>A good place starts with us.</h3><p>A few things we believe make a community worth coming back to.</p>{[['Lead with kindness', 'There’s a person on the other side of every conversation. Make room for different experiences.'], ['Be yourself, thoughtfully', 'Share what matters to you. Respect other people’s privacy and never share their personal information without permission.'], ['Bring something good', 'Curiosity, creativity, useful questions. Leave spam, harassment and hateful content outside.'], ['Look out for each other', 'Use the report option if something doesn’t belong. Our community moderators review reports.']].map(([title, copy], i) => <div className="cz-guideline" key={title}><span>0{i + 1}</span><div><h4>{title}</h4><p>{copy}</p></div></div>)}</div>;
}
function AuthPage({ signup = false }) {
  const { signInUser, signUpUser, googleSignIn, updateUser } = useAuth(); const { api, toast } = useCommunity(); const navigate = useNavigate(); const cache = useQueryClient(); const location = useLocation();
  const from = location.state?.from; const destination = from?.pathname?.startsWith('/') && !from.pathname.startsWith('//') ? from.pathname + (from.search || '') : '/';
  const [show, setShow] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function handle(event) {
    event.preventDefault(); setError(''); setBusy(true); const data = new FormData(event.currentTarget);
    try {
      if (signup) {
        const result = await signUpUser(data.get('email'), data.get('password'));
        await updateUser(data.get('name'), result.user.photoURL || null);
        await api.post('/users', { name: data.get('name'), userImage: '' });
        await api.patch('/community/me', { name: data.get('name'), bio: '', location: '' });
      } else await signInUser(data.get('email'), data.get('password'));
      cache.invalidateQueries({ queryKey: ['community'] }); navigate(destination); toast(signup ? 'You belong here. Welcome to Zen Zephyr.' : 'Good to have you back.');
    } catch (e) { setError(e.code === 'auth/email-already-in-use' ? 'That email already has a home here. Try logging in.' : e.code?.startsWith('auth/') ? 'We couldn’t sign you in. Check your details and try again.' : signup ? 'Your account may have been created, but we couldn’t finish your profile. Try logging in.' : errorMessage(e)); }
    finally { setBusy(false); }
  }
  async function google() { setBusy(true); setError(''); try { const result = await googleSignIn(); await api.post('/users', { name: result.user.displayName, userImage: result.user.photoURL }); cache.invalidateQueries({ queryKey: ['community'] }); navigate(destination); } catch { setError('Google sign-in could not finish. Please try again or use email.'); } finally { setBusy(false); } }
  return <div className="cz-auth-page"><div className="cz-auth-intro"><span className="cz-eyebrow">A LITTLE MORE HUMAN</span><h1>{signup ? 'Your people are out there.' : 'Good to have you back.'}</h1><p>{signup ? 'Find them here. Share your world, follow your curiosity, and make a few good connections along the way.' : 'Your conversations, your connections, your little corner of the internet.'}</p><div className="cz-auth-art" aria-hidden="true">✳<span>you belong<br />here.</span><i>✦</i></div></div><section className="cz-card cz-auth-form"><h2>{signup ? 'Make yourself at home.' : 'Welcome home.'}</h2><p>{signup ? 'Create your free community account.' : 'Log in to your Zen Zephyr account.'}</p><button className="cz-button google" onClick={google} disabled={busy}><FcGoogle />Continue with Google</button><div className="cz-auth-divider"><span>or use your email</span></div><form onSubmit={handle}>{signup && <label>Your name<input name="name" placeholder="What should we call you?" autoComplete="name" required maxLength={120} /></label>}<label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label><label>Password<div className="cz-password"><input name="password" type={show ? 'text' : 'password'} placeholder={signup ? 'At least 8 characters' : 'Your password'} minLength={signup ? 8 : undefined} autoComplete={signup ? 'new-password' : 'current-password'} required /><button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)}>{show ? <FiEyeOff /> : <FiEye />}</button></div></label>{error && <p className="cz-inline-error" role="alert">{error}</p>}<button className="cz-button primary" disabled={busy}>{busy ? 'One moment…' : signup ? 'Join the community' : 'Log in'}<FiArrowUpRight /></button></form><p className="cz-auth-switch">{signup ? 'Already found your place?' : 'New around here?'} <Link to={signup ? '/signin' : '/signup'}>{signup ? 'Log in' : 'Join us'}</Link></p>{signup && <small className="cz-auth-terms">By joining, you agree to follow our <Link to="/guidelines">community guidelines</Link>.</small>}</section></div>;
}
AuthPage.propTypes = { signup: PropTypes.bool };

export default function CommunityApp() {
  const { user, loading, signOutUser } = useAuth(); const api = useAxiosPublic(); const cache = useQueryClient(); const location = useLocation(); const navigate = useNavigate();
  const [theme, setTheme] = useState(() => readLocal('zen-appearance', 'light')); const [guidelines, setGuidelines] = useState(false); const [message, setMessage] = useState(''); const timeout = useRef();
  const me = useQuery({ queryKey: ['community', 'me', user?.uid], enabled: !!user, queryFn: async () => (await api.get('/community/me')).data, retry: false });
  const notifications = useQuery({ queryKey: ['community', 'notifications', user?.uid], enabled: !!user, queryFn: async () => (await api.get('/community/notifications')).data, retry: false, refetchInterval: user ? 60000 : false });
  useEffect(() => { document.documentElement.dataset.communityTheme = theme; writeLocal('zen-appearance', theme); return () => { delete document.documentElement.dataset.communityTheme; }; }, [theme]);
  useEffect(() => () => clearTimeout(timeout.current), []);
  function toast(value) { setMessage(value); clearTimeout(timeout.current); timeout.current = setTimeout(() => setMessage(''), 5000); }
  async function signOut() { try { await signOutUser(); cache.clear(); navigate('/'); toast('See you around.'); } catch { toast('Couldn’t sign out. Please try again.'); } }
  const networkContext = { api, user, me, toast, loading };
  const path = location.pathname; const authPage = path === '/signin' || path === '/signup';
  let content; let title = 'Your community';
  if (path === '/') content = <>{!user && <Hero />}<StoryShelf context={networkContext} /><div className="cz-feed-heading"><div><span className="cz-eyebrow">THE LITTLE THINGS, SHARED</span><h2>Your daily dose of connection</h2></div><span className="cz-handwritten">stay curious ✦</span></div><Composer /><Feed /></>;
  else if (/^\/(messages|groups|pages|events|marketplace|stories|settings|discover)(\/|$)/.test(path)) { title = path.split('/')[1]; content = <NetworkApp context={networkContext} />; }
  else if (path === '/explore') { title = 'Explore'; content = <><PageHeading eyebrow="FOLLOW YOUR CURIOSITY" title="A world of little discoveries." description="Fresh perspectives, shared passions, and conversations worth your time." /><Feed /></>; }
  else if (path === '/people') { title = 'People'; content = <PeoplePage />; }
  else if (path === '/saved') { title = 'Saved conversations'; content = <RequireSignIn><PageHeading eyebrow="KEEP THE GOOD STUFF" title="Worth coming back to." description="The ideas, moments and conversations you saved for later." /><Feed view="saved" /></RequireSignIn>; }
  else if (path === '/notifications') { title = 'Notifications'; content = <RequireSignIn><NotificationPage /></RequireSignIn>; }
  else if (path.startsWith('/profile/')) { title = 'Profile'; content = <ProfilePage id={decodeURIComponent(path.split('/')[2] || 'me')} />; }
  else if (path.startsWith('/post/')) { title = 'Conversation'; content = <PostPage id={path.split('/')[2]} />; }
  else if (path === '/moderation') { title = 'Moderation'; content = <RequireSignIn><ModerationPage /></RequireSignIn>; }
  else if (path === '/guidelines') { title = 'Our shared values'; content = <div className="cz-card"><Guidelines /></div>; }
  else if (authPage) { title = path === '/signup' ? 'Join the community' : 'Welcome back'; content = <AuthPage signup={path === '/signup'} />; }
  else content = <div className="cz-card"><Empty title="A little off the beaten path." action={<Link className="cz-button primary" to="/">Back to your community <FiArrowRight /></Link>}>We couldn’t find this page. There’s plenty to explore back home.</Empty></div>;
  return <CommunityContext.Provider value={{ user, loading, api, me, notifications, toast, signOut, theme, setTheme, setGuidelines }}><div className="community-app"><Helmet><title>{title} · Zen Zephyr</title><meta name="description" content="A little more human. Share your world, find your people, and join thoughtful conversations on Zen Zephyr." /></Helmet><Header />{authPage ? <main className="cz-auth-layout">{content}</main> : <div className="cz-layout"><Sidebar /><main className="cz-main">{content}</main><RightRail /></div>}<nav className="cz-mobile-nav" aria-label="Mobile navigation">{[[FiHome, '/', 'Feed'], [FiUsers, '/groups', 'Groups'], [FiMessageSquare, '/messages', 'Messages'], [FiBell, '/notifications', 'Updates'], [FiGrid, '/discover', 'Menu']].map(([Icon, href, label]) => <NavLink key={label} end={href === '/'} to={href} className={({ isActive }) => isActive ? 'active' : ''}><Icon /><span>{label}</span></NavLink>)}</nav>{message && <div className="cz-toast" role="status"><FiCheckCircle /><span>{message}</span><button aria-label="Dismiss notification" onClick={() => setMessage('')}><FiX /></button></div>}{guidelines && <Modal title="Our shared values" close={() => setGuidelines(false)}><Guidelines /></Modal>}</div></CommunityContext.Provider>;
}
