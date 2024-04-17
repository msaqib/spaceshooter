import * as PIXI from "pixi.js";
import { App } from '../system/App';

export class Fighter {
    constructor(x, y) {
        // this.location = {x: window.innerWidth, y: Math.floor(window.innerHeight / 2)}
        // this.location = {x: 50, y: 50}
        this.location = {x: x, y: y}
        this.velocity = App.config.fighter.velocity
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
            this.shipSprite = new PIXI.Sprite(App.res('fighter'))

            this.setSpriteLocation()
            this.sprite.loop = true;
            this.sprite.animationSpeed = 0.1;
            this.sprite.play();

            
            this.setShipLocation()

            this.container.addChild(this.sprite, this.shipSprite)
            App.app.ticker.add(this.update.bind(this))
    }

    setSpriteLocation() {
        this.sprite.x = this.location.x ;
        this.sprite.y = this.location.y - this.sprite.height / 2;
    }

    setShipLocation() {
        this.shipSprite.x = this.sprite.x + this.sprite.width
        this.shipSprite.y = this.location.y - this.shipSprite.height / 2
        this.shipSprite.anchor.set(1, 1)
        this.shipSprite.rotation = -Math.PI /2
    }

    update(dt) {
        const increment = (this.velocity * dt.deltaTime)
        // if (this.location.y >= (this.sprite.height - increment) && this.location.y <= (window.innerHeight - this.sprite.height - increment)) {
            
            this.location.x -= increment
        // }
        this.setSpriteLocation()
        this.setShipLocation()
    }
}