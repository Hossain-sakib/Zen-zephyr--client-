import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { metadata, websiteSchema } from './metadata';
export default function PageMetadata({ title, description, image, index, type }) {
  const location = useLocation();
  const meta = metadata(location.pathname, location.search, {
    title,
    description,
    image,
    index,
    type,
  });
  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta
        name="robots"
        content={meta.index ? 'index, follow, max-image-preview:large' : 'noindex, follow'}
      />
      <link rel="canonical" href={meta.canonical} />
      <meta property="og:site_name" content="Zen Zephyr" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:alt" content="Zen Zephyr community" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
      {location.pathname === '/' && (
        <script type="application/ld+json">{JSON.stringify(websiteSchema(meta))}</script>
      )}
    </Helmet>
  );
}
PageMetadata.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  index: PropTypes.bool,
  type: PropTypes.string,
};
