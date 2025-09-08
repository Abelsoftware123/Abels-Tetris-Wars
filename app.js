// Game-besturingselementen
const startBtn = document.querySelector('.start-btn');
const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const linesDisplay = document.querySelector('#lines');

// Gamevariabelen
const width = 10;
const gameSize = 200; // 20 rijen van 10 kolommen
let score = 0;
let lines = 0;
let timerId;

// Kleuren van de blokken
const colors = [
  'url(images/blue_block.png)',
  'url(images/pink_block.png)',
  'url(images/purple_block.png)',
  'url(images/peach_block.png)',
  'url(images/yellow_block.png)',
  'url(images/navy_block.png)',
  'url(images/green_block.png)'
];

// Functie om het speelveld te creëren
function createGrid() {
  for (let i = 0; i < gameSize; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
  }
}

// Start het spel
startBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    createGrid();
    timerId = setInterval(gameLoop, 1000);
  }
});

// Hoofd gameloop
function gameLoop() {
  // Voeg hier de logica voor het vallen van de blokjes toe
}
