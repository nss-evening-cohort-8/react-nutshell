import axios from 'axios';
import moment from 'moment';
import apiKeys from '../apiKeys';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const getAllMessages = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/messages.json`)
    .then((results) => {
      const messagesArray = [];
      const messagesObj = results.data;
      if (messagesObj !== null) {
        Object.keys(messagesObj).forEach((message) => {
          messagesObj[message].id = message;
          messagesArray.push(messagesObj[message]);
        });
        messagesArray.sort((a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix());
      }
      resolve(messagesArray);
    })
    .catch((error) => {
      reject(error);
    });
});

const getSingleMessage = messageId => axios.get(`${firebaseUrl}/messages/${messageId}.json`);

const createMessage = newMessage => axios.post(`${firebaseUrl}/messages.json`, newMessage);

const deleteMessage = messageId => axios.delete(`${firebaseUrl}/messages/${messageId}.json`);

const updateMessage = (editedMessage, messageId) => axios.put(`${firebaseUrl}/messages/${messageId}.json`, editedMessage);

export default {
  getAllMessages,
  createMessage,
  deleteMessage,
  getSingleMessage,
  updateMessage,
};
