import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

async function sendMessage(req, res) {
  try {
    const { recipientId, message } = req.body; // loggedin user will send a message to the recipient, i.e., it will be coming from fontend/client
    let { img } = req.body; // getting the selected image

    const senderId = req.user._id; // loggedin user is the sender, recieved from req object which was set in protectRoute.js middleware

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] }, // as participants is array of id referring to "User" model
    });

    // if there doesn't exist a conversation b/w senderId and recipientId, then create a new conversation
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });

      await conversation.save(); // saving the created conversation in db
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    // as there is conversation, now adding the message
    const newMessage = new Message({
      conversationId: conversation._id, // id of just created conversation, if it was not there / or fetched one if it was there
      sender: senderId,
      text: message, //recieved from client
      img: img || "",
    });

    // Promise.all is for faster and to happen concurrently
    await Promise.all([
      newMessage.save(), // for saving the new message in database
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }), // only updating the last message in conversation
    ]);

    // for realtime chat functionality (socket io). Getting the socketId of recipient & emitting newMessage to recipient socket only
    const recipientSocketId = getRecipientSocketId(recipientId); // getting socketId of recipient from hashmap of users & socketId (inside socket.js)
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage); // sends the event only to recipientId , not to all the users
    }

    //now sending the message to the client
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getMessages(req, res) {
  const { otherUserId } = req.params;
  const userId = req.user._id;
  try {
    // console.log("User ID:", userId); // Log user IDs to verify input
    // console.log("Other User ID:", otherUserId);

    // finding if the conversation bw the two users exist (loggedin user and the other/recipient user)
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    // console.log("Conversation found:", conversation); // Log conversation details to verify

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // finding all the messages where conversationId = found conversation._id
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    // console.log("Messages found:", messages); // Log messages to verify

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// async function getMessages(req, res) {
//   const { otherUserId } = req.params; // userId of other user
//   const userId = req.user._id;
//   try {
//     // finding if the conversation bw the two users exist (loggedin user and the other/recipient user)
//     const conversation = await Conversation.findOne({
//       participants: { $all: [userId, otherUserId] },
//     });

//     console.log("Conversation found:", conversation); // Log conversation details to verify

//     if (!conversation) {
//       return res
//         .status(404)
//         .json({ error: "Conversation not found, hence no messages are there" });
//     }

//     // finding all the messages where conversationId = found conversation._id
//     const messages = await Message.find({
//       conversationId: conversation._id,
//     }).sort({ createdAt: 1 });

//     console.log("Messages found:", messages); // Log messages to verify

//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

async function getConversations(req, res) {
  const userId = req.user._id; // getting it from the user set in the req object , inside protectRoute middleware
  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username profilePic",
    }); // as we find the conversation we got  participants array in that which referes to User model(i.e., it contains userId of message sender and reciver). path: "participants" ==> this part of code refers to User model as participants is reference to user model.  select: "username profilePic" ==> select the fields with the help of that userId present in praticipants array

    // remove the current user(loggedin user) from the participants array // doing this as we have to show only other user(with whom the loggedin user is chatting) in the messages
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { sendMessage, getMessages, getConversations };
