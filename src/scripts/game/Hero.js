import * as PIXI from "pixi.js";
import { App } from '../system/App';
import * as Matter from 'matter-js'
import {sound} from '@pixi/sound'

export class Hero {
    constructor() {
        this.location = {x: 20, y: Math.floor(window.innerHeight / 2)}
        this.velocity = App.config.hero.velocity
        this.createSprite();
        this.createBody()
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
            this.sprite.loop = true;
            this.sprite.animationSpeed = 0.1;
            this.sprite.play();

            this.shipSprite = new PIXI.Sprite(App.res('hero1'))
            this.sprite.x = 0
            this.sprite.y = -this.sprite.height / 2
            this.shipSprite.x = this.sprite.width
            this.shipSprite.y = -this.shipSprite.height / 2
            this.container.x = 20
            this.container.y = this.location.y
            this.container.addChild(this.sprite, this.shipSprite)
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(this.container.x + this.shipSprite.width / 2, this.container.y, this.shipSprite.width, this.shipSprite.height, {friction: 0})
        Matter.World.add(App.physics.world, this.body)
        this.body.gameHero = this
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
        if (this.dy != -1) {
            this.dy = -1
            if (!this.ticker) {
                this.ticker = new PIXI.Ticker
                this.ticker.add(this.update.bind(this))
                this.ticker.start()
            }
            
        }
    }

    moveDown() {
        if (this.dy != 1) {
            this.dy = 1

            if (!this.ticker) {
                this.ticker = new PIXI.Ticker
                this.ticker.add(this.update.bind(this))
                this.ticker.start()
            }
        }
    }

    straighten() {
        this.dy = 0
        this.ticker.remove(this.update)
        this.ticker.destroy()
        this.ticker = null
    }

    update(dt) {
        // const increment = (this.dy * this.velocity * dt.deltaTime)
        // if (this.sprite) {
        //     if (this.container.y >= (this.sprite.height - increment) && this.container.y <= (window.innerHeight - this.sprite.height - increment)) {
        //         this.container.y += increment
        //         Matter.Body.setPosition(this.body, {x: this.body.position.x, y: this.body.position.y - increment})
        //     }
        // }
    }

    destroy() {
        App.app.ticker.remove(this.update, this)
        Matter.World.remove(App.physics.world, this.body)
        this.sprite.destroy()
        this.shipSprite.destroy()
        this.sprite = null
        this.shipSprite = null
    }
}