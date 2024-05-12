import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Fighter } from "./Fighter";
import * as Matter from 'matter-js'

export class Fighters {
    constructor() {
        this.fighters = [];
        this.container = new PIXI.Container();
        this.velocity = App.config.fighter.velocity
        this.numChannels = 9
        this.channelWidth = Math.floor(window.innerHeight/this.numChannels)
        this.createFighter(this.getRandomData(), this.velocity)
        this.interval = 0
        this.nextSpacing = Math.floor(Math.random()*( App.config.fighter.maximumSpacing - App.config.fighter.minimumSpacing)) + App.config.fighter.minimumSpacing
    }

    createFighter(data) {
        const fighter = new Fighter(data.x, data.y, this.velocity);
        this.current = fighter
        this.container.addChild(fighter.container);
        this.fighters.push(fighter)
        fighter.shipSprite.once('gone', (f) => {
            const index = this.fighters.findIndex( (f) => f.shipSprite === fighter.shipSprite)
            if (index !== -1) {
                this.fighters.splice(index, 1)
            }
        })
    }

    getRandomData() {
        const channel = Math.floor(Math.random() * this.numChannels - Math.floor(this.numChannels / 2))
        const location = {x: window.innerWidth - 20, y: window.innerHeight / 2 + channel * this.channelWidth}
        return location
    }

    update(dt) {
        this.interval += dt.deltaTime
        if (this.interval > this.nextSpacing) {
            this.createFighter(this.getRandomData(), this.velocity);
            this.interval = 0
            this.nextSpacing = Math.floor(Math.random()*( App.config.fighter.maximumSpacing - App.config.fighter.minimumSpacing)) + App.config.fighter.minimumSpacing
        }

        this.fighters.forEach(fighter => fighter.move(dt));
    }

    destroy() {
        this.fighters.forEach( (fighter) => {
            if (fighter.body) {
                Matter.Composite.remove(App.physics.world, fighter.body)
                fighter.destroy()
            }
    })
        this.container.destroy()
    }
}