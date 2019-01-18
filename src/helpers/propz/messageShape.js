import PropTypes from 'prop-types';

const messageShape = PropTypes.shape({
  uid: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  isEdited: PropTypes.bool.isRequired,
});

export default {
  messageShape,
};
