import { AddIcon} from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import ChatLoading from './ChatLoading';
import { getSender } from "../config/ChatLogics";
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({fetchAgain}) => {

  const [loggedUser, setLoggedUser] = useState(); 
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();// we import all of our state from context..sidedrawer.js

  const toast = useToast();
  //we have to fetchchats for that get req

  const fetchChats = async () => {
    try {
       const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
      };
      const { data } = await axios.get("api/chat", config);//we are making axios req
      console.log(data);
      setChats(data);//we are setting all of the chat..
    }
    catch (error)
    {
          toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
    }
  }
//to call the function fetchChats im gonna call it inside useEffect
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    
  },[fetchAgain])

  return (
    //im gonna render all of our chats
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      w={{base:"100%",md:"31%"}}
    >
      {/*This is gonna be our header of the chat*/}
      <Box
        d="flex"
        justifyContent="space-between"
        w="100%"
        px={3}
        pb={3}
        alignItems="center"
        fontFamily="Work sans"
        fontSize={{base:"28px",md:"30px"}}
      >
        My Chats
        <GroupChatModal>
        <Button
          d="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
          </Button>
          </GroupChatModal>
      </Box>
      {/*im gonna render all of the chats here*/}
      <Box
        d="flex"
        flexDir="column"
        w="100%"
        p={3}
        bg="#F8F8F8"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {/*if that chat is there im gonna map through the chat otherwise chat loading*/}
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                px={3}
                py={2}
                key={chat._id}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat ===chat ?"white" :"black"}
                borderRadius="lg"
              >
                <Text >
                  {!chat.isGroupChat ? 
                    getSender(loggedUser,chat.users)
                   : chat.chatName
                  }
            </Text>
              </Box>
            ))}
          </Stack>

        ):
          (
            <ChatLoading/>
        )
        }
      </Box>

    </Box>
  )
}

export default MyChats