import React from 'react';

import smashRequests from '../../../helpers/data/smashRequests';
import authRequests from '../../../helpers/data/authRequests';
import friendRequests from '../../../helpers/data/friendRequests';
import './Friends.scss';


class Friends extends React.Component {
  state={
    undiscoveredFriends: [],
    pendingFriendships: [],
    myFriends: [],
  }

  userMegaSmash = () => {
    const uid = authRequests.getCurrentUid();
    smashRequests.usersAndFriends(uid)
      .then((users) => {
        const undiscoveredFriends = users.filter(x => x.friendRequest === '');
        const pendingFriendships = users.filter(x => x.friendRequest !== '' && x.isPending);
        const myFriends = users.filter(x => x.isAccepted);

        this.setState({ undiscoveredFriends, pendingFriendships, myFriends });
      })
      .catch(err => console.error('err in usersAndFriends', err));
  }

  componentDidMount() {
    this.userMegaSmash();
  }

  addNewFriend = (e) => {
    e.preventDefault();
    const newFriend = {
      friendUid: e.target.id,
      isAccepted: false,
      isPending: true,
      uid: authRequests.getCurrentUid(),
    };
    friendRequests.addFriend(newFriend)
      .then(() => {
        this.userMegaSmash();
      })
      .catch(err => console.error('problem adding new friend', err));
  };

  friendshipOver = (e) => {
    e.preventDefault();
    const friendId = e.target.id;
    friendRequests.deleteFriend(friendId)
      .then(() => {
        this.userMegaSmash();
      })
      .catch(err => console.error('problem deleting friend', err));
  };

  confirmFriendship = (e) => {
    e.preventDefault();
    const friendId = e.target.id;
    friendRequests.acceptFriendship(friendId)
      .then(() => {
        this.userMegaSmash();
      })
      .catch(err => console.error('problem deleting friend', err));
  }

  render() {
    const { undiscoveredFriends, pendingFriendships, myFriends } = this.state;
    const undiscoveredFriendCards = undiscoveredFriends.map(undiscovered => (
      <div className="card border-dark" key={undiscovered.id}>
        <h5 className="card-header bg-secondary">{undiscovered.userName}</h5>
        <div className="card-body">
          <div className="double-wide">
            <img className="profile-img" src={undiscovered.photo} alt={undiscovered.userName}/>
          </div>
          <div className="double-wide">
            <button className="btn btn-primary delete-button" id={undiscovered.uid} onClick={this.addNewFriend}>Request</button>
          </div>
        </div>
      </div>
    ));

    const pendingFriendshipsCards = pendingFriendships.map(pending => (
      <div className="card border-dark" key={pending.id}>
        <h5 className="card-header bg-warning ">{pending.userName}</h5>
        <div className="card-body">
          <div className="double-wide">
            <img className="profile-img" src={pending.photo} alt={pending.userName}/>
          </div>
          <div className="double-wide">
            { pending.friendRequest === 'me'
              ? <p>Waiting</p>
              : <div>
                <button className="btn btn-warning" id={pending.friendRequestId} onClick={this.confirmFriendship}>Accept!</button>
                <button className="btn btn-danger" id={pending.friendRequestId} onClick={this.friendshipOver}>Nope</button>
              </div>}
          </div>
        </div>
      </div>
    ));

    const myFriendsCards = myFriends.map(mine => (
      <div className="card border-dark" key={mine.id}>
        <h5 className="card-header bg-success">{mine.userName}</h5>
        <div className="card-body">
          <div className="double-wide">
            <img className="profile-img" src={mine.photo} alt={mine.userName}/>
          </div>
          <div className="double-wide">
            <button className="btn btn-danger" id={mine.friendRequestId} onClick={this.friendshipOver}>Nope</button>
          </div>
        </div>
      </div>
    ));

    return (
      <div className="Friends text-center col">
        <h1>Friends</h1>
        <div className="row">
          <div className="col">
            <h3>Undiscovered Friends</h3>
            <hr/>
            { undiscoveredFriendCards }
          </div>
          <div className="col">
            <h3>Pending Friendships</h3>
            <hr/>
            { pendingFriendshipsCards }
          </div>
          <div className="col">
            <h3>My Friends</h3>
            <hr/>
            { myFriendsCards }
          </div>
        </div>
      </div>
    );
  }
}

export default Friends;
