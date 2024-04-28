import { Tools } from "../system/Tools";
import { GameScene } from "./GameScene";
import { Game } from "./Game";

export const Config = {
    loader: Tools.importAll(require.context('./../../sprites', true, /\.(png|mp3)$/)),
    bgSpeed: 2,
    scenes: {
        "Game": GameScene,
        "startScene": Game
    },
    hero: {
        velocity: 2
    },
    fighter: {
        velocity: 2,
        probability: 0.015,
        minimumSpacing: 250,
        maximumSpacing: 300
    },
    enemy: {
        velocity: 2,
        probability: 0.01
    }
}