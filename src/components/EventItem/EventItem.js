import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import eventShape from '../../helpers/propz/eventShape';
import authRequests from '../../helpers/data/authRequests';

import './EventItem.scss';

class EventItem extends React.Component {
  static propTypes = {
    event: eventShape.eventShape,
    deleteSingleEvent: PropTypes.func,
    passEventToEdit: PropTypes.func,
  }

  deleteEvent = (e) => {
    e.preventDefault();
    const { deleteSingleEvent, event } = this.props;
    deleteSingleEvent(event.id);
  }

  editEvent = (e) => {
    e.preventDefault();
    const { passEventToEdit, event } = this.props;
    passEventToEdit(event.id);
  }

  render() {
    const { event } = this.props;
    const uid = authRequests.getCurrentUid();

    const makeButtons = () => {
      if (event.uid === uid) {
        return (
          <div className="col-2">
            <button className="btn btn-default" onClick={this.editEvent}>
              <i className="fas fa-pencil-alt"></i>
            </button>
            <button className="btn btn-default" onClick={this.deleteEvent}>
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        );
      }
      return <div className="col-2"></div>;
    };
    return (
      <li className="event-item text-center">
        <div className="col-7">
          <h4>{event.event}</h4>
          <p>{event.location}</p>
        </div>
        <div className="col-3">
          {moment(event.startDate).format('L')}
        </div>
        { makeButtons() }
      </li>
    );
  }
}

export default EventItem;
