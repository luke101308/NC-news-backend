const { Topic } = require("../models");


const getAllTopics = (req, res, next) => {
    Topic.find()
      .then(topics => {
        res.send({ topics });
      })
      .catch(next);
  };

module.exports = {
    getAllTopics,
  }