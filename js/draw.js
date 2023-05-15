import { canvas,context,color,rounds,pitch,pitchSrc } from "./script.js";

export function drawBackground(){context.drawImage(pitch, 0, 0, canvas.width, canvas.height)}

export function drawPlayerScores(playerScore,aiScore){
    context.font = '100px Courier New'
    
    context.fillText(
        playerScore,
        (canvas.width / 2) - 300,
        200
    )

    context.fillText(
        aiScore,
        (canvas.width / 2) + 300,
        200
    )
}

export function drawRound(round){
    context.font = 'bold 30px Courier New'

    context.fillText(
        'Runde ' + (round + 1),
        (canvas.width / 2),
        35
    )
}

export function drawWinningScore(round){
    context.font = 'bold 40px Courier'

    context.fillText(
        rounds[round] ? rounds[round] : rounds[round - 1],
        (canvas.width / 2),
        100
    )
}