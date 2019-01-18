import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import authRequests from '../../helpers/data/authRequests';
import messageShape from '../../helpers/propz/messageShape';

import './MessageItem.scss';

class MessageItem extends React.Component {
  static propTypes = {
    message: messageShape.messageShape,
    messageSelection: PropTypes.func,
  }

  selectMessage = (e) => {
    e.stopPropagation();
    const { messageSelection, message } = this.props;
    messageSelection(message.id);
  }

  render() {
    const { message } = this.props;
    const uid = authRequests.getCurrentUid();
    const msgClasses = `d-flex mb-4 ${message.uid === uid ? 'justify-content-end' : 'justify-content-start'}`;

    const messagePerson = () => {
      if (message.uid === uid) {
        return (
          <div className={msgClasses}>
            <div>
              <div className='msg_current' onClick={this.selectMessage}>{message.message}</div>
              <div className="msg_time">{moment(message.timestamp).format('MM/DD/YYYY, h:mm a')} {message.isEdited ? '(Edited)' : ''}</div>
            </div>
            <div className="msg_avatar">
              <img src={message.photo} alt={message.userName} className="rounded-circle user_img_msg"/>
            </div>
          </div>
        );
      }
      return (
        <div className={msgClasses}>
          <div className="msg_avatar">
            <img src={message.photo} alt={message.userName} className="rounded-circle user_img_msg"/>
          </div>
          <div>
            <div className='msg_other'>{message.message}</div>
            <div className="msg_time">{moment(message.timestamp).format('MM/DD/YYYY, h:mm a')} {message.isEdited ? '(Edited)' : ''}</div>
          </div>
        </div>
      );
    };

    return (
      <div className="message-item">
        { messagePerson() }
      </div>
    );
  }
}

export default MessageItem;
