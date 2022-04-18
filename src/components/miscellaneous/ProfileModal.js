import React from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { Image } from '@chakra-ui/react';

const ProfileModal = ({user,children}) => { //profile modal has two things user and children 

  const { isOpen, onOpen, onClose } = useDisclosure();
  
  console.log(user);
    
    return (
        <>
            {       //if the children is supplied i have to display the children 
                children ? (<span onClick={onOpen}>{children}</span>)
                    //if the children is not supplied im gonna written eye icon 
            : (
              <IconButton
                        d={{ base: "flex" }}
                        icon={<ViewIcon />}
                        onClick={onOpen}/>)
            }
      
{/*copy paste from modal dialog chakra-ui*/}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
                    <ModalHeader
                        d="flex"
                        justifyContect="center"
                        fontSize="40px"
                        fontFamily="Work sans">
                        {user.name}
                    </ModalHeader>
          <ModalCloseButton />
                    <ModalBody
                        d="flex"
                        justifyContent="space-between"
                        flexDir="column"
                        alignItems="center"
                    >
                        <Image
                            borderRadius="full"
                           boxSize="150px"
                          src={user.pic} 
                            alt={user.name}
                            />
                        <Text fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans">
                Email:{user.email}
              </Text>
           
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
         </>
  )
}

export default ProfileModal;