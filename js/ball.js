import { canvas,hitSound,ball } from "./script.js"

// Zuordnung von Zahlen zu möglichen Bewegungen
export const DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
}

export class Ball {
    constructor(canvasWidth, canvasHeight, incrementedSpeed) {
        this.width = 36
        this.height = 36
        this.x = (canvasWidth / 2) - 18
        this.y = (canvasHeight / 2) - 18
        this.moveX = DIRECTION.IDLE
        this.moveY = DIRECTION.IDLE
        this.speed = incrementedSpeed || 7
    }

    playerCollision(player) {
        if (this.x - this.width <= player.x && this.x >= player.x - player.width) {
            if (this.y <= player.y + player.height && this.y + this.height >= player.y) {
                hitSound.currentTime = 0
                hitSound.play()
                if (player.side === "left") {
                    this.x = (player.x + this.width)
                    this.moveX = DIRECTION.RIGHT
                }
                else {
                    this.x = (player.x - this.width)
                    this.moveX = DIRECTION.LEFT
                }
            }
        }
    }

    draw(context) {context.drawImage(ball,this.x,this.y,this.width,this.height)}

    move(player1,player2){
        if (this.moveY === DIRECTION.UP) this.y -= (this.speed / 1.5)
        else if (this.moveY === DIRECTION.DOWN) this.y += (this.speed / 1.5)
        if (this.moveX === DIRECTION.LEFT) this.x -= this.speed
        else if (this.moveX === DIRECTION.RIGHT) this.x += this.speed
        this.wallCollision()
        this.playerCollision(player1)
        this.playerCollision(player2)
    }

    wallCollision(){
        if (this.y <= 0) this.moveY = DIRECTION.DOWN
        if (this.y >= canvas.height - this.height) this.moveY = DIRECTION.UP
    }
}