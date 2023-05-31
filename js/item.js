import { canvas,context } from "./script.js"
import { DIRECTION } from "./ball.js"

export class Item {
    constructor(canvasWidth, canvasHeight,image) {
        this.width = 100
        this.height = 100
        this.x = (canvasWidth / 2) - 50
        this.y = (canvasHeight / 2) - 50
        this.moveY = DIRECTION.UP
        this.speed = 3
        this.image = image
    }

    move(ball,player,ai){
        if (this.moveY === DIRECTION.UP) this.y -= this.speed
        else this.y += this.speed
        this.wallcollision()
        this.ballCollision(ball,player,ai)
    }

    wallcollision(){
        if (this.y <= 0) this.moveY = DIRECTION.DOWN
        if (this.y >= canvas.height - this.height) this.moveY = DIRECTION.UP
    }

    ballCollision(ball,player,ai){
        if (this.x - this.width <= ball.x && this.x >= ball.x - ball.width) {
            if (this.y <= ball.y + ball.height && this.y + this.height >= ball.y) {
                if(ball.moveX === DIRECTION.LEFT) {
                    ai.height += 3
                    console.log("aiGrow")
                }
                else {
                    player.height += 3
                    console.log("playerGrow")
                }
            }
        }
    }

    draw(){
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}