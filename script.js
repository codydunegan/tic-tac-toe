const TicTacToe = (() => {
    const _winningSelections = [
        [0, 1, 2], // row 1
        [3, 4, 5], // row 2
        [6, 7, 8], // row 3
        [0, 3, 6], // column 1
        [1, 4, 7], // column 2
        [2, 5, 8], // column 3
        [0, 4, 8], // diagonal tl -> br
        [2, 4, 6], // diagonal tr -> bl
    ];

    let _gameover = null;
    let _turn = null;

    let _currentPlayer = null;
    let _startingPlayer = null;
    let _vsComputer = false;

    let _player1 = null;
    let _player2 = null;

    const init = (aiopponent = true, player1IsX = true) => {
        _vsComputer = false;
        _gameover = false;
        _turn = 0;

        _player1 = Player("Player 1");

        if (aiopponent) {
            _player2 = AIOpponent();
            _vsComputer = true;
        }
        else {
            _player2 = Player("Player 2");
        }

        if (player1IsX) {
            _startingPlayer = _player1;
            _player1.setGamePiece("X");
            _player2.setGamePiece("O");
        }
        else {
            _startingPlayer = _player2;
            _player1.setGamePiece("O");
            _player2.setGamePiece("X");
        }

        Board.resetBoard();
        nextTurn();
    }

    const getCurrentPlayer = () => { return _currentPlayer }

    const nextTurn = () => {
        ++_turn;

        if (_turn == 1) {
            _currentPlayer = _startingPlayer;
        }
        else {
            if (_currentPlayer == _player1) {
                _currentPlayer = _player2;
            }
            else {
                _currentPlayer = _player1;
            }
        }

        if (_turn > 9) {
            Board.output(`Round over: Tie game!`);
        }
        else {
            Board.output(`${_currentPlayer.getName()}'s turn!`)

            if (_currentPlayer == _player2 && _vsComputer) {
                Board.getComputerChoice();
            }
        }
    }

    const checkWinner = () => {
        let p1Tiles = _player1.getTiles();
        let p2Tiles = _player2.getTiles();

        let winner = null;

        for (let i = 0; i < _winningSelections.length; i++) {
            let winingArray = _winningSelections[i];
            let p1Matches = 0;
            let p2Matches = 0;

            for (let j = 0; j < winingArray.length; j++) {
                if (p1Tiles.includes(winingArray[j])) {
                    ++p1Matches;

                    if (p1Matches >= 3) {
                        winner = _player1;
                        break;
                    }
                }

                if (p2Tiles.includes(winingArray[j])) {
                    ++p2Matches;

                    if (p2Matches >= 3) {
                        winner = _player2;
                        break;
                    }
                }
            }
        }


        if (winner == null) {
            nextTurn();
        }
        else {
            playerWon(winner);
        }
    }

    const playerWon = (winner) => {
        _gameover = true;
        Board.output(`${winner.getName()} wins! Game over!`);
    }

    const isGameOver = () => { return _gameover };

    return {init, checkWinner, getCurrentPlayer, isGameOver};
})();

const Board = (() => {
    const _defaultTiles = ["", "", "", "", "", "", "", "", ""];

    const resetBoard = () => {
        _tiles = [..._defaultTiles];

        renderTiles();
    }

    const renderTiles = () => {
        gameBoard.innerText = '';

        for (let i = 0; i < _tiles.length; i++) {
            let newTile = document.createElement('div');
            newTile.classList.add('tile');
            newTile.setAttribute('data-tile', i);

            if (_tiles[i] !== '') {
                let span = document.createElement('span');
                span.classList.add('iconify-inline');
                span.setAttribute('data-icon', `mdi:alpha-${_tiles[i].toLowerCase()}-box-outline`);

                newTile.appendChild(span);
            }

            newTile.addEventListener('click', handleTileClick);
            gameBoard.appendChild(newTile);
        }
    }

    const updateTile = (index) => {
        if (_tiles[index] !== '') return;
        if (TicTacToe.isGameOver()) return;

        let _currentPlayer = TicTacToe.getCurrentPlayer();
        _currentPlayer.getTiles().push(index);
        _tiles[index] = _currentPlayer.getGamePiece();

        renderTiles();
        TicTacToe.checkWinner();
    }

    const output = (message) => {
        infoOutput.innerText = message;
    }

    const getComputerChoice = () => {
        let availableTiles = [];

        for (i = 0; i < _tiles.length; i++) {
            if (_tiles[i] == '') {
                availableTiles.push(i);
            }
        }

        let randomNumber = Math.floor(Math.random() * availableTiles.length);
        updateTile(availableTiles[randomNumber]);
    }

    return {resetBoard, renderTiles, updateTile, output, getComputerChoice};
})();

const Player = (name) => {
    let _gamePiece = null;
    let _tiles = [];

    const getName = () => { return name; };
    
    const setGamePiece = (piece) => {
        _gamePiece = piece;
    }

    const getGamePiece = () => {return _gamePiece; };

    const getTiles = () => {return _tiles};

    return {getName, setGamePiece, getGamePiece, getTiles};
}

const AIOpponent = () => {
    const {getName, setGamePiece, getGamePiece, getTiles} = Player("Computer");

    return {getName, setGamePiece, getGamePiece, getTiles};
}

const restartGame = () => {
    let aiopponent = true;
    let player1IsX = true;

    if (opponentSwitch.checked) {
        aiopponent = false;
    }

    if (gamepieceSwitch.checked) {
        player1IsX = false;
    }

    TicTacToe.init(aiopponent, player1IsX);
}

const switchOpponent = () => {
    restartGame();
}

const switchGamepiece = () => {
    restartGame();
}

const handleTileClick = (event) => {
    let target = event.currentTarget;
    let index = target.getAttribute('data-tile');

    Board.updateTile(parseInt(index));
}

const gameBoard = document.querySelector("#gameboard");

const opponentSwitch = document.querySelector("#opponentswitch");
opponentSwitch.addEventListener('click', switchOpponent);

const gamepieceSwitch = document.querySelector("#gamepieceswitch");
gamepieceSwitch.addEventListener('click', switchGamepiece);

const restartButton = document.querySelector("#reset");
restartButton.addEventListener('click', restartGame);

const infoOutput = document.querySelector("#info");

restartGame();