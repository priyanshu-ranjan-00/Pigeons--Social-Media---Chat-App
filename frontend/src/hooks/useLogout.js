import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";
import useShowToast from "./useShowToast";

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);

  const showToast = useShowToast(); // custom hook to show toast messages(from hooks/useShowToast.js file )

  const setLocalUser = useSetRecoilState(userAtom); // useSetRecoilState is a recoil hook to update the userAtom state in the recoil store // setLocalUser is changing value to null defined in userAtom.js and which is being fetched from localstorage as locallyExistingUser

  const logout = async () => {
    try {
      //fetch
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      localStorage.removeItem("user-pigeons");

      showToast("Success", "You have been logged out successfully!", "success");

      setLocalUser(null);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  return logout;
};

export default useLogout;
