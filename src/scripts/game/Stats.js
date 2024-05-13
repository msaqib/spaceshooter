import { App } from "../system/App"
export class Stats {
    constructor() {
        if (!Stats.instance) {
            this.livesRemaining = App.config.hero.lives
            this.score = 0
            Stats.instance = this
        }
        return Stats.instance
    }
}