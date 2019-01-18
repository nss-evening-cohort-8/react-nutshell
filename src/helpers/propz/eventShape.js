import PropTypes from 'prop-types';

const eventShape = PropTypes.shape({
  uid: PropTypes.string.isRequired,
  event: PropTypes.string.isRequired,
  startDate: PropTypes.number.isRequired,
  location: PropTypes.string.isRequired,
});

export default {
  eventShape,
};
