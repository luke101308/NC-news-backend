const usersRouter = require("express").Router();

usersRouter.route("/:username").get;

usersRouter.route("/:username/repos").get();

module.exports = usersRouter;
