const apiRouter = require("express").Router();
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");
const topicsRouter = require("./topics");
const usersRouter = require("./users");

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
