import { canvas, context } from "./script.js"
import { DIRECTION } from "./ball.js"

const bat = new Image()
bat.src = "images/bat.png"

class Player {
    constructor(canvasWidth, canvasHeight, side) {
        this.width = 18
        this.height = 180
        this.side = side
        this.x = side === 'left' ? 150 : canvasWidth - 150
        this.y = (canvasHeight / 2) - 35
        this.score = 0
    }

    wallCollision() {
        if (this.y <= 0) this.y = 0
        else if (this.y >= canvas.height - this.height) this.y = canvas.height - this.height
    }

    draw() {context.drawImage(bat,this.x,this.y,this.width,this.height)}
    
    reset() {this.height = 180}
}

export class RealPlayer extends Player{
    constructor(canvasWidth, canvasHeight, side){
        super(canvasWidth, canvasHeight, side)
        this.speed = 8
    }

    move(keys){
        if(this.side === "left"){
            if (keys.keysPressed.get("w")) this.y -= this.speed
            if (keys.keysPressed.get("s")) this.y += this.speed
        }
        else{
            if (keys.keysPressed.get("ArrowUp")) this.y -= this.speed
            if (keys.keysPressed.get("ArrowDown")) this.y += this.speed
        }
        this.wallCollision()
    }
}

export class AI extends Player{
    constructor(canvasWidth, canvasHeight, side){
        super(canvasWidth, canvasHeight, side)
        this.speed = 5
    }

    move(ball){
        if (this.y > ball.y - (this.height / 2)) {
            if (ball.moveX === DIRECTION.RIGHT) this.y -= this.speed / 1.5
            else this.y -= this.speed / 4
        }
        if (this.y < ball.y - (this.height / 2)) {
            if (ball.moveX === DIRECTION.RIGHT) this.y += this.speed / 1.5
            else this.y += this.speed / 4
        }
        this.wallCollision()
    }
}