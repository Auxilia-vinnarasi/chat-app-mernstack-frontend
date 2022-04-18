import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';

const ScrollableChat = ({ messages }) => {
    
    const { user } = ChatState();
  return (
      <ScrollableFeed>    {/*im passing here messages and index*/}
          {messages &&
              messages.map((m, i) => (
              <div style={{display:"flex"}} key={m._id}>     {/*same sender and last message*/}
                {(isSameSender(messages, m, i, user._id)
                    || isLastMessage(messages, i, user._id)) && (
                      <Tooltip
                          label={m.sender.name} placement="bottom-start" hasArrow>
                          <Avatar
                            mr={1}
                            mt="7px"
                            size="sm"
                            cursor="pointer"
                            name={m.sender.name}
                            src={m.sender.pic}
                          />
                    </Tooltip>
                          )}
                      <span style={{
                          backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                          borderRadius: "20px",
                         padding:"5px 15px",
                          maxWidth: "75%",
                          marginLeft: isSameSenderMargin(messages, m, i, user._id),
                          //if the prev msg has same user then create space between them
                          marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10, // 3 space otherwise 10 space
                      }}>
                    {m.content}
                      </span>
              </div>
          )
          )}
    </ScrollableFeed>
  )
}

export default ScrollableChat;