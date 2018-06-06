const createUserRefObj = (data, docs) => {
  return data.reduce((acc, datum, index) => {
    acc[datum.username] = docs[index]._id;
    return acc;
  }, {});
};

const createArticleRefObj = (data, docs) => {
  return data.reduce((acc, datum, index) => {
    acc[datum.title] = docs[index]._id;
    return acc;
  }, {});
};

const formatArticle = (articleData, lookupUsers) => {
  return articleData.map(article => {
    return {
      ...article,
      belongs_to: article.topic,
      created_by: lookupUsers[article.created_by]
    };
  });
};

const formatComment = (commentData, lookupArticles, lookupUsers) => {
  return commentData.map(comment => {
    return {
      ...comment,
      belongs_to: lookupArticles[comment.belongs_to],
      created_by: lookupUsers[comment.created_by]
    };
  });
};

module.exports = {
  createUserRefObj,
  createArticleRefObj,
  formatArticle,
  formatComment
};
