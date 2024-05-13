import * as PIXI from "pixi.js";
import { App } from '../system/App';

export class Hud {
    constructor(lives, score) {
        this.score = score
        this.remainingLives = lives
        this.createDisplay()
    }

    createDisplay() {
        this.container = new PIXI.Container()
        
        this.textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial', // Choose a font that includes the heart symbol
            fontSize: 24,
            fill: 'red' // Color of the heart symbol
        });
        
        // Create a new Text object with the heart symbol
        let livesText = ''
        for (let i = 0 ; i < this.remainingLives ; i++) {
            livesText += '❤️'
        }

        this.lives = new PIXI.Text({text: livesText, style: this.textStyle});
        
        this.score = new PIXI.Text({
            text: `Score: ${this.score}`,
            style: this.textStyle
        })

        this.score.style.fill = 'white'

        this.container.addChild(this.score, this.lives)
        this.container.x = 20
        this.container.y = 20

        this.lives.x = window.innerWidth /2
    }

    update(score) {
        this.score.text = 'Score: ' + score
    }
}
