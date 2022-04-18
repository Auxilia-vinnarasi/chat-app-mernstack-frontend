import { FormControl, FormLabel, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Input } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import { useHistory } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleClick = () => setShow(!show);
    
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {//pop up an error we have to go chakra ui
      toast({
        title: 'Please select an Image!',
        //description: "We've created your account for you.",like that the pop up will come
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      return;
    }
    //console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Tbchatapp");
      data.append("cloud_name", "dizv5qzcj");
      fetch("https://api.cloudinary.com/v1_1/dizv5qzcj/image/upload", {
        method: "post",
        body: data,//whatever the res we get we have to convert it into json
      }).then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPic(data.url.toString());
          setLoading(false);//cause pic is uploaded
        })
      .catch((err)=>
      {
        console.log(err);
        setLoading(false)
      })
    } else {
      toast({
        title: 'Please select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  }; 

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
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
    if (password !== confirmpassword) {
      toast({
        title: 'Password Do not match',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    //make api req to store the db
    try {                             //headers for our req
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post("api/user", { name, password, email, pic },
        config);
       toast({
        title: 'Registration Successful',
        status: 'Success',
        duration: 5000,
        isClosable: true,
        position: "bottom",
       });
      
      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      history.push("/chats")
    }
    catch (error) {
       toast({
        title: 'Error Occured!',
        description:error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom",
       });
      setLoading(false);
      }
  };
   return (
      <VStack spacing="5px">

          <FormControl id="first-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
                placeholder="Enter Your Name"
                 onChange={(e)=>setName(e.target.value)}
          />
          </FormControl>

          <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
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
                 onChange={(e)=>setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
             </Button>
             
                        
                    </InputRightElement>
              </InputGroup>
        </FormControl>

        <FormControl id="confirm-password" isRequired>
              <FormLabel>confirm password</FormLabel>
              <InputGroup size="md">
                   <Input type ={show ? "text" : "password"}
                     placeholder="Enter Your confirm password"
                 onChange={(e)=>setConfirmpassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={ handleClick} >
                        {show ? "Hide" : "Show"}
                      </Button>
                  </InputRightElement>
              </InputGroup>
         
        </FormControl>

        <FormControl id="pic" isRequired>
          <FormLabel>Upload Your Picture</FormLabel>
              <Input
                  type={"file"}
                  p={1.5}
                  accept="/image*"
                placeholder="Upload your Picture"
                onChange={(e)=>postDetails(e.target.files[0])}
          />
          </FormControl>

          <Button
              colorScheme="blue"
              width="100%"
              color="white"
              style={{ marginTop: 15 }}
              onClick={submitHandler}
              isLoading={loading}>
              Sign Up
          </Button>
         </VStack>
  )
}

export default Signup