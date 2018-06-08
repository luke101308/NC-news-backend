const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers");

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
