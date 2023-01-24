//  Variable declaration
let volumeOn = true;
let singlePlayer = true;
let slotNames = ['topLeft', 'topCenter', 'topRight', 'middleLeft', 'middleCenter', 'middleRight', 'bottomLeft', 'bottomCenter', 'bottomRight'];
let remainingSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let gameOver = false;
let player1Turn = true;
let interval = true;
let winningSlots = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let player = 0;
let tie = 0;
let computer = 0;

// Finding elements for manipulating DOM
const volumeIcon = document.querySelector('.volumeIcon');
const multiplayerIcon = document.querySelector('.multiplayerIcon');
const player1 = document.querySelector('.player1');
const player2 = document.querySelector('.player2');
const playerSc = document.querySelector('.playerSc');
const tieSc = document.querySelector('.tieSc');
const computerSc = document.querySelector('.computerSc');
const resetIcon = document.querySelector('.resetIcon');
const boxes = document.querySelectorAll('.box');
// Showing popup box after winning
const popup = document.querySelector('.popup');
const msg = document.querySelector('.msg');
const msgBtn = document.querySelector('.msg-btn');

// Volume on off function
volumeIcon.addEventListener('click', () => {
    if (volumeOn) {
        volumeIcon.src = './media/audioOff.png';
        volumeOn = false;
    } else {
        volumeIcon.src = './media/audioOn.png';
        volumeOn = true;
    };
});

// Changing playing mode betwen single and multiplayer
multiplayerIcon.addEventListener('click', () => {
    if (singlePlayer) {
        multiplayerIcon.src = './media/multiPlayer.png';
        player1.innerHTML = 'Player1 :';
        player2.innerHTML = 'Player2 :';
        singlePlayer = false;
        player = tie = computer = 0;
        clear('modeChange');
        player1.classList.add('currentPlayer');
    } else {
        multiplayerIcon.src = './media/singlePlayer.png';
        player1.innerHTML = 'Player :';
        player2.innerHTML = 'Computer :';
        singlePlayer = true;
        player1Turn = true;
        player = tie = computer = 0;
        clear('modeChange');
    };
});

// Reseting game data
resetIcon.addEventListener('click', () => {
    resetIcon.classList.toggle('resetAnim');
    multiplayerIcon.src = './media/singlePlayer.png';
    player1.innerHTML = 'Player :';
    player2.innerHTML = 'Computer :';
    singlePlayer = true;
    player = tie = computer = 0;
    clear('reset');
})

// Playing sound for player 1
const playPlayer1Sound = () => {
    if (volumeOn) {
        const Player1Sound = new Audio();
        Player1Sound.src = './sounds/player1Sound.mp3';
        Player1Sound.volume = 0.3;
        Player1Sound.play();
    };
};
// Playing sound for player 2
const playPlayer2Sound = () => {
    if (volumeOn) {
        const Player2Sound = new Audio();
        Player2Sound.src = './sounds/player2Sound.mp3';
        Player2Sound.volume = 0.3;
        Player2Sound.play();
    };
};
// Playing sound after winning
const playWinningSound = () => {
    if (volumeOn) {
        const winnerSound = new Audio();
        winnerSound.src = './sounds/matchFinish.mp3';
        winnerSound.volume = 0.3;
        winnerSound.play();
    };
};
// Playing sound if match tie
const playTieSound = () => {
    if (volumeOn) {
        const tieSound = new Audio();
        tieSound.src = './sounds/tieSound.mp3';
        tieSound.volume = 0.3;
        tieSound.play();
    };
};

// Game logic for player 1 and player 2
boxes.forEach((box) => {
    box.addEventListener('click', (e) => {
        if (!gameOver) {
            if (player1Turn) {
                if (interval) {
                    interval = false;
                    setTimeout(() => {
                        interval = true;
                    }, 800);
                    if (e.target.value !== 'x' && e.target.value !== 'o') {
                        let x = document.createElement('img');
                        x.src = './media/X.png';
                        e.target.value = x.value = 'x';
                        box.appendChild(x);
                        playPlayer1Sound();
                        remainingSlots = remainingSlots.filter((slot) => {
                            return slot !== slotNames.indexOf(e.target.id);
                        });
                        checkWinner('x');
                        if (singlePlayer) {
                            setTimeout(() => {
                                computerTurn();
                            }, 500);
                        } else {
                            player1Turn = false;
                            player1.classList.remove('currentPlayer');
                            player2.classList.add('currentPlayer');
                            return 0;
                        };
                    };
                };
            };
            if (!player1Turn) {
                if (e.target.value !== 'x' && e.target.value !== 'o') {
                    let x = document.createElement('img');
                    x.src = './media/O.png';
                    e.target.value = x.value = 'o';
                    box.appendChild(x);
                    playPlayer2Sound();
                    remainingSlots = remainingSlots.filter((slot) => {
                        return slot !== slotNames.indexOf(e.target.id);
                    });
                    checkWinner('o');
                    player1Turn = false;
                    player1.classList.add('currentPlayer');
                    player2.classList.remove('currentPlayer');
                    player1Turn = true;
                };
            };
        } /* else if (gameOver) {
            clear();
            gameOver = false;
            remainingSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            // This function has replaced with msgBtn.addEventListener
        }; */
    });
});

// Function for computer turn for single mode
function computerTurn() {
    if (!gameOver) {
        let randomNumber = remainingSlots[Math.floor(Math.random() * remainingSlots.length)];
        remainingSlots = remainingSlots.filter((slot) => {
            return slot !== randomNumber;
        });
        let O = document.createElement('img');
        O.src = './media/O.png';
        boxes[randomNumber].value = O.value = 'o';
        boxes[randomNumber].appendChild(O);
        playPlayer2Sound();
        checkWinner('o');
    };
};

// Checking if someone wins or not
function checkWinner(params) {
    winningSlots.forEach((slot) => {
        if (!gameOver) {
            if (boxes[slot[0]].value === params && boxes[slot[1]].value === params && boxes[slot[2]].value === params) {
                slot.forEach((value) => {
                    boxes[value].childNodes[0].classList.add('win');
                });
                gameOver = true;
                playWinningSound();
                if (params === 'x') {
                    playerSc.innerHTML = player += 1;
                    if (singlePlayer) {
                        msg.innerHTML = 'Congratulations ! You won the match.';
                    } else {
                        msg.innerHTML = 'Congratulations Player1, You won the match.';
                    };
                };
                if (params === 'o') {
                    computerSc.innerHTML = computer += 1;
                    if (singlePlayer) {
                        msg.innerHTML = 'Oops ! You lost the match.';
                    } else {
                        msg.innerHTML = 'Congratulations Player2, You won the match.';
                    };
                };
                popup.classList.add('toggle');
            };
        };
    });
    if (remainingSlots.length < 1 && !gameOver) {
        for (let i = 0; i < 9; i++) {
            boxes[i].classList.add('tie');
        };
        gameOver = true;
        setTimeout(() => {
            playTieSound();
        }, 500);
        tieSc.innerHTML = tie += 1;
        msg.innerHTML = 'Oops ! No one wons, try again..';
        popup.classList.add('toggle');
    };
};

// Clearing everything incase of wins, tie, mode change and reset
function clear(params) {
    for (let i = 0; i < 9; i++) {
        boxes[i].value = '';
        boxes[i].classList.remove('tie');
        if (boxes[i].children[0]) {
            boxes[i].children[0].remove();
        };
    };
    remainingSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    if (popup.classList.contains('toggle')) {
        popup.classList.remove('toggle');
    };
    if (params) {
        playerSc.innerHTML = 0;
        tieSc.innerHTML = 0;
        computerSc.innerHTML = 0;
        player1.classList.remove('currentPlayer');
        player2.classList.remove('currentPlayer');
        gameOver = false;
    };
};
// Adding listener for game restart after game over
msgBtn.addEventListener('click', () => {
    clear();
    gameOver = false;
});