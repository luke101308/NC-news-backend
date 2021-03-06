const mongoose = require("mongoose");
const { Article, Comment, Topic, User } = require("../models");
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
    .then(topicDocs => {
      return Promise.all([User.insertMany(data.userData), topicDocs]);
    })
    .then(([userDocs, topicDocs]) => {
      return Promise.all([
        createUserRefObj(data.userData, userDocs),
        userDocs,
        topicDocs
      ]);
    })
    .then(([lookupUsers, userDocs, topicDocs]) => {
      return Promise.all([
        Article.insertMany(formatArticle(data.articleData, lookupUsers)),
        lookupUsers,
        userDocs,
        topicDocs
      ]);
    })
    .then(([articleDocs, lookupUsers, userDocs, topicDocs]) => {
      const lookupArticles = createArticleRefObj(data.articleData, articleDocs);
      return Promise.all([
        Comment.insertMany(
          formatComment(data.commentData, lookupArticles, lookupUsers)
        ),
        articleDocs,
        userDocs,
        topicDocs
      ]);
    });
};

module.exports = seedDB;
