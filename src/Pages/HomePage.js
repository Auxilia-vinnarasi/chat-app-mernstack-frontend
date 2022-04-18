import React,{useEffect} from 'react';
import { Container, Box, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Login from "../components/Authentication/Login";
import Signup from '../components/Authentication/Signup';
import { useHistory } from "react-router-dom";


const HomePage = () => {

  const history = useHistory(); //when the user is logged in push him back to the chats page. this code is from chat provider
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
   
    if (user)
           history.push("/chats");
    }, [history]);    
  return (
    
      <Container maxW='xl' centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
       bg={"white"}
        m="40px 0 15px 0"
        w="100%"
        borderRadius="lg"
        borderWidth="0.1px"
      >
        <Text fontSize="2xl" fontWeight="bolder" fontFamily="Work sans" color="black">Twin Brothers Chat App</Text>
        
      </Box>
      <Box bg={"white"} p={4} w="100%" color="black" borderRadius="lg" borderLength="1px" borderWidth="0.1px">
      <Tabs variant='soft-rounded'>
  <TabList mb="1em">
    <Tab width="50%" borderWidth="0.1px">Login</Tab>
    <Tab width="50%" borderWidth="0.1px">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
              <Login/>
    </TabPanel>
    <TabPanel>
              <Signup/>
    </TabPanel>
  </TabPanels>
        </Tabs>
      </Box>

      </Container>
   
  )
}

export default HomePage