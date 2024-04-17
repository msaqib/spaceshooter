import { Background } from "./Background";
import { Scene } from '../system/Scene';
import { Hero } from "./Hero";
import * as  Tools from "../system/Tools";
import { Fighter } from "./Fighter";
import { App } from "../system/App";

export class GameScene extends Scene {
    create() {
        this.createBackground();
        this.createHero();
        this.createFighters()
    }

    createBackground() {
        this.bg = new Background();
        this.container.addChild(this.bg.container);
    }

    update(dt) {
        super.update(dt)
        this.bg.update(dt.deltaTime);
        if (Math.random() < App.config.fighter.probability) {
            this.createFighter(window.innerWidth + 20, Math.floor(Math.random() * window.innerHeight))
        }
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
        this.createFighter(window.innerWidth + 20, window.innerHeight / 2)
    }

    createFighter(x, y) {
        this.fighter = new Fighter(x, y)
        this.container.addChild(this.fighter.container)
    }
}