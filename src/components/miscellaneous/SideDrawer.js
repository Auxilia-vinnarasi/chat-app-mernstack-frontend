import React,{useState} from 'react';
import {
    Box,
    Tooltip,
    Text,
    Menu,
    MenuButton,
    Avatar,
    MenuItem,
    MenuList,
    MenuDivider,
    DrawerHeader,
    DrawerContent,
    DrawerOverlay,
    Drawer,
    DrawerBody,
    Input,
    toast,
    useToast,
    Spinner
} from '@chakra-ui/react';
import { Button } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/hooks';
import ChatLoading from '../ChatLoading';
import  axios  from "axios";
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from "../../config/ChatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from 'react-notification-badge';



const SideDrawer = () => {
    const [search, setSearch]=useState("")//firt initially its str
    const [searchResult,setSearchResult] =useState([])//then if we search the j many names shown there so its in array
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    
    const { user,setSelectedChat,chats, setChats,notification,setNotification} = ChatState();
    const history = useHistory();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");//we just simply remove the user from pur localstorage
        history.push("/");//push it to the /route
    };

    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter Something in search",
                status: "warning",
                duaration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
            //im gonna have try catch here... so im making API call for searching the user
        
        try {
            setLoading(true);
//we supposed to send the JWT token i made this route as protected
            
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            //im gonna take this config and put it inside axios im gonna destructure it from api call
        const {data} =await axios.get(`/api/user?search=${search}`,config)//since its search so im using query here
            setLoading(false);
            setSearchResult(data);
        }
        catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            }

    };

    const accessChat = async (userId) => { //after searching im gonna access the chat 
        try {
            setLoadingChat(true);
            
            const config = {
                headers: {
                    "Content-type": "application/json", //the chat content in json so we add contenttype
                    Authorization: `Bearer ${user.token}`,
                },
            };
        //to create chat what was the api req
            const { data } = await axios.post("/api/chat", {userId}, config);//a chat that is created..
            
            //we have to append that chats inside of it so we are adding the below code 
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            
            setSelectedChat(data);//we have to take this to inside context so that itcan accessable to whole of our app.
            setLoadingChat(false);
            onClose();
            }

        catch (error)
        {
             toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });

        }
        
    };
    
    return (<>
        <Box d="flex" justifyContent="space-between" w="100%" p="5px 10px 5px 10px" alignItems="center" bg="white" borderWidth="5px">
            <Tooltip label="Search users to chat" hasArrow placement='bottom'>
                <Button variant="ghost" onClick={onOpen} >
                    <i class="fas fa-search"></i> {/*i need to download cdn for Fontawesome */}
                    <Text d={{ base: "none", md: "flex" }} px="4">Search User</Text>
                </Button>
            </Tooltip>
            <Text fontSize="2xl" fontFamily="Work sans">Twin Brothers Chat App</Text>
            <div>
                <Menu>
                    <MenuButton p={1}>
                        <NotificationBadge count={notification.length}
                          effect={Effect.SCALE}
                        />
                        <BellIcon fontSize="2xl" m={1}/>
                        {/*<i class="fa-solid fa-bell" fontSize="2xl" m={1}></i>*/} {/*I can use font awesome also*/}
                        </MenuButton>
                    <MenuList pl={2}>
                        {!notification.length && "No New Messages"}
                        {notification.map((notif) => (
                            <MenuItem
                                key={notif._id}
                                onClick={() => {
                                setSelectedChat(notif.chat);
                                setNotification(notification.filter((n) => n !== notif));
                            }}>
                                {notif.chat.isGroupChat ?
                                    `New Message in ${notif.chat.chatName}`
                                    : `New Message from ${getSender(user,notif.chat.users)}`}
                            </MenuItem>
                                
                        ))}
                    
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                        <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}><MenuItem>My Profile</MenuItem></ProfileModal>{/*Wrap evrything in profile modal */}
                        <MenuDivider/>
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                <DrawerBody>
                <Box d="flex" pb={2}>
                    <Input
                        placeholder="search by name or email"
                        mr={2}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={handleSearch}>Go</Button>
                    </Box>
                    {loading ?  // if the loading is true do loading stuff otherwise shown result 
                        <ChatLoading /> //display component
                        :       // <span>results</span>
                        (//if somethingn is there in so optional chaining
                            searchResult?.map((user) => (
                                <UserListItem //so that we have to create useravatar folder inside userlistitem
                                    //with keys we are mapping
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                {loadingChat && <Spinner ml="auto" d="flex" />}{/*after searching while fetching the chat */}
                
            </DrawerBody>
            </DrawerContent>
            </Drawer>
    </>
)
}

export default SideDrawer