const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");
const commentsRoute = require("./routes/commentRoute");

require("dotenv").config();

const app = express();
mongoose.connect("mongodb://localhost:27017/social-app");

//cronJob: Sending emails on a given interval
require("./cron-jobs/send-mail");

//Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",

    info: {
      title: "Social network API",
      description: "Users posting and commenting on stuff",
      contact: {
        name: "Aleksandar Vangelov",
      },
      servers: ["http://localhost:3000"],
      tags: [
        { name: "User", description: "a" },
        { name: "Post", description: "b" },
        { name: "Comment", description: "c" },
      ],
    },
  },
  //Routes defined
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/posts", postRoute);
app.use("/users", userRoute);
app.use("/comments", commentsRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
