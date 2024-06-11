import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

// this hook will allow to use value as socket which is in SocketContext.Provider
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useRecoilValue(userAtom); //loggedIn user

  useEffect(() => {
    // url of backend server: "http://localhost:3000" , and in case of deployment just put "/".
    const socket = io("/", {
      query: {
        userId: user?._id, // setting query inside socket.handShake, & sending this query to backend socket.js file
      },
    });

    setSocket(socket);

    // socket.on ---> listens for events, both client and server
    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => socket && socket.close();
  }, [user?._id]);
  //   console.log(onlineUsers, " Online users");

  return (
    // providing value here and wrapping <App> inside this provider in main.jsx, then the value provided here can be used inside any of the components or pages (i.e. this is how context works)
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
