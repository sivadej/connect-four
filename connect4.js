/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// MODELS
// Game.board: contains array of board data
// VIEWS
// renderBoard
// showBoard
// animatePiece
// CONTROLLER METHODS
// findSpotForCol
// playPiece
// checkForWin
// handleClick

class Game {
	constructor(id, p1, p2, w = 7, h = 6) {
		this.players = [p1, p2];
		this.boardId = 'board'+id;
		this.width = w;
		this.height = h;
		this.board = this.createBoardArray();
		this.currPlayer = p1;
		this.renderBoardHtml();
		this.gameOver = false;
	}

	createBoardArray() {
		// Returns empty 2d array of Game width and height
		const boardArr = [];
		for (let row = 0; row < this.height; row++) {
			boardArr[row] = [];
			for (let col = 0; col < this.width; col++){
				boardArr[row][col]=null;
			}
		}
		return boardArr;
	}

	renderBoardHtml() {
		const games = document.getElementById('games');
		const newTable = document.createElement('table');
		newTable.setAttribute('id',this.boardId);
		newTable.classList.add('board');
		games.append(newTable);
		
		const board = document.getElementById(this.boardId);
		
		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement('tr');
		top.classList.add('column-top');
		top.addEventListener('click', this.handleClick.bind(this));

		for (let col = 0; col < this.width; col++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', col);
			top.append(headCell);
		}

		board.append(top);

		// make main part of board
		for (let row = 0; row < this.height; row++) {
			const tr = document.createElement('tr');

			for (let col = 0; col < this.width; col++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', this.getCoordinateId(row,col));
				tr.append(cell);
			}

			board.append(tr);
		}

		const deleteBtn = document.createElement('button');
		deleteBtn.innerText="Remove this Board";
		deleteBtn.classList.add('delete-btn');
		deleteBtn.addEventListener('click', this.removeBoard.bind(this));
		games.append(deleteBtn);
	}

	// Return id of spot
	// Example: Row 2, Col 1 in Board 1 will return #board1-row2-col1
	getCoordinateId(row, col){
		return(`#${this.boardId}-row${row}-col${col}`)
	}

	// Return next available row for given column
	getRowForCol(x) {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	placeInTable(y, x) {
		const piece = document.createElement('div');
		piece.classList.add('piece');
		piece.style.backgroundColor = this.currPlayer.color;
		//piece.style.top = -50 * (y + 2); //this was in existing code. what does it do?

		const spot = document.getElementById(this.getCoordinateId(y,x));
		spot.append(piece);
	}

	endGame(msg) {
		alert(msg);
		document.getElementById('column-top').removeEventListener('click', this.handleClick);
	}

	handleClick(evt) {
		// get x from ID of clicked cell
		const col = +evt.target.id;
		console.log(evt.target.id);

		// get next spot in column (if none, ignore click)
		const row = this.getRowForCol(col);
		if (row === null) {
			alert('This column is full!');
			//return;
		}

		// place piece in board and add to HTML table
		this.board[row][col] = this.currPlayer;
		this.placeInTable(row, col);

		// check for win
		if (this.checkForWin()) {
			return this.endGame(`${this.currPlayer.color} wins!`);
		}

		// check for tie
		if (this.board.every((row) => row.every((cell) => cell))) {
			return this.endGame('Tie!');
		}

		// switch players
		this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
	}

	checkForWin() {
		const _win = (cells) =>
			cells.every(
				([y, x]) => y >= 0 && y < this.height && x >= 0 && x < this.width && this.board[y][x] === this.currPlayer
			);

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
				const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
				const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
				const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

				// find winner (only checking each win-possibility as needed)
				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					return true;
				}
			}
		}
	}

	removeBoard() {
		console.log('removing ' + this.boardId);
		const thisBoard = document.getElementById(this.boardId);
		thisBoard.nextElementSibling.remove() // removes delete button
		thisBoard.remove();
	}
}

// TODO: Input player name
class Player {
	constructor(color) {
		this.color = color;
	}
}

let boardCount=0;
document.getElementById('start-game').addEventListener('click', () => {
	boardCount += 1;
	let p1 = new Player(document.getElementById('p1-color').value);
	let p2 = new Player(document.getElementById('p2-color').value);
	new Game(boardCount, p1, p2);
});