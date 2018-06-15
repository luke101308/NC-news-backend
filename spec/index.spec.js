process.env.NODE_ENV = "test";
const app = require("../app");
const { data } = require("../seed/data/testData");
const seedDB = require("../seed/seed");
const mongoose = require("mongoose");
const request = require("supertest")(app);
const { expect } = require("chai");

describe("/", () => {
  let commentDocs;
  let articleDocs;
  let userDocs;
  let topicDocs;
  beforeEach(function() {
    this.timeout(20000);
    return seedDB(data)
      .then(docs => {
        [commentDocs, articleDocs, userDocs, topicDocs] = docs;
      })
      .catch(console.log);
  });
  describe("/api", () => {
    describe("/topics", () => {
      it("GET will return status 200 and an object containing all topics", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(res => {
            expect(res.body.topics[0]).to.contain.all.keys(["title", "slug"]);
          });
      });
      describe("/:topic_slug/articles", () => {
        it("GET will return status 200 and an object of all articles for a certain topic", () => {
          return request
            .get("/api/topics/cats/articles")
            .expect(200)
            .then(res => {
              expect(res.body.articles[0]).to.contain.all.keys(
                "title",
                "body",
                "belongs_to",
                "votes",
                "created_by"
              );
              expect(res.body.articles[0].belongs_to).to.equal("cats");
            });
        });
        it("GET will return status 404 and an error message when topic_slug is not a topic in the database", () => {
          return request
            .get("/api/topics/dogs/articles")
            .expect(404)
            .then(res => {
              expect(res.body.err).to.equal(
                "error:404 dogs not present in database"
              );
            });
        });
        it("POST will return status 201 and an object containing the newly posted article", () => {
          return request
            .post("/api/topics/cats/articles")
            .send({
              title: "new article",
              body: "This is my new article content",
              created_by: "5b1925c83bd6dd33bca3228a"
            })
            .expect(201)
            .then(res => {
              expect(res.body.article).to.contain.all.keys(
                "title",
                "body",
                "belongs_to",
                "votes",
                "created_by"
              );
            });
        });
        it("POST will return status 400 and what is missing if attempting to post with missing arguments", () => {
          return request
            .post("/api/topics/cats/articles")
            .send({
              title: "new article",
              body: "This is my new article content"
            })
            .expect(400)
            .then(res => {
              expect(res.body.err).to.equal(
                "articles validation failed: created_by: Path `created_by` is required."
              );
            });
        });
      });
    });
    describe("/articles", () => {
      it("GET will return status 200 and an array of all articles", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(res => {
            expect(res.body.articles[0]).to.contain.all.keys([
              "title",
              "body",
              "belongs_to",
              "created_by",
              "comments"
            ]);
            expect(res.body.articles[0].comments).to.equal(2);
          });
      });
      describe("/:article_id", () => {
        it("GET will return status 200 and an article object", () => {
          return request
            .get(`/api/articles/${articleDocs[0]._id}`)
            .expect(200)
            .then(res => {
              expect(res.body).to.contain.all.keys(
                "_id",
                "title",
                "created_by",
                "body",
                "belongs_to",
                "votes"
              );
              expect(res.body._id).equal("" + articleDocs[0]._id);
            });
        });
        it("GET will return status 404 and an err msg when passed an valid MongoID, not present in the database", () => {
          return request
            .get(`/api/articles/${commentDocs[0]._id}`)
            .expect(404)
            .then(res => {
              expect(res.body.err).to.equal(
                "err: Page not found, invalid article ID"
              );
            });
        });
        it("GET will return status 400 and an err mesg when passed an invalid MongoID", () => {
          return request
            .get(`/api/articles/14`)
            .expect(400)
            .then(res => {
              expect(res.body.message).to.equal(
                "Bad request : Invalid ObjectId"
              );
            });
        });
        it("PUT will return status 202 and an article object with an increased vote count", () => {
          return request
            .put(`/api/articles/${articleDocs[0]._id}?vote=up`)
            .expect(202)
            .then(res => {
              expect(res.body.votes).to.equal(1);
            });
        });
        it("PUT will return status 202 and an article object with an decreased vote count", () => {
          return request
            .put(`/api/articles/${articleDocs[0]._id}?vote=down`)
            .expect(202)
            .then(res => {
              expect(res.body.votes).to.equal(-1);
            });
        });
      });
      describe("/:article_id/comments", () => {
        it("GET will return status 200 and an array of all comments for a particular article", () => {
          return request
            .get(`/api/articles/${articleDocs[0]._id}/comments`)
            .expect(200)
            .then(res => {
              expect(res.body.comments[0]).to.contain.all.keys(
                "body",
                "belongs_to",
                "created_at",
                "votes",
                "created_by"
              );
              expect(res.body.comments[0].belongs_to).to.equal(
                "" + articleDocs[0]._id
              );
            });
        });
        it("GET will return status 404 and an err msg when passed an valid MongoID, not present in the database", () => {
          return request
            .get(`/api/articles/${commentDocs[0]._id}/comments`)
            .expect(404)
            .then(res => {
              expect(res.body.err).to.equal(
                `error:404 ${commentDocs[0]._id} not present in database`
              );
            })._id;
        });
        it("GET will return status 400 and an err mesg when passed an invalid MongoID", () => {
          return request
            .get(`/api/articles/14/comments`)
            .expect(400)
            .then(res => {
              expect(res.body.message).to.equal(
                "Bad request : Invalid ObjectId"
              );
            });
        });
        it("POST will return status 201 and an object of the posted article", () => {
          return request
            .post(`/api/articles/${articleDocs[0]._id}/comments`)
            .send({
              title: "new article",
              body: "This is my new article content",
              created_by: userDocs[0]._id
            })
            .expect(201)
            .then(res => {
              expect(res.body.comment).to.contain.all.keys(
                "body",
                "belongs_to",
                "created_at",
                "votes",
                "created_by"
              );
            });
        });
        it("POST will return status 400 and and err msg when attempting to post but missing a required field", () => {
          return request
            .post(`/api/articles/${articleDocs[0]._id}/comments`)
            .send({
              title: "new article",
              body: "This is my new article content"
            })
            .expect(400)
            .then(res => {

              expect(res.body.err).to.equal(
                "comments validation failed: created_by: Path `created_by` is required."
              );
            });
        });
      });
    });
    describe.only("/comments", () => {
      describe(("/comment_id"), () => {
        it("PUT will return status 202 and an comment object with an increased vote count", () => {
          return request
          .put(`/api/comments/${commentDocs[0]._id}?vote=up`)
          .expect(202)
          .then(res => {
            expect(res.body.votes).to.equal(8);
          });
        });
        it("PUT will return status 202 and an comment object with an decreased vote count", () => {
          return request
          .put(`/api/comments/${commentDocs[0]._id}?vote=down`)
          .expect(202)
          .then(res => {
            expect(res.body.votes).to.equal(6);
          });
        });
        it("DELETE will return status 202 and an msg", () => {
          return request
          .delete(`/api/comments/${commentDocs[0]._id}`)
          .expect(202)
          .then(res => {
            expect(res.body.msg).to.equal(
              `${commentDocs[0]._id} sucessfully deleted`
            );
          });
        })
      })
    });
    describe("/users", () => {
      describe("/:username", () => {
        it("GET will return status 200 and a user object", () => {
          return request.get("/api/users/dedekind561").then(res => {
            expect(res.body).to.contain.all.keys(
              "username",
              "name",
              "avatar_url",
              "_id",
              "__v"
            );
          });
        });
        it("GET will return status 404 an an err msg", () => {
          return request
            .get("/api/users/dedekind1")
            .expect(404)
            .then(res => {
              expect(res.body.err).to.equal(
                "error:404 dedekind1 not present in database"
              );
            });
        });
      });
    });
    after(() => {
      mongoose.disconnect();
    });
  });
});
