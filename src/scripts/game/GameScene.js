import { Background } from "./Background";
import { Scene } from '../system/Scene';
import { Hero } from "./Hero";
import * as  Tools from "../system/Tools";
import { Fighters } from "./Fighters";
import { App } from "../system/App";
import * as Matter from 'matter-js'
import * as PIXI from 'pixi.js'

export class GameScene extends Scene {
    create() {
        this.createBackground();
        this.createHero();
        this.numChannels = 9
        this.interval = 0
        this.nextSpacing = Math.floor(Math.random()*( App.config.fighter.maximumSpacing - App.config.fighter.minimumSpacing)) + App.config.fighter.minimumSpacing
        this.channelWidth = Math.floor(window.innerHeight/this.numChannels)
        this.createFighters()
        // this.createFighter(600, Math.floor(window.innerHeight / 2))
        this.registerEvents()
        // this.explode()
    }

    createBackground() {
        this.bg = new Background();
        this.container.addChild(this.bg.container);
    }

    registerEvents() {
        Matter.Events.on(App.physics, 'collisionStart', this.onCollisionStart.bind(this))
    }

    onCollisionStart(event) {
        const colliders = [event.pairs[0].bodyA, event.pairs[0].bodyB]
        const hero = colliders.find((body) => body.gameHero)
        const fighter = colliders.find((body) => body.gameFighter)
        if (hero && fighter) {
            this.explode(fighter)
        }
    }

    explode(fighter) {
        let names = []
            for (let i = 1; i < 12 ; i++) {
                const name = `Explosion1_${i}`
                names.push(App.res(name))
            }
            this.sprite = new PIXI.AnimatedSprite(names);
            this.sprite.loop = false;
            this.sprite.animationSpeed = 0.1;
            this.sprite.play();
            this.sprite.position.x = this.hero.container.x + this.hero.sprite.width + this.hero.shipSprite.width / 2 - this.sprite.width / 2
            this.sprite.position.y = this.hero.container.y  - this.sprite.height / 2 
            this.container.addChild(this.sprite)
            this.hero.destroy()
            // fighter.destroy()
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
    }

    createFighters() {
        this.fighters = new Fighters()
        this.container.addChild(this.fighters.container)
    }
}