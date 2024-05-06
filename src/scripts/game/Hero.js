import * as PIXI from "pixi.js";
import { App } from '../system/App';
import * as Matter from 'matter-js'
import {sound} from '@pixi/sound'

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
        App.app.ticker.add(this.update)
    }

    createSprite() {

            this.container = new PIXI.Container()

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
            this.sprite.x = 0
            this.sprite.y = -this.sprite.height / 2
            this.shipSprite.x = this.sprite.width
            this.shipSprite.y = -this.shipSprite.height / 2
            this.container.x = 20
            this.container.y = this.location.y
            this.container.addChild(this.sprite, this.shipSprite)
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
    }

    // explode() {
    //     // Check and remove `update` from the Ticker
    //     App.app.ticker.remove(this.update);
    //     Matter.Composite.remove(App.physics.world, this.body)
    //     this.body = null
    //     App.physics.world.bodies.forEach( body => {
    //         if (body.gameHero) {
    //             console.log(body.gameHero)
    //         }
    //         if (body.gameFighter) {
    //             console.log(body.gameFighter)
    //         }
    //         // console.log(body, this.body)
    //     })
    //     const frames = [];
    //     for (let i = 1; i < 12; i++) {
    //         frames.push(App.res(`Explosion1_${i}`));
    //     }

    //     this.flameSprite = new PIXI.AnimatedSprite(frames);
    //     this.flameSprite.loop = false;
    //     this.flameSprite.animationSpeed = 0.1;
    //     this.flameSprite.position.x = this.sprite.width + this.shipSprite.width / 2 - this.flameSprite.width / 2
    //     this.flameSprite.position.y = - this.flameSprite.height / 2 
    //     this.flameSprite.play();

    //     this.container.addChild(this.flameSprite);

    //     // Hide `shipSprite` on frame 5
    //     const checkFlameSpriteFrame = () => {
    //         if (this.flameSprite.currentFrame === 5) {
    //         this.shipSprite.visible = false;
    //         this.sprite.visible = false
    //         App.app.ticker.remove(checkFlameSpriteFrame);
    //         }
    //     };

    //     App.app.ticker.add(checkFlameSpriteFrame);

    //     // Emit "die" when the animation completes
    //     this.flameSprite.onComplete = () => {
    //         console.log("Explosion completed. Emitting 'die' message.");
    //         this.shipSprite.emit("die");// Define how the "die" message is handled
    //     };
    //     }

        explode(fighter) {
            Matter.Composite.remove(App.physics.world, this.body)
            this.exploding = true
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
    }

    // explode() {
    //     console.log('Order')
    //     console.log('There: ', this.isCallbackInTicker(App.app.ticker, this.update))
    //     App.app.ticker.remove(this.update, this)
    //     console.log('There: ', this.isCallbackInTicker(App.app.ticker, this.update))
    //     console.log(this.container, this.sprite, this.shipSprite, this.flameSprite)
    //     this.exploding = true
    //     let names = []
    //     for (let i = 1; i < 12 ; i++) {
    //         const name = `Explosion1_${i}`
    //         names.push(App.res(name))
    //     }
    //     this.flameSprite = new PIXI.AnimatedSprite(names);
    //     this.flameSprite.loop = false;
    //     this.flameSprite.animationSpeed = 0.1;
    //     this.flameSprite.play();
    //     console.log(this.container.x, this.flameSprite.position.x)
    //     this.flameSprite.position.x = this.container.x + this.sprite.width + this.shipSprite.width / 2 - this.flameSprite.width / 2
    //     this.flameSprite.position.y = - this.flameSprite.height / 2 
    //     this.container.addChild(this.flameSprite)
    //     App.app.ticker.add(this.chup)
    //     this.flameSprite.onComplete = this.uda
    // }

    // chup() {
    //     console.log('chup')
    //     if (this.flameSprite.currentFrame >= 4) {
    //         App.app.ticker.remove(this.chup)
    //     }
    // }

    // uda() {
    //     console.log('uda')
    //     this.destroy()
    //     this.flameSprite.destroy()
    //     this.flameSprite = null
    // }

    // destroy() {
    //     console.log('destroy')
        
    //     Matter.World.remove(App.physics.world, this.body)
    //     this.sprite.destroy()
    //     this.shipSprite.emit("die");
    // }

    // nullify() {
    //     console.log('nullify')
    //     this.shipSprite.destroy()
    //     this.sprite = null
    //     this.shipSprite = null
    // }

    // isCallbackInTicker(ticker, callback) {
    //     let current = ticker._head; // Start from the head of the linked list
    //     console.log(current, current.fn)
    //     while (current) {
            
    //       if (current.fn === callback) {
    //         return true; // Callback found
    //       }
    //       current = current.next; // Move to the next item in the list
    //     }
    //     return false; // Callback not found
    //   }
// }