import PropTypes from 'prop-types';

const articleShape = PropTypes.shape({
  uid: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  synopsis: PropTypes.string.isRequired,
});

export default {
  articleShape,
};
