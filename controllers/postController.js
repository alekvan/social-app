const response = require("../lib/response_handler");
const Post = require("../models/post");
const AccessControl = require("accesscontrol");
const ac = new AccessControl();
const jwt = require("jsonwebtoken");

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

const likesOnPost = async (req, res) => {
  const bearerToken = req.get("Authorization");
  const token = bearerToken.substring(7, bearerToken.length);
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const getPostById = await Post.findById(req.params.id);
  switch (req.body.action) {
    case "like":
      if (getPostById.likes.includes(decoded.id)) {
        response(res, 400, "Already liked this post");
        break;
      }
      await Post.updateOne(getPostById, {
        $push: { likes: decoded.id },
      });

      response(res, 200, "Liked a post", {
        likesCounter: getPostById.likes.length + 1,
      });
      break;
    case "unlike":
      if (getPostById.likes.includes(decoded.id)) {
        await Post.updateOne(getPostById, {
          $pull: { likes: decoded.id },
        });

        response(res, 200, "Unliked the post", {
          likesCounter: getPostById.likes.length - 1,
        });
        break;
      }
      response(res, 400, "Can't unlike a post that's not been liked");
      break;
    case "dislike":
      if (getPostById.dislikes.includes(decoded.id)) {
        response(res, 400, "Already disliked this post");
        break;
      }
      await Post.updateOne(getPostById, {
        $push: { dislikes: decoded.id },
      });
      response(res, 200, "Disliked a post", {
        dislikesCounter: getPostById.dislikes.length + 1,
      });
      break;
    case "undislike":
      if (getPostById.dislikes.includes(decoded.id)) {
        await Post.updateOne(getPostById, {
          $pull: { dislikes: decoded.id },
        });
        response(res, 200, "Udisliked the post", {
          dislikesCounter: getPostById.dislikes.length - 1,
        });
        break;
      }
      response(res, 400, "Can't undislike a post that's not been disliked");
      break;
    default:
      response(res, 401, "No action taken, select action");
      break;
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  likesOnPost,
};
