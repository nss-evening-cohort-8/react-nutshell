import axios from 'axios';
import apiKeys from '../apiKeys';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const createUser = user => axios.post(`${firebaseUrl}/users.json`, user);

const getUserByUid = uid => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/users.json?orderBy="uid"&equalTo="${uid}"`)
    .then((result) => {
      const userObject = result.data;
      const userArray = [];
      if (userObject != null) {
        Object.keys(userObject).forEach((userId) => {
          userObject[userId].id = userId;
          userArray.push(userObject[userId]);
        });
      }
      resolve(userArray[0]);
    })
    .catch((error) => {
      reject(error);
    });
});

const getAllUsers = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/users.json`)
    .then((result) => {
      const userObject = result.data;
      const userArray = [];
      if (userObject != null) {
        Object.keys(userObject).forEach((userId) => {
          userObject[userId].id = userId;
          userArray.push(userObject[userId]);
        });
      }
      resolve(userArray);
    })
    .catch((error) => {
      reject(error);
    });
});


export default {
  getAllUsers,
  getUserByUid,
  createUser,
};
