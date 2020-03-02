class Player {
	constructor(color) {
		this.color = color;
	}
}
class Game {
	constructor(id, p1, p2, w = 7, h = 6) {
		this.players = [p1, p2];
		this.boardId = 'board'+id;
		this.width = w;
		this.height = h;
		this.board = this.createBoardArray();
		this.currPlayer = p1;
		this.renderBoardMarkup();
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

	renderBoardMarkup() {
		// Returns markup for board and clickable areas
		
		const boardContainer = document.createElement('div');
		boardContainer.classList.add('board-container');

		const newTable = document.createElement('table');
		newTable.setAttribute('id',this.boardId);
		newTable.classList.add('board');

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement('tr');
		top.classList.add('column-top');
		top.addEventListener('click', this.handleClick.bind(this));
		for (let col = 0; col < this.width; col++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', col);
			top.append(headCell);
		}
		newTable.append(top);

		// make main part of board
		for (let row = 0; row < this.height; row++) {
			const tr = document.createElement('tr');
			for (let col = 0; col < this.width; col++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', this.getCoordinateId(row,col));
				tr.append(cell);
			}
			newTable.append(tr);
		}

		// create button to remove own board
		const deleteBtn = document.createElement('button');
		deleteBtn.innerText = 'Remove this Board';
		deleteBtn.classList.add('delete-btn');
		deleteBtn.addEventListener('click', this.removeBoard.bind(this));

		const gameMsgElement = document.createElement('span');
		gameMsgElement.classList.add('game-message');

		boardContainer.append(newTable);
		boardContainer.append(deleteBtn);
		boardContainer.append(gameMsgElement);
		return boardContainer;
	}

	placeInTable(y, x) {
		const piece = document.createElement('div');
		piece.classList.add('piece');
		piece.style.backgroundColor = this.currPlayer.color;
		document.getElementById(this.getCoordinateId(y,x)).append(piece);
	}

	handleClick(evt) {
		// on click, place new piece. end game if win or tie. otherwise swap to other player's turn.
		this.updateBoardMessage('');

		// get column from ID of clicked cell.
		// assign next available spot in selected column
		const col = +evt.target.id;
		const row = this.getRowForCol(col);
		if (row === null) {
			this.updateBoardMessage('Column is full!');
			return;
		}

		// place piece in board and add to HTML table
		this.board[row][col] = this.currPlayer;
		this.placeInTable(row, col);

		// check for win
		if (this.checkForWin()) {
			this.disableBoard();
			return this.updateBoardMessage(`${this.currPlayer.color} wins!`);
		}

		// check for tie. Determines if all elements in array are non-null.
		if (this.board.every((row) => row.every((cell) => cell))) {
			this.disableBoard();
			return this.updateBoardMessage('Tie!');
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

	getRowForCol(x) {
		// Return next available row for given column
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	removeBoard() {
		const boardToRemove = document.getElementById(this.boardId).parentElement;
		boardToRemove.remove();
	}

	updateBoardMessage(msg) {
		document.getElementById(this.boardId).nextElementSibling.nextElementSibling.innerText = msg;
	}

	disableBoard() {
		document.querySelector(`#${this.boardId} .column-top`).remove();
	}

	getCoordinateId(row, col){
	// Return formatted id of spot on board
	// Example: Row 2, Col 1 in Board 1 will return #board1-row2-col1
		return(`#${this.boardId}-row${row}-col${col}`)
	}
}