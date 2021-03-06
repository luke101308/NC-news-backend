const app = require("express")();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const DB_URL = process.env.DB_URL || require("./config").DB_URL;
const mongoose = require("mongoose");
const cors = require("cors")

mongoose.connect(DB_URL).then(() => {
  console.log(`connected to ${DB_URL}`);
});

app.use(cors())

app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  res.send(require("./homepage"));
});

app.use("/api", apiRouter);

app.use('/*', () => {
  res.status(404).send({err: "page not found"})
})

app.use((err, req, res, next) => {
  err.status ? res.status(err.status).send({ err: err.message }) : next(err);
});

app.use((err, req, res, next) => {
  err.name === "ValidationError"
    ? res.status(400).send({ err: err.message })
    : err.name === "CastError"
      ? res.status(400).send({ message: `Bad request : Invalid ${err.kind}` })
      : next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({err: "Internal Server Error"});
});

module.exports = app;
