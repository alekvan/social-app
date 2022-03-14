var express = require("express");
var router = express.Router();
const controller = require("../controllers/postController");
const jwt = require("express-jwt");
const response = require("../lib/response_handler");

require("dotenv").config();

router.use(
  jwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"],
  }).unless({
    path: [
      {
        url: "/posts",
        methods: ["GET"],
      },
      {
        url: /^\/posts\/.*/,
        methods: ["GET"],
      },
    ],
  })
);

router.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === "UnauthorizedError") {
    response(res, 401, "Unauthorized access");
  }
});

/**
 * @swagger
 * /posts:
 *  get:
 *    tags:
 *      - Post
 *    description: Get method to show all posts
 *    responses:
 *      200:
 *        description: Successful response
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /posts:
 *   post:
 *     tags:
 *       - Post
 *     summary: Create post
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - title
 *              - content
 *              - postedBy
 *            properties:
 *              title:
 *                type: string
 *                default: Random title
 *              content:
 *                type: string
 *                default: Text about the title
 *              postedBy:
 *                type: string
 *                default: ID of the user that created this post
 *     responses:
 *      201:
 *        description: Post created
 *      500:
 *        description: Error
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */
router.post("/", controller.create);

/**
 * @swagger
 * /posts/{id}:
 *  get:
 *    tags:
 *       - Post
 *    summary: Get post by id
 *    description: Get post by ID
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of a post in database
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
 * /posts/{id}:
 *   patch:
 *     tags:
 *        - Post
 *     summary: Update post
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: ID of a post in database
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
 *              - title
 *              - content
 *              - postedBy
 *            properties:
 *              title:
 *                type: string
 *                default: John
 *              content:
 *                type: string
 *                default: Doe
 *              postedBy:
 *                type: string
 *                default: ID of the user that created this post
 *     responses:
 *      201:
 *        description: Post updated
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
 * /posts/{id}:
 *  delete:
 *    tags:
 *       - Post
 *    summary: Delete post by id
 *    description: Delete method to delete post by id
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of a post in database
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

router.post("/:id/likes", controller.likesOnPost);

module.exports = router;

//Model for documentation
/**
 * @swagger
 * components:
 *  schemas:
 *    Post:
 *      type: object
 *      required:
 *        - title
 *        - content
 *      properties:
 *        _id:
 *          type: string
 *          description: Auto-generated id of the post
 *        title:
 *          type: string
 *          description: Title of the post
 *        content:
 *          type: string
 *          description: Content of the post
 *        postedBy:
 *          type: string
 *          description: ID of the user that created this post
 *      example:
 *        _id: kkj236h5gh56hg9cx0
 *        title: Some random title
 *        content: Content about the random title
 *        postedBy: s8d94io3is7wwu7sk1
 */
