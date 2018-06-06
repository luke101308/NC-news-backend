const mongoose = require("mongoose");
const { Article, Comment, Topic, User } = require("../models");
mongoose.Promise = Promise;
const {
  createUserRefObj,
  createArticleRefObj,
  formatArticle,
  formatComment
} = require("../utils");

const seedDB = data => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Topic.insertMany(data.topicData);
    })
    .then(() => {
      return User.insertMany(data.userData);
    })
    .then(userDocs => {
      return createUserRefObj(data.userData, userDocs);
    })
    .then(lookupUsers => {
      return Promise.all([
        Article.insertMany(formatArticle(data.articleData, lookupUsers)),
        lookupUsers
      ]);
    })
    .then(([articleDocs, lookupUsers]) => {
      const lookupArticles = createArticleRefObj(data.articleData, articleDocs);
      return Comment.insertMany(
        formatComment(data.commentData, lookupArticles, lookupUsers)
      );
    });
};

module.exports = seedDB;
