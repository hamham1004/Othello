const boardSize = 8;
const board = document.getElementById("board");
const playerColors = ["black", "white"];


const cells = new Array(boardSize * boardSize).fill(null);

function createCell(index) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.addEventListener("click", () => handleClick(index));
  board.appendChild(cell);
  cells[index] = cell;
}

function placeDisk(index, color) {
  const disk = document.createElement("div");
  disk.classList.add(color ? "white" : "black");
  cells[index].appendChild(disk);
}

function initializeBoard() {
  for (let i = 0; i < cells.length; i++) {
    createCell(i);
  }

  placeDisk(27, 0);
  placeDisk(28, 1);
  placeDisk(35, 1);
  placeDisk(36, 0);

  updateGameState();
}


let currentPlayer = 0; // 0: black, 1: white

function isValidMove(index, player) {
  if (cells[index].firstChild) {
    return false;
  }

  const opponent = player === 0 ? 1 : 0;
  const directions = [
    { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
    { x: -1, y: 0 }, { x: 1, y: 0 },
    { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 },
  ];

  for (const direction of directions) {
    let x = index % 8 + direction.x;
    let y = Math.floor(index / 8) + direction.y;
    let foundOpponent = false;

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const currentIndex = y * 8 + x;
      const currentCell = cells[currentIndex];

      if (!currentCell.firstChild) {
        break;
      }

      if (currentCell.firstChild.classList.contains(playerColors[opponent])) {
        foundOpponent = true;
      } else if (currentCell.firstChild.classList.contains(playerColors[player])) {
        if (foundOpponent) {
          return true;
        } else {
          break;
        }
      } else {
        break;
      }

      x += direction.x;
      y += direction.y;
    }
  }

  return false;
}

function flipDisks(index, player) {
  // ここにflipDisksのロジックが入ります
  const directions = [
    { x: -1, y: -1 },
    { x:  0, y: -1 },
    { x:  1, y: -1 },
    { x: -1, y:  0 },
    { x:  1, y:  0 },
    { x: -1, y:  1 },
    { x:  0, y:  1 },
    { x:  1, y:  1 }
  ];

  const row = Math.floor(index / boardSize);
  const col = index % boardSize;

  for (const dir of directions) {
    const toFlip = [];
    let newRow = row + dir.y;
    let newCol = col + dir.x;

    while (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
      const newIndex = newRow * boardSize + newCol;
      const cell = cells[newIndex].firstChild;

      if (!cell) {
        break;
      }

      const color = cell.classList.contains("black") ? 0 : 1;

      if (color === player) {
        if (toFlip.length > 0) {
          toFlip.forEach(index => {
            cells[index].firstChild.classList.toggle("black");
            cells[index].firstChild.classList.toggle("white");
          });
        }
        break;
      }

      toFlip.push(newIndex);

      newRow += dir.y;
      newCol += dir.x;
    }
  }
}

function isGameOver() {
  // ここにisGameOverのロジックが入ります
  for (let i = 0; i < cells.length; i++) {
    if (isValidMove(i, 0) || isValidMove(i, 1)) {
      return false;
    }
  }
  return true;
}

function handleClick(index) {
  if (currentPlayer === 1 || !isValidMove(index, currentPlayer)) {
    return;
  }

  placeDisk(index, currentPlayer);
  flipDisks(index, currentPlayer);
  currentPlayer = 1;
  updateValidMoveHints(); // この行を追加

  if (isGameOver()) {
    setTimeout(() => {
      showResult();
    }, 500);
  } else {
    setTimeout(() => {
      makeComputerMove();
    }, 500);
  }
}

function makeComputerMove() {
  if (!hasValidMoves(currentPlayer)) {
    currentPlayer = 0;
    updateValidMoveHints();
    return;
  }

  const validMoves = [];

  for (let i = 0; i < cells.length; i++) {
    if (isValidMove(i, currentPlayer)) {
      validMoves.push(i);
    }
  }

  const selectedIndex = validMoves[Math.floor(Math.random() * validMoves.length)];
  placeDisk(selectedIndex, currentPlayer);
  flipDisks(selectedIndex, currentPlayer);
  currentPlayer = 0;
  updateValidMoveHints();

  if (isGameOver()) {
    showResult();
  }
}



function updateValidMoveHints() {
  cells.forEach((cell, index) => {
    if (isValidMove(index, currentPlayer)) {
      cell.classList.add("valid-move");
    } else {
      cell.classList.remove("valid-move");
    }
  });
}

function showResult() {
  let blackCount = 0;
  let whiteCount = 0;

  cells.forEach(cell => {
    if (cell.firstChild) {
      if (cell.firstChild.classList.contains("black")) {
        blackCount++;
      } else {
        whiteCount++;
      }
    }
  });

  let resultMessage = "";
  if (blackCount > whiteCount) {
    resultMessage = "プレイヤー (黒) の勝利！";
  } else if (blackCount < whiteCount) {
    resultMessage = "コンピュータ (白) の勝利！";
  } else {
    resultMessage = "引き分け！";
  }

  alert(resultMessage + "\n黒: " + blackCount + " 白: " + whiteCount);
}

function hasValidMoves(player) {
  for (let i = 0; i < cells.length; i++) {
    if (isValidMove(i, player)) {
      return true;
    }
  }
  return false;
}

function updateGameState() {
  if (isGameOver()) {
    setTimeout(() => {
      updateValidMoveHints();
      showResult();
    }, 500);
  } else if (currentPlayer === 1) {
    setTimeout(() => {
      updateValidMoveHints();
      makeComputerMove();
    }, 500);
  } else {
    setTimeout(() => {
      updateValidMoveHints();
    }, 500);
  }
}

initializeBoard();