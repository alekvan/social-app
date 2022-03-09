var express = require("express");
const jwt = require("express-jwt");
var router = express.Router();
const controller = require("../controllers/commentController");

router.use(
  jwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"],
  }).unless({
    path: [
      {
        url: "/comments",
        methods: ["GET"],
      },
      {
        url: /^\/comments\/.*/,
        methods: ["GET"],
      },
    ],
  })
);

router.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("Unauthorized access");
  }
});

/**
 * @swagger
 * /comments:
 *  get:
 *    tags:
 *      - Comment
 *    description: Get method to show all comments
 *    responses:
 *      200:
 *        description: Successful response
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /comments:
 *   post:
 *     tags:
 *        - Comment
 *     summary: Post a comment
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - content
 *            properties:
 *              content:
 *                type: string
 *                default: Random comment
 *     responses:
 *      201:
 *        description: Commented
 *      500:
 *        description: Error
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT  # optional, for documentation purposes only
 */
router.post("/", controller.create);

/**
 * @swagger
 * /comments/{id}:
 *  get:
 *    tags:
 *       - Comment
 *    summary: Get comment by id
 *    description: Get method to show all comments
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of a comment in database
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
 * /comments/{id}:
 *   patch:
 *     tags:
 *        - Comment
 *     summary: Update comment
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: ID of a comment in database
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
 *              - content
 *            properties:
 *              content:
 *                type: string
 *                default: Old comment
 *     responses:
 *      201:
 *        description: Updated comment
 *      500:
 *        description: Error
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT  # optional, for documentation purposes only
 */
router.post("/:id", controller.update);

/**
 * @swagger
 * /comments/{id}:
 *  delete:
 *    tags:
 *       - Comment
 *    summary: Delete comment by id
 *    description: Delete method to delete comment by id
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of a comment in database
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
 */
router.delete("/:id", controller.remove);

module.exports = router;

//Model of the comments for documentation
/**
 * @swagger
 * components:
 *  schemas:
 *    Comment:
 *      type: object
 *      required:
 *        - content
 *      properties:
 *        _id:
 *          type: string
 *          description: Auto-generated id of the comment
 *        content:
 *          type: string
 *          description: Content of the comment
 *        commentOnPost:
 *          type: string
 *          description: ID of the post that this
 *      example:
 *        _id: kkj236h5gh56hg9cx0
 *        content: Random comment about nothing
 */
