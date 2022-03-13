var express = require("express");
const jwt = require("express-jwt");
var router = express.Router();
const controller = require("../controllers/userController");

router.use(
  jwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"],
  }).unless({
    path: [
      {
        url: "/users",
        methods: ["GET"],
      },
      {
        url: /^\/users\/.*/,
        methods: ["GET"],
      },
      {
        url: "/users",
        methods: ["POST"],
      },
      {
        url: "/users/login",
        methods: ["POST"],
      },
      {
        url: "/users/logout",
        methods: ["POST"],
      },
    ],
  })
);

/**
 * @swagger
 * /users:
 *  get:
 *    tags:
 *      - User
 *    description: Get method to show all users
 *    responses:
 *      200:
 *        description: Successful response
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - User
 *     summary: Create user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - first_name
 *              - last_name
 *              - email
 *              - password
 *            properties:
 *              first_name:
 *                type: string
 *                default: John
 *              last_name:
 *                type: string
 *                default: Doe
 *              email:
 *                type: string
 *                default: test@email.com
 *              password:
 *                type: string
 *                default: password123
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: User exists
 *      500:
 *        description: Error
 */
router.post("/", controller.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *        - User
 *     summary: Login user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: test@email.com
 *              password:
 *                type: string
 *                default: password123
 *     responses:
 *      200:
 *        description: Logged in
 *      401:
 *        description: Bad syntax
 *      500:
 *        description: Error
 */
router.post("/login", controller.login);

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    tags:
 *       - User
 *    summary: Get user by id
 *    description: Get method to show all users
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of a user in database
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Successful response
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags:
 *        - User
 *     summary: Update user
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: ID of a user in database
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - first_name
 *              - last_name
 *              - email
 *              - password
 *            properties:
 *              first_name:
 *                type: string
 *                default: John
 *              last_name:
 *                type: string
 *                default: Doe
 *              email:
 *                type: string
 *                default: test@email.com
 *              password:
 *                type: string
 *                default: password123
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: User exists
 *      500:
 *        description: Error
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT  # optional, for documentation purposes only
 *
 *
 */
router.patch("/:id", controller.update);

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    tags:
 *       - User
 *    summary: Delete user by id
 *    description: Delete method to delete user by id
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of a user in database
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Successful response
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT  # optional, for documentation purposes only
 *
 */
router.delete("/:id", controller.remove);

router.post("/addfriend", controller.addAndDeleteFriend);

module.exports = router;

//Model for user documented
/**
 * @swagger
 * components:
 *  schemas:
 *    Users:
 *      type: object
 *      required:
 *        - first_name
 *        - last_name
 *        - email
 *        - password
 *      properties:
 *        _id:
 *          type: string
 *          description: Auto-generated id of the user
 *        first_name:
 *          type: string
 *          description: User's first name
 *        last_name:
 *          type: string
 *          description: User's last name
 *        email:
 *          type: string
 *          description: User's email
 *        password:
 *          type: string
 *          description: User's password
 *      example:
 *        _id: 2j3kj2jhk9mjl6ui4u
 *        first_name: John
 *        last_name: Doe
 *        email: jdoe@mail.com
 *        password: password123
 */
