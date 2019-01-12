import axios from 'axios';
import apiKeys from '../apiKeys';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const getAllFriends = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/friends.json`)
    .then((result) => {
      const friendObject = result.data;
      const friendArray = [];
      if (friendObject != null) {
        Object.keys(friendObject).forEach((friendId) => {
          friendObject[friendId].id = friendId;
          friendArray.push(friendObject[friendId]);
        });
      }
      resolve(friendArray);
    })
    .catch((error) => {
      reject(error);
    });
});

const addFriend = newFriend => axios.post(`${firebaseUrl}/friends.json`, newFriend);

const deleteFriend = friendId => axios.delete(`${firebaseUrl}/friends/${friendId}.json`);

const acceptFriendship = friendId => axios.patch(`${firebaseUrl}/friends/${friendId}.json`, { isAccepted: true, isPending: false });

const getMyFriends = uid => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/friends.json`)
    .then((result) => {
      const friendObject = result.data;
      const friendArray = [];
      if (friendObject != null) {
        Object.keys(friendObject).forEach((friendId) => {
          friendObject[friendId].id = friendId;
          if (friendObject[friendId].isAccepted && friendObject[friendId].friendUid === uid) {
            friendArray.push(friendObject[friendId].uid);
          }

          if (friendObject[friendId].isAccepted && friendObject[friendId].uid === uid) {
            friendArray.push(friendObject[friendId].friendUid);
          }
        });
      }
      resolve(friendArray);
    })
    .catch((error) => {
      reject(error);
    });
});

export default {
  getAllFriends,
  addFriend,
  deleteFriend,
  acceptFriendship,
  getMyFriends,
};
