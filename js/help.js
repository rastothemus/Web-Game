import { canvas,context,color } from "./script.js"

export function drawText(text){
    context.font = '45px Courier New'
    context.fillStyle = color

    context.fillRect(
        canvas.width / 2 - 350,
        canvas.height / 2 - 48,
        700,
        100
    )

    context.fillStyle = '#ffffff'

    context.fillText(text,
        canvas.width / 2,
        canvas.height / 2 + 15
    )
}

export function clearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height)
}

export function loadImage(image,src){
    return new Promise(resolve => {
        image.src = src
        image.onload = () => resolve(true)
    })
}