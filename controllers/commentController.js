const mongoose = require("mongoose");
const Comment = require("../models/comment");
const response = require("../lib/response_handler");
const jwt = require("jsonwebtoken");

const getAll = async (req, res) => {
  const commentList = await Comment.find().populate({
    path: "commentOnPost",
    populate: {
      path: "postedBy",
    },
  });

  response(res, 200, "List of all comments", { commentList });
};

const getById = async (req, res) => {
  const commentById = await Comment.findById(req.params.id);

  response(res, 200, `Comment with id #${comments._id}, has been fetched`, {
    commentById,
  });
};

const create = async (req, res) => {
  const comment = await Comment.create(req.body);

  response(res, 200, "Comment created!", { comment });
};

const update = async (req, res) => {
  await Comment.findByIdAndUpdate(req.params.id, req.body);
  const comment = await Comment.findById(req.params.id);

  response(res, 200, "Comment updated", { comment });
};

const remove = async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);

  response(res, 200, `Comment with ID#${req.params.id} is deleted`);
};

const likesOnComment = async (req, res) => {
  const bearerToken = req.get("Authorization");
  const token = bearerToken.substring(7, bearerToken.length);
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const getCommentById = await Comment.findById(req.params.id);
  switch (req.body.action) {
    case "like":
      if (getCommentById.likes.includes(decoded._id)) {
        response(res, 400, "Already liked this comment");
        break;
      }
      await Comment.updateOne(getCommentById, {
        $push: { likes: decoded._id },
      });
      response(res, 200, "Liked a comment", {
        likesCounter: getCommentById.likes.length + 1,
      });
      break;
    case "unlike":
      if (getCommentById.likes.includes(decoded._id)) {
        await Comment.updateOne(getCommentById, {
          $pull: { likes: decoded._id },
        });
        response(res, 200, "Unliked the comment", {
          likesCounter: getCommentById.likes.length - 1,
        });
        break;
      }
      response(res, 400, "Can't unlike a comment that's not been liked");
      break;
    case "dislike":
      if (getCommentById.dislikes.includes(decoded._id)) {
        response(res, 400, "Already disliked this comment");
        break;
      }
      await Comment.updateOne(getCommentById, {
        $push: { dislikes: decoded._id },
      });
      response(res, 200, "Liked a comment", {
        dislikesCounter: getCommentById.dislikes.length + 1,
      });
      break;
    case "undislike":
      if (getCommentById.dislikes.includes(decoded._id)) {
        await Comment.updateOne(getCommentById, {
          $pull: { dislikes: decoded._id },
        });
        response(res, 200, "Udisliked the comment", {
          dislikesCounter: getCommentById.dislikes.length - 1,
        });
        break;
      }
      response(res, 400, "Can't undislike a comment that's not been disliked");
      break;
    default:
      response(res, 401, "Wrong action taken or none selected");
      break;
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
