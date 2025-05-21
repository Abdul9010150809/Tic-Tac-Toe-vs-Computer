const boxes = document.querySelectorAll(".box");
const resetBtn = document.getElementById("reset-btn");
const newBtn = document.getElementById("new-btn");
const msgContainer = document.getElementById("msg-container");
const msg = document.getElementById("msg");
const turnDisplay = document.getElementById("turn");
const scoreDisplay = document.getElementById("score");
const themeSwitch = document.getElementById("theme-switch");

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let currentPlayer = "X";
let playerScore = 0;
let computerScore = 0;

const clickSound = new Audio("/home/rgukt/Documents/Laptop-data/CAREER/Skill craft intern/csa/tic-tac-toe/assets/beep-01a.mp3");

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const updateTurnDisplay = () => {
  turnDisplay.innerText = `Turn: ${currentPlayer === "X" ? "Player (X)" : "Computer (O)"}`;
  scoreDisplay.innerText = `Player: ${playerScore} | Computer: ${computerScore}`;
};

const showMessage = (text) => {
  msg.innerText = text;
  msgContainer.classList.remove("hide");
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      gameActive = false;
      if (board[a] === "X") playerScore++;
      else computerScore++;
      showMessage(`🎉 Winner is ${board[a]}!`);
      updateTurnDisplay();
      return;
    }
  }

  if (!board.includes("")) {
    gameActive = false;
    showMessage("It's a Draw! 🤝");
  }
};

const minimax = (newBoard, player) => {
  const availSpots = newBoard.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);

  if (checkWin(newBoard, "X")) return { score: -10 };
  if (checkWin(newBoard, "O")) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    const result = minimax(newBoard, player === "O" ? "X" : "O");
    move.score = result.score;

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
};

const checkWin = (board, player) => {
  return winPatterns.some(pattern => {
    return pattern.every(index => board[index] === player);
  });
};

const computerMove = () => {
  if (!gameActive) return;
  const bestSpot = minimax(board, "O").index;
  board[bestSpot] = "O";
  boxes[bestSpot].innerText = "O";
  boxes[bestSpot].disabled = true;
  clickSound.play();
  currentPlayer = "X";
  updateTurnDisplay();
  checkWinner();
};

const playerMove = (index) => {
  if (!gameActive || board[index] !== "") return;

  board[index] = "X";
  boxes[index].innerText = "X";
  boxes[index].disabled = true;
  clickSound.play();
  checkWinner();

  if (gameActive) {
    currentPlayer = "O";
    updateTurnDisplay();
    setTimeout(computerMove, 500);
  }
};

const resetGame = () => {
  board.fill("");
  boxes.forEach(box => {
    box.innerText = "";
    box.disabled = false;
  });
  gameActive = true;
  currentPlayer = "X";
  msgContainer.classList.add("hide");
  updateTurnDisplay();
};

boxes.forEach((box, index) => {
  box.addEventListener("click", () => playerMove(index));
});

resetBtn.addEventListener("click", resetGame);
newBtn.addEventListener("click", resetGame);

themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

updateTurnDisplay();