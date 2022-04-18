import React , { useState} from 'react';
import { Input } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { FormControl, FormLabel, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useToast } from '@chakra-ui/react'

const Login = () => {
 
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);
  
  const submitHandler =async() => { 
      setLoading(true);
    if (!email || !password) {
      toast({
        title: 'Please Fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {                             //headers for our req
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
//we are making request  to api/user/login
      const { data } = await axios.post("api/user/login", { email, password },
        config
      );
       toast({
        title: 'Login Successful',
        status: 'Success',
        duration: 5000,
        isClosable: true,
        position: "bottom",
       });
      //storing in our local storage
      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      history.push("/chats")
    }
    catch (error) {
       toast({
        title: "Error Occured!",
        //description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
       });
      setLoading(false);
      }
    }

  return (
      <VStack spacing="5px">
             <FormControl id="email" isRequired>
          <FormLabel>E-mail Address</FormLabel>
        <Input
           value={email}
                placeholder="Enter Your email"
                 onChange={(e)=>setEmail(e.target.value)}
          />
          </FormControl>

        <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                   <Input
                  type={ show ? "text": "password" }
            placeholder="Enter Your Password"
            value={password}
                 onChange={(e)=>setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                      </Button>
                        
                    </InputRightElement>
              </InputGroup>
        </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        color="white"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
              Login
      </Button>

      <Button
              //color="white"
              variant="solid"
              colorScheme="red"
              width="100%"
             // style={{ marginTop: 15 }}
        onClick={() => {
          setEmail("guest@example.com")
          setPassword("123456")
        }}
      >
              Get Guest User Credentials
      </Button>
    </VStack>
  )
}

export default Login