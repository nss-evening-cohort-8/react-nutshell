import React from 'react';
import PropTypes from 'prop-types';
import './EventForm.scss';
import moment from 'moment';
import authRequests from '../../helpers/data/authRequests';
import eventRequests from '../../helpers/data/eventRequests';

const defaultEvent = {
  uid: '',
  event: '',
  location: '',
};

const defaultEventDate = moment().format('YYYY-MM-DD');

class EventForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    isEditing: PropTypes.bool,
    editId: PropTypes.string,
  }

  state = {
    newEvent: defaultEvent,
    eventDate: defaultEventDate,
  }

  formFieldStringState = (name, e) => {
    e.preventDefault();
    const tempEvent = { ...this.state.newEvent };
    tempEvent[name] = e.target.value;
    this.setState({ newEvent: tempEvent });
  }

  eventChange = e => this.formFieldStringState('event', e);

  locationChange = e => this.formFieldStringState('location', e);

  startDateChange = (e) => {
    e.preventDefault();
    let tempDate = { ...this.state.eventDate };
    tempDate = e.target.value;
    this.setState({ eventDate: tempDate });
  };

  formSubmit = (e) => {
    e.preventDefault();
    const { onSubmit } = this.props;
    const myEvent = { ...this.state.newEvent };
    myEvent.startDate = Date.parse(`${this.state.eventDate}T00:00:00`);
    myEvent.uid = authRequests.getCurrentUid();
    onSubmit(myEvent);
    this.setState({ newEvent: defaultEvent, eventDate: defaultEventDate });
  }

  componentDidUpdate(prevProps) {
    const { isEditing, editId } = this.props;
    if (prevProps !== this.props && isEditing) {
      eventRequests.getSingleEvent(editId)
        .then((event) => {
          const eventDate = moment(event.data.startDate).format('YYYY-MM-DD');
          const newEvent = {
            event: event.data.event,
            location: event.data.location,
            uid: event.data.uid,
          };
          this.setState({ newEvent, eventDate });
        })
        .catch(err => console.error('error with getSingleEvent', err));
    }
  }

  render() {
    const { newEvent, eventDate } = this.state;
    const { isEditing } = this.props;
    const title = () => {
      if (isEditing) {
        return <h2>Edit Event:</h2>;
      }
      return <h2>Add New Event:</h2>;
    };
    return (
      <div className="event-form col">
        {title()}
        <form onSubmit={this.formSubmit}>
          <div className="form-group">
            <label htmlFor="event">Event:</label>
            <input
              type="text"
              className="form-control"
              id="event"
              aria-describedby="eventHelp"
              placeholder="BBQ Party"
              value={newEvent.event}
              onChange={this.eventChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              className="form-control"
              id="location"
              aria-describedby="locationHelp"
              placeholder="Downtown Nashville"
              value={newEvent.location}
              onChange={this.locationChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Date:</label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              aria-describedby="startDateHelp"
              // placeholder="Downtown Nashville"
              value={eventDate}
              onChange={this.startDateChange}
            />
          </div>
          <button className="btn btn-danger">Save Event</button>
        </form>
      </div>
    );
  }
}

export default EventForm;
