import { ViewIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain,fetchMessages}) => {
    
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [groupChatName, setGroupChatName] = useState();
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    
    const toast = useToast();

    const { user, selectedChat, setSelectedChat } = ChatState()
    
    const handleRemove = async (user1) => {
   //user1-looged in user ;user-whos tring to remove
        if(selectedChat.groupAdmin !== user._id && user1._id !== user._id) {
            toast({
                title: "Only Admins can remove someone",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }
 //next try catch and config then make api call
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                }, config);
           //if the logged in user has removed himself-he left the group means we make setSelected chat as empty-i dont want to see the chat anymore
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);

           // setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();  
            setLoading(false);
        }
        catch (error) {
            toast({
                title: "Error Occured!",
                duaration: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
        }
        setGroupChatName("");
    };
    
    const handleRename = async () => { 
        if (!groupChatName) return
        
        try {
            setRenameLoading(true);

        const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
                 
            const { data } = await axios.put("/api/chat/rename",
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                }
                , config);
           //i updated with the  new data 
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);//im gonna fetch all chats again
            setRenameLoading(false);
        }

        catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "warning",
                duaration: 5000,
                isClosable: true,
                position: "bottom"
            });
             setRenameLoading(false);
        }
        setGroupChatName("")//back to empty
        }

    const handleAddUser = async (user1) => { 
        //if in the list of selected users- the user already there in group chat
        if(selectedChat.users.find((u) => u._id === user1._id))
        {
            toast({ 
                title: "User Already in Group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })
            return;
        }

        {/*if the user is Admin or not groupadmin id match with userid*/}
        if (selectedChat.groupAdmin !== user._id)
        {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })
            return;
        }
      
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(`/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                }, config);
            
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        }
        catch (error) {
            toast({
                title: "Error Occured!",
               duaration: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })
            setLoading(false);
        }
         setGroupChatName("");
        };

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return
        }
        try {//inside try catch we are searching the user
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            console.log(data);
            setLoading(false)
            setSearchResult(data);
            }
        catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to load the Search Results",
                status: "error",
                duaration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
            setLoading(false);
        }
}

  return (
    <>
      <IconButton d={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay/>
        <ModalContent>
                  <ModalHeader d="flex"
                      justifyContent="center"
                      fontFamily="Work sans"
                      fontSize="35px">
                      {selectedChat.chatName}
                  </ModalHeader>
          <ModalCloseButton />
                  <ModalBody d="flex" flexDir="column" alignItems="center">
                <Box d="flex" flexwrap="wrap" w="100%" pb={3}>
              
                {selectedChat.users.map((u) => (
                    <UserBadgeItem
                        key={u._id}
                        user={u}
                       admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)} />
                ))}
                      </Box>
                      <FormControl d="flex">
                          <Input
                              placeholder="Chat Name"
                              mb={3}
                              value={groupChatName}
                              onChange={(e)=>setGroupChatName(e.target.value)} />
                          <Button
                              variant="solid"
                              colorScheme="teal"
                                isLoading={renameLoading}
                              ml={3}
                              onClick={handleRename}
                          >
                            Update
                          </Button>
                      </FormControl>
                      <FormControl>
                          <Input
                              placeholder="Add User to Group"
                              mb={1}
                              onChange={(e)=>handleSearch(e.target.value)} />
                      </FormControl>
                      {loading ? (<Spinner size="lg" />) : (
                          searchResult?.map((user) => (
                              <UserListItem
                                  key={user._id}
                                  user={user}
                                  handleFunction={()=>handleAddUser(user)} />
                              ))
                      )}
                    </ModalBody>
                  <ModalFooter>
                      <Button onClick={()=>handleRemove(user)} colorScheme='red'>
                        Leave Group
                    </Button>
          </ModalFooter>    
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal;