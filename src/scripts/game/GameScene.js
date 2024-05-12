import { Background } from "./Background";
import { Scene } from '../system/Scene';
import { Hero } from "./Hero";
import * as  Tools from "../system/Tools";
import { Fighters } from "./Fighters";
import { App } from "../system/App";
import * as Matter from 'matter-js'
import {sound} from '@pixi/sound'
import { Shoot } from "./Shoot";

export class GameScene extends Scene {
    create() {
        this.createBackground();
        this.createHero();
        this.numChannels = 9
        this.interval = 0
        this.createFighters()
        this.registerEvents()
        
    }

    createBackground() {
        this.bg = new Background();
        this.container.addChild(this.bg.container);
    }

    registerEvents() {
        this.boundOnCollisionStart = this.onCollisionStart.bind(this);
        Matter.Events.on(App.physics, 'collisionStart', this.boundOnCollisionStart)
    }

    onCollisionStart(event) {
        const colliders = [event.pairs[0].bodyA, event.pairs[0].bodyB]
        const hero = colliders.find((body) => body.gameHero)
        const fighter = colliders.find((body) => body.gameFighter)
        const fighterIndex = colliders.findIndex( (body) => body.gameFighter)
        if (hero && fighter) {
            this.engineSound.stop('engine')
            this.explode(colliders[fighterIndex].gameFighter)
        }
    }

    explode(fighter) {
        fighter.explode()
        this.hero.explode()
    }

    update(dt) {
        super.update(dt)
        this.bg.update(dt.deltaTime);
        this.interval += dt.deltaTime
        this.fighters.update(dt)
    }

    createHero() {
        this.hero = new Hero();
        this.container.addChild(this.hero.container);
        const up = Tools.Tools.keyboard('ArrowUp')
        up.press = this.hero.moveUp.bind(this.hero)
        up.release = this.hero.straighten.bind(this.hero)
        const down = Tools.Tools.keyboard('ArrowDown')
        down.press = this.hero.moveDown.bind(this.hero)
        down.release = this.hero.straighten.bind(this.hero)
        this.engineSound = sound.play('engine', {loop:true})
        this.hero.shipSprite.once('die', ()=> {
            Matter.Events.off(App.physics, 'collisionStart', this.boundOnCollisionStart);
            this.hero = null
            this.fighters.destroy()
            this.fighters = null
            App.scenes.start('Game')
        })

        const shoot = Tools.Tools.keyboard(' ')
        shoot.press = this.shoot.bind(this)
    }

    shoot() {
        // this.shoot = new Shoot()
        // App.app.stage.addChild(this.shoot.container)
        this.hero.initShot()
    }

    createFighters() {
        this.fighters = new Fighters()
        this.container.addChild(this.fighters.container)
    }
}