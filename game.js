// Initialize the canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Game settings
const basket = {
  width: 100,
  height: 20,
  x: canvas.width / 2 - 50,
  y: canvas.height - 30,
  speed: 7,
  dx: 0,
};

let fallingItems = [];
let score = 0;
let gameInterval;
let isGameOver = false;

// Create random falling items
function createFallingItem() {
  const size = Math.random() * 20 + 20;
  const x = Math.random() * (canvas.width - size);
  const speed = Math.random() * 2 + 2;
  fallingItems.push({ x, y: 0, size, speed });
}

// Move the basket based on input
function moveBasket() {
  basket.x += basket.dx;
  // Prevent the basket from moving out of bounds
  basket.x = Math.max(0, Math.min(canvas.width - basket.width, basket.x));
}

// Draw the basket
function drawBasket() {
  ctx.fillStyle = '#333';
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

// Draw falling items
function drawFallingItems() {
  ctx.fillStyle = 'red';
  fallingItems.forEach(item => {
    ctx.beginPath();
    ctx.arc(item.x + item.size / 2, item.y + item.size / 2, item.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Move falling items
function moveFallingItems() {
  fallingItems = fallingItems.filter(item => {
    item.y += item.speed;
    // Check if an item is caught by the basket
    if (
      item.y + item.size >= basket.y &&
      item.x + item.size > basket.x &&
      item.x < basket.x + basket.width
    ) {
      score += 10;
      return false; // Remove caught item
    }
    // If an item falls off the screen, game over
    if (item.y > canvas.height) {
      isGameOver = true;
    }
    return item.y <= canvas.height; // Keep items on screen
  });
}

// Draw score
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Update the game (called every frame)
function updateGame() {
  if (!isGameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveBasket();
    moveFallingItems();
    drawBasket();
    drawFallingItems();
    drawScore();
  } else {
    drawGameOver();
    clearInterval(gameInterval);
  }
}

// Game Over message
function drawGameOver() {
  ctx.font = '40px Arial';
  ctx.fillStyle = 'red';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
  ctx.font = '20px Arial';
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
}

// Key down event handler
function keyDown(e) {
  if (e.key === 'ArrowRight' || e.key === 'Right') {
    basket.dx = basket.speed;
  } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
    basket.dx = -basket.speed;
  }
}

// Key up event handler
function keyUp(e) {
  if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'ArrowLeft' || e.key === 'Left') {
    basket.dx = 0;
  }
}

// Start the game
function startGame() {
  gameInterval = setInterval(() => {
    updateGame();
    if (Math.random() < 0.05) {
      createFallingItem(); // Add a new falling item randomly
    }
  }, 1000 / 60); // 60 FPS
}

// Event listeners for keyboard input
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Start the game
startGame();
