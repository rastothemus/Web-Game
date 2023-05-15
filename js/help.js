import { canvas,context,color } from "./script.js"

export function drawText(text){
    // Change the canvas font size and color
    context.font = '45px Courier New'
    context.fillStyle = color

    // Draw the rectangle behind the 'Press any key to begin' text.
    context.fillRect(
        canvas.width / 2 - 350,
        canvas.height / 2 - 48,
        700,
        100
    )

    // Change the canvas color
    context.fillStyle = '#ffffff'

    // Draw the end game menu text ('Game Over' and 'Winner')
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