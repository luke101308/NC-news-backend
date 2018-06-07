process.env.NODE_ENV = "test";
const app = require("../app");
console.log("**********");
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
    console.log("hi");
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
    });
  });
  after(() => {
    mongoose.disconnect();
  });
});
