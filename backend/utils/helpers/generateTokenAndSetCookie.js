import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // only accessible by the server// can't be accessed by javascript in the browser
    maxAge: 15 * 24 * 60 * 60 * 100, // 15 days
    sameSite: "strict", //CSRF
  });

  return token; // return the token so we can use it in other functions
};

export default generateTokenAndSetCookie;
