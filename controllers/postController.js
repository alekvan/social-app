const response = require("../lib/response_handler");
const Post = require("../models/post");
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

ac.grant("user").createOwn("post");
ac.deny("admin").createOwn("post");

const getAll = async (req, res) => {
  const posts = await Post.find().populate("postedBy");

  response(res, 200, `All posts from the database`, { posts });
};

const getById = async (req, res) => {
  const posts = await Post.findById(req.params.id);

  response(res, 200, `Post with id #${posts._id}, has been fetched`, { posts });
};

const create = async (req, res) => {
  const permission = ac.can(req.user.role).createOwn("post");

  if (!permission.granted) {
    responseHandler(
      res,
      401,
      `Cannot create posts with role: ${req.user.role}`
    );
    return;
  }

  // const start = new Date().getTime() / 1000;
  // var currentTime = new Date().getTime() / 1000;
  // if (currentTime - start >= 300) {
  //   // then more than 5 minutes elapsed.
  // }

  const post = await Post.create(req.body);

  response(res, 200, "New post has been created", { post });
};

const update = async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, req.body);
  const post = await Post.findById(req.params.id);

  response(res, 200, `Post with id #${post._id} has been updated`, { post });
};

const remove = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);

  response(res, 200, `Post with id #${req.params.id} has been deleted`);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
