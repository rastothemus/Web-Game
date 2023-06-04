import { canvas,context } from "./script.js"
import { DIRECTION } from "./ball.js"
import { loadImage } from "./help.js"

const imageSrcs = ["grow","shrink","growBall","shrinkBall"]

export class Item {
    constructor(canvasWidth, canvasHeight,image) {
        this.width = 100
        this.height = 100
        this.x = (canvasWidth / 2) - 50
        this.y = (canvasHeight / 2) - 50
        this.moveY = DIRECTION.UP
        this.speed = 3
        this.image = image
        this.imageSrc = "grow"
        this.activated = false 
        this.collected = false 
    }

    async move(ball,player,ai){
        if (this.moveY === DIRECTION.UP) this.y -= this.speed
        else this.y += this.speed
        this.wallcollision()
        await this.ballCollision(ball,player,ai)
    }

    wallcollision(){
        if (this.y <= 0) this.moveY = DIRECTION.DOWN
        if (this.y >= canvas.height - this.height) this.moveY = DIRECTION.UP
    }

    async ballCollision(ball,player,ai){
        if(!this.collected){
            if (this.x - this.width <= ball.x && this.x >= ball.x - ball.width && this.y <= ball.y + ball.height && this.y + this.height >= ball.y) {
                this.activated = true
                if(ball.moveX === DIRECTION.LEFT) {
                    ai.height += 3
                    console.log("aiGrow")
                }
                else {
                    player.height += 3
                    console.log("playerGrow")
                }
            }
            else if (this.activated) {
                this.collected = true
                this.activated = false
                this.timer = (new Date()).getTime()
            }
        }
        else if((new Date()).getTime() - this.timer >= 1000){
            this.collected = false
            this.y = Math.floor(Math.random() * canvas.height - 200) + 200
            this.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())]
            await this.loadNewItem()
        }
    }

    async loadNewItem(){
        do{
            let index = Math.floor(Math.random() * imageSrcs.length)
            var newSrc = imageSrcs[index]
        }while(newSrc === this.imageSrc)
        this.imageSrc = newSrc
        await loadImage(this.image,'images/' + this.imageSrc + '.png')
        console.log("image.src")
    }

    draw(){
        if(!this.collected) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
    }
}