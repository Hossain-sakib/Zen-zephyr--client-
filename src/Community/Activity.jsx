import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PageMetadata from '../seo/PageMetadata';
import PropTypes from 'prop-types';
import { FiBell, FiArrowUpRight, FiCheck, FiArrowLeft, FiShield } from 'react-icons/fi';
import { Avatar, Empty, QueryError, Skeleton } from './ui';
import { PostCard } from './Feed';
import { PageHeading } from './ui';
import { useCommunity, errorMessage, relativeTime } from './core-context';
export function NotificationPage() {
  const { notifications, api, toast } = useCommunity();
  const cache = useQueryClient();
  const read = useMutation({
    mutationFn: () => api.patch('/community/notifications/read'),
    onSuccess: () => cache.invalidateQueries({ queryKey: ['community', 'notifications'] }),
    onError: (e) => toast(errorMessage(e)),
  });
  const words = {
    like: 'appreciated your post.',
    comment: 'added to your conversation.',
    friend_request: 'would like to connect with you.',
    friend_accepted: 'accepted your connection request.',
    group_request: 'asked to join your group.',
    group_accepted: 'welcomed you to the group.',
    space_comment: 'replied in your community.',
    message: 'sent you a message.',
  };
  return (
    <>
      <div className="cz-notifications-heading">
        <PageHeading
          eyebrow="A LITTLE CONNECTION"
          title="You’re in the loop."
          description="The conversations and people that make this place yours."
        />
        {!!notifications.data?.unread && (
          <button
            className="cz-button secondary small"
            onClick={() => read.mutate()}
            disabled={read.isPending}
          >
            <FiCheck />
            Mark all read
          </button>
        )}
      </div>
      {notifications.isPending ? (
        <Skeleton />
      ) : notifications.isError ? (
        <QueryError retry={notifications.refetch} />
      ) : notifications.data?.items.length ? (
        <div className="cz-card cz-notification-list">
          {notifications.data.items.map((item) => (
            <Link
              to={item.link || (item.postId ? `/post/${item.postId}` : '/people')}
              className={`cz-notification ${!item.read ? 'unread' : ''}`}
              key={item.id}
            >
              <Avatar person={item.actor} />
              <div>
                <p>
                  <strong>{item.actor.name}</strong> {words[item.kind] || 'shared an update.'}
                </p>
                <time>{relativeTime(item.createdAt)}</time>
              </div>
              {!item.read && <i />}
            </Link>
          ))}
        </div>
      ) : (
        <div className="cz-card">
          <Empty icon={FiBell} title="A quiet moment. Enjoy it.">
            Connection requests, appreciations and replies will find you here.
          </Empty>
        </div>
      )}
    </>
  );
}
export function PostPage({ id }) {
  const { api, user } = useCommunity();
  const query = useQuery({
    queryKey: ['community', 'post', id, user?.uid],
    queryFn: async () => (await api.get(`/community/posts/${id}`)).data,
    retry: false,
  });
  return (
    <>
      <Link className="cz-back-link" to="/">
        <FiArrowLeft />
        Back to your community
      </Link>
      {query.isPending ? (
        <Skeleton cards={1} />
      ) : query.isError ? (
        <QueryError retry={query.refetch} />
      ) : (
        <>
          <PageMetadata
            title={`${query.data.author.name} shared a conversation`}
            description={query.data.content}
            image={query.data.image || undefined}
            index={query.data.visibility !== 'friends' && !query.data.isDemo}
            type="article"
          />
          <PostCard post={query.data} expanded />
        </>
      )}
    </>
  );
}
PostPage.propTypes = { id: PropTypes.string.isRequired };
export function ModerationPage() {
  const { api, me, toast } = useCommunity();
  const cache = useQueryClient();
  const reports = useQuery({
    queryKey: ['community', 'moderation'],
    enabled: !!me.data?.isAdmin,
    queryFn: async () => (await api.get('/community/moderation/reports')).data,
    retry: false,
  });
  const action = useMutation({
    mutationFn: ({ id, remove }) =>
      api.delete(`/community/moderation/${remove ? 'content' : 'reports'}/${id}`),
    onSuccess: () => {
      cache.invalidateQueries({ queryKey: ['community'] });
      toast('Report reviewed. Thank you for looking out for the community.');
    },
    onError: (e) => toast(errorMessage(e)),
  });
  if (me.isPending) return <Skeleton />;
  if (!me.data?.isAdmin)
    return (
      <div className="cz-card">
        <Empty icon={FiShield} title="This corner is for moderators.">
          You can help by reporting content that doesn’t belong.
        </Empty>
      </div>
    );
  return (
    <>
      <PageHeading
        eyebrow="LOOKING OUT FOR EACH OTHER"
        title="Community moderation."
        description="Review reports thoughtfully. Keep the community a welcoming place."
      />
      {reports.isPending ? (
        <Skeleton />
      ) : reports.isError ? (
        <QueryError retry={reports.refetch} />
      ) : !reports.data.length ? (
        <div className="cz-card">
          <Empty icon={FiShield} title="Nothing to review right now.">
            New reports will appear here.
          </Empty>
        </div>
      ) : (
        reports.data.map((report) => (
          <article className="cz-card cz-report-card" key={report.id}>
            <span className="cz-eyebrow">REPORTED {report.type}</span>
            <h3>{report.reason}</h3>
            {report.content && <p>{report.content}</p>}
            <div>
              {report.postId && (
                <Link to={`/post/${report.postId}`} className="cz-button secondary small">
                  View conversation <FiArrowUpRight />
                </Link>
              )}
              <button
                className="cz-button secondary small"
                disabled={action.isPending}
                onClick={() => action.mutate({ id: report.id, remove: false })}
              >
                Dismiss
              </button>
              <button
                className="cz-button primary small"
                disabled={action.isPending}
                onClick={() => {
                  if (window.confirm('Remove the reported content?'))
                    action.mutate({ id: report.id, remove: true });
                }}
              >
                Remove content
              </button>
            </div>
          </article>
        ))
      )}
    </>
  );
}
