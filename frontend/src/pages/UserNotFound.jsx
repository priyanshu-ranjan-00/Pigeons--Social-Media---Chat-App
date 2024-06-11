import React from "react";
import { Box, Image, Heading, Text, Button, VStack } from "@chakra-ui/react";

const UserNotFound = () => {
  return (
    <VStack spacing={6} mt={10} align="center">
      <Heading as="h1" size="lg" color="gray.700">
        The user was not found.
      </Heading>
      <Image
        src="/user-not-found.png"
        alt="User not found"
        boxSize="300px"
        objectFit="contain"
      />
    </VStack>
  );
};

export default UserNotFound;
