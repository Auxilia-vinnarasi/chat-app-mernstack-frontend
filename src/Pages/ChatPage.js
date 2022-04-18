import React, {useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";


const ChatPage = () => {
    {/*
        const [chats, setChats] = useState([]);

        const fetchChats = async () => {
            const { data } = await axios.get("/api/chat");
            //console.log(data);
            setChats(data);
        };

        useEffect(() => {
            fetchChats();
    
        }, []);

    
    return(
       <div>
            {chats.map((chat) => (
                <div key={chat._id}>
                    {chat.chatName}
                </div> 
            ))}
        </div>
    )
    
  };
*/
    }
    
    //how do we take something from contextapi so ChatState from chatProvider
    const { user } = ChatState();
    //for parent state ive add fetchagain here from chatbox
    const [fetchAgain, setFetchAgain] = useState(false);
    
    return (
        <div style={{ width: "100%" }}>
             {user && <SideDrawer/>}
            {/*structure of our chat page*/}
            <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && <MyChats fetchAgain={fetchAgain} />}
                {/*if the user is there we have to render the chat*/}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                {/*if the user is there we have to create chatbox to chat so for that we have to create componenets each*/}
            </Box> 

</div>

        
    )


};


export default ChatPage;