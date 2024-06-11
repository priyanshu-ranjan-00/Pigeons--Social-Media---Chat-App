import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";
import { useState } from "react";

const AuthPage = () => {
  // const [x,setx] = useState("login");

  const authScreenState = useRecoilValue(authScreenAtom);
  // console.log(authScreenState);
  return (
    <>
      {authScreenState === "login" ? <LoginCard /> : <SignupCard />}
      {/* {x === "login" ? <LoginCard x={x} setx={setx} /> : <SignupCard x={x} setx={setx}/>} */}
    </>
  );
};

export default AuthPage;
