import React, { useState } from 'react';
import styled from 'styled-components';
import { Typography, Container, Card, CardContent, TextField, Button } from '@mui/material';

const discussionData = {
  topic: 'Class Discussion Topic',
  messages: [
    { id: 1, sender: 'John', message: 'Hello everyone!' },
    { id: 2, sender: 'Jane', message: 'Hi John, how are you?' },
    // Add more messages as needed
  ],
};

const DiscussionContainer = styled(Container)`
  && {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f0f0;
    padding: 16px;
  }
`;

const DiscussionCard = styled(Card)`
  && {
    width: 400px;
    max-width: 90%;
    background-color: #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
    padding: 16px;
    margin-bottom: 20px;
  }
`;

const DiscussionTopic = styled(Typography)`
  && {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
  }
`;

const DiscussionMessages = styled.div`
&& {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
}
`;

const MessageCard = styled(Card)`
  && {
    width: 100%;
    background-color: #f0f0f0;
    border-radius: 8px;
    text-align: left;
    padding: 12px;
    margin-bottom: 8px;
  }
`;

const MessageSender = styled(Typography)`
  && {
    font-size: 14px;
    font-weight: bold;
  }
`;

const MessageContent = styled(Typography)`
  && {
    font-size: 16px;
  }
`;

const MessageForm = styled.form`
&& {
    display: flex;
    flex-direction: column;
    width: 100%;
}
`;

const MessageInput = styled(TextField)`
  && {
    margin-bottom: 16px;
  }
`;

const MessageButton = styled(Button)`
  && {
    margin-top: 16px;
  }
`;

const ClassDiscussion = () => {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(discussionData.messages);

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleSubmitMessage = (event) => {
    event.preventDefault();
    if (messageInput.trim() !== '') {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You', // Replace 'You' with the user's name or username
        message: messageInput,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput('');
    }
  };

  return (
    <DiscussionContainer maxWidth="sm">
      <DiscussionCard>
        <CardContent>
          <DiscussionTopic>{discussionData.topic}</DiscussionTopic>
          <DiscussionMessages>
            {messages.map((message) => (
              <MessageCard key={message.id}>
                <MessageSender>{message.sender}</MessageSender>
                <MessageContent>{message.message}</MessageContent>
              </MessageCard>
            ))}
          </DiscussionMessages>
          <MessageForm onSubmit={handleSubmitMessage}>
            <MessageInput
              variant="outlined"
              label="Type your message..."
              fullWidth
              value={messageInput}
              onChange={handleInputChange}
            />
            <MessageButton variant="contained" color="primary" type="submit">
              Send
            </MessageButton>
          </MessageForm>
        </CardContent>
      </DiscussionCard>
    </DiscussionContainer>
  );
};

export default ClassDiscussion;
