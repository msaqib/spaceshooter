import { Tools } from "../system/Tools";
import { GameScene } from "./GameScene";
import {GameOver} from "./GameOver"
import {StartScene} from "./StartScene"

export const Config = {
    loader: Tools.importAll(require.context('./../../sprites', true, /\.(png|mp3)$/)),
    bgSpeed: 2,
    scenes: {
        "Game": GameScene,
        "startScene": StartScene,
        "gameOver": GameOver
    },
    hero: {
        velocity: 2,
        lives: 3
    },
    fighter: {
        velocity: 2,
        probability: 0.015,
        minimumSpacing: 250,
        maximumSpacing: 300
    },
    shot: {
        velocity: 5
    }
}