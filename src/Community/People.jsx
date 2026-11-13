import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PageMetadata from '../seo/PageMetadata';
import PropTypes from 'prop-types';
import {
  FiUsers,
  FiArrowUpRight,
  FiX,
  FiCheck,
  FiMapPin,
  FiEdit2,
  FiShield,
  FiUserPlus,
  FiMessageSquare,
} from 'react-icons/fi';
import { uploadProfileImage } from '../utils/cloudinary';
import { Avatar, Modal, Empty, QueryError, Skeleton } from './ui';
import { Feed } from './Feed';
import { RequireSignIn } from './Feed';
import { PageHeading } from './ui';
import { useCommunity, errorMessage } from './core-context';
export function ConnectionButton({ person }) {
  const { api, user, toast } = useCommunity();
  const navigate = useNavigate();
  const cache = useQueryClient();
  const mutation = useMutation({
    mutationFn: (method) => api[method](`/community/connections/${person.id}`),
    onSuccess: () => cache.invalidateQueries({ queryKey: ['community'] }),
    onError: (error) => toast(errorMessage(error)),
  });
  if (person.isDemo) return <span className="cz-demo-badge">Demo profile</span>;
  if (person.id === user?.uid)
    return (
      <Link className="cz-button secondary small" to="/profile/me">
        Your profile <FiArrowUpRight />
      </Link>
    );
  return (
    <div className="cz-connect-actions">
      {person.incoming && person.connection === 'pending' ? (
        <>
          <button
            className="cz-button primary small"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate('patch')}
          >
            Accept <FiCheck />
          </button>
          <button
            className="cz-icon-button"
            aria-label="Decline request"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate('delete')}
          >
            <FiX />
          </button>
        </>
      ) : (
        <button
          className={`cz-button ${person.connection ? 'secondary' : 'primary'} small`}
          disabled={mutation.isPending || person.canConnect === false}
          onClick={() => {
            if (!user) return navigate('/signin');
            if (
              person.connection === 'accepted' &&
              !window.confirm(`Remove your connection with ${person.name}?`)
            )
              return;
            mutation.mutate(person.connection ? 'delete' : 'post');
          }}
        >
          {mutation.isPending
            ? 'One moment…'
            : person.connection === 'accepted'
              ? 'Connected'
              : person.connection === 'pending'
                ? 'Cancel request'
                : person.canConnect === false
                  ? 'Not active yet'
                  : 'Connect'}
          {person.connection ? <FiCheck /> : <FiUserPlus />}
        </button>
      )}
    </div>
  );
}
ConnectionButton.propTypes = { person: PropTypes.object.isRequired };
export function PeoplePage() {
  const { api, user } = useCommunity();
  const [params] = useSearchParams();
  const [tab, setTab] = useState('discover');
  const people = useQuery({
    queryKey: ['community', 'people', params.get('q'), user?.uid],
    queryFn: async () =>
      (await api.get('/community/people', { params: { q: params.get('q') || '' } })).data,
    retry: false,
  });
  const connections = useQuery({
    queryKey: ['community', 'connections', user?.uid],
    enabled: !!user,
    queryFn: async () => (await api.get('/community/connections')).data,
    retry: false,
  });
  const list =
    tab === 'discover'
      ? people.data
      : connections.data
          ?.filter((c) =>
            tab === 'requests' ? c.status === 'pending' && c.incoming : c.status === 'accepted',
          )
          .map((c) => ({ ...c.person, connection: c.status, incoming: c.incoming }));
  const query = tab === 'discover' ? people : connections;
  const incoming =
    connections.data?.filter((c) => c.status === 'pending' && c.incoming).length || 0;
  return (
    <>
      <PageHeading
        eyebrow="BETTER, TOGETHER"
        title="Find your people."
        description="A familiar interest. A different perspective. A new connection."
      />
      <div className="cz-tabs cz-page-tabs">
        <button className={tab === 'discover' ? 'active' : ''} onClick={() => setTab('discover')}>
          Discover
        </button>
        {user && (
          <>
            <button
              className={tab === 'connections' ? 'active' : ''}
              onClick={() => setTab('connections')}
            >
              Your connections
            </button>
            <button
              className={tab === 'requests' ? 'active' : ''}
              onClick={() => setTab('requests')}
            >
              Requests {incoming > 0 && <span className="cz-badge">{incoming}</span>}
            </button>
          </>
        )}
      </div>
      {query.isPending ? (
        <Skeleton />
      ) : query.isError ? (
        <QueryError retry={query.refetch} />
      ) : !list?.length ? (
        <div className="cz-card">
          <Empty
            icon={FiUsers}
            title={tab === 'requests' ? 'All caught up.' : 'Good connections take a first hello.'}
          >
            {tab === 'requests'
              ? 'New connection requests will appear here.'
              : 'Explore the community and connect with someone who sparks your curiosity.'}
          </Empty>
        </div>
      ) : (
        <div className="cz-people-grid">
          {list.map((person) => (
            <article className="cz-card cz-person-card" key={person.id}>
              <div className="cz-person-cover" />
              <Link to={`/profile/${person.id}`}>
                <Avatar person={person} size="large" />
                <h3>{person.name}</h3>
              </Link>
              <p>{person.bio || 'Here for the conversations and connections.'}</p>
              {person.location && (
                <small>
                  <FiMapPin />
                  {person.location}
                </small>
              )}
              <ConnectionButton person={person} />
            </article>
          ))}
        </div>
      )}
    </>
  );
}
export function ProfilePage({ id }) {
  const { api, me, user, toast } = useCommunity();
  const cache = useQueryClient();
  const own = id === 'me' || id === user?.uid;
  const uid = own ? user?.uid : id;
  const profile = useQuery({
    queryKey: ['community', 'profile', uid],
    enabled: !!uid && (!own || !!me.data),
    queryFn: async () => (await api.get(`/community/profiles/${encodeURIComponent(uid)}`)).data,
    retry: false,
  });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', location: '' });
  const [photo, setPhoto] = useState(null);
  const mutation = useMutation({
    mutationFn: async () =>
      api.patch('/community/me', {
        ...form,
        image: photo ? await uploadProfileImage(photo, user) : undefined,
      }),
    onSuccess: () => {
      setEditing(false);
      cache.invalidateQueries({ queryKey: ['community'] });
      toast('A little more you. Profile updated.');
    },
    onError: (e) => toast(errorMessage(e)),
  });
  if (own && !user) return <RequireSignIn />;
  if (own && me.isError) return <QueryError retry={me.refetch} />;
  if (profile.isPending) return <Skeleton />;
  if (profile.isError) return <QueryError retry={profile.refetch} />;
  const person = profile.data;
  return (
    <>
      <PageMetadata
        title={person.name}
        description={person.bio || `Meet ${person.name} on Zen Zephyr.`}
        image={person.image || undefined}
        index={!person.isDemo && !own}
      />
      <section className="cz-card cz-profile-card">
        <div className="cz-profile-cover">
          <span>your own kind of wonderful.</span>
          <b>✳</b>
          <i>✦</i>
        </div>
        <div className="cz-profile-body">
          <Avatar person={person} size="xl" />
          <div className="cz-profile-top-actions">
            {own ? (
              <button
                className="cz-button secondary small"
                onClick={() => {
                  setForm({
                    name: person.name,
                    bio: person.bio || '',
                    location: person.location || '',
                  });
                  setPhoto(null);
                  setEditing(true);
                }}
              >
                <FiEdit2 />
                Edit profile
              </button>
            ) : (
              <>
                <ConnectionButton person={person} />
                {!person.isDemo && (
                  <>
                    <Link
                      className="cz-button secondary small"
                      to={`/messages?to=${encodeURIComponent(person.id)}`}
                    >
                      <FiMessageSquare />
                      Message
                    </Link>
                    <Link
                      className="cz-icon-button"
                      aria-label="Block member"
                      to={`/settings?block=${encodeURIComponent(person.id)}`}
                    >
                      <FiShield />
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
          <h1>
            {person.name}
            {person.isDemo && <span className="cz-demo-badge">Demo profile</span>}
          </h1>
          <p className="cz-profile-bio">
            {person.bio ||
              (own
                ? 'Tell the community a little about your world.'
                : 'Here to share a little of their world.')}
          </p>
          <div className="cz-profile-meta">
            {person.location && (
              <span>
                <FiMapPin />
                {person.location}
              </span>
            )}
            <span>
              <strong>{person.postCount}</strong> conversations
            </span>
            <span>
              <strong>{person.connectionCount}</strong> connections
            </span>
          </div>
        </div>
      </section>
      <h2 className="cz-subheading">
        {own ? 'Your conversations' : `From ${person.name.split(' ')[0]}`}
      </h2>
      <Feed author={person.id} />
      {editing && (
        <Modal title="Make it feel like you" close={() => setEditing(false)}>
          <form
            className="cz-modal-form"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            <label>
              Name
              <input
                autoComplete="name"
                value={form.name}
                maxLength={120}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              A little about you
              <textarea
                rows={3}
                value={form.bio}
                maxLength={240}
                placeholder="The things you love. What makes you, you."
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
              <small>{form.bio.length}/240</small>
            </label>
            <label>
              Location
              <input
                value={form.location}
                maxLength={100}
                placeholder="Your corner of the world"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </label>
            <label>
              Profile photo
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f && f.size > 5 * 1024 * 1024) {
                    toast('Choose an image under 5 MB.');
                    e.target.value = '';
                  } else setPhoto(f || null);
                }}
              />
            </label>
            <button className="cz-button primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save profile'}
              <FiCheck />
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
ProfilePage.propTypes = { id: PropTypes.string.isRequired };
