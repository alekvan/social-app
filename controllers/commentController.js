const mongoose = require("mongoose");
const Comment = require("../models/comment");
const response = require("../lib/response_handler");

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

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
