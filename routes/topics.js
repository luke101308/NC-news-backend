const { getAllTopics } = require("../controllers");

const topicsRouter = require("express").Router();

topicsRouter.route("/").get(getAllTopics);

topicsRouter.route("/:topic/articles").get();

module.exports = topicsRouter;
