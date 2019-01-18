import PropTypes from 'prop-types';

const weatherShape = PropTypes.shape({
  uid: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  isCurrent: PropTypes.bool.isRequired,
});

const weatherOptionalShape = PropTypes.oneOfType([
  PropTypes.shape({
    nope: PropTypes.string.isRequired,
  }),
  weatherShape,
]);

export default {
  weatherShape,
  weatherOptionalShape,
};
