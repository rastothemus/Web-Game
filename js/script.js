import { Keyboard } from "./keyboard.js"
import { Ball, DIRECTION } from "./ball.js"
import { RealPlayer, AI } from "./player.js"
import { Item } from "./item.js"
import { clearCanvas, drawText, loadImage } from "./help.js"
import {drawBackground,drawPlayerScores,drawRound,drawWinningScore} from "./draw.js"

export const canvas = document.querySelector('canvas')
canvas.width = 1400   //Doppelt damit man bei ganzen Zahlen bleibt
canvas.height = 1000
canvas.style.width = (canvas.width / 2) + 'px'
canvas.style.height = (canvas.height / 2) + 'px'
export const context = canvas?.getContext('2d')
export const analyse = document.getElementById("analyse")
export let color = '#8c52ff'
export let pitchSrc = 'bb-pitch'
export let ballSrc = 'basketball'

export const rounds = [1,1, 3, 3, 2,1] // Punkte die man braucht um die jeweilige Runde zu beenden
const colors = ['#1abc9c', '#2ecc71', '#3498db', '#8c52ff', '#9b59b6']
const pitches = ['fb-pitch','ih-pitch','r-pitch','bb-pitch','t-pitch']
const balls = ['football','icehockeypuck','rugbyball','basketball','tennisball']

export const music = new Audio('../Music.mp3')
music.volume = 0
document.addEventListener('click', () => music.play());
var musicSlider = document.getElementById('music')
musicSlider.value = 0
musicSlider.addEventListener('input', () => music.volume = musicSlider.value/100);
export const hitSound = new Audio('../hit.mp3')
hitSound.volume = 0.5
var soundSlider = document.getElementById('sounds')
soundSlider.value = 50
soundSlider.addEventListener('input', () => hitSound.volume = soundSlider.value/100);

class Game {
    constructor() {

        this.player = new RealPlayer(canvas?.width, canvas?.height, 'left')
        this.player2 = multiplayer.checked ? new RealPlayer(canvas?.width, canvas?.height, 'right') : new AI(canvas?.width, canvas?.height, 'right')

        this.ball = new Ball(canvas?.width, canvas?.height)

        if(itemCheck.checked) this.item = new Item(canvas?.width, canvas?.height,image)

        this.keys = new Keyboard()

        this.keys.listenTo(window)

        this.over = false
        this.turn = this.player2
        this.timer = this.round = 0    

        this.setup()
    }

    endGameMenu(text) {
        drawText(text)
        this.keys.looked = true
        setTimeout(() => this.showMenu(), 3000)
    }

    async update() {
        if (!this.over) {
            
            this.checkForGoal()

            this.player.move(this.keys)

            // On new serve (start of each turn) move the ball to the correct side
            // and randomize the direction to add some challenge.
            if (this.turn && this._turnDelayIsOver()) {
                this.ball.moveX = this.turn === this.player ? DIRECTION.RIGHT : DIRECTION.LEFT
                this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())]
                this.ball.y = Math.floor(Math.random() * canvas.height - 200) + 200
                this.turn = null
            }
            
            this.ball.move(this.player,this.player2)

            
            this.player2.move(multiplayer.checked? this.keys:this.ball)

            this.item?.move(this.ball,this.player,this.player2,this.timer)
        }

        if (this.player.score === (multiplayer.checked ? 10 : rounds[this.round])) {
            await this.handlePlayerVictory()
        }

        else if (this.player2.score === (multiplayer.checked ? 10 : rounds[this.round])) {
            this.handleAiVictory()
        }
    }

    draw() {

        clearCanvas()

        drawBackground()
        
        this.player.draw()

        this.player2.draw()

        if (this._turnDelayIsOver()) {
            this.ball.draw(context)
        }

        this.item?.draw(this.timer)

        context.textAlign = 'center'

        context.fillStyle = '#000000'

        drawPlayerScores(this.player.score.toString(),this.player2.score.toString())

        if(!multiplayer.checked) {
            drawRound(this.round)
            drawWinningScore(this.round)
        }
    }

    async loop() {

        if(!this.keys.paused){
            await this.update()  //Pong weil requestAnimationFrame das Object nicht mitnimmt
            this.draw()
        }


        // If the game is not over, draw the next frame.
        if (!this.over) requestAnimationFrame(() => this.loop())
    }

    checkForGoal(){
        if (this.ball.x <= 0) this._resetTurn(this.player2, this.player)
        if (this.ball.x >= canvas.width - this.ball.width) this._resetTurn(this.player, this.player2)
    }

    async handlePlayerVictory(){
        // Check to see if there are any more rounds/levels left and display the victory screen if
            // there are not.
        if (!rounds[this.round + 1] || multiplayer.checked) {
            this.over = true
            setTimeout(() => this.endGameMenu(multiplayer.checked ?'Player 1 Wins':'Winner!'), 1000)
        } else {
            // If there is another round, reset all the values and increment the round number.
            color = await this._generateRoundColor()
            this.player.score = this.player2.score = 0
            this.player.speed += 0.5
            this.player2.speed += 1
            this.ball.speed += 1
            this.round += 1
        }
    }

    handleAiVictory(){
        this.over = true
        setTimeout(() => this.endGameMenu(multiplayer.checked ?'Player 2 Wins':'Game Over!'), 1000)
    }

    // Reset the ball location, the player turns and set a delay before the next round begins.
    _resetTurn(victor, loser) {
        this.ball = new Ball(canvas.width, canvas.height, this.ball.speed)
        this.turn = loser
        this.timer = (new Date()).getTime()
        victor.score++
        this.player.reset()
        this.player2.reset()
    }

    // Wait for a delay to have passed after each turn.
    _turnDelayIsOver() {
        return ((new Date()).getTime() - this.timer >= 1000)
    }

    // Select a random color as the background of each level/round.
    _generateRoundColor() {
        return new Promise(resolve => {
            do{
            var index = Math.floor(Math.random() * colors.length)
            var newColor = colors[index]
            }while (newColor === color)
            pitchSrc = 'images/' + pitches[index] + '.jpg'
            ballSrc = 'images/' + balls[index] + '.png'
            pitch.src = 'images/' + pitches[index] + '.jpg'
            let promises = [loadImage(pitch,pitchSrc),loadImage(ball,ballSrc)]
            Promise.all(promises).then(() => {
                resolve(newColor)
            })
        })
    }
    async hideMenu(){
        [startButton,document.getElementById("rules"),itemCheck,document.getElementById("icLabel"),multiplayer,document.getElementById("mpLabel")]
        .forEach(el => el.style.zIndex = "0")
        color = await this._generateRoundColor()
    }
    showMenu(){
        clearCanvas()
        var menuItems = [startButton,document.getElementById("rules"),itemCheck,document.getElementById("icLabel"),multiplayer,document.getElementById("mpLabel")]
        menuItems.forEach(el => el.style.zIndex = "2")
    }
    async setup(){
        this.hideMenu()

        color = await this._generateRoundColor()
        this.draw()

        drawText("Beliebige Taste drücken")

        await this.item?.loadNewItem()

        this.keys.waitTillAnyKeyPressed().then(() => window.requestAnimationFrame(() => this.loop()))

    }

}




const image = new Image()

export const pitch = new Image()

export const ball = new Image()

var startButton = document.getElementById('start')
var itemCheck = document.getElementById('itemCheck')
var multiplayer = document.getElementById('multiPlayer')
var Pong

startButton.addEventListener('click',() => Pong = new Game())
