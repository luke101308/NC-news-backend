const mongoose = require("mongoose");
const { Article, Comment, Topic, User } = require("../models");

const seedDB = () => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Topic.insertMany(topicData);
    })
    .then(topicDocs => {
      return promise.all([
        Article.insertMany(articleData),
        User.insertMany(userData)
      ]);
    })
    .then(({ articleDocs, userDocs }) => {
      comment.insertMany(commentData);
    });
};

module.exports = seedDB;
