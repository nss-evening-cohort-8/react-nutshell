// This file contans all requests that touch multiple collections.

import userRequests from './userRequests';
import messageRequests from './messageRequests';
import friendRequests from './friendRequests';
import articleRequests from './articleRequests';
import eventRequests from './eventRequests';

const getAllMessagesWithUserInfo = () => new Promise((resolve, reject) => {
  let users = [];
  userRequests.getAllUsers()
    .then((usrs) => {
      users = usrs;
      messageRequests.getAllMessages()
        .then((msgs) => {
          const messages = msgs.map(msg => Object.assign({ ...users.find(x => x.uid === msg.uid), ...msg }));
          resolve(messages);
        });
    })
    .catch(err => reject(err));
});

const usersAndFriends = currentUid => new Promise((resolve, reject) => {
  const users = [];
  userRequests.getAllUsers()
    .then((usrs) => {
      friendRequests.getAllFriends()
        .then((friends) => {
          usrs.forEach((user) => {
            const newUser = { ...user };
            newUser.isAccepted = false;
            newUser.isPending = false;
            newUser.friendRequest = '';
            newUser.friendRequestId = '';
            friends.forEach((friend) => {
              if (friend.uid === currentUid && friend.friendUid === newUser.uid) {
                newUser.isAccepted = friend.isAccepted;
                newUser.isPending = friend.isPending;
                newUser.friendRequest = 'me';
                newUser.friendRequestId = friend.id;
              } else if (friend.friendUid === currentUid && newUser.uid === friend.uid) {
                newUser.isAccepted = friend.isAccepted;
                newUser.isPending = friend.isPending;
                newUser.friendRequest = 'them';
                newUser.friendRequestId = friend.id;
              }
            });
            if (newUser.uid !== currentUid) {
              users.push(newUser);
            }
          });
          resolve(users);
        });
    })
    .catch(err => reject(err));
});

const getArticlesFromMeAndFriends = uid => new Promise((resolve, reject) => {
  let allArticles = [];
  articleRequests.getAllArticles()
    .then((articlez) => {
      allArticles = articlez;
      friendRequests.getMyFriends(uid).then((friendsArray) => {
        friendsArray.push(uid);
        const articlesToKeep = allArticles.filter(f => friendsArray.includes(f.uid));
        resolve(articlesToKeep);
      });
    })
    .catch(err => reject(err));
});

const getEventsFromMeAndFriends = uid => new Promise((resolve, reject) => {
  let allEvents = [];
  eventRequests.getAllEvents()
    .then((eventz) => {
      allEvents = eventz;
      friendRequests.getMyFriends(uid).then((friendsArray) => {
        friendsArray.push(uid);
        const eventsToKeep = allEvents.filter(f => friendsArray.includes(f.uid));
        resolve(eventsToKeep);
      });
    })
    .catch(err => reject(err));
});

export default {
  getAllMessagesWithUserInfo,
  usersAndFriends,
  getArticlesFromMeAndFriends,
  getEventsFromMeAndFriends,
};
