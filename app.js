const app = require("express")();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const { DB_URL } = require("./config");
const mongoose = require("mongoose");

mongoose.connect(DB_URL).then(() => {
  console.log(`connected to ${DB_URL}`);
});

app.use(bodyParser.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {});

module.exports = app;
