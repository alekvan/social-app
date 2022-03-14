const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    commentOnPost: {
      type: mongoose.Types.ObjectId,
      ref: "post",
    },
    likes: {
      type: String,
      ref: "user",
      required: false,
    },
    dislikes: {
      type: String,
      ref: "user",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);
