import * as Phaser from "phaser";
import { MainGame } from "./Scenes/MainGame";

export class Game extends Phaser.Game {
  constructor() {
    super({
      type: Phaser.AUTO,
      parent: "phaser-example",
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
          gravity: { y: 0 }
        }
      }
    });

    this.scene.add("MainGame", new MainGame());
    this.scene.start("MainGame");
  }
}
