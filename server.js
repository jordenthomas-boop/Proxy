const express = require("express");
const { createBareServer } = require("@tomphttp/bare-server-node");
const path = require("path");

const app = express();
const bare = createBareServer("/bare/");

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    res.sendFile(path.join(__dirname, "public/index.html"));
  }
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  }
});
