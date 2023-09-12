const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const score = document.querySelector('.score--value')
const finalScore = document.querySelector('.final-score > span')
const menu = document.querySelector('.menu-screen')
const buttonPlay = document.querySelector('.btn-play')
const music = new Audio('/music.mp3')
const audio = new Audio('/audio.mp3')
const lose = new Audio('/lose.mp3')
const size = 20



const initialPosition =  { x: 120, y: 120}

let snake = [initialPosition]

const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

const randomNumber = (max , min) => {
    return Math.round(Math.random()* (max - min)+ min)
}
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 20) * 20
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}



const food = {
    x:randomPosition(),
    y:randomPosition(),
    color: randomColor()
}

let direction, loopId

const drawFood = () => {

    const { x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0

}

const drawsnake = () => {
    ctx.fillStyle = '#ddd'
    music.play()
    snake.forEach((position, index) => {

        if (index == snake.length - 1){
            ctx.fillStyle = 'green'
        }
    ctx.fillRect(position.x, position.y, size, size)
   })
}
const movesnake = () => {
    if(!direction)return
    
    const head = snake[snake.length -1 ]


    if (direction == 'right'){
        snake.push({x: head.x + size, y: head.y})
    } 
    
    if (direction == 'left'){
        snake.push({x: head.x - size, y: head.y})
    }
    if (direction == 'down'){
        snake.push({x: head.x, y: head.y + size})
    }
    if (direction == 'up'){
        snake.push({x: head.x, y: head.y - size})
    }
    snake.shift()
}
const drawGrid = () => {
    
    ctx.lineWidth = 0.01
    ctx.strokeStyle ='#191919'

    for(let i = 20; i < canvas.width; i += 20){
    ctx.beginPath()
    ctx.lineTo(i, 0)
    ctx.lineTo(i, 400) 
    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(0, i)
    ctx.lineTo(400, i) 
    ctx.stroke()
    }


}

const checkEat = () => {
    const head = snake[snake.length - 1]



    if (head.x == food.x && head.y == food.y){
        incrementScore()
        snake.push(head)
        audio.play()


        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y == y )){
            x = randomPosition()
            y = randomPosition()
        }
        food.x = x
        food.y = y
        food.color = randomColor()
    }

}

const checkCollision = () =>{
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallColision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit
    const selfColision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
        
    })

    if(wallColision || selfColision){
        music.pause()
        lose.play()
       gameOver()
    }

}




const gameOver = () =>{
    direction = undefined
    
    menu.style.display = 'flex'
    finalScore.innerText = score.innerText
    canvas.style.filter = 'blur(2px)'
}

const gameLoop = () => {
    clearInterval()
    ctx.clearRect(0, 0, 600, 600)

    
    drawGrid()
    drawFood()
    movesnake()
    drawsnake()
    checkEat()
    checkCollision()
   

    loopId = setTimeout(() => {
        gameLoop()
    }, 100)
}

gameLoop()

document.addEventListener('keydown', ({key}) =>{
    if(key == 'ArrowRight' && direction != 'left'){
        direction = 'right'
    }
     if(key == 'ArrowLeft' && direction != 'right'){
        direction = 'left'
    } if(key == 'ArrowUp' && direction != 'down'){
        direction = 'up'
    } if(key == 'ArrowDown' && direction != 'up'){
        direction = 'down'
    }

})
buttonPlay.addEventListener('click', () => {
    score.innerText = '00'
    menu.style.display = 'none'
    canvas.style.filter = 'none'
    snake = [initialPosition]
    music.currentTime = 0
})