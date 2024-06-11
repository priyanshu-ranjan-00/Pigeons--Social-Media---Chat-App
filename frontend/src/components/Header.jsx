import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { Link as RouterLink } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdOutlineSettings } from "react-icons/md";


const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const localUser = useRecoilValue(userAtom);
  const handleLogout = useLogout();
  const [, setAuthScreen] = useRecoilState(authScreenAtom); //the hook useRecoilState(authScreenAtom) returns an array where 1st element is current value of authScreenAtom,2nd element is setter function for updating the atom's state

  return (
    <Flex alignItems={"center"} justifyContent={"space-between"} mt={6} mb="12">
      {localUser && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}
      {!localUser && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("login")}
        >
          Login
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={10}
        // src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        src={
          colorMode === "dark"
            ? "/pigeon-removed-bg.svg"
            : "/pigeon-removed-bg.svg"
        }
        onClick={toggleColorMode}
      />

      {localUser && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${localUser.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <IoChatbubbleEllipsesOutline size={22} />
          </Link>
          <Link as={RouterLink} to={`/settings`}>
            <MdOutlineSettings size={20} />
          </Link>
          <Button size={"xs"} onClick={handleLogout}>
            <FiLogOut size={"20px"} />
          </Button>
        </Flex>
      )}

      {!localUser && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("signup")}
        >
          Sign up
        </Link>
      )}
    </Flex>
  );
};

export default Header;
