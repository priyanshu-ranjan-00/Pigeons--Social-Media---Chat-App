import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { useToast, useColorMode, Button } from "@chakra-ui/react";

import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
  const toast = useToast();

  const localUser = useRecoilValue(userAtom); // get user from userAtom, which is loggedin
  // console.log("loggedin user stored in local storage is:");  console.log(localUser);

  // const [following, setFollowing] = useState(
  //   user?.followers.includes(localUser?._id) // check if loggedin user is following the user which is being fetched
  // );
  // console.log(following);

  const showToast = useShowToast();
  // const [updating, setUpdating] = useState(false); // for avoiding multiple clicks as handleFollowUnfollow function is taking time to respond

  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  const copyURL = () => {
    const currentURL = window.location.href;
    // console.log(window);
    navigator.clipboard.writeText(currentURL).then(
      toast({
        status: "success",
        description: "Profile link copied!",
        duration: "1500",
        isClosable: true,
      })
    );
  };

  const { colorMode } = useColorMode();

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>@{user?.username}</Text>
            <Text
              fontSize={"xs"}
              bg={colorMode === "light" ? "gray.gray500" : "gray.dark"}
              color={colorMode === "light" ? "white" : "gray.light"}
              p={1}
              borderRadius={"full"}
            >
              pigeons.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user?.profilePic && (
            <Avatar
              name={user?.name}
              src={user?.profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
          {!user?.profilePic && (
            <Avatar
              name={user?.name}
              src="https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>

      <Text>{user?.bio}</Text>

      {/* Link from react-router-dom is used to go to updatePage.jsx through /update route without refreshing the page, as it was being refreshed when using Link fromm chakra ui */}
      {localUser?._id === user?._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}

      {localUser?._id !== user?._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user?.followers.length} followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>social.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList
                  bg={colorMode === "light" ? "gray.gray500" : "gray.dark"}
                >
                  <MenuItem
                    bg={colorMode === "light" ? "gray.gray500" : "gray.dark"}
                    onClick={copyURL}
                  >
                    <Text color={"white"}>🔗Copy link</Text>
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> For You</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
