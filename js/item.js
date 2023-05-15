import { context } from "./script.js"
import { DIRECTION } from "./ball.js"

export class Item {
    constructor(canvasWidth, canvasHeight,image) {
        this.width = 18
        this.height = 18
        this.x = (canvasWidth / 2) - 9
        this.y = (canvasHeight / 2) - 9
        this.move = DIRECTION.IDLE
        this.speed = 3
        this.image = image
    }

    draw(){
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}