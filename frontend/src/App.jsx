import { Box, Container } from "@chakra-ui/react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
// import LogoutButton from "./components/LogoutButton";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";

function App() {
  const localExistUser = useRecoilValue(userAtom); // get user from recoil state which is saved in local storage
  // console.log(localExistUser);

  const { pathname } = useLocation();

  return (
    <Box position={"relative"} w="full">
      <Container
        maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}
      >
        <Header />

        <Routes>
          <Route
            path="/"
            element={localExistUser ? <HomePage /> : <Navigate to="/auth" />} // if user exists, show home page, else show auth page
          />
          <Route
            path="/auth"
            element={!localExistUser ? <AuthPage /> : <Navigate to="/" />} // if user does not exist, show auth page, else show home page
          />
          <Route
            path="/update"
            element={
              localExistUser ? <UpdateProfilePage /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/:username"
            element={
              localExistUser ? (
                <>
                  <UserPage />
                  <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route
            path="/chat"
            element={localExistUser ? <ChatPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/settings"
            element={
              localExistUser ? <SettingsPage /> : <Navigate to={"/auth"} />
            }
          />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
