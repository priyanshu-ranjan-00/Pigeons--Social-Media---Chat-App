// This middleware is used to protect routes that require a user to be logged in. It checks for a token in the cookies, verifies the token, and gets the user from the token. If the token is valid and the user exists, the user is added to the request object and the next middleware/route handler is called. Otherwise, an error is returned.
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Get token from cookies

    if (!token)
      return res.status(401).json({
        message: "Unauthorized, so we are protecting this action from you",
      }); // If no token, return error

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    const user = await User.findById(decoded.userId).select("-password"); // Get user from token

    req.user = user; // Add user to request object so that it can be accessed in the next middleware/route handler

    next(); // Continue to the next middleware or route handler.
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};

export default protectRoute;
