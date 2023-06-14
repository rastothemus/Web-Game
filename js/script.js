import { Keyboard } from "./keyboard.js"
import { Ball, DIRECTION,hitSound } from "./ball.js"
import { RealPlayer, AI } from "./player.js"
import { Item } from "./item.js"
import { clearCanvas, drawText, loadImage } from "./help.js"
import {drawBackground,drawPlayerScores,drawRound,drawWinningScore} from "./draw.js"

export const canvas = document.querySelector('canvas')
setupCanvas()
export const context = canvas?.getContext('2d')
export const analyse = document.getElementById("analyse")
export let color = ''
export let pitchSrc = ""
export let ballSrc = ""

export const rounds = [5,5, 3, 3, 2,1] 
const colors = ['#1abc9c', '#2ecc71', '#3498db', '#8c52ff', '#9b59b6']
const pitches = ['fb-pitch','ih-pitch','r-pitch','bb-pitch','t-pitch']
const balls = ['football','icehockeypuck','rugbyball','basketball','tennisball']

export const music = new Audio('../Music.mp3')
setupMusic()

const image = new Image()
export const pitch = new Image()
export const ball = new Image()

var startButton = document.getElementById('start')
var itemCheck = document.getElementById('itemCheck')
var multiplayer = document.getElementById('multiPlayer')
var Pong

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

    async setup(){
        this.hideMenu()

        color = await this._generateRoundDesign()
        this.draw()

        drawText("Beliebige Taste drücken")

        await this.item?.loadNewItem()

        this.keys.waitTillAnyKeyPressed().then(() => window.requestAnimationFrame(() => this.loop()))

    }

    async loop() {

        if(!this.keys.paused){
            await this.update()
            this.draw()
        }

        if (!this.over) requestAnimationFrame(() => this.loop())
    }

    async update() {
        if (!this.over) {
            
            this.checkForGoal()

            this.player.move(this.keys)

            if (this.turn && this._turnDelayIsOver()) {
                this.ball.moveX = this.turn === this.player ? DIRECTION.RIGHT : DIRECTION.LEFT
                this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())]
                this.ball.y = Math.floor(Math.random() * canvas.height - 200) + 200
                this.turn = null
                hitSound.currentTime = 0
                hitSound.play()
            }
            
            await this.ball.move(this.player,this.player2)

            
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

    endGameMenu(text) {
        drawText(text)
        this.keys.looked = true
        setTimeout(() => this.showMenu(), 3000)
    }


    checkForGoal(){
        if (this.ball.x <= 0) this._resetTurn(this.player2, this.player)
        if (this.ball.x >= canvas.width - this.ball.width) this._resetTurn(this.player, this.player2)
    }

    async handlePlayerVictory(){
        if (!rounds[this.round + 1] || multiplayer.checked) {
            this.over = true
            setTimeout(() => this.endGameMenu(multiplayer.checked ?'Player 1 Wins':'Winner!'), 1000)
        } else {
            color = await this._generateRoundDesign()
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

    _resetTurn(victor, loser) {
        this.ball = new Ball(canvas.width, canvas.height, this.ball.speed)
        this.turn = loser
        this.timer = (new Date()).getTime()
        victor.score++
        this.player.reset()
        this.player2.reset()
    }

    _turnDelayIsOver() {
        return ((new Date()).getTime() - this.timer >= 1000)
    }

    _generateRoundDesign() {
        return new Promise(resolve => {
            do{
            var index = Math.floor(Math.random() * colors.length)
            var newColor = colors[index]
            }while (newColor === color)
            pitchSrc = 'images/' + pitches[index] + '.jpg'
            ballSrc = 'images/' + balls[index] + '.png'
            let promises = [loadImage(pitch,pitchSrc),loadImage(ball,ballSrc)]
            Promise.all(promises).then(() => {
                resolve(newColor)
            })
        })
    }
    async hideMenu(){
        [startButton,document.getElementById("rules"),itemCheck,document.getElementById("icLabel"),multiplayer,document.getElementById("mpLabel")]
        .forEach(el => el.style.zIndex = "0")
        color = await this._generateRoundDesign()
    }
    showMenu(){
        clearCanvas()
        var menuItems = [startButton,document.getElementById("rules"),itemCheck,document.getElementById("icLabel"),multiplayer,document.getElementById("mpLabel")]
        menuItems.forEach(el => el.style.zIndex = "2")
    }

}

function setupMusic(){
    music.volume = 0
    document.addEventListener('click', () => music.play());
    const musicSlider = document.getElementById('music')
    musicSlider.value = 0
    musicSlider.addEventListener('input', () => music.volume = musicSlider.value/100);
}

function setupCanvas(){
    canvas.width = 1400   //Doppelt damit man bei ganzen Zahlen bleibt
    canvas.height = 1000
    canvas.style.width = (canvas.width / 2) + 'px'
    canvas.style.height = (canvas.height / 2) + 'px'
}

startButton?.addEventListener('click',() => Pong = new Game())
