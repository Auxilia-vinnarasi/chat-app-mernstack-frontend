
import { Box, FormControl, IconButton, Input, Text, useToast } from '@chakra-ui/react';
import React,{useEffect, useState} from 'react'
import { ChatState } from '../Context/ChatProvider';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender,getSenderFull } from "../config/ChatLogics";
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import { Spinner } from '@chakra-ui/react';
import axios from 'axios';
import "./styles.css";
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const toast = useToast();
    const { user, selectedChat, setSelectedChat,notification,setNotification} = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;  //if no chat is selected dont do anything- just return
        //otherwise we gonna have try catch
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            setLoading(true);
        //api call here
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
        //console.log(messages);
            setMessages(data); //im gonna set all of the messages in state..
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        }
        catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position:"bottom",
          })
        }

    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);
    
    //im calling this function inside of a useEffect
    useEffect (() => {
        fetchMessages();
        selectedChatCompare = selectedChat;

    }, [selectedChat]);

    console.log(notification, "----------------------------");

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => { //if any chat is selected or if the selected chat is noteq to the message received from the server...then give notifications..
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id)//if both cases are not true
            {
                //give notification
                if(!notification.includes(newMessageReceived)) //if the notification array doesnt includes newmsgreceived...
                {
                    setNotification([newMessageReceived, ...notification]) //then update our list of chat
                    setFetchAgain(!fetchAgain);//this will fetch all of the chat
                }  
            }
            else {//so im gonna add it to the list of our messages
            setMessages([...messages, newMessageReceived]);
                
            }
        });//if we receive anything from the socket we'r accordingly put it inside of our chat..
    });

    const sendMessage = async (event) => {
        //we triggering this by onkeydown
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }
                setNewMessage(""); 
                //our message sending api is /api/message
                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id, 
                }, config);
               // console.log(data);
                
                socket.emit("new Message", data);//that newmsg will contain data ie we received from api call  
                //we have to append it to all of the messages
                setMessages([...messages, data]);
            }
            catch (error)
            {
                toast({
                    title: "Error Occured!",
                    description:"Failed to send the message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                })
            }
        }
    };

   


    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        //typing Indicator Logic
        if (!socketConnected) return;

        if (!typing){
            setTyping(true)
            socket.emit("typing", selectedChat._id);
        }
        //the bouncing function..when we have to stop typing..
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
       // console.log("fff");

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

        if (timeDiff >= timerLength && typing)
        {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
        }
        },timerLength);
        };
    
  return (
      <>  
          {selectedChat ? (<>
              {/* base-for smaller screen md-for large screen*/}
              <Text fontSize={{ base: "28px", md: "30px" }}
                  fontFamily="Work sans"
                  w="100%"
                  px={2}
                  pb={3}
                  d="flex"
                  alignItems="center"
                justifyContent={{base:'space-between'}}
              >
                  {/* Its gonna only display it when the display is small */}
                  <IconButton
                      d={{ base: "flex", md: "none" }}
                      icon={<ArrowBackIcon />}
                      onClick={()=>setSelectedChat("")} // so if i click that arrowback button the setSelectedChatpage will be empty and goback there
                  />
                  {/* if its not a group chat means*/}
                  {messages && (!selectedChat.isGroupChat ? (
                      <>
                          {getSender(user, selectedChat.users)}
                          <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                      </>//user-loggedin user
                  ) : (
                          //if its group chat means i need that group chat name in upper case
                      <>
                              {selectedChat.chatName.toUpperCase()}
                             <UpdateGroupChatModal
                              fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}
                              />
                        </>      
                  ))}
              </Text>
              <Box d="flex"
                  justifyContent="flex-end"
                  flexDir="column"
                  w="100%"
                  h="100%"
                  p={3}
                  bg="#E8E8E8"
                  borderRadius="lg"
                  overflowY="hidden"
              >
                  {loading ? (
                      <Spinner size="xl"
                          w={20}
                          h={20}
                          alignSelf="center"
                          margin="auto"/>
                  ) : (
                    <div className="messages">  
                              {/* Messages */}
                    <ScrollableChat messages={messages}/>
                        </div>
                  )}

                  <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                      {isTyping ? (<div>
                          <Lottie
                              options={defaultOptions}
                          width={70}
                          style={{ marginBottom:15, marginLeft:0 }}
                      /></div> ):( <></>)}
                      <Input
                          variant="filled"
                          bg="#E0E0E0"
                          placeholder='Enter a message...'
                          onChange={typingHandler}
                          value={newMessage}
                      />
                  </FormControl>
            </Box>
        </>
          ) : (<Box d="flex" alignItems="center" justifyContect="center" h="100%">
                <Text pb={3} fontFamily="Work sans" fontSize="3xl">
                Click on a user to start Chatting 
            </Text>
             </Box>    
          )}
      </>
  )
}

export default SingleChat