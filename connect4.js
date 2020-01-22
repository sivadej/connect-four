/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

makeBoard();
makeHtmlBoard();

// board = array of rows, each row is array of cells  (board[y][x])
function makeBoard() {
	for (i = 0; i < HEIGHT; i++) {
		board[i] = [];
		for (j = 0; j < WIDTH; j++) {
			board[i][j] = null;
		}
	}
}

// makeHtmlBoard: make HTML table and row of column tops.
function makeHtmlBoard() {
	const htmlBoard = document.getElementById('board');

	// create row of column tops with click handler
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	// append column tops based on board width
	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// create all game spots with xy coordinates as attributes
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
	for (let row = HEIGHT - 1; row >= 0; row--) {
		let spot = document.getElementById(`${row}-${x}`);
		if (spot.innerHTML === '') {
			return row;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
	const piece = document.createElement('div');
	if (currPlayer === 1) piece.setAttribute('class', 'piece p1');
	else piece.setAttribute('class', 'piece p2');
	document.getElementById(`${y}-${x}`).append(piece);
}

/** endGame: announce game end */
function endGame(msg) {
	alert(msg);
	// prevent any more player actions
	document
		.getElementById('column-top')
		.removeEventListener('click', handleClick);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
	// get x from ID of clicked cell
	const x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	const y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	placeInTable(y, x);

	// add line to update in-memory board
	board[y][x] = currPlayer;

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// Check if all cells in board are filled
	function isRowFull(arr) {
		return arr.every(col => col !== null);
	}
	if (board.every(row => isRowFull(row))) {
		return endGame('Tie Game!');
	}

	// switch players
	currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(
			([y, x]) =>
				y >= 0 &&
				y < HEIGHT &&
				x >= 0 &&
				x < WIDTH &&
				board[y][x] === currPlayer
		);
	}

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			const horiz = [
				[y, x],
				[y, x + 1],
				[y, x + 2],
				[y, x + 3]
			];
			const vert = [
				[y, x],
				[y + 1, x],
				[y + 2, x],
				[y + 3, x]
			];
			const diagDR = [
				[y, x],
				[y + 1, x + 1],
				[y + 2, x + 2],
				[y + 3, x + 3]
			];
			const diagDL = [
				[y, x],
				[y + 1, x - 1],
				[y + 2, x - 2],
				[y + 3, x - 3]
			];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

