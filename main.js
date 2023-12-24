const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let playerName;

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
  playerName = prompt('Enter your name:');
  const data = new FormData();
  data.append('playerName', playerName);
  data.append('action', 'join');

  fetch('https://jjsal1234.byethost7.com/server.php', {
    method: 'POST',
    body: data,
  })
    .then(response => response.json())
    .then(updatedGameState => {
      updateGame(updatedGameState);
    })
    .catch(error => console.error('Error:', error));
}

// Function to create a game
function createGame() {
  playerName = prompt('Enter your name:');
  const data = new FormData();
  data.append('playerName', playerName);
  data.append('action', 'create');

  fetch('https://jjsal1234.byethost7.com/server.php', {
    method: 'POST',
    body: data,
  })
    .then(response => response.json())
    .then(updatedGameState => {
      updateGame(updatedGameState);
    })
    .catch(error => console.error('Error:', error));
}

// Function to join an existing game
function joinExistingGame() {
  document.getElementById('game-options').style.display = 'none';
  document.getElementById('join-game-inputs').style.display = 'block';
}

// Function to join a game with a code
function joinGameWithCode() {
  const gameCode = document.getElementById('game-code-input').value;
  const data = new FormData();
  data.append('playerName', playerName);
  data.append('action', 'join');
  data.append('gameCode', gameCode);

  fetch('https://jjsal1234.byethost7.com/server.php', {
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

  fetch('https://jjsal1234.byethost7.com/server.php', {
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
  }

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

// Event listeners for game options
document.getElementById('create-game-btn').addEventListener('click', createGame);
document.getElementById('join-game-btn').addEventListener('click', joinExistingGame);
document.getElementById('join-game-confirm-btn').addEventListener('click', joinGameWithCode);

// Start the game by joining
joinGame();
