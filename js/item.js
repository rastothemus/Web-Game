import { canvas,context } from "./script.js"
import { DIRECTION } from "./ball.js"
import { loadImage } from "./help.js"

const imageSrcs = ["grow","shrink","growBall","shrinkBall"]
const maxPlayerHeight = 360
const minPlayerHeight = 90
const maxBallSize = 60
const minBallSize = 15

export class Item {
    constructor(canvasWidth, canvasHeight,image) {
        this.width = 100
        this.height = 100
        this.x = (canvasWidth / 2) - 50
        this.y = (canvasHeight / 2) - 50
        this.moveY = DIRECTION.UP
        this.speed = 3
        this.image = image
        this.imageSrc = "growBall"
        this.activated = false 
        this.collected = false 
    }

    async move(ball,player,ai,gameTimer){
        if (this.moveY === DIRECTION.UP) this.y -= this.speed
        else this.y += this.speed
        this.wallcollision()
        await this.ballCollision(ball,player,ai,gameTimer)
    }

    wallcollision(){
        if (this.y <= 0) this.moveY = DIRECTION.DOWN
        if (this.y >= canvas.height - this.height) this.moveY = DIRECTION.UP
    }

    async ballCollision(ball,player,ai,gameTimer){
        if(!this.collected && (new Date()).getTime() - gameTimer >= 2000){
            if (this.x - this.width <= ball.x && this.x >= ball.x - ball.width && this.y <= ball.y + ball.height && this.y + this.height >= ball.y) {
                this.activated = true
                console.log(this.imageSrc)
                switch(this.imageSrc){
                    case "grow": 
                        this.growPlayer(ball,player,ai)
                        break
                    case "growBall":
                        this.growBall(ball)
                        break
                    case "shrink":
                        this.shrinkPlayer(ball,player,ai)
                        break
                    default:
                        this.shrinkBall(ball)
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

    growBall(ball){
        ball.width +=10
        ball.height +=10
        if(ball.height >= maxBallSize){
            ball.width = maxBallSize
            ball.height = maxBallSize
        }
    }

    growPlayer(ball,player,ai){
        if(ball.moveX === DIRECTION.LEFT) ai.height += 3
        else player.height += 3
        if(player.height>maxPlayerHeight) player.height = maxPlayerHeight
        if(ai.height>maxPlayerHeight) ai.height = maxPlayerHeight
    }

    shrinkBall(ball){
        ball.width -=10
        ball.height -=10
        if(ball.height < minBallSize){
            ball.width = minBallSize
            ball.height = minBallSize
        }
        console.log(ball.height)
    }

    shrinkPlayer(ball,player,ai){
        if(ball.moveX === DIRECTION.LEFT) player.height -= 3
        else ai.height -= 3
        if(player.height<minPlayerHeight) player.height = minPlayerHeight
        if(ai.height<minPlayerHeight) ai.height = minPlayerHeight
    }

    draw(gameTimer){
        if(!this.collected && (new Date()).getTime() - gameTimer >= 2000) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
    }
}