import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiMessageCircle, FiX, FiRefreshCw } from 'react-icons/fi';
export function Avatar({ person, size = '', className = '' }) {
  const name = person?.name || 'You';
  return <span className={`cz-avatar ${size} ${className}`} style={{ '--avatar-hue': [...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % 360 }} aria-label={name}>
    <span>{name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}</span>
    {person?.image && <img src={person.image} alt="" onError={event => { event.currentTarget.style.display = 'none'; }} />}
  </span>;
}
Avatar.propTypes = { person: PropTypes.object, size: PropTypes.string, className: PropTypes.string };
export function Modal({ title, children, close }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.showModal();
    return () => { previous?.focus?.(); };
  }, []);
  return <dialog className="cz-modal" ref={ref} onCancel={close} onClick={event => { if (event.target === ref.current) close(); }}>
    <div className="cz-modal-head"><h2>{title}</h2><button className="cz-icon-button" aria-label="Close dialog" onClick={close}><FiX /></button></div>{children}
  </dialog>;
}
Modal.propTypes = { title: PropTypes.string.isRequired, children: PropTypes.node, close: PropTypes.func.isRequired };
export function Empty({ icon: Icon = FiMessageCircle, title, children, action }) {
  return <div className="cz-empty"><span className="cz-empty-icon"><Icon /></span><h3>{title}</h3><p>{children}</p>{action}</div>;
}
Empty.propTypes = { icon: PropTypes.elementType, title: PropTypes.string, children: PropTypes.node, action: PropTypes.node };
export function QueryError({ retry, compact = false }) {
  return <div className={`cz-query-error ${compact ? 'compact' : ''}`} role="alert"><FiRefreshCw /><div><strong>We couldn’t load this just yet.</strong><p>Please try again in a moment.</p></div><button className="cz-button subtle" onClick={retry}>Try again</button></div>;
}
QueryError.propTypes = { retry: PropTypes.func.isRequired, compact: PropTypes.bool };
export function Skeleton({ cards = 2 }) {
  return <div aria-label="Loading conversations" className="cz-skeletons">{Array.from({ length: cards }, (_, i) => <div className="cz-card cz-skeleton" key={i}><span /><div /><div /><div /></div>)}</div>;
}
Skeleton.propTypes = { cards: PropTypes.number };
