import React from 'react';
import './Events.scss';

import eventRequests from '../../../helpers/data/eventRequests';
import smashRequests from '../../../helpers/data/smashRequests';
import authRequests from '../../../helpers/data/authRequests';

import EventItem from '../../EventItem/EventItem';
import EventForm from '../../EventForm/EventForm';

class Events extends React.Component {
  state = {
    events: [],
    isEditing: false,
    editId: '-1',
  }

  getEvents = () => {
    const uid = authRequests.getCurrentUid();
    smashRequests.getEventsFromMeAndFriends(uid)
      .then((events) => {
        this.setState({ events });
      })
      .catch(err => console.error('error with events GET', err));
  }

  componentDidMount() {
    this.getEvents();
  }

  deleteSingleEvent = (eventId) => {
    eventRequests.deleteEvent(eventId)
      .then(() => {
        this.getEvents();
      })
      .catch(err => console.error('error with delete single', err));
  }

  formSubmitEvent = (newEvent) => {
    const { isEditing, editId } = this.state;
    if (isEditing) {
      eventRequests.updateEvent(editId, newEvent)
        .then(() => {
          this.setState({ isEditing: false, editId: '-1' });
          this.getEvents();
        })
        .catch(err => console.error('error with events post', err));
    } else {
      eventRequests.postRequest(newEvent)
        .then(() => {
          this.getEvents();
        })
        .catch(err => console.error('error with events post', err));
    }
  }

  render() {
    const { events, isEditing, editId } = this.state;
    const passEventToEdit = eventId => this.setState({ isEditing: true, editId: eventId });
    const eventsItemComponents = events.map(event => (
      <EventItem
        event={event}
        key={event.id}
        deleteSingleEvent={this.deleteSingleEvent}
        passEventToEdit={passEventToEdit}
      />
    ));

    return (
      <div className="Events text-center col">
        <h1>Events</h1>
        <div className="row">
          <div className="col">
            <h3>Upcoming Events</h3>
            <ul>{ eventsItemComponents }</ul>
          </div>
          <div className="col">
            <EventForm
              onSubmit={this.formSubmitEvent}
              isEditing={isEditing}
              editId={editId}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Events;
