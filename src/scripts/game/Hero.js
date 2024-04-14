import * as PIXI from "pixi.js";
import { App } from '../system/App';

export class Hero {
    constructor() {
        this.location = {x: 20, y: Math.floor(window.innerHeight / 2)}
        this.createSprite();
        this.dy = 0
    }

    createSprite() {

            this.container = new PIXI.Container()

            this.sprite = new PIXI.AnimatedSprite([
                App.res("exhaust1"),
                App.res("exhaust2"),
                App.res("exhaust3"),
                App.res("exhaust4")
            ]);
    
            this.setSpriteLocation()
            this.sprite.loop = true;
            this.sprite.animationSpeed = 0.1;
            this.sprite.play();

            this.shipSprite = new PIXI.Sprite(App.res('hero'))
            this.setShipLocation()

            this.container.addChild(this.sprite, this.shipSprite)
    }

    setSpriteLocation() {
        this.sprite.x = 20;
        this.sprite.y = this.location.y - this.sprite.height / 2;
    }

    setShipLocation() {
        this.shipSprite.x = this.sprite.x
        this.shipSprite.y = this.location.y - this.shipSprite.height / 2
    }

    moveUp() {
        this.dy = -1
        App.app.ticker.add(this.update.bind(this))
        // this.update()
    }

    moveDown() {
        this.dy = 1
        // // App.app.ticker.add(this.update.bind(this))
        // this.update()
    }

    straighten() {
        this.dy = 0
        App.app.ticker.remove(this.update)
    }

    update() {
        if (this.location.y >= (this.sprite.height - this.dy) && this.location.y <= (window.innerHeight - this.sprite.height - this.dy)) {
            this.location.y += this.dy
        }
        this.setSpriteLocation()
        this.setShipLocation()
    }
}