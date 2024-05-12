import * as PIXI from 'pixi.js'
import { App } from '../system/App'
import * as Matter from 'matter-js'

export class Shoot {
    constructor(x, y) {
        this.container = new PIXI.Container()
        this.container.x = x
        this.container.y = y
        this.velocity = App.config.shot.velocity
        this.createShot()
        this.createBody()
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
        // console.log(this.body.position)
        const increment = this.velocity / dt.deltaTime
        // console.log(this.velocity, dt.deltaTime, increment)
        this.container.x += increment
        if (this.sprite) {
            if (this.body.position.x > window.innerWidth) {
                Matter.Composite.remove(App.physics.world, this.body)
                this.sprite.emit('beyond')
                this.sprite.destroy()
            }
            Matter.Body.setPosition(this.body, {x: this.body.position.x + increment, y: this.body.position.y})
            this.container.y = this.body.position.y
        }
    }

    destroy() {
        this.sprite.destroy()
        this.container.destroy()
    }
}