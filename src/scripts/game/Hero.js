import * as PIXI from "pixi.js";
import { App } from '../system/App';
import * as Matter from 'matter-js'
import {sound} from '@pixi/sound'

export class Hero {
    constructor() {
        console.log('live')
        this.location = {x: 20, y: Math.floor(window.innerHeight / 2)}
        this.velocity = App.config.hero.velocity
        this.createSprite();
        this.createBody()
        this.dy = 0
        this.chup = this.chup.bind(this)
        this.uda = this.uda.bind(this)
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
        if (this.dy != 1) {
            this.dy = 1
        }
    }

    moveDown() {
        if (this.dy != -1) {
            this.dy = -1
        }
    }

    straighten() {
        this.dy = 0
    }

    update(dt) {
        console.log(this.sprite, this.shipSprite)
        const increment = (this.dy * this.velocity * dt.deltaTime)
        if (!this.shipSprite || (this.dy === 1 && this.body.position.y - this.shipSprite.height / 2 <= -increment)) {
            return
        }
        if (!this.shipSprite || (this.dy === -1 && window.innerHeight - this.body.position.y - this.shipSprite.height / 2 <= -increment)) {
            return
        }
        if (this.sprite) {
            Matter.Body.setPosition(this.body, {x: this.body.position.x, y: this.body.position.y - increment})
            this.container.y = this.body.position.y
        }
    }

    explode() {
        console.log(this, this.sprite, this.shipSprite, this.flameSprite)
        let names = []
        for (let i = 1; i < 12 ; i++) {
            const name = `Explosion1_${i}`
            names.push(App.res(name))
        }
        this.flameSprite = new PIXI.AnimatedSprite(names);
        this.flameSprite.loop = false;
        this.flameSprite.animationSpeed = 0.1;
        this.flameSprite.play();
        this.flameSprite.position.x = this.container.x + this.sprite.width + this.shipSprite.width / 2 - this.flameSprite.width / 2
        this.flameSprite.position.y = - this.flameSprite.height / 2 
        this.container.addChild(this.flameSprite)
        App.app.ticker.add(this.chup)
        this.flameSprite.onComplete = this.uda
    }

    chup() {
        console.log('chup')
        if (this.flameSprite.currentFrame >= 4) {
            App.app.ticker.remove(this.chup)
        }
    }

    uda() {
        console.log('uda')
        this.destroy()
        this.flameSprite.destroy()
        this.flameSprite = null
    }

    destroy() {
        console.log('destroy')
        App.app.ticker.remove(this.update, this)
        Matter.World.remove(App.physics.world, this.body)
        this.sprite.destroy()
        this.shipSprite.emit("die");
    }

    nullify() {
        console.log('nullify')
        this.shipSprite.destroy()
        this.sprite = null
        this.shipSprite = null
    }
}