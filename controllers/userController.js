const User = require("../models/user");
const bcrypt = require("bcryptjs");
const response = require("../lib/response_handler");
const jwt = require("jsonwebtoken");

const getAll = async (req, res) => {
  const users = await User.find();

  response(res, 200, "List of all users", { users });
};

const getById = async (req, res) => {
  const users = await User.findById(req.params.id);

  res.send({
    error: false,
    message: `User with id #${users._id}, has been fetched`,
    users: users,
  });
};

const register = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return response(
        res,
        400,
        "Bad request. User exists with the provided email."
      );
    }

    req.body.password = bcrypt.hashSync(req.body.password);

    user = await User.create(req.body);

    response(res, 201, "New user has been created", { user });
  } catch (error) {
    response(res, 500, error.msg);
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // token = plain data (JSON payload) + secret key za potpisuvanje na token + config options
        const payload = {
          id: user._id,
          email: user.email,
          first_name: user.first_name,
          role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: "5m",
        });

        response(res, 200, "You have logged in successfully", { token });
      } else {
        response(res, 401, "Invalid credentials");
      }
    } else {
      response(res, 401, "Invalid credentials");
    }
  } catch (error) {
    response(res, 500, error.msg);
  }
};

const update = async (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password);
  await User.findByIdAndUpdate(req.params.id, req.body);
  const user = await User.findById(req.params.id);

  response(res, 200, `User with ID#${user._id} has been updated`);
};

const remove = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.send({
    error: false,
    message: `User with id #${req.params.id} has been deleted`,
  });
};

module.exports = {
  getAll,
  getById,
  register,
  login,
  update,
  remove,
};
