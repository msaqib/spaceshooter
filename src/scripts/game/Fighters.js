import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Fighter } from "./Fighter";

export class Fighters {
    constructor() {
        this.fighters = [];
        this.container = new PIXI.Container();
        this.velocity = App.config.fighter.velocity
        this.numChannels = 9
        this.channelWidth = Math.floor(window.innerHeight/this.numChannels)
        this.createFighter(this.getRandomData(), this.velocity)
        //this.debug()
        this.interval = 0
        this.nextSpacing = Math.floor(Math.random()*( App.config.fighter.maximumSpacing - App.config.fighter.minimumSpacing)) + App.config.fighter.minimumSpacing
    }

    createFighter(data) {
        const fighter = new Fighter(data.x, data.y, this.velocity);
        this.current = fighter
        this.container.addChild(fighter.container);
        this.fighters.push(fighter)
    }

    getRandomData() {
        // const channel = Math.floor(Math.random() * this.numChannels - Math.floor(this.numChannels / 2))
        const channel = 0
        const location = {x: window.innerWidth - 20, y: window.innerHeight / 2 + channel * this.channelWidth}//channel * Math.floor(this.channelWidth) + (this.channelWidth / 2)
        return location
    }

    update(dt) {

        this.interval += dt.deltaTime
        if (this.interval > this.nextSpacing) {
            this.createFighter(this.getRandomData(), this.velocity);
            this.interval = 0
            this.nextSpacing = Math.floor(Math.random()*( App.config.fighter.maximumSpacing - App.config.fighter.minimumSpacing)) + App.config.fighter.minimumSpacing
        }

        // if (this.current.container.x + this.current.container.width < window.innerWidth - 300) {
        //     this.createFighter(this.getRandomData());
        // }

        this.fighters.forEach(fighter => fighter.move(dt));
    }

    destroy() {
        this.fighters.forEach( (fighter) => fighter.destroy())
        this.container.destroy()
    }

    debug() {
        this.fighters.forEach((fighter ) => {
            this.debugHelper(fighter, 400, 600)
        })
        // this.debugHelper(this.hero, 0, 300)
        // this.debugHelper(this.fighter, 400, 600)
    }

    debugHelper(obj, startX, endX) {
        const line1 = this.drawLine(startX, obj.body.bounds.max.y, endX, obj.body.bounds.max.y, 0xff0000)
        this.container.addChild(line1)

        const line2 = this.drawLine(startX, obj.body.bounds.min.y, endX, obj.body.bounds.min.y, 0xff0000)
        this.container.addChild(line2)

        const line3 = this.drawLine(startX, obj.container.y, endX, obj.container.y, 0x00ff00)
        this.container.addChild(line3)

        const line4 = this.drawLine(startX, obj.container.y + obj.container.height, endX, obj.container.y + obj.container.height, 0x00ff00)
        this.container.addChild(line4)
    }

    drawLine(x1, y1, x2, y2, color) {
        const line = new PIXI.Graphics()
        line.moveTo(x1, y1)
        line.lineTo(x2, y2)
        line.stroke({width: 2, color: color})
        line.fill(color)
        return line
    }
}