import React from 'react';
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
//import { Badge } from "@chakra-ui/layout";

const UserBadgeItem = ({user,handleFunction,admin }) => {
  return (
      <Box
          px={2}
          py={1}
          borderRadius="lg"
          m={1}
          mb={2}
          fontSize={12}
          variant="solid"
          cursor="pointer"
          backgroundColor="#555"
          color="white"
          onClick={handleFunction}
      >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
          <CloseIcon pl={1} />
          
          
    </Box>
  )
}

export default UserBadgeItem