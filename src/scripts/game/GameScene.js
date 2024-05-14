import { Background } from "./Background";
import { Scene } from '../system/Scene';
import { Hero } from "./Hero";
import * as  Tools from "../system/Tools";
import { Fighters } from "./Fighters";
import { App } from "../system/App";
import * as Matter from 'matter-js'
import {sound} from '@pixi/sound'
import { Stats } from "./Stats";
import { Hud } from "./Hud";

export class GameScene extends Scene {
    create() {
        this.stats = new Stats()
        this.createBackground();
        this.createHero();
        this.numChannels = 9
        this.interval = 0
        this.createFighters()
        this.registerEvents()
        this.createHud()
    }

    createHud() {
        this.hud = new Hud(this.stats.livesRemaining, this.stats.score)
        this.container.addChild(this.hud.container)
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
        const shot = colliders.find( (body) => body.gameShot)
        if (fighter) {
            const fighterObj = colliders[fighterIndex].gameFighter
            if (hero) {
                this.engineSound.stop('engine')
                this.explodeHeroAndFighter(fighterObj)
                this.stats.livesRemaining--
            }
            else {
                this.stats.score += 10
                this.hud.update(this.stats.score)
                sound.play('explosion')
                this.hero.destroyShot(shot)
                this.explodeFighter(fighterObj)
            }
        }
    }

    explodeFighter(fighterObj) {
        fighterObj.explode()
    }

    explodeHeroAndFighter(fighter) {
        fighter.explode()
        this.hero.explode()
        this.up.unsubscribe()
        this.down.unsubscribe()
        this.shoot.unsubscribe()
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
        this.up = Tools.Tools.keyboard('ArrowUp')
        this.up.press = this.hero.moveUp.bind(this.hero)
        this.up.release = this.hero.straighten.bind(this.hero)
        this.down = Tools.Tools.keyboard('ArrowDown')
        this.down.press = this.hero.moveDown.bind(this.hero)
        this.down.release = this.hero.straighten.bind(this.hero)
        this.engineSound = sound.play('engine', {loop:true})
        this.hero.shipSprite.once('die', ()=> {
            Matter.Events.off(App.physics, 'collisionStart', this.boundOnCollisionStart);
            this.hero = null
            this.fighters.destroy()
            this.fighters = null
            if (this.stats.livesRemaining === 0) {
                App.scenes.start('gameOver')
            }
            else {
                App.scenes.start('Game')
            }            
        })

        this.shoot = Tools.Tools.keyboard(' ')
        this.shoot.press = this.shootHandler.bind(this)
    }

    shootHandler() {
        this.hero.initShot()
    }

    createFighters() {
        this.fighters = new Fighters()
        this.container.addChild(this.fighters.container)
    }
}