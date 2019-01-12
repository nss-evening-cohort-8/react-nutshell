import axios from 'axios';
import apiKeys from '../apiKeys';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const getAllEvents = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/events.json`)
    .then((result) => {
      const eventObject = result.data;
      const eventArray = [];
      if (eventObject != null) {
        Object.keys(eventObject).forEach((eventId) => {
          eventObject[eventId].id = eventId;
          eventArray.push(eventObject[eventId]);
        });
      }
      resolve(eventArray);
    })
    .catch((error) => {
      reject(error);
    });
});
const deleteEvent = eventId => axios.delete(`${firebaseUrl}/events/${eventId}.json`);

const postRequest = newEvent => axios.post(`${firebaseUrl}/events.json`, newEvent);

const getSingleEvent = eventId => axios.get(`${firebaseUrl}/events/${eventId}.json`);

const updateEvent = (eventId, event) => axios.put(`${firebaseUrl}/events/${eventId}.json`, event);

export default {
  getAllEvents,
  deleteEvent,
  postRequest,
  getSingleEvent,
  updateEvent,
};
