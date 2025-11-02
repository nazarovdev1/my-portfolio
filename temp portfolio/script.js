const BOARD_SIZE = 8;
let board = [];
let currentPlayer = 'player';
let selectedPiece = null;

function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    for (let row = 0; row < BOARD_SIZE; row++) {
        board[row] = [];
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;

            if ((row + col) % 2 === 1) {
                cell.classList.add('black');

                if (row < 3) {
                    board[row][col] = 'ai';
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'ai');
                    cell.appendChild(piece);
                } else if (row > 4) {
                    board[row][col] = 'player';
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'player');
                    cell.appendChild(piece);
                } else {
                    board[row][col] = null;
                }
            } else {
                board[row][col] = null;
            }

            cell.addEventListener('click', () => handleCellClick(row, col));
            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(row, col) {
    if (currentPlayer !== 'player') return;

    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

    if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
        clearSelection();
        return;
    }

    if (board[row][col] === 'player') {
        clearSelection();
        selectedPiece = { row, col };
        cell.classList.add('selected');
        highlightValidMoves(row, col);
    } else if (selectedPiece && isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        movePiece(selectedPiece.row, selectedPiece.col, row, col);
        clearSelection();
        currentPlayer = 'ai';
        setTimeout(makeAIMove, 600);
    }
}

function highlightValidMoves(row, col) {
    const directions = [[1, -1], [1, 1]];

    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
            if (!board[newRow][newCol]) {
                const targetCell = document.querySelector(`.cell[data-row="${newRow}"][data-col="${newCol}"]`);
                targetCell.classList.add('valid-move');
            }
        }
    }
}
let land = document.getElementById("land")
land.addEventListener("click", () => {
    window.location.href = "./ui dashboard/build/index.html";
    console.log(`ishladi`);
    
})
function clearSelection() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('selected', 'valid-move');
    });
    selectedPiece = null;
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    if (Math.abs(fromRow - toRow) !== 1 || Math.abs(fromCol - toCol) !== 1) return false;
    if (toRow < fromRow && board[fromRow][fromCol] === 'player') return false;
    if (board[toRow][toCol]) return false;
    return true;
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = null;

    const fromCell = document.querySelector(`.cell[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toCell = document.querySelector(`.cell[data-row="${toRow}"][data-col="${toCol}"]`);

    toCell.appendChild(fromCell.firstChild);

    if (Math.abs(fromRow - toRow) === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        board[midRow][midCol] = null;
        const midCell = document.querySelector(`.cell[data-row="${midRow}"][data-col="${midCol}"]`);
        midCell.innerHTML = '';
    }
}

function makeAIMove() {
    let possibleMoves = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === 'ai') {
                const directions = [[-1, -1], [-1, 1]];
                for (const [dr, dc] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;

                    if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
                        if (!board[newRow][newCol]) {
                            possibleMoves.push({ from: [row, col], to: [newRow, newCol] });
                        }
                    }
                }
            }
        }
    }

    if (possibleMoves.length > 0) {
        const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        const [fromRow, fromCol] = move.from;
        const [toRow, toCol] = move.to;

        movePiece(fromRow, fromCol, toRow, toCol);
        currentPlayer = 'player';
    }
}

createBoard();