import * as PIXI from "pixi.js";
import { App } from '../system/App';
import * as Matter from 'matter-js'
import {sound} from '@pixi/sound'
import { Shoot } from "./Shoot";

export class Hero {
    constructor() {
        this.location = {x: 20, y: Math.floor(window.innerHeight / 2)}
        this.velocity = App.config.hero.velocity
        this.createSprite();
        this.createBody()
        this.dy = 0
        this.halfFlame = this.halfFlame.bind(this)
        this.flameGone = this.flameGone.bind(this)
        this.update = this.update.bind(this)
        this.shots = []
        App.app.ticker.add(this.update)
    }

    createSprite() {
            this.container = new PIXI.Container()
            this.container.x = this.location.x
            this.container.y = this.location.y
            
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
            this.container.addChild(this.sprite, this.shipSprite)
            this.shipSprite.x = this.sprite.width
            this.shipSprite.y = - this.shipSprite.height / 2
            this.sprite.y = -this.sprite.height / 2
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(this.container.x + this.shipSprite.width / 2, this.container.y, this.shipSprite.width, this.shipSprite.height, {friction: 0})
        Matter.Composite.add(App.physics.world, this.body)
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
        this.shots.forEach((shot) => shot.update(dt))
    }

    explode(fighter) {
        sound.play('explosion')
        Matter.Composite.remove(App.physics.world, this.body)
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
        this.flameSprite.position.x = this.sprite.width + this.shipSprite.width / 2 - this.flameSprite.width / 2
        this.flameSprite.position.y = - this.flameSprite.height / 2 
        this.container.addChild(this.flameSprite)
        App.app.ticker.add(this.halfFlame)
        this.flameSprite.onComplete = this.flameGone
    }

    halfFlame() {
        if (this.flameSprite.currentFrame >= 4) {
            this.destroy()
            App.app.ticker.remove(this.halfFlame)
        }
    }

    flameGone() {
        this.flameSprite.destroy()
        this.container.destroy()
        this.shipSprite.emit("die")
        this.sprite.destroy()
        this.shipSprite.destroy()
        this.sprite = null
        this.shipSprite = null
    }

    destroy() {
        if (this.sprite) {
            this.sprite.visible = false
            this.shipSprite.visible = false
        }
    }

    initShot() {
        this.shot = new PIXI.AnimatedSprite([App.res('shot1_1'), App.res('shot1_2'), App.res('shot1_3'), App.res('shot1_4')])
        this.shot.onComplete = this.completeShot.bind(this)
        this.shot.loop = false
        this.shot.animationSpeed = 1
        this.shot.play()
        this.container.addChild(this.shot)
        this.shot.x = this.sprite.width + this.shipSprite.width
        this.shot.y = - this.shot.height / 2
    }

    completeShot() {
        const location = this.shot.toGlobal(new PIXI.Point(0, 0))
        const newShot = new Shoot(location.x, location.y)
        this.shots.push(newShot)
        newShot.sprite.once('beyond', ()=> {
            const shotIndex = this.shots.findIndex(s => s === newShot)
            this.shots.splice(shotIndex, 1)
        })
        this.container.removeChild(this.shot)
        App.app.stage.addChild(newShot.container)
    }

    destroyShot(shot) {
        const index = this.shots.findIndex(s => shot)
        this.shots[index].destroy()
        this.shots.splice(index, 1)
    }
}