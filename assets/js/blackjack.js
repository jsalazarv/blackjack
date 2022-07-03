const blackJack =  (() => {
    'use strict';
    let deck = [];
    const suits = ["C", "D", "H", "S"]; // Clubs, Diamonds, Hearts, Spades (1 - 10)
    const courtCards = ["A", "J", "Q", "K"]; // Ace, Jack, Queen, King
    const giveCardBtn = document.querySelector('#give-card-btn');
    const stopGameBtn = document.querySelector('#stop-game-btn');
    const newGameBtn = document.querySelector('#new-game-btn');
    const reloadGameBtn = document.querySelector('#reload-game');
    const gameOverMessage = document.querySelector('.game-over-message');
    const scores = document.querySelectorAll('.counter');
    const cardContainer = document.querySelectorAll('.card-container');
    const scoreboards = document.querySelectorAll('.counter-container h5');
    const logo = document.querySelector('.blackjack');
    const PLAYERS = {player: 'player', computer: 'computer'};
    let playersScore = [];

    const initializeGame = (numberOfPlayers = 2) => {
        deck = createDeck();
        playersScore = [];

        for(let i = 0; i < numberOfPlayers; i++) {
            playersScore.push(0);
        }

        scores.forEach(element => element.innerText = '0');
        cardContainer.forEach(element => element.innerHTML = '');

        scoreboards.forEach(element => element.classList.add('d-block'));

        giveCardBtn.disabled = false;
        stopGameBtn.disabled = false;

        giveCardBtn.classList.add('d-block');
        stopGameBtn.classList.add('d-block');
    }


    const createDeck = () => {
        for(let number = 2; number <= 10; number ++) {
            for(let suit of suits) {
                deck.push(number+suit);
            }
        }

        for(let suit of suits) {
            for(let figure of courtCards) {
                deck.push(figure+suit);
            }
        }

        return _.shuffle(deck);;
    }


    const giveCard = () => {
        if (deck.length === 0) {
            throw "No hay cartas en el deck";
        }

        return deck.pop();
    }

    const cardValue = (card) => {
        const value = card.substring(0, card.length -1);

        return (isNaN(value))
            ? ((value === 'A') ? 11 : 10)
            : (value * 1);
    }

    const playerScoreSum = (card, turn) => {
        playersScore[turn] = playersScore[turn] + cardValue(card);
        scores[turn].innerText = playersScore[turn];

        return playersScore[turn];
    }

    const renderCard = (card, turn) => {
        const cardImage = document.createElement('img');

        cardImage.src = `assets/images/cards/${card}.png`;
        cardImage.classList.add('playing-card');
        cardContainer[turn].append(cardImage);
    }

    const checkScore = (playerScore, computerScore) => {

        if(playerScore > 21) {
            return PLAYERS.computer;
        }

        if(computerScore > 21) {
            return PLAYERS.player;
        }

        if(playerScore > computerScore) {
            return PLAYERS.player;
        }

        if(playerScore < computerScore) {
            return PLAYERS.computer;
        }

        return null;
    }

    const reverseAnimations = () => {
        logo.classList.add('logo');
        gameOverMessage.classList.add('game-over');
        reloadGameBtn.classList.remove('d-none');
    }

    const displayMessages = () => {
        const [playerScore, computerScore] = playersScore;
        let winner = checkScore(playerScore, computerScore);

        if (winner === PLAYERS.computer) {
            reverseAnimations();
            return gameOverMessage.innerText = "¡PERDISTE!";
        }

        if (winner === PLAYERS.player) {
            confettii();
            reverseAnimations();
            return gameOverMessage.innerText = "¡GANASTE!";
        }

        reverseAnimations();
        return gameOverMessage.innerText = "¡EMPATE!";
    }

    const finishGame = () => {
        setTimeout(displayMessages, 10);
    }

    const computerGame = (minimumScore) => {
        let computerScore = 0;

        do {
            const card = giveCard();

            computerScore = playerScoreSum(card, playersScore.length -1);
            renderCard(card, playersScore.length -1);
        } while((computerScore < minimumScore) && (minimumScore <= 21));

        finishGame();
    }

    giveCardBtn.addEventListener('click', () => {
        const card = giveCard();
        const playerScore = playerScoreSum(card, 0);


        renderCard(card, 0);

        if(playerScore > 21) {
            giveCardBtn.disabled = true;
            stopGameBtn.disabled = true;

            computerGame(playerScore);
        } else if (playerScore === 21) {
            giveCardBtn.disabled = true;
            stopGameBtn.disabled = true;

            computerGame(playerScore);
        }
    });

    stopGameBtn.addEventListener('click', () => {
        giveCardBtn.disabled = true;
        stopGameBtn.disabled = true;

        computerGame( playersScore[0] );
    });

    newGameBtn.addEventListener('click', () => {
        initializeGame();
    });

    reloadGameBtn.addEventListener('click', () => {
        reloadGameBtn.classList.add('d-none');
        gameOverMessage.classList.remove('game-over');
        gameOverMessage.innerText = "";
        logo.classList.remove('logo');
        initializeGame();
    })

    return {
        checkScore,
        startGame: initializeGame
    };
})();
