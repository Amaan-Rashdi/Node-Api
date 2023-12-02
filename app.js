require("rootpath")();

const express = require("express");
const cors = require("cors");
// const errorHandler = require('./errorhandler')

const config = require("./config");
require("dotenv/config");

const bodyParser = require("body-parser");
const morgan = require("morgan");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
//app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());
app.use(morgan("tiny"));
// app.use(authJwt());
app.use(errorHandler);

const appRouter = require("./src");

app.use("/api", appRouter);
// "172.20.10.7"
const PORT = process.env.PORT || config.PORT;
const server = app.listen(config.PORT, () => {
  console.log("Listening on port", config.PORT);
});
// const server = app.listen(PORT,() => {
//   console.log('Listening on port', PORT)
// })

module.exports = server;
