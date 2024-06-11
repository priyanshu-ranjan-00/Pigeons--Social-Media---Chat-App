import mongoose from "mongoose";

// defining the schema
const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// creating the model, "______" => it takes the name of the model which is eventually named as a collection in mongodb
const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
