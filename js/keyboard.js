import { music } from "./script.js"
import { drawText } from "./help.js"

export class Keyboard {
    constructor() {
        this.keysPressed = new Map()
        this.paused = false 
        this.audioPaused = false 
        this.started = false
        this.setup()
    }
    setup() {
        ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight',' ','m'].forEach(key => this.keysPressed.set(key, false))
    }
    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                event.preventDefault()
                this.started = true
                this.handlePauseKey(event)
                if (this.keysPressed.has(event.key)) this.keysPressed.set(event.key, event.type === "keydown")
            })
        })
    }
    waitTillAnyKeyPressed(){
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if(this.started) {
                   clearInterval(interval)
                   resolve(true)
                }
            })
        })
    }
    handlePauseKey(event){
        if (this.firstpress(event," ")) {
            this.paused = !this.paused
            drawText("Pause")
        }
    }
    firstpress(event,key){
        return event.key === key && !this.keysPressed.get(key) && (event.type === "keydown")
    }
}