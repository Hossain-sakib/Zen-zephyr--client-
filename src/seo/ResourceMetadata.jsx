import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import PageMetadata from './PageMetadata';
import { resourceMetadata } from './metadata';
export default function ResourceMetadata({ data }) {
  const location = useLocation();
  const meta = resourceMetadata(location.pathname, data);
  return (
    <PageMetadata
      title={meta.title}
      description={meta.description}
      image={meta.image}
      index={meta.index && !location.search}
      type={meta.type}
    />
  );
}
ResourceMetadata.propTypes = { data: PropTypes.object.isRequired };
