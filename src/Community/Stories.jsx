import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import {
  FiPlus,
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiTrash2,
  FiCheck,
  FiClock,
} from 'react-icons/fi';
import { NetworkContext, useNet, useAction, time } from './context';
import { PhotoPicker } from './shared';
import { Avatar, Modal, Skeleton, Empty } from './ui';
import { uploadProfileImage } from '../utils/cloudinary';
import './network.css';
function StoryCreator({ close }) {
  const ctx = useNet();
  const [content, setContent] = useState('');
  const [color, setColor] = useState('lilac');
  const [visibility, setVisibility] = useState('public');
  const [files, setFiles] = useState([]);
  const action = useAction(
    async () =>
      ctx.api.post('/social/stories', {
        content,
        color,
        visibility,
        image: files[0] ? await uploadProfileImage(files[0], ctx.user) : '',
      }),
    () => {
      close();
      ctx.toast('Your moment is shared for the next 24 hours.');
    },
  );
  return (
    <Modal title="Share a little of today" close={close}>
      <form
        className="cz-modal-form"
        onSubmit={(e) => {
          e.preventDefault();
          action.mutate();
        }}
      >
        <div className={`nz-story-preview ${color}`}>
          <textarea
            aria-label="Story text"
            placeholder="A thought. A little moment. Something worth sharing."
            value={content}
            maxLength={280}
            rows={4}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="nz-story-colors" aria-label="Story background">
          {['lilac', 'sage', 'sunset', 'ink'].map((c) => (
            <button
              type="button"
              key={c}
              className={`${c} ${color === c ? 'selected' : ''}`}
              onClick={() => setColor(c)}
              aria-label={`${c} background`}
            >
              {color === c && <FiCheck />}
            </button>
          ))}
        </div>
        <PhotoPicker files={files} setFiles={setFiles} />
        <label>
          Audience
          <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <option value="public">Everyone</option>
            <option value="connections">Connections only</option>
          </select>
        </label>
        <p className="nz-quiet-note">
          <FiClock />
          Stories disappear from the community after 24 hours.
        </p>
        <button
          className="cz-button primary"
          disabled={action.isPending || (!content.trim() && !files.length)}
        >
          {action.isPending ? 'Sharing…' : 'Share your moment'}
          <FiArrowUpRight />
        </button>
      </form>
    </Modal>
  );
}
StoryCreator.propTypes = { close: PropTypes.func.isRequired };
function StoryViewer({ stories, index, setIndex, close }) {
  const ctx = useNet();
  const cache = useQueryClient();
  const id = stories[index]?.id;
  const query = useQuery({
    queryKey: ['social', 'story', id, ctx.user?.uid],
    queryFn: async () => (await ctx.api.get(`/social/stories/${id}`)).data,
    retry: false,
  });
  const data = query.data;
  useEffect(() => {
    if (data?.id && ctx.user)
      ctx.api
        .put(`/social/stories/${data.id}/view`, {})
        .then(() => cache.invalidateQueries({ queryKey: ['social', 'stories'] }))
        .catch(() => {});
  }, [data?.id, ctx.user, ctx.api, cache]);
  useEffect(() => {
    if (!data?.expiresAt) return;
    const remaining = new Date(data.expiresAt).getTime() - Date.now();
    const timer = setTimeout(close, Math.max(0, remaining));
    return () => clearTimeout(timer);
  }, [data?.expiresAt, close]);
  const remove = useAction(
    () => ctx.api.delete(`/social/stories/${id}`),
    () => {
      close();
      ctx.toast('Story removed.');
    },
  );
  return (
    <Modal title="A little moment" close={close}>
      {query.isPending ? (
        <Skeleton cards={1} />
      ) : query.isError ? (
        <Empty icon={FiClock} title="This moment has passed.">
          It may have expired or is no longer available to you.
        </Empty>
      ) : (
        <div className="nz-story-viewer">
          <div className="nz-story-progress">
            {stories.map((s, i) => (
              <span className={i <= index ? 'seen' : ''} key={s.id} />
            ))}
          </div>
          <div className="nz-story-person">
            <Avatar person={data.author} />
            <span>
              <strong>{data.author?.name || 'Community member'}</strong>
              <small>
                {time(data.createdAt)} · {data.visibility === 'public' ? 'Public' : 'Connections'}
              </small>
            </span>
            {data.canDelete && (
              <button
                className="cz-icon-button"
                aria-label="Remove story"
                disabled={remove.isPending}
                onClick={() => {
                  if (window.confirm('Remove this story?')) remove.mutate();
                }}
              >
                <FiTrash2 />
              </button>
            )}
          </div>
          <div className={`nz-story-slide ${data.color}`}>
            {data.image && <img src={data.image} alt="Photo shared in this story" />}
            {data.content && <p>{data.content}</p>}
          </div>
          <div className="nz-story-bottom">
            <button
              className="cz-icon-button"
              aria-label="Previous story"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              <FiChevronLeft />
            </button>
            <small>
              {data.views !== undefined ? (
                <>
                  <FiEye />
                  {data.views} member views
                </>
              ) : (
                <>
                  <FiClock />
                  Shared for 24 hours
                </>
              )}
            </small>
            <button
              className="cz-icon-button"
              aria-label="Next story"
              onClick={() => (index + 1 < stories.length ? setIndex(index + 1) : close())}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
StoryViewer.propTypes = {
  stories: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  setIndex: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};
export function StoriesWidget({ full = false }) {
  const ctx = useNet();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [index, setIndex] = useState(null);
  const query = useQuery({
    queryKey: ['social', 'stories', ctx.user?.uid],
    queryFn: async () => (await ctx.api.get('/social/stories')).data,
    retry: false,
    refetchInterval: 60000,
  });
  const groups = new Map();
  for (const story of query.data || []) {
    const key = story.author?.id || story.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(story);
  }
  const all = [...groups.values()].flatMap((group) => [...group].reverse());
  return (
    <section className={`nz-story-section ${full ? 'full' : ''}`}>
      <div className="nz-story-heading">
        <h2>Little moments</h2>
        {!full && (
          <Link to="/stories">
            See all <FiArrowUpRight />
          </Link>
        )}
      </div>
      <div className="nz-story-shelf">
        <button
          className="nz-story-create"
          onClick={() =>
            ctx.user
              ? setCreating(true)
              : navigate('/signin', { state: { from: { pathname: '/stories' } } })
          }
        >
          <span>
            <FiPlus />
          </span>
          <strong>Add your story</strong>
          <small>A little of today</small>
        </button>
        {[...groups.values()].map((stories) => {
          const story = stories[0];
          return (
            <button
              key={story.id}
              className={`nz-story-tile ${story.color} ${stories.every((s) => s.seen) ? 'viewed' : ''}`}
              onClick={() => setIndex(all.findIndex((s) => s.id === story.id))}
            >
              {story.image && <img className="nz-story-photo" src={story.image} alt="" />}
              <Avatar person={story.author} size="small" />
              <span>{story.content ? story.content.slice(0, 65) : 'A little moment'}</span>
              <strong>{story.author?.name?.split(' ')[0] || 'Community'}</strong>
            </button>
          );
        })}
        {query.isPending && (
          <div className="nz-stories-loading">Finding today’s little moments…</div>
        )}
        {query.isError && (
          <button className="nz-story-retry" onClick={() => query.refetch()}>
            Couldn’t load stories. Try again.
          </button>
        )}
        {query.isSuccess && !query.data.length && (
          <div className="nz-story-invite">
            <span>✦</span>
            <strong>Small moments make a community.</strong>
            <p>Something from your day. Here for 24 hours.</p>
          </div>
        )}
      </div>
      {creating && <StoryCreator close={() => setCreating(false)} />}
      {index !== null && all[index] && (
        <StoryViewer stories={all} index={index} setIndex={setIndex} close={() => setIndex(null)} />
      )}
    </section>
  );
}
StoriesWidget.propTypes = { full: PropTypes.bool };
export function StoryShelf({ context }) {
  return (
    <NetworkContext.Provider value={context}>
      <StoriesWidget />
    </NetworkContext.Provider>
  );
}
StoryShelf.propTypes = { context: PropTypes.object.isRequired };
