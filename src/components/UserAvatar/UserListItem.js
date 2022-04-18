import React from 'react';
import { Box, Text, Avatar } from "@chakra-ui/react";
import { ChatState } from '../../Context/ChatProvider';

const UserListItem = ({ user, handleFunction }) => {
 
  return (
   <Box //once the search is done the name will be here for that im writing code here
        onClick={handleFunction}
          cursor="pointer"
          bg="#E8E8E8"
         _hover={{
          background:"#38B2AC",
          color:"white",
        }}
        w="100%"
        alignItems="center"
        d="flex"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
        color="black">
    <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
        />
      <Box>
        <Text>{user.name}</Text>
        <Text
          fontSize="xs">
          <b>Email:</b>
          {user.email}
          </Text>
          </Box>
          </Box>

  )
}

export default UserListItem