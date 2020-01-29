const express = require("express");
const server = express();

/* route requests for static files to appropriate directory */
server.use("/", express.static(__dirname + "/"));

/* other routes defined before catch-all */
server.get("/some-route", (req, res) => {
  res.send("ok");
});

/* final catch-all route to index.html defined last */
server.get("/*", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const port = 8000;
server.listen(port, function() {
  console.log("server listening on port " + port);
});
