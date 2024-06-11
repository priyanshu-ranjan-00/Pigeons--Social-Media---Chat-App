import { atom } from "recoil";

// This atom is used to store the current auth screen (login or signup) in the recoil state. is used to render login/signup page.

const authScreenAtom = atom({
  key: "authScreenAtom",
  default: "login",
});

export default authScreenAtom;
