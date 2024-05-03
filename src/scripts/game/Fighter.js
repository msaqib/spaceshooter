import * as PIXI from "pixi.js";
import { App } from '../system/App';
import * as Matter from 'matter-js'
import {sound} from '@pixi/sound'

export class Fighter {
    constructor(x, y, velocity) {
        this.location = {x: x, y: y}
        this.velocity = velocity
        this.createSprite();
        this.createBody()
        this.dy = 0
        this.chup = this.chup.bind(this)
        this.uda = this.uda.bind(this)
        this.exploding = false
    }

    createSprite() {

        this.container = new PIXI.Container()

        this.sprite = new PIXI.AnimatedSprite([
            App.res("exhaust1"),
            App.res("exhaust2"),
            App.res("exhaust3"),
            App.res("exhaust4")
        ]);
        this.shipSprite = new PIXI.Sprite(App.res('Ship1'))
        // this.shipSprite.x = 0
        // this.shipSprite.y = 0//-this.shipSprite.height / 2
        // this.shipSprite.anchor.set(0.5, 0.5)
        // this.shipSprite.rotation = -Math.PI /2
        // this.sprite.y = - this.sprite.width /2
        
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();

        this.container.addChild(this.sprite, this.shipSprite)
        this.container.x = this.location.x
        this.container.y = this.location.y
        this.shipSprite.y = -this.shipSprite.height/2
        this.sprite.x = this.shipSprite.width
        this.sprite.y = -this.shipSprite.height/2
        // App.app.ticker.add(this.update.bind(this))
    }

    setSpriteLocation() {
        this.sprite.x = this.location.x ;
        this.sprite.y = this.location.y - this.sprite.height / 2;
    }

    setShipLocation() {
        this.shipSprite.x = this.sprite.x + this.sprite.width
        this.shipSprite.y = this.location.y - this.shipSprite.height / 2
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(this.container.x + this.container.width / 2, this.container.y, this.container.width, this.container.height, {friction: 0})
        Matter.World.add(App.physics.world, this.body)
        this.body.gameFighter = this
    }

    move(dt) {
        const increment = (this.velocity * dt.deltaTime)
        
        if(this.body && !this.exploding) {
            if (this.body.position.x < -this.container.width) {
                App.app.ticker.remove(this.update, this)
                Matter.World.remove(App.physics.world, this.body)
                this.container.destroy()
                this.body = null
            }
            else {
                this.container.x -= increment
                Matter.Body.setPosition(this.body, {x: this.body.position.x - increment, y: this.body.position.y})
                this.container.x = this.body.position.x - this.container.width / 2
            }
        }
        
    }

    explode(fighter) {
        this.exploding = true
        App.app.ticker.remove(this.update)
        let names = []
        for (let i = 1; i < 12 ; i++) {
            const name = `Explosion1_${i}`
            names.push(App.res(name))
        }
        this.flameSprite = new PIXI.AnimatedSprite(names);
        this.flameSprite.loop = false;
        this.flameSprite.animationSpeed = 0.1;
        this.flameSprite.play();
        this.flameSprite.position.x = this.shipSprite.width / 2 - this.flameSprite.width / 2
        this.flameSprite.position.y = - this.flameSprite.height / 2 
        this.container.addChild(this.flameSprite)
        App.app.ticker.add(this.chup)
        this.flameSprite.onComplete = this.uda
    }

    chup() {
        if (this.flameSprite.currentFrame >= 4) {
            this.destroy()
            App.app.ticker.remove(this.chup)
        }
    }

    uda() {
        this.flameSprite.destroy()
    }

    destroy() {
        Matter.World.remove(App.physics.world, this.body)
        this.sprite.destroy()
        this.shipSprite.destroy()
        this.sprite = null
        this.shipSprite = null
        this.container.destroy()
    }
}