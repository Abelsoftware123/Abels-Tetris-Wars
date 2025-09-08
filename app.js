// Game-besturingselementen
const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const linesDisplay = document.querySelector('#lines')
const startBtn = document.querySelector('.start-btn')
const display = document.querySelector('.previous-shape')
const rulesBtn = document.querySelector('.rules-btn');
const closeBtn = document.querySelector('.close-btn');

// Gamevariabelen
const width = 10
const gameSize = 200 // 20 rijen van 10 kolommen
let score = 0
let lines = 0
let timerId
let nextRandom = 0

// Kleuren van de blokken
const colors = [
  'url(./images/blue_block.png)',
  'url(./images/pink_block.png)',
  'url(./images/purple_block.png)',
  'url(./images/peach_block.png)',
  'url(./images/yellow_block.png)',
  'url(./images/navy_block.png)',
  'url(./images/green_block.png)'
]

const theTetrominos = [
  [1, 2, 3, 4], // The L-shape
  [1, width + 1, width * 2 + 1, 2], // The J-shape
  [0, width, width + 1, width * 2 + 1], // The S-shape
  [0, 1, width, width + 1], // The Z-shape
  [1, width, width + 1, width + 2], // The T-shape
  [1, width, width * 2, width * 2 + 1], // The O-shape
  [0, 1, width + 1, width + 2] // The I-shape
]

let currentPosition = 4
let currentRotation = 0
let random = Math.floor(Math.random() * theTetrominos.length)
let current = theTetrominos[random][currentRotation]

// Functie om het speelveld te creëren
function createGrid() {
  for (let i = 0; i < gameSize; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
  }
}

// Functie om de Tetromino's willekeurig te genereren en te roteren
function generateNextTetromino() {
  random = nextRandom
  nextRandom = Math.floor(Math.random() * theTetrominos.length)
  current = theTetrominos[random][currentRotation]
}

// Functie om een ​​Tetromino te tekenen
function draw() {
  current.forEach(index => {
    squares[currentPosition + index].style.backgroundImage = colors[random]
  })
}

// Functie om een ​​Tetromino te verwijderen
function undraw() {
  current.forEach(index => {
    squares[currentPosition + index].style.backgroundImage = 'none'
  })
}

// Functie om de Tetromino naar beneden te verplaatsen
function moveDown() {
  undraw()
  currentPosition += width
  draw()
  freeze()
}

// Functie om het blok te bevriezen
function freeze() {
  if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
    current.forEach(index => squares[currentPosition + index].classList.add('taken'))
    random = nextRandom
    nextRandom = Math.floor(Math.random() * theTetrominos.length)
    current = theTetrominos[random][currentRotation]
    currentPosition = 4
    draw()
  }
}

// Toetsenbordbesturing
function control(e) {
  if (e.keyCode === 37) {
    moveLeft()
  } else if (e.keyCode === 38) {
    rotate()
  } else if (e.keyCode === 39) {
    moveRight()
  } else if (e.keyCode === 40) {
    moveDown()
  }
}

document.addEventListener('keydown', control)

// Start het spel
startBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  } else {
    createGrid()
    timerId = setInterval(moveDown, 1000)
    generateNextTetromino()
    draw()
  }
})

// Functie om naar links te bewegen
function moveLeft() {
  undraw()
  const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
  if (!isAtLeftEdge) currentPosition -= 1
  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition += 1
  }
  draw()
}

// Functie om naar rechts te bewegen
function moveRight() {
  undraw()
  const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
  if (!isAtRightEdge) currentPosition += 1
  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition -= 1
  }
  draw()
}

// Functie om te roteren
function rotate() {
  undraw()
  currentRotation++
  if (currentRotation === current.length) {
    currentRotation = 0
  }
  current = theTetrominos[random][currentRotation]
  draw()
}

// Toon regels
rulesBtn.addEventListener('click', () => {
  const rulesModal = document.querySelector('.rules-modal');
  rulesModal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  const rulesModal = document.querySelector('.rules-modal');
  rulesModal.style.display = 'none';
});

// Zorg ervoor dat de DOM is geladen voordat we scripts uitvoeren
document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  draw();
})

const squares = document.querySelectorAll('.grid div');
