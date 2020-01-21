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

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	for (i = 0; i < HEIGHT; i++) {
		board[i] = [];
		for (j = 0; j < WIDTH; j++) {
			board[i][j] = null;
		}
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const htmlBoard = document.getElementById('board');

	// TODO: add comment for this code
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
	// TODO: write the real version of this, rather than always returning 0'

	// Loop through rows for given column from (HEIGHT-1) to 0.
	// Return the first null value.

	//

	for (let row = HEIGHT - 1; row >= 0; row--) {
		let spot = document.getElementById(`${row}-${x}`);
		if (spot.innerHTML === '') {
			//console.log('placing piece at row ' + row + ' col ' + x);
			return row;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell
	const piece = document.createElement('div');
	piece.innerText = `${y}-${x}`; //temp
	if (currPlayer === 1) piece.setAttribute('class', 'piece p1');
	else piece.setAttribute('class', 'piece p2');
	document.getElementById(`${y}-${x}`).append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
	// TODO: pop up alert message
	alert(msg);
	// game over, prevent any more player actions
	document
		.getElementById('column-top')
		.removeEventListener('click', handleClick);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	const x = +evt.target.id;
	//console.log(`column ${x} clicked`);

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

	// check for tie
	// TODO: check if all cells in board are filled; if so call, call endGame

	function isRowFull(arr) {
		return arr.every(col => col !== null);
	}
	if (board.every(row => isRowFull(row))) {
		return endGame('Tie Game!');
	}

	// switch players
	// TODO: switch currPlayer 1 <-> 2
	// Next player's turn
	currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
	//console.log('Your turn, player ' + currPlayer);
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

	// TODO: read and understand this code. Add comments to help you.

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

makeBoard();
makeHtmlBoard();
