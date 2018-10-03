import * as express from "express";
import * as socketIo from "socket.io";
import { createServer, Server } from "http";
import { IPlayer } from "./IPlayer";
import { IScore } from "./IScore";
import { IStar } from "./IStar";

const app = express();
const server = createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 8080;

class App {
  players: IPlayer[];
  scores: IScore[];
  star: IStar;
  io: SocketIO.Server;

  constructor() {
    this.players = [];
    this.scores = [{ team: "blue", quantity: 0 }, { team: "red", quantity: 0 }];
    this.star = {
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50
    };
    this.io = io;

    this.listen();
  }

  private listen() {
    this.io.on("connection", socket => {
      console.log("User connected...");
      const player = {
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: Math.floor(Math.random() * 2) === 0 ? "red" : "blue"
      };

      this.players.push(player);

      socket.emit("currentPlayers", this.players);
      socket.emit("starLocation", this.star);
      socket.emit("scoreUpdate", this.scores);
      socket.broadcast.emit("newPlayer", player);

      socket.on("playerMovement", movementData => {
        const player = this.players.find(p => p.playerId === socket.id);

        socket.broadcast.emit("playerMoved", {
          ...player,
          x: movementData.x,
          y: movementData.y,
          rotation: movementData.rotation
        });
      });

      socket.on("starCollected", () => {
        const player = this.players.find(p => p.playerId === socket.id);

        const scoresUpdated = this.scores.map(s => {
          if (s.team === player.team)
            return { ...s, quantity: (s.quantity += 10) };
          return s;
        });

        const star = {
          x: Math.floor(Math.random() * 700) + 50,
          y: Math.floor(Math.random() * 500) + 50
        };

        io.emit("starLocation", star);
        io.emit("scoreUpdate", scoresUpdated);
      });

      socket.on("disconnect", () => {
        console.log("user disconected");
        this.players = this.players.filter(p => p.playerId !== socket.id);
        io.emit("disconnect", socket.id);
      });
    });
  }
}

app.use(express.static(__dirname + "/../public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

server.listen(PORT, () => {
  console.log("Listen on " + PORT);
});

new App();
