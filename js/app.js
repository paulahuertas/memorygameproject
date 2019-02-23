/*
 * Create a list that holds all of your cards
 */
let cardIcons = [
    'fa-diamond',
    'fa-diamond',    
    'fa-anchor',
    'fa-anchor',
    'fa-bolt',
    'fa-bolt',
    'fa-cube',
    'fa-cube',
    'fa-leaf',
    'fa-leaf',
    'fa-bicycle',
    'fa-bicycle',
    'fa-bomb',
    'fa-bomb',
    'fa-paper-plane-o',
    'fa-paper-plane-o'
];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


// list of all cards flipped in the game
let openCards = [];

// matched cards
let matchedCards = 0;

// tracks card pairing
let cardPair = [];

// shuffled deck
const shuffledCards = shuffle(cardIcons);

// rating performance
const stars = document.querySelector('.stars');
const starList = stars.querySelectorAll('i.fa-star');

// tracks player score
let playerScore = 3;

// timer
let gameTimer;

// boolean in case the timer has been started or not
let isTimerActive = false;

// to increase timer
let timerSeconds = 0,
timerMinutes = 0;

// tracks # of moves
let movesNum = 0;

// displays # of moves
let moves = document.querySelector('.moves');

// array of <i> for cards 
const emptyDeck = document.querySelectorAll('li.card > i');

const deck = document.querySelector('.deck');

// forms the deck using shuffle
for ( let i = 0; i < 16; i++ ) {
    const card = emptyDeck[i];
    const cardIcon = shuffledCards[i];
    card.classList.add(cardIcon);
}

// flips the card on click
function cardFlip (event) {
    startTimer();
    const card = event.target;

    // check if a card was clicked and wasn't already clicked
    if (card.classList.contains('card') && !card.classList.contains('clicked') && !card.classList.contains('match')) {
    
        const cardIdentifier = card.querySelector('i').getAttribute('class').split(' ')[1];
        
        card.classList.add('open', 'show');
    
        // if the cards match
        if (openCards.includes(cardIdentifier)) {
            cardPair.push(card);
            
            // applies matched color to card
            for ( let i = 0; i < 2; i++ ) {
                cardPair[i].classList.add('match', 'wiggle');
            }
            
            const clickedCards = document.querySelector('.clicked');
            clickedCards.classList.remove('clicked');
            
            matchedCards++;
            openCards = [];
            cardPair = [];        
            moveCounter();
            winCondition();

        // first click of match attempt
        } else if (openCards.length == 0) {
            card.classList.add('clicked', 'bounce');
            cardPair.push(card);
            openCards.push(cardIdentifier);
            setTimeout(() => {
                card.classList.remove('bounce');
            }, 500);

        // if cards don't match
        } else if (!openCards.length == 0) {
            cardPair.push(card);
            cardPair[0].classList.add('wrong', 'shake');
            cardPair[1].classList.add('wrong', 'shake');

            // hides cards after 1 second if not a match
            setTimeout(() => {
                const wrongCards = document.querySelectorAll('.wrong');
                for ( let i = 0; i < 2; i++ ) {
                    wrongCards[i].classList.remove('open', 'show', 'wrong', 'shake');
                }
            }, 1000);

            
            const clickedCards = document.querySelector('.clicked');
            clickedCards.classList.remove('clicked');

            openCards = [];
            cardPair = [];
            moveCounter();
        }
    }
}

function moveCounter () {
    movesNum++;
    moves.innerHTML = movesNum;

    // decrease star rating based on # of moves
    if (movesNum > 10 && movesNum <= 19) {
        starList[2].className = 'fa fa-star-o'
        playerScore = 2;
    } else if (movesNum > 22 && movesNum <= 25) {
        starList[1].className = 'fa fa-star-o'
        playerScore = 1;
    }  
}

deck.addEventListener('click', (event) => {
    cardFlip(event);
});

// to stop watch
function incrementTimer() {
    timerSeconds++;
    if(timerSeconds >= 60) {
        timerSeconds = 0;
        timerMinutes++;
    }
    const timerEl = document.querySelector('.timer');
    timerEl.textContent = (timerMinutes ? (timerMinutes > 9 ? timerMinutes : "0" + timerMinutes) : "00") + ":" + (timerSeconds > 9 ? timerSeconds : "0" + timerSeconds);
    timer();
}

function timer() {
    gameTimer = setTimeout(incrementTimer, 1000);
}

function startTimer() {
    if (!isTimerActive) {
        isTimerActive = true;
        timer();
    }
}

function winCondition () {
    if (matchedCards === 8) {
        const modal = document.querySelector('.modal');
        const time = document.querySelector('.timer').textContent;
        const moves = document.querySelector('.moves').textContent;
        const cards = document.querySelectorAll('.card');
        
        // add animation to all cards
        for (let i = 0; i < 16; i++) {
            cards[i].classList.add('winWiggle');
        }
        
        // to stop timer
        clearTimeout(gameTimer);

        // modal
        const modalHeading = document.querySelector('.modalHeading');
        const modalStars = document.querySelector('.modalStars');
        const modalStarsList = modalStars.querySelectorAll('i.fa-star-o');
        const modalText = document.querySelector('.modalWindow > p');
        const modalMoves = document.querySelector('.modalMoves');
        const modalTime = document.querySelector('.modalTime');
        const modalButton = document.querySelector('.modalButton')


        // Message Based on Player Score
        swal({
        title: "Good job!",
        text: "See your score and moves for this game, press the  yellow button to continue with the fun!",
        icon: "success",
        });

        switch (playerScore) {
            case 3:
                modalHeading.textContent = 'Congratulations You Have a Perfect Score!'
                break;
            case 2:
                modalHeading.textContent = 'Terrific Score!'
                break;
            case 1:
                modalHeading.textContent = 'Awesome Score!'
                break;
            case 0:
                modalHeading.textContent = 'Keep Trying!'
                break;
        }

        // shows moves and time
        modalMoves.textContent = moves;
        modalTime.textContent = time;

        // modalButton.addEventListener('click', location.reload());

        setTimeout(() => {
            modal.style.display = 'block';
            modal.classList.add('fadein-down');
            
            
            setTimeout(() => {
                modalHeading.style.display = 'block';
                modalHeading.classList.add('fadein-down');
            }, 500);

            // score with the stars
            setTimeout(() => {
                let i = 0;

                modalStars.style.display = 'block';
                modalStars.classList.add('fadein-down');

                function displayScore () {
                    if (playerScore > 0) {
                        setTimeout(() => {
                            modalStarsList[i].className = 'fa fa-star pop';
                            i++;
                            if (i < playerScore) {
                                displayScore();
                            }
                        }, 250);
                    }
                }
                setTimeout(displayScore, 700);
            }, 800);

            
            setTimeout(() => {
                modalText.style.display = 'block';
                modalText.classList.add('fadein')
            }, 1750)
            
            // button to play again
            setTimeout(() => {
                modalButton.style.display = 'block';
                modalButton.classList.add('fadein')
            }, 2250)
            
        }, 2000);
    }
}


function restartGame () {
    document.querySelector('.modalButton').addEventListener('click', () => {
        location.reload();
    });
    document.querySelector('.restart').addEventListener('click', () => {
        location.reload();
    });
}

restartGame();