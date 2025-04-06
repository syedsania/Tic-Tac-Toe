const board = document.getElementById('board');
const status = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const modeSelect = document.getElementById('mode');

let currentPlayer = 'X';
let cells = Array(9).fill(null);
let gameActive = true;
let gameMode = 'multi'; // default

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// Set up game board
function initBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    board.appendChild(cell);
  }
}

function resetGame() {
  cells = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  status.textContent = "Player X's turn";
  initBoard();
}

function checkWin(player) {
  return winPatterns.some(pattern => 
    pattern.every(index => cells[index] === player)
  );
}

function aiMove() {
  // Very basic AI - chooses random empty cell
  const emptyIndices = cells.map((val, idx) => val === null ? idx : null).filter(i => i !== null);
  if (emptyIndices.length === 0) return;
  
  const aiIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  cells[aiIndex] = 'O';
  const cell = board.querySelector(`[data-index='${aiIndex}']`);
  cell.textContent = 'O';

  if (checkWin('O')) {
    status.textContent = "AI (O) wins! 🤖🏆";
    gameActive = false;
  } else if (cells.every(cell => cell)) {
    status.textContent = "It's a draw! 🤝";
    gameActive = false;
  } else {
    currentPlayer = 'X';
    status.textContent = "Player X's turn";
  }
}

// Handle click event
board.addEventListener('click', e => {
  if (!gameActive || !e.target.classList.contains('cell')) return;
  const index = e.target.dataset.index;

  if (cells[index]) return;

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    status.textContent = `Player ${currentPlayer} wins! 🎉`;
    gameActive = false;
  } else if (cells.every(cell => cell)) {
    status.textContent = "It's a draw! 🤝";
    gameActive = false;
  } else {
    if (gameMode === 'single' && currentPlayer === 'X') {
      currentPlayer = 'O';
      setTimeout(aiMove, 500); // delay for realism
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
});

// Reset game
resetBtn.addEventListener('click', resetGame);

// Mode change
modeSelect.addEventListener('change', e => {
  gameMode = e.target.value;
  resetGame();
});

// Init on page load
initBoard();
