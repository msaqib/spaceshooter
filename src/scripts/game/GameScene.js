import { Background } from "./Background";
import { Scene } from '../system/Scene';
import { Hero } from "./Hero";
import * as  Tools from "../system/Tools";
import { Fighters } from "./Fighters";
import { App } from "../system/App";
import * as Matter from 'matter-js'

export class GameScene extends Scene {
    create() {
        this.createBackground();
        this.createHero();
        this.numChannels = 9
        this.interval = 0
        this.nextSpacing = Math.floor(Math.random()*( App.config.fighter.maximumSpacing - App.config.fighter.minimumSpacing)) + App.config.fighter.minimumSpacing
        this.channelWidth = Math.floor(window.innerHeight/this.numChannels)
        this.createFighters()
        this.registerEvents()
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
        const fighterIndex = colliders.findIndex( (body) => body.gameFighter)
        if (hero && fighter) {
            this.explode(colliders[fighterIndex].gameFighter)
        }
    }

    explode(fighter) {
        this.hero.explode()
        fighter.explode()
    }

    update(dt) {
        super.update(dt)
        this.bg.update(dt.deltaTime);
        this.interval += dt.deltaTime
        this.fighters.update(dt)
        this.hero.update(dt)
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
        this.hero.shipSprite.once('die', ()=> {
            // stats.livesRemaining--
            // if(stats.livesRemaining > 0) {
                console.log('chutty time')
                this.hero.nullify()
                App.scenes.start('Game')
            // }
            // else {
                // App.scenes.start('gameOver')
                // stats.reset()
            // }
        })
        this.id++
    }

    createFighters() {
        this.fighters = new Fighters()
        this.container.addChild(this.fighters.container)
    }

    listTickerCallbacks(ticker) {
        const callbacks = [];
        let current = ticker._head; // Start from the head of the linked list
    
        while (current) {
            callbacks.push(current.fn); // Add the callback function to the list
            current = current.next; // Move to the next item in the list
        }
    
        return callbacks;
    }
}