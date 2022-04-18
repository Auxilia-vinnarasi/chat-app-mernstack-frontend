import React, { useState } from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import {Box} from "@chakra-ui/react";


const GroupChatModal = ({ children }) => {
    
    const { isOpen, onOpen, onClose } = useDisclosure();//copy paste it from modeldialogue chakra UI

    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    //after creating our groupchat we are gonna append it to the list of chat we already have
    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => { 
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);//as the search starts
            //if we want to pass the token we say config headers and authorization
            const config = {
                headers: {
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`api/user?search=${search}`, config);
           // console.log(data);
           //whatever data we are getting after that we set the loading to false;
            setLoading(false);
            setSearchResult(data);  //we are setting the searchresult to data  
            }
        catch (error)
        {
            toast({
                title: "Error Occured!",
                description: "Failed to the load search result",
                status: "error",
                duration: 5000,
                isClosable:"true",
                position: "bottom-left",
                })
        }
    }; // so our searching is working fine here.. after that render in formcontrol so that is after input box

    const handleSubmit = async () => { 
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "pleae Fill all the fields",
                status: "warning",
                duaration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        //im gonna make api call here so first config
        try {
             const config = {
                headers: {
                    Authorization:`Bearer ${user.token}`,
                },
            };
                    //to create api the group chat
            const { data } = await axios.post("/api/chat/group", {
                name: groupChatName,// its gonna take group chat name
                //its gonna take users array
                users: JSON.stringify(selectedUsers.map((u)=>u._id)),

            }, config);
            
            setChats([data, ...chats])//data gonna add it to the top of our chat
            onClose();
            toast({
                title: "New Group Chat Created",
                status: "success",
                duaration: 5000,
                isClosable: true,
                position: "bottom",
            });
            }
        catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duaration: 5000,
                isClosable: true,
                position: "bottom",
                
            });
        }
    };
    
    //handlegroup- it adds them to our array of selected users.
    const handleGroup = (userToAdd) => { 
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "user Already Added",
                status: "warning",
                duration: 5000,
                isClosable: "true",
                position: "top"
            });
            return;
        } //if the user not there the new one add it to the array
        setSelectedUsers([...selectedUsers, userToAdd]);//spread all the users who already there and add usertoadd
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel)=> sel._id!== delUser._id))
     };

  return (
    <>
          <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
                  <ModalHeader
                      d="flex"
                      justifyContent="center"
                      fontSize="35px"
                      fontFamily="Work sans"
                  >
                      Create Group Chat
                  </ModalHeader>
          <ModalCloseButton />
                  <ModalBody d="flex"
                      flexDir="column"
                     alignItems="center">
                        <FormControl>
                          <Input placeholder='Chat Name'
                              mb={3}
                              onChange={(e)=>setGroupChatName(e.target.value)}/>
                      </FormControl>
                       <FormControl>
                          <Input placeholder="Add Users Eg: piyush,jero,jeri"
                              mb={1}
                              onChange={(e)=>handleSearch(e.target.value)}/>
                      </FormControl>
                      {/*selected users form our search*/}
                      <Box w="100%" d="flex" flexWrap="wrap">
                      {selectedUsers.map((u) => (
                          <UserBadgeItem
                              key={u._id}
                              user={u}
                              handleFunction={()=>handleDelete(u)} />
                      ))}
                          </Box>
             {/* render searched users*/} 
                      {loading ? (<div>Loading....</div>) : //through setResult we can mapping throgh
                          (searchResult?.slice(0,4).map((user)=> (
                              <UserListItem
                                  key={user._id}
                                  user={user}
                                  handleFunction={()=>handleGroup(user)} />
                          )))}   {/* Top four result -so slice the array and mapping it*/}
                    </ModalBody> 
            <ModalFooter> 
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
           </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal