const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let playerName;
let gameCode;
let playerSpeed = 5;

// Game state
const gameState = {
  players: {},
  bullets: [],
};

// Event listeners for game options
document.getElementById('create-game-btn').addEventListener('click', createGame);
document.getElementById('join-game-btn').addEventListener('click', joinExistingGame);
document.getElementById('join-game-confirm-btn').addEventListener('click', joinGameWithCode);

// Event listener for shooting bullets (for demonstration purposes)
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    shootBullet();
  }
});

// Event listener for player movement
document.addEventListener('keydown', (event) => {
  handlePlayerMovement(event.code);
});

// Function to handle player movement
function handlePlayerMovement(keyCode) {
  const player = gameState.players[playerName];
  if (!player) return;

  switch (keyCode) {
    case 'ArrowUp':
      player.y -= playerSpeed;
      break;
    case 'ArrowDown':
      player.y += playerSpeed;
      break;
    case 'ArrowLeft':
      player.x -= playerSpeed;
      break;
    case 'ArrowRight':
      player.x += playerSpeed;
      break;
  }

  updateGameOnServer();
}

// Function to update the game state on the server
function updateGameOnServer() {
  const data = new FormData();
  data.append('playerName', playerName);
  data.append('action', 'update');
  data.append('gameCode', gameCode);
  data.append('playerX', gameState.players[playerName].x);
  data.append('playerY', gameState.players[playerName].y);

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
      gameCode = updatedGameState.gameCode;
      updateGame(updatedGameState);
    })
    .catch(error => console.error('Error:', error));
}

// Function to join an existing game
function joinExistingGame() {
  gameCode = prompt('Enter the game code:');
  if (!gameCode) return;

  document.getElementById('game-options').style.display = 'none';
  document.getElementById('join-game-inputs').style.display = 'block';
}

// Function to join a game with a code
function joinGameWithCode() {
  joinGame();
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

  // Draw players (tanks)
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
  // Draw tank body
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

// Start drawing the game
drawGame();
