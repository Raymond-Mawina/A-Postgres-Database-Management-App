const portToListen = 8081;
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({ origin: "*" }));

app.use(express.static("src"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { router } = require("./routes");
router(app);

app.set("view engine", "pug");
app.set("views", "src/views");

const server = app.listen(portToListen, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log("App listening to at http://%s:%s", host, port);
});

module.exports = { app };
