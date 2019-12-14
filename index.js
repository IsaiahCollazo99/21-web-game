const scores = {
    "KING": 10,
    "QUEEN": 10,
    "JACK": 10,
    "10": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
    "ACE": 1
}

const fetchData = async (url, callback) => {
    let res = await axios.get(url);
    callback(res.data);
}

const setScore = (hand) => {
    let cards = hand.querySelectorAll("li");
    let playerScore = document.createElement("h3");
    let gameSection = document.querySelector("#game");
    playerScore.innerText = 0;
    for(let i = 0; i < cards.length; i++) {
        playerScore.innerText = Number(playerScore.innerText) + cards[i].value;
    }
    if(Number(playerScore.innerText) > 21) {
        playerScore.innerText = "BUSTED";
        gameSection.appendChild(playerScore);
    } else {
        gameSection.appendChild(playerScore);
        gameSection.appendChild(hand);
    }
}

const createElements = async (deckId) => {
    let playerHand = document.createElement("ul");
    playerHand.id = "player";
    await fetchData(`https://deckofcardsapi.com/api/deck/${deckId.innerText}/draw/?count=2`, (data) => {
        data.cards.forEach(card => {
            let li = document.createElement("li");
            let img = document.createElement("img");
            img.src = card.image;
            li.appendChild(img);
            li.value = scores[card.value];
            playerHand.appendChild(li);   
        })
    });
    setScore(playerHand);
}

const isBust = (card) => {
    let playerScore = document.querySelector("h3");
    playerScore.innerText = Number(playerScore.innerText) + scores[card.value];
    if(Number(playerScore.innerText) > 21) {
        return true;
    } else {
        return false;
    }
}

const playerBust = () => {
    let playerHand = document.querySelector("#game");
    playerHand.parentNode.removeChild(playerHand);
    
    let playerScore = document.querySelector("h3");
    playerScore.innerText = "BUSTED";
}

const dealComputer = (data) => {
    debugger;
}

const computerTurn = () => {
    let computerHand = document.createElement("ul");
    computerHand.id = document.querySelector("#computer");
    let computerScore = document.createElement("h3");
    let game = document.querySelector("game");
    game.appendChild(computerScore);

    let deckId = document.querySelector("#deckId");
    fetchData(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`, dealComputer);
}

const playerDecision = (hit, stand) => {
    let deckId = document.querySelector("#deckId");
    hit.addEventListener("click", async () => {
        await fetchData(`https://deckofcardsapi.com/api/deck/${deckId.innerText}/draw/?count=1`, (data) => {
            let playerHand = document.querySelector("#player");
            let card = data.cards[0];
            let li = document.createElement("li");
            let img = document.createElement("img");
            img.src = card.image;
            li.appendChild(img); 
            li.value = scores[card.value];
            playerHand.appendChild(li);
            if(isBust(card)) {
                playerBust();
            }
        });
    })

    stand.addEventListener("click", () => {
        computerTurn();
    })
}

const displayButtons = () => {
    let decision = document.querySelector("#decision");
    let hit = document.createElement("button");
    hit.id = "hit";
    hit.innerText = "HIT";
    let stand = document.createElement("button");
    stand.id = "stand";
    stand.innerText = "STAND";
    decision.appendChild(hit);
    decision.appendChild(stand);
    playerDecision(hit, stand);
}

document.addEventListener("DOMContentLoaded", async () => {
    let deckId = document.querySelector("#deckId");
    let startButton = document.querySelector("#start");
    startButton.addEventListener("click", async () => {
        startButton.parentNode.removeChild(startButton);
        await fetchData("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1", (data) => {
            deckId.innerText = data.deck_id;
        });
        await createElements(deckId);
        displayButtons();
    })
})