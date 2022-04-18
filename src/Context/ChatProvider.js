import React, { createContext, useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => { //this one is used to wrap the whole app
    const [user, setUser] = useState();  //how do we create the state inside of our context api for that i haveto do here
    const [selectedChat, setSelectedChat] = useState();//setselected chat from sidedrawer.js wehave to wrap this inside context
    const [chats, setChats] = useState([]);//we have to populate all of our chats inside this chats.
    
    // create global state for notification
    const [notification, setNotification] = useState([]);

    const history = useHistory();
    //userinfo to local storage
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));//since this in a stringify format im gonna parse
        setUser(userInfo);

        if (!userInfo)//so if the user is not logged in its gonna redirect to the login page
            history.push("/");
    }, [history]);//when have a history changes its gonna run agian..

    return (<ChatContext.Provider
        value={{
            user,
            setUser,
            selectedChat,
            setSelectedChat,
            chats,
            setChats,
            notification,
            setNotification
        }}>
        {children}
    </ChatContext.Provider>)//how do we accessable forwhole of our app using value
};


export const ChatState= () => {
  return useContext(ChatContext);//all of our state inside of this variable  
};

export default ChatProvider;


