//
// Blackjack
// By ME!
let deck = []
let playerCards = []
let dealerCards = []
let playerCard
let dealerCard
let suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades']
let values = ['Ace', 'King', 'Queen', 'Jack', 10, 9, 8, 7, 6, 5, 4, 3, 2]
let sumOfPlayerCards
let sumOfDealerCards
let playerHandString = []
let dealerHandString = []
let playerNumberOfCards = 1
let dealerNumberOfCards = 1
let playerValue = document.getElementById('playerValue')
let dealerValue = document.getElementById('dealerValue')
let status = document.getElementById('status')
let newGame = document.getElementById('newGame')
let stand = document.getElementById('stand')
let numberOfCards = 52
let dealerZone = document.getElementById('dealer')
let playerZone = document.getElementById('player')
let draw = null
let hitButton = document.getElementById('hitButton')
let playerHasAce = null
let playerHadAce = null
let playerMoney = 1000
let playerPocket = document.getElementById('playerPocket')
let betButton = document.getElementById('bet')
let bet = null
let winnings = null
let inGame = null
let currentBet = document.getElementById('currentBet')
let imgBasePath = '../imgs/'

// Creating a deck

function createDeck () {
  deck = []
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      // calc is the nummerical value of the card
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx],
        calc: values[valueIdx],
        img: null
      }
      if (card.value === 'King' || card.value === 'Queen' || card.value === 'Jack') {
        card.calc = 10
      } else if (card.value === 'Ace') {
        card.calc = 11
      } else {
        card.calc = card.value
      }
      deck.push(card)
      card.img = imgBasePath + deck.indexOf(card) + '.png'
    }
  }
  console.log(deck)
  return deck
}
function testDealersHand (sumOfDealerCards) {
  sumOfDealerCards = 0
  draw = 0
  for (let i = 0; i < dealerCards.length; i++) {
    sumOfDealerCards += dealerCards[i].calc
  }

  if (sumOfDealerCards >= 16 && sumOfDealerCards < sumOfPlayerCards) {
    console.log('Here!')
    status.innerText = 'You win!'
    calculatePlayerWinnings()
    hideButtons()
  } else if (sumOfDealerCards > 16 && sumOfDealerCards > sumOfPlayerCards && sumOfDealerCards < 22) {
    status.innerText = 'You lose!'
    calculatePlayerLoss()
    hideButtons()
    return draw
  } else if (sumOfDealerCards < 16) {
    draw = 1
    return draw
  } else if (sumOfDealerCards > 21) {
    status.innerText = 'Dealer busted, you win!'
    calculatePlayerWinnings()
    hideButtons()
  } else if (sumOfDealerCards >= 16 && sumOfDealerCards === sumOfPlayerCards) {
    status.innerText = 'It\'s a draw'
    playerMoney += bet
    hideButtons()
  }
}

function dealCardToDealer (deck, numberOfCards) {
  draw = testDealersHand()
  if (draw === 1) {
    dealerCard = Math.floor(Math.random() * numberOfCards) // draws a random card from deck
    dealerCards.push(deck[dealerCard])
    dealerNumberOfCards = dealerCards.length
    dealerNumberOfCards -= 1
    deck.splice(dealerCard, 1)
    numberOfCards -= 1
    dealerHandString.push(dealerCards[dealerNumberOfCards].value + ' of ' + dealerCards[dealerNumberOfCards].suit)
    dealerZone.innerText = dealerHandString
    sumOfDealerCards = calculateDealerHand(dealerCards)
    dealerValue.innerText = sumOfDealerCards
    testDealersHand()
    // return deck, dealerCards, dealerNumberOfCards
  } else if (draw === 0) {
    hideButtons()
  }
}

function dealCardToPlayer (deck, numberOfCards, playerHasAce) {
  playerCard = Math.floor(Math.random() * numberOfCards) // draws a random card from deck
  playerCards.push(deck[playerCard])
  playerNumberOfCards = playerCards.length
  playerNumberOfCards -= 1
  deck.splice(playerCard, 1)
  numberOfCards -= 1
  playerHandString.push(playerCards[playerNumberOfCards].value + ' of ' + playerCards[playerNumberOfCards].suit)
  playerZone.innerText = playerHandString
  sumOfPlayerCards = calculatePlayerHand(playerCards, playerHasAce)
  playerValue.innerText = sumOfPlayerCards
  // return deck, playerCards;
}

function calculatePlayerHand (playerCards, playerHasAce) {
  sumOfPlayerCards = 0
  for (let i = 0; i < playerCards.length; i++) {
    sumOfPlayerCards += playerCards[i].calc
  }
  if (sumOfPlayerCards === 21) {
    status.innerText = 'You win'
    calculatePlayerWinnings()
    hideButtons()
  } else if (sumOfPlayerCards > 21) {
    playerHasAce = checkPlayerForAces(playerCards, sumOfPlayerCards)
    if (playerHasAce === 0) {
      status.innerText = 'You\'ve busted'
      calculatePlayerLoss()
      hideButtons()
    } else if (playerHasAce === 1 && playerHadAce === 1) {
      status.innerText = 'You\'ve busted'
      calculatePlayerLoss()
      hideButtons()
    } else if (playerHasAce === 1) {
      playerCards = playerHasAceAndBusted(playerCards)
      sumOfPlayerCards = 0
      for (let i = 0; i < playerCards.length; i++) {
        sumOfPlayerCards += playerCards[i].calc
      }
      playerHadAce = 1
    }
  }
  return sumOfPlayerCards
}

function calculatePlayerWinnings () {
  winnings += (bet * 2)
  playerMoney += winnings
  resetWinningsAndBet()
  printPlayerMoney()
  printPlayerBet()
}

function calculatePlayerLoss () {
  winnings += bet
  resetWinningsAndBet()
  printPlayerMoney()
  printPlayerBet()
}

function resetWinningsAndBet () {
  winnings = null
  bet = null
}

function playerHasAceAndBusted (playerCards) {
  for (let i = 0; i < playerCards.length; i++) {
    if (playerCards[i].value === 'Ace') {
      playerCards[i].calc = 1
    }
  }
  return playerCards
}

function checkPlayerForAces (playerCards, playerHasAce) {
  playerHasAce = 0
  for (let i = 0; i < playerCards.length; i++) {
    if (playerCards[i].value === 'Ace') {
      playerCards[i].calc = 1
      playerHasAce = 1
    }
  }
  return playerHasAce
}

function calculateDealerHand (dealerCards) {
  sumOfDealerCards = 0
  for (let i = 0; i < dealerCards.length; i++) {
    sumOfDealerCards += dealerCards[i].calc
  }
  return sumOfDealerCards
}

function cleanVariables () {
  sumOfPlayerCards = null
  playerCards = []
  dealerCards = []
  playerHandString = []
  dealerHandString = []
  sumOfDealerCards = null
  numberOfCards = 52
  playerHasAce = null
}

function cleanStatus () {
  status.innerText = ''
}

function calculateWinningsFromBlackJack () {
  winnings = (bet * 1.5)
  playerMoney += winnings
  return playerMoney
}

function calculateLossFromBlackJack () {
  winnings = (bet * 1.5)
  playerMoney -= winnings
  return playerMoney
}

function testForBlackJack () {
  if (sumOfDealerCards === 21 && sumOfPlayerCards === 21) {
    status.innerText = 'It\'s a draw! Bet has been repaid'
    playerMoney += bet
    hideButtons()
    printPlayerMoney()
  } else if (sumOfPlayerCards === 21) {
    status.innerText = 'Congrats! You have BlackJack'
    playerMoney = calculateWinningsFromBlackJack()
    hideButtons()
    printPlayerMoney()
  } else if (sumOfDealerCards === 21) {
    status.innerText = 'Dealer has BlackJack, you lose!'
    playerMoney = calculateLossFromBlackJack()
    hideButtons()
    printPlayerMoney()
  }
}

function hideButtons () {
  stand.style.visibility = 'hidden'
  hitButton.style.visibility = 'hidden'
}

function showButtons () {
  stand.style.visibility = 'visible'
  hitButton.style.visibility = 'visible'
}

function printPlayerBet () {
  currentBet.innerText = 'Your current bet is: ' + bet
}

// dealing initial cards and setting up game
function startNewGame () {
  deck = createDeck()
  cleanVariables()
  cleanStatus()
  showButtons()
  for (let playerHand = 0; playerHand <= 1; playerHand++) {
    // player
    playerCard = Math.floor(Math.random() * numberOfCards)
    playerCards.push(deck[playerCard])
    // removing card from deck
    deck.splice(playerCard, 1)
    console.log(playerCards[playerHand].img)
    let img = document.createElement('img')
    let src = document.getElementById('playerCardsZone')
    img.src = playerCards[playerHand].img
    src.appendChild(img)
    numberOfCards -= 1
    // dealer
    dealerCard = Math.floor(Math.random() * numberOfCards)
    dealerCards.push(deck[dealerCard])
    // removing card from deck
    deck.splice(dealerCard, 1)
    img = document.createElement('img')
    src = document.getElementById('dealerCardsZone')
    img.src = dealerCards[playerHand].img
    src.appendChild(img)
    numberOfCards -= 1

    sumOfPlayerCards = calculatePlayerHand(playerCards)
    sumOfDealerCards = calculateDealerHand(dealerCards)
    if (playerHand === 1) {
      testForBlackJack(sumOfPlayerCards, sumOfDealerCards)
      // printing player
      playerHandString.push('Player has: ' + playerCards[0].value + ' of ' + playerCards[0].suit + ' and ' + playerCards[1].value + ' of ' + playerCards[1].suit)
      playerZone.innerText = playerHandString
      playerValue.innerText = sumOfPlayerCards
      // printing dealer
      dealerHandString.push('Dealer has: ' + dealerCards[0].value + ' of ' + dealerCards[0].suit + ' and ' + dealerCards[1].value + ' of ' + dealerCards[1].suit)
      // dealerHandString.push("Total value: " + sumOfDealerCards);
      dealerZone.innerText = dealerHandString
      dealerValue.innerText = sumOfDealerCards
    }
  }
}

dealerZone.innerText = dealerHandString
playerZone.innerText = playerHandString

hitButton.addEventListener('click', function () {
  if (bet != null && inGame) {
    dealCardToPlayer(deck, numberOfCards, playerHasAce)
  } else if (bet === null) {
    status.innerText = 'You must place a bet'
  }
})

newGame.addEventListener('click', function () {
  if (bet != null) {
    inGame = true
    startNewGame()
  } else if (bet === null) {
    status.innerText = 'You must place a bet'
  }
})

stand.addEventListener('click', function () {
  testDealersHand()
  while (sumOfDealerCards < 16) {
    dealCardToDealer(deck, numberOfCards, sumOfPlayerCards)
  }
  testDealersHand()
})

function printPlayerMoney () {
  playerPocket.innerText = 'You have ' + playerMoney + ' chips'
}

betButton.addEventListener('click', function () {
  bet += 50
  playerMoney -= 50
  printPlayerMoney()
  printPlayerBet()
})
