import React from 'react';

import authRequests from '../../../helpers/data/authRequests';
import smashRequests from '../../../helpers/data/smashRequests';
import messageRequests from '../../../helpers/data/messageRequests';
import MessageItem from '../../MessageItem/MessageItem';

import './Messages.scss';

class Messages extends React.Component {
  state={
    messages: [],
    newMessageText: '',
    isEditing: false,
    editMessageId: '-1',
  };

  getAllMessages() {
    smashRequests.getAllMessagesWithUserInfo()
      .then((messages) => {
        this.setState({ messages });
      })
      .catch(err => console.error('error in getAllMessages', err));
  }

  componentDidMount() {
    this.getAllMessages();
  }

  messageChange = (e) => {
    e.preventDefault();
    let tempMessage = { ...this.state.newMessageText };
    tempMessage = e.target.value;
    this.setState({ newMessageText: tempMessage });
  }

  newMessage = (e) => {
    const { isEditing, editMessageId, newMessageText } = this.state;
    e.preventDefault();
    if (isEditing) {
      messageRequests.getSingleMessage(editMessageId)
        .then((msg) => {
          const editedMessage = { ...msg.data };
          editedMessage.isEdited = true;
          editedMessage.message = newMessageText;
          messageRequests.updateMessage(editedMessage, editMessageId)
            .then(() => {
              this.setState({ isEditing: false, editMessageId: '-1', newMessageText: '' });
              this.getAllMessages();
            });
        })
        .catch(err => console.error('error with weather post', err));
    } else {
      const newMessageObject = {
        message: this.state.newMessageText,
        isEdited: false,
        timestamp: Date.now(),
        uid: authRequests.getCurrentUid(),
      };
      messageRequests.createMessage(newMessageObject)
        .then(() => {
          this.setState({ newMessageText: '' });
          this.getAllMessages();
        })
        .catch(err => console.error('error with weather post', err));
    }
  }

  selectMessageToEdit = (messageId) => {
    const selectedMessage = this.state.messages.find(x => x.id === messageId);
    this.setState({ editMessageId: messageId, isEditing: true, newMessageText: selectedMessage.message });
  }

  deleteMessage = () => {
    const { editMessageId } = this.state;
    messageRequests.deleteMessage(editMessageId)
      .then(() => {
        this.setState({ newMessageText: '', isEditing: false, editMessageId: '-1' });
        this.getAllMessages();
      })
      .catch(err => console.error('error with weather post', err));
  }

  render() {
    const { messages, newMessageText } = this.state;
    const printMessages = messages.map(message => (
      <MessageItem
        message={message}
        key={message.id}
        messageSelection={this.selectMessageToEdit}
      />
    ));

    const addDeleteButton = () => {
      if (this.state.isEditing) {
        return (
          <div className="input-group-append">
            <button className="input-group-text delete_btn" onClick={this.deleteMessage}><i className="fas fa-times"></i></button>
          </div>
        );
      }
      return '';
    };

    return (
      <div className="messages col">
        <h2 className="text-center">Instant Messages</h2>
        <div className="message-container">
          <div className="card">
            <div className="card-body msg_card_body">
              { printMessages }
            </div>
            <div className="card-footer">
              <div className="input-group">
                { addDeleteButton() }
                <input
                  className="form-control type_msg"
                  placeholder="Type your message..."
                  value={newMessageText}
                  onChange={this.messageChange}
                />
                <div className="input-group-append">
                  <button className="input-group-text send_btn" onClick={this.newMessage}><i className="fas fa-location-arrow"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Messages;
