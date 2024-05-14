import { App } from "../system/App"
export class Stats {
    constructor() {
        if (!Stats.instance) {
            this.reset()
            Stats.instance = this
        }
        return Stats.instance
    }

    reset() {
        this.livesRemaining = App.config.hero.lives
        this.score = 0
    }
}