import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FiLock, FiArrowUpRight, FiImage, FiX } from 'react-icons/fi';
import { useNet } from './context';
import { Empty, Skeleton } from './ui';
export function Heading({ eyebrow, title, description, action }) {
  return (
    <div className="nz-heading">
      <div>
        <span className="cz-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
Heading.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
};
export function NeedAccount({ children }) {
  const { user, loading } = useNet();
  const location = useLocation();
  return loading ? (
    <Skeleton />
  ) : user ? (
    children
  ) : (
    <div className="cz-card">
      <Empty
        icon={FiLock}
        title="Make this space yours."
        action={
          <Link className="cz-button primary" to="/signin" state={{ from: location }}>
            Log in <FiArrowUpRight />
          </Link>
        }
      >
        Log in to connect, share moments and build your community.
      </Empty>
    </div>
  );
}
NeedAccount.propTypes = { children: PropTypes.node };
export function PhotoPicker({ files, setFiles, kept = [], setKept, max = 1 }) {
  const { toast } = useNet();
  const [previews, setPreviews] = useState([]);
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);
  return (
    <div className="nz-photos">
      <div className="nz-photo-previews">
        {kept.map((url, i) => (
          <div key={url}>
            <img src={url} alt="Existing photo" />
            <button
              type="button"
              aria-label="Remove existing photo"
              onClick={() => setKept?.(kept.filter((_, n) => n !== i))}
            >
              <FiX />
            </button>
          </div>
        ))}
        {previews.map((url, i) => (
          <div key={url}>
            <img src={url} alt="Selected photo" />
            <button
              type="button"
              aria-label="Remove selected photo"
              onClick={() => setFiles(files.filter((_, n) => n !== i))}
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>
      <label className="nz-upload">
        <FiImage />
        <span>
          {max > 1 ? 'Add photos' : 'Add a photo'}{' '}
          <small>JPG, PNG or WebP · up to 5 MB{max > 1 ? ' each · maximum 4' : ''}</small>
        </span>
        <input
          type="file"
          aria-label="Choose photos"
          accept="image/jpeg,image/png,image/webp"
          multiple={max > 1}
          onChange={(event) => {
            const selected = Array.from(event.target.files || []);
            event.target.value = '';
            if (files.length + kept.length + selected.length > max)
              return toast(`Choose up to ${max} ${max > 1 ? 'photos' : 'photo'}.`);
            if (
              selected.some(
                (file) =>
                  !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
                  file.size > 5 * 1024 * 1024,
              )
            )
              return toast('Choose JPG, PNG or WebP images under 5 MB.');
            setFiles([...files, ...selected]);
          }}
        />
      </label>
    </div>
  );
}
PhotoPicker.propTypes = {
  files: PropTypes.array.isRequired,
  setFiles: PropTypes.func.isRequired,
  kept: PropTypes.array,
  setKept: PropTypes.func,
  max: PropTypes.number,
};
