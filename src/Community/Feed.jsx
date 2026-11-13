import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { optimizedImage, imageSources } from '../utils/images';
import PropTypes from 'prop-types';
import {
  FiUsers,
  FiBookmark,
  FiArrowUpRight,
  FiArrowRight,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiMoreHorizontal,
  FiImage,
  FiGlobe,
  FiLock,
  FiX,
  FiCheck,
  FiChevronDown,
  FiEdit2,
  FiTrash2,
  FiFlag,
  FiSend,
} from 'react-icons/fi';
import { uploadProfileImage } from '../utils/cloudinary';
import { Avatar, Modal, Empty, QueryError, Skeleton } from './ui';
import { useCommunity, topics, topicEmojis, errorMessage, relativeTime } from './core-context';
export function Composer() {
  const { user, me, api, toast } = useCommunity();
  const cache = useQueryClient();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState(topics[0]);
  const [audience, setAudience] = useState('public');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const input = useRef(null);
  const field = useRef(null);
  const [params] = useSearchParams();
  useEffect(() => {
    if (params.get('compose') && user) field.current?.focus();
  }, [params, user]);
  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) return navigate('/signin');
      const image = file ? await uploadProfileImage(file, user) : '';
      return api.post('/community/posts', { content, topic, visibility: audience, image });
    },
    onSuccess: () => {
      setContent('');
      setFile(null);
      setError('');
      if (input.current) input.current.value = '';
      cache.invalidateQueries({ queryKey: ['community'] });
      toast('Your conversation is out in the world.');
    },
    onError: (error) => setError(errorMessage(error)),
  });
  function pickFile(event) {
    const chosen = event.target.files?.[0];
    if (!chosen) return;
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(chosen.type) ||
      chosen.size > 5 * 1024 * 1024
    ) {
      setError('Choose a JPG, PNG or WebP image under 5 MB.');
      event.target.value = '';
      return;
    }
    setError('');
    setFile(chosen);
  }
  return (
    <form
      className="cz-card cz-composer"
      id="composer"
      onSubmit={(event) => {
        event.preventDefault();
        if (!user) navigate('/signin');
        else mutation.mutate();
      }}
    >
      <div className="cz-composer-row">
        <Avatar person={me.data || { name: user?.displayName || 'You', image: user?.photoURL }} />
        {user ? (
          <textarea
            ref={field}
            aria-label="Write a post"
            placeholder={`What’s on your mind${me.data?.name ? ', ' + me.data.name.split(' ')[0] : ''}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={20000}
            rows={content ? 3 : 1}
            required
          />
        ) : (
          <button
            type="button"
            className="cz-composer-placeholder"
            onClick={() => navigate('/signup')}
          >
            A thought, a question, a little life update…
          </button>
        )}
      </div>
      {preview && (
        <div className="cz-upload-preview">
          <img src={preview} alt="Your selected photo" />
          <button
            type="button"
            className="cz-icon-button"
            aria-label="Remove selected photo"
            onClick={() => setFile(null)}
          >
            <FiX />
          </button>
        </div>
      )}
      {error && (
        <p className="cz-inline-error" role="alert">
          {error}
        </p>
      )}
      <div className="cz-composer-bottom">
        <label className="cz-photo-button">
          <FiImage />
          <span>Photo</span>
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={pickFile}
            disabled={!user || mutation.isPending}
            aria-label="Attach a photo"
          />
        </label>
        <label className="cz-select-label">
          <span className="sr-only">Topic</span>
          <select aria-label="Post topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="cz-audience-select">
          {audience === 'public' ? <FiGlobe /> : <FiUsers />}
          <select
            aria-label="Post audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option value="public">Everyone</option>
            <option value="friends">Connections</option>
          </select>
        </label>
        <button
          type={user ? 'submit' : 'button'}
          onClick={!user ? () => navigate('/signup') : undefined}
          className="cz-button primary small"
          disabled={!!user && (!content.trim() || mutation.isPending)}
        >
          {mutation.isPending ? 'Sharing…' : user ? 'Post' : 'Join in'}
          <FiArrowUpRight />
        </button>
      </div>
    </form>
  );
}
export function Comments({ postId }) {
  const { api, user, toast } = useCommunity();
  const cache = useQueryClient();
  const [content, setContent] = useState('');
  const query = useQuery({
    queryKey: ['community', 'comments', postId],
    queryFn: async () => (await api.get(`/community/posts/${postId}/comments`)).data,
    retry: false,
  });
  const mutation = useMutation({
    mutationFn: () => api.post(`/community/posts/${postId}/comments`, { content }),
    onSuccess: () => {
      setContent('');
      cache.invalidateQueries({ queryKey: ['community'] });
    },
    onError: (error) => toast(errorMessage(error)),
  });
  return (
    <section className="cz-comments" aria-label="Comments">
      {query.isPending ? (
        <p>Loading replies…</p>
      ) : query.isError ? (
        <QueryError compact retry={query.refetch} />
      ) : query.data.length ? (
        query.data.map((comment) => (
          <div className="cz-comment" key={comment.id}>
            <Avatar person={comment.author} size="small" />
            <div>
              <strong>
                {comment.author.name}
                {comment.author.isDemo && <span className="cz-demo-badge">Demo</span>}
              </strong>
              <p>{comment.content}</p>
              <time>{relativeTime(comment.createdAt)}</time>
            </div>
          </div>
        ))
      ) : (
        <p className="cz-quiet">Be the first to leave a thoughtful reply.</p>
      )}
      {user ? (
        <form
          className="cz-comment-form"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <input
            aria-label="Write a comment"
            placeholder="Add to the conversation…"
            value={content}
            maxLength={5000}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button
            className="cz-icon-button"
            aria-label="Send comment"
            disabled={!content.trim() || mutation.isPending}
          >
            <FiSend />
          </button>
        </form>
      ) : (
        <Link className="cz-text-link" to="/signin">
          Sign in to join the conversation <FiArrowRight />
        </Link>
      )}
    </section>
  );
}
Comments.propTypes = { postId: PropTypes.string.isRequired };
export function PostCard({ post, expanded = false }) {
  const { api, user, toast } = useCommunity();
  const cache = useQueryClient();
  const navigate = useNavigate();
  const [comments, setComments] = useState(expanded);
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState(post.content);
  const [report, setReport] = useState(false);
  const [reason, setReason] = useState('');
  const mutation = useMutation({
    mutationFn: async ({ action, body, method = 'put' }) =>
      api[method](`/community/posts/${post.id}${action ? '/' + action : ''}`, body),
    onSuccess: (result, variables) => {
      cache.invalidateQueries({ queryKey: ['community'] });
      setEdit(false);
      setReport(false);
      if (variables.action === 'report') toast('Thank you. Your report will be reviewed.');
    },
    onError: (error) => toast(errorMessage(error)),
  });
  function act(action, body) {
    if (!user) {
      navigate('/signin');
      return;
    }
    mutation.mutate({ action, body });
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      toast('Link copied. Send a little inspiration.');
    } catch {
      toast(`Share this post: ${window.location.origin}/post/${post.id}`);
    }
  }
  return (
    <article className="cz-card cz-post">
      <div className="cz-post-top">
        <Link to={post.author.id ? `/profile/${post.author.id}` : '/people'} className="cz-author">
          <Avatar person={post.author} />
          <span>
            <strong>
              {post.author.name}
              {post.isDemo && <span className="cz-demo-badge">Demo</span>}
            </strong>
            <small>
              <time dateTime={post.createdAt}>{relativeTime(post.createdAt)}</time>
              <span>·</span>
              {post.visibility === 'friends' ? (
                <FiUsers aria-label="Connections only" />
              ) : (
                <FiGlobe aria-label="Public" />
              )}
            </small>
          </span>
        </Link>
        <details className="cz-post-menu">
          <summary aria-label="Post options">
            <FiMoreHorizontal />
          </summary>
          <div>
            {post.canEdit ? (
              <>
                <button
                  onClick={() => {
                    setContent(post.content);
                    setEdit(true);
                  }}
                >
                  <FiEdit2 />
                  Edit post
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    if (window.confirm('Remove this post and its comments?'))
                      mutation.mutate({ method: 'delete' });
                  }}
                >
                  <FiTrash2 />
                  Remove post
                </button>
              </>
            ) : (
              <button onClick={() => (user ? setReport(true) : navigate('/signin'))}>
                <FiFlag />
                Report post
              </button>
            )}
          </div>
        </details>
      </div>
      <Link className="cz-post-topic" to={`/explore?topic=${encodeURIComponent(post.topic)}`}>
        {post.topic}
      </Link>
      <div className="cz-post-content">{post.content || post.title}</div>
      {post.image && (
        <Link to={`/post/${post.id}`} className="cz-post-image">
          <img
            src={optimizedImage(post.image, 1200)}
            srcSet={imageSources(post.image)}
            sizes="(max-width:760px) 95vw, (max-width:1200px) 65vw, 800px"
            alt={post.content.slice(0, 120) || 'Photo shared with this post'}
            width="1200"
            height="900"
            loading="lazy"
            decoding="async"
          />
        </Link>
      )}
      <div className="cz-post-counts">
        <span>
          {post.likes > 0 && (
            <>
              <span className="cz-like-dot">♥</span>
              {post.likes} {post.likes === 1 ? 'appreciation' : 'appreciations'}
            </>
          )}
        </span>
        <button onClick={() => setComments(!comments)}>
          {post.comments
            ? `${post.comments} ${post.comments === 1 ? 'reply' : 'replies'}`
            : 'Start a conversation'}
        </button>
      </div>
      <div className="cz-post-actions">
        <button
          className={post.liked ? 'selected' : ''}
          aria-pressed={post.liked}
          disabled={mutation.isPending}
          onClick={() => act('like', { liked: !post.liked })}
        >
          <FiHeart />
          <span>{post.liked ? 'Appreciated' : 'Appreciate'}</span>
        </button>
        <button
          className={comments ? 'selected' : ''}
          aria-expanded={comments}
          onClick={() => setComments(!comments)}
        >
          <FiMessageCircle />
          <span>Comment</span>
        </button>
        <button onClick={share}>
          <FiShare2 />
          <span>Share</span>
        </button>
        <button
          className={post.saved ? 'selected' : ''}
          aria-label={post.saved ? 'Unsave post' : 'Save post'}
          aria-pressed={post.saved}
          disabled={mutation.isPending}
          onClick={() => act('save', { saved: !post.saved })}
        >
          <FiBookmark />
        </button>
      </div>
      {comments && <Comments postId={post.id} />}
      {edit && (
        <Modal title="A little edit" close={() => setEdit(false)}>
          <form
            className="cz-modal-form"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate({ method: 'patch', body: { content } });
            }}
          >
            <label>
              Your post
              <textarea
                value={content}
                maxLength={20000}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                required
              />
            </label>
            <button className="cz-button primary" disabled={mutation.isPending}>
              Save changes <FiCheck />
            </button>
          </form>
        </Modal>
      )}
      {report && (
        <Modal title="Help keep this a good place" close={() => setReport(false)}>
          <form
            className="cz-modal-form"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate({ action: 'report', method: 'post', body: { reason } });
            }}
          >
            <p>Tell us what concerns you. Reports go to community moderators.</p>
            <label>
              Reason
              <textarea
                rows={4}
                maxLength={1000}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>
            <button className="cz-button primary" disabled={mutation.isPending}>
              Send report <FiFlag />
            </button>
          </form>
        </Modal>
      )}
    </article>
  );
}
PostCard.propTypes = { post: PropTypes.object.isRequired, expanded: PropTypes.bool };
export function Feed({ view = 'all', author = null }) {
  const { api, user } = useCommunity();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const topic = params.get('topic') || '';
  const [filter, setFilter] = useState('all');
  const actualView = view === 'all' ? filter : view;
  const feed = useInfiniteQuery({
    queryKey: ['community', 'feed', actualView, author, query, topic, user?.uid],
    initialPageParam: '',
    queryFn: async ({ pageParam }) =>
      (
        await api.get('/community/feed', {
          params: {
            view: actualView,
            author: author || undefined,
            cursor: pageParam || undefined,
            q: query || undefined,
            topic: topic || undefined,
          },
        })
      ).data,
    getNextPageParam: (last) => last.nextCursor || undefined,
    retry: false,
  });
  function pickTopic(value) {
    const next = new URLSearchParams(params);
    value ? next.set('topic', value) : next.delete('topic');
    setParams(next);
  }
  const items = feed.data?.pages.flatMap((page) => page.items) || [];
  return (
    <>
      {view === 'all' && !author && (
        <div className="cz-feed-controls">
          <div className="cz-tabs">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
              For you
            </button>
            {user && (
              <button
                className={filter === 'friends' ? 'active' : ''}
                onClick={() => setFilter('friends')}
              >
                Your connections
              </button>
            )}
          </div>
          <span className="cz-feed-order">
            Latest conversations <FiChevronDown />
          </span>
        </div>
      )}
      {view === 'all' && !author && (
        <div className="cz-topic-chips" aria-label="Filter by topic">
          <button className={!topic ? 'active' : ''} onClick={() => pickTopic('')}>
            ✦ All topics
          </button>
          {topics.map((t, i) => (
            <button className={topic === t ? 'active' : ''} key={t} onClick={() => pickTopic(t)}>
              {topicEmojis[i]} {t}
            </button>
          ))}
        </div>
      )}
      {query && (
        <div className="cz-search-summary">
          Conversations matching “{query}”
          <button
            aria-label="Clear search"
            onClick={() => {
              const next = new URLSearchParams(params);
              next.delete('q');
              setParams(next);
            }}
          >
            <FiX />
          </button>
        </div>
      )}
      {feed.isPending ? (
        <Skeleton />
      ) : feed.isError ? (
        <QueryError retry={feed.refetch} />
      ) : items.length ? (
        <div className="cz-post-list">
          {items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {feed.hasNextPage && (
            <button
              className="cz-button secondary cz-load-more"
              disabled={feed.isFetchingNextPage}
              onClick={() => feed.fetchNextPage()}
            >
              {feed.isFetchingNextPage ? 'Finding more conversations…' : 'A little more to explore'}
              <FiArrowRight />
            </button>
          )}
        </div>
      ) : (
        <div className="cz-card">
          <Empty
            icon={view === 'saved' ? FiBookmark : FiMessageCircle}
            title={
              view === 'saved' ? 'Good things, kept close.' : 'Every conversation starts somewhere.'
            }
            action={
              view !== 'saved' &&
              !author && (
                <Link className="cz-button primary" to={user ? '/?compose=1' : '/signup'}>
                  {user ? 'Share the first thought' : 'Join the conversation'}
                  <FiArrowUpRight />
                </Link>
              )
            }
          >
            {view === 'saved'
              ? 'Save a post with the bookmark button. You’ll find it right here.'
              : topic || query
                ? 'No conversations match yet. Try another topic or share something of your own.'
                : 'A thought, a question, a little life update. Make this space your own.'}
          </Empty>
        </div>
      )}
    </>
  );
}
Feed.propTypes = { view: PropTypes.string, author: PropTypes.string };
export function RequireSignIn({ children }) {
  const { user, loading } = useCommunity();
  if (loading) return <Skeleton />;
  return user ? (
    children
  ) : (
    <div className="cz-card">
      <Empty
        icon={FiLock}
        title="Your little corner is waiting."
        action={
          <Link className="cz-button primary" to="/signin">
            Log in <FiArrowRight />
          </Link>
        }
      >
        Log in to see your connections, saved conversations and updates.
      </Empty>
    </div>
  );
}
RequireSignIn.propTypes = { children: PropTypes.node };
