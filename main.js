const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const playerName = prompt('Enter your name:');

// Game state
const gameState = {
  players: {},
  bullets: [],
};

// Event listener for shooting bullets (for demonstration purposes)
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    shootBullet();
  }
});

// Function to join the game
function joinGame() {
  const data = new FormData();
  data.append('playerName', playerName);
  data.append('action', 'join');

  fetch('http://yourbyethostdomain.com/server.php', {
    method: 'POST',
    body: data,
  })
    .then(response => response.json())
    .then(updatedGameState => {
      updateGame(updatedGameState);
    })
    .catch(error => console.error('Error:', error));
}

// Function to shoot a bullet
function shootBullet() {
  const data = new FormData();
  data.append('playerName', playerName);
  data.append('action', 'shoot');
  data.append('bulletX', gameState.players[playerName].x + 15);
  data.append('bulletY', gameState.players[playerName].y);

  fetch('https://c00lsite.byethost7.com/server.php', {
    method: 'POST',
    body: data,
  })
    .then(response => response.json())
    .then(updatedGameState => {
      updateGame(updatedGameState);
    })
    .catch(error => console.error('Error:', error));
}

// Function to update the game state
function updateGame(updatedGameState) {
  // Update local game state
  Object.assign(gameState, updatedGameState);

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw players
  for (const player in gameState.players) {
    const { x, y, health } = gameState.players[player];
    drawTank(x, y, health);
  }

  // Draw bullets
  gameState.bullets.forEach(bullet => {
    drawBullet(bullet.x, bullet.y);
  });

  // Request next animation frame
  requestAnimationFrame(() => updateGame(gameState));
}

// Function to draw a tank
function drawTank(x, y, health) {
  ctx.fillStyle = 'green';
  ctx.fillRect(x, y, 30, 30);

  // Display player's health
  ctx.fillStyle = 'black';
  ctx.fillText(`Health: ${health}`, x, y - 5);
}

// Function to draw a bullet
function drawBullet(x, y) {
  ctx.fillStyle = 'red';
  ctx.fillRect(x, y, 5, 5);
}

// Start the game by joining
joinGame();
