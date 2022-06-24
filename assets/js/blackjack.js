let deck = [];
const suits = ["C", "D", "H", "S"]; // Clubs, Diamonds, Hearts, Spades (1 - 10)
const courtCards = ["A", "J", "Q", "K"]; // Ace, Jack, Queen, King


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

    deck = _.shuffle(deck);

    return deck;
}

createDeck();
