import { atom } from "recoil";

// User atom to store the current user's data which is in local storage which was saved byline of  code which is in components\SignupCard.jsx
const userAtom = atom({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("user-pigeons")),
});

export default userAtom;
