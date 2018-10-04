import { Injectable } from "@decorators/di";
import { IPlayer } from "../interfaces/IPlayer";
import { IStar } from "../interfaces/IStar";
import { IScore } from "../interfaces/IScore";

const GET_STAR_SCORE = 10;

@Injectable()
export class ShipGameService {
  private players: IPlayer[] = [];
  private scores: IScore[] = [
    { team: "blue", quantity: 0 },
    { team: "red", quantity: 0 }
  ];
  private star: IStar = this.generateStar();

  public createPlayer(id: string): IPlayer {
    const player = {
      rotation: 0,
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
      playerId: id,
      team: Math.floor(Math.random() * 2) === 0 ? "red" : "blue"
    };

    this.players.push(player);

    return player;
  }

  public getPlayers(): IPlayer[] {
    return this.players;
  }

  public getPlayer(id: string): IPlayer {
    return this.players.find(p => p.playerId === id);
  }

  public removePlayer(id: string): IPlayer {
    const player = this.getPlayer(id);
    this.players = this.players.filter(p => p.playerId !== id);

    return player;
  }

  public updatePlayer(id: string, args): IPlayer {
    const player = this.getPlayer(id);
    const updatePlayer = { ...player, ...args };

    this.players = this.players.map(
      p => (p.playerId === id ? updatePlayer : p)
    );

    return updatePlayer;
  }

  public generateStar(): IStar {
    return {
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50
    };
  }

  public getStar(): IStar {
    return this.star;
  }

  public getScores(): IScore[] {
    return this.scores;
  }

  public addScore(id: string): IScore[] {
    const { team } = this.getPlayer(id);

    this.scores = this.scores.map(
      s =>
        s.team === team ? { ...s, quantity: s.quantity + GET_STAR_SCORE } : s
    );

    return this.getScores();
  }
}
