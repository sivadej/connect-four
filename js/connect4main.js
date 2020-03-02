let boardCount=0; // running count used to generate unique id for each new game board

document.getElementById('start-game').addEventListener('click', () => {
	let p1 = new Player(document.getElementById('p1-color').value);
	let p2 = new Player(document.getElementById('p2-color').value);
	boardCount += 1;
	const newGame = new Game(boardCount, p1, p2);
	document.getElementById('games').append(newGame.renderBoardMarkup());
});