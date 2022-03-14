const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    likes: [
      {
        type: String,
        ref: "user",
        required: false,
      },
    ],
    dislikes: [
      {
        type: String,
        ref: "user",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
