import { IPlayer } from "./interfaces/IPlayer";
import { IScore } from "./interfaces/IScore";
import { IStar } from "./interfaces/IStar";
import {
  Controller,
  Event,
  Connect,
  Socket,
  ServerMiddleware,
  IO_MIDDLEWARE,
  Args,
  Disconnect,
  IO
} from "@decorators/socket";
import { Injectable, Container } from "@decorators/di";

class GlobalMiddleware implements ServerMiddleware {
  public use(io, socket, next) {
    console.log("ControllerMiddleware");
    next();
  }
}

@Injectable()
@Controller("/")
export class GameSocket {
  players: IPlayer[];
  scores: IScore[];
  star: IStar;

  constructor() {
    this.players = [];
    this.scores = [{ team: "blue", quantity: 0 }, { team: "red", quantity: 0 }];
    this.star = {
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50
    };
  }

  @Connect()
  public onConnect(@Socket() socket: SocketIO.Socket) {
    console.log("User connected ->", socket.id);
    const player = this.createPlayer(socket.id);
    this.players.push(player);

    socket.emit("currentPlayers", this.players);
    socket.emit("starLocation", this.star);
    socket.emit("scoreUpdate", this.scores);
    socket.broadcast.emit("newPlayer", player);
  }

  @Disconnect()
  public onDisconnect(@Socket() socket: SocketIO.Socket): void {
    console.log("User disconected -->", socket.id);
    this.players = this.players.filter(p => p.playerId !== socket.id);
    socket.broadcast.emit("userDisconnect", socket.id);
  }

  @Event("playerMovement")
  onPlayerMovement(@Args() movementData, @Socket() socket: SocketIO.Socket) {
    const player = this.players.find(p => p.playerId === socket.id);

    socket.broadcast.emit("playerMoved", {
      ...player,
      x: movementData.x,
      y: movementData.y,
      rotation: movementData.rotation
    });
  }

  @Event("starCollected")
  onStarCollected(
    @IO() io: SocketIO.Server,
    @Socket() socket: SocketIO.Socket
  ) {
    const { team } = this.players.find(p => p.playerId === socket.id);

    const scoresUpdated = this.scores.map(s => {
      if (s.team === team) return { ...s, quantity: (s.quantity += 10) };
      return s;
    });

    const star = {
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50
    };

    io.emit("starLocation", star);
    io.emit("scoreUpdate", scoresUpdated);
  }

  private createPlayer(id: string): IPlayer {
    return {
      rotation: 0,
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
      playerId: id,
      team: Math.floor(Math.random() * 2) === 0 ? "red" : "blue"
    };
  }
}

Container.provide([{ provide: IO_MIDDLEWARE, useClass: GlobalMiddleware }]);
