import * as PIXI from 'pixi.js'
import { App } from '../system/App'

export class Shoot {
    constructor(x, y) {
        this.container = new PIXI.Container()
        this.container.x = x
        this.container.y = y
        this.shotVelocity = App.config.shot.velocity
        this.initShot()
    }

    createShot() {
        this.sprite = new PIXI.Sprite(App.res('shot1_4'))
        this.container.addChild(this.sprite)
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(this.container.x + this.sprite.width / 2, this.container.y, this.sprite.width, this.sprite.height, {friction: 0})
        Matter.Composite.add(App.physics.world, this.body)
        this.body.gameShot = this
    }

    update(dt) {
        const increment = this.shotVelocity / dt.deltaTime
        this.container.x += increment
        if (this.sprite) {
            Matter.Body.setPosition(this.body, {x: this.body.position.x, y: this.body.position.y - increment})
            this.container.y = this.body.position.y
        }
    }
}