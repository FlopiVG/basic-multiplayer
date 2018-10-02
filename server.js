const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);

const players = {};

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "index.html");
});

server.listen(8080, () => {
  console.log("Listen on " + server.address().port);
});

io.on("connection", socket => {
  console.log("a user connected");
  players[socket.id] = {
    rotation: 0,
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id,
    team: Math.floor(Math.random() * 2) === 0 ? "red" : "blue"
  };

  socket.emit("currentPlayers", players);
  socket.broadcast.emit("newPlayer", players[socket.id]);

  socket.on("disconnect", () => {
    console.log("user disconected");
    delete players[socket.id];
    io.emit("disconnect", socket.id);
  });
});
