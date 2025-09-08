// DOM elementen
const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const linesDisplay = document.querySelector('#lines');
const startBtn = document.querySelector('.start-btn');
const rulesBtn = document.querySelector('.rules-btn');
const closeBtn = document.querySelector('.close-btn');

// Game variabelen
const width = 10;
const gameSize = 200; // 20 rijen van 10 kolommen
let score = 0;
let lines = 0;
let timerId = null;
let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random() * 7);
let nextRandom = 0;
let squares = [];

// Tetromino vormen
const theTetrominos = [
  [1, width + 1, width * 2 + 1, 2], // De L-vorm
  [0, width, width + 1, width * 2 + 1], // De J-vorm
  [0, 1, width, width + 1], // De S-vorm
  [1, width, width + 1, width + 2], // De Z-vorm
  [1, width, width * 2, width * 2 + 1], // De T-vorm
  [0, 1, width + 1, width + 2], // De O-vorm
  [1, 2, width + 1, width * 2 + 1], // De I-vorm
];

// Kleuren en afbeeldingen van de blokken
const colors = [
  'url(./images/blue_block.png)',
  'url(./images/pink_block.png)',
  'url(./images/purple_block.png)',
  'url(./images/peach_block.png)',
  'url(./images/yellow_block.png)',
  'url(./images/navy_block.png)',
  'url(./images/green_block.png)'
];

// Functie om het speelveld te creëren
function createGrid() {
  for (let i = 0; i < gameSize; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
  }
  // De 'taken' rij onderaan
  for (let i = 0; i < width; i++) {
    const square = document.createElement('div');
    square.classList.add('taken');
    grid.appendChild(square);
  }
  squares = document.querySelectorAll('.grid div');
}

// Functie om de Tetromino te tekenen
function draw() {
  const currentShape = theTetrominos[random][currentRotation];
  currentShape.forEach(index => {
    squares[currentPosition + index].style.backgroundImage = colors[random];
  });
}

// Functie om de Tetromino te verwijderen
function undraw() {
  const currentShape = theTetrominos[random][currentRotation];
  currentShape.forEach(index => {
    squares[currentPosition + index].style.backgroundImage = 'none';
  });
}

// Functie om naar beneden te bewegen
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

// Functie om het blok te bevriezen
function freeze() {
  const currentShape = theTetrominos[random][currentRotation];
  if (currentShape.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
    currentShape.forEach(index => squares[currentPosition + index].classList.add('taken'));
    addScore();
    addNextTetromino();
  }
}

// Functie om naar links te bewegen
function moveLeft() {
  undraw();
  const isAtLeftEdge = theTetrominos[random][currentRotation].some(index => (currentPosition + index) % width === 0);
  if (!isAtLeftEdge) currentPosition -= 1;
  if (theTetrominos[random][currentRotation].some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition += 1;
  }
  draw();
}

// Functie om naar rechts te bewegen
function moveRight() {
  undraw();
  const isAtRightEdge = theTetrominos[random][currentRotation].some(index => (currentPosition + index) % width === width - 1);
  if (!isAtRightEdge) currentPosition += 1;
  if (theTetrominos[random][currentRotation].some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition -= 1;
  }
  draw();
}

// Functie om te roteren
function rotate() {
  undraw();
  currentRotation++;
  if (currentRotation === theTetrominos[random].length) {
    currentRotation = 0;
  }
  draw();
}

// Functie om een nieuwe Tetromino te starten
function addNextTetromino() {
  random = nextRandom;
  nextRandom = Math.floor(Math.random() * theTetrominos.length);
  currentPosition = 4;
  draw();
  displayNextShape();
  gameOver();
}

// Functie om de score te verhogen en regels te controleren
function addScore() {
  for (let i = 0; i < gameSize; i += width) {
    const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
    if (row.every(index => squares[index].classList.contains('taken'))) {
      score += 10;
      lines++;
      scoreDisplay.innerHTML = score;
      linesDisplay.innerHTML = lines;
      row.forEach(index => {
        squares[index].classList.remove('taken');
        squares[index].style.backgroundImage = 'none';
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach(cell => grid.appendChild(cell));
    }
  }
}

// Game Over Functie
function gameOver() {
  const currentShape = theTetrominos[random][currentRotation];
  if (currentShape.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    scoreDisplay.innerHTML = 'end';
    clearInterval(timerId);
  }
}

// Toon volgende vorm
const displayWidth = 4;
const displaySquares = document.querySelectorAll('.previous-shape div');
const upNextTetrominos = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], // De L-vorm
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // De J-vorm
  [0, 1, displayWidth, displayWidth + 1], // De S-vorm
  [1, displayWidth, displayWidth + 1, displayWidth + 2], // De Z-vorm
  [1, displayWidth, displayWidth * 2, displayWidth * 2 + 1], // De T-vorm
  [0, 1, displayWidth + 1, displayWidth + 2], // De O-vorm
  [1, 2, displayWidth + 1, displayWidth * 2 + 1], // De I-vorm
];

function displayNextShape() {
  displaySquares.forEach(square => {
    square.style.backgroundImage = 'none';
  });
  upNextTetrominos[nextRandom].forEach(index => {
    displaySquares[index].style.backgroundImage = colors[nextRandom];
  });
}

// Toetsenbordbesturing
function control(e) {
  if (e.keyCode === 37) {
    moveLeft();
  } else if (e.keyCode === 38) {
    rotate();
  } else if (e.keyCode === 39) {
    moveRight();
  } else if (e.keyCode === 40) {
    moveDown();
  }
}
document.addEventListener('keydown', control);

// Start/Pauze knop
startBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    draw();
    timerId = setInterval(moveDown, 1000);
    nextRandom = Math.floor(Math.random() * theTetrominos.length);
    displayNextShape();
  }
});

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
});