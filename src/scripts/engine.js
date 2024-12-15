const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById('score_points')
  },
  cardSprites: {
    avatar: document.getElementById('card-image'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type')
  },
  fieldCards: {
    player: document.getElementById('player-field-card'),
    computer: document.getElementById('computer-field-card')
  },
  playerSides: {
    player1: 'player-cards',
    player1Box: document.querySelector('#player-cards'),
    computer: 'computer-cards',
    computerBox: document.querySelector('#computer-cards')
  },
  actions: {
    button: document.getElementById('next-duel')
  }
}

const imagePath = './src/assets/icons/'

const cardData = [
  {
    id: 0,
    name: 'Blue Eyes White Dragon',
    type: 'Paper',
    img: `${imagePath}dragon.png`,
    winOf: [1],
    loseOf: [2]
  },
  {
    id: 1,
    name: 'Dark Magician',
    type: 'Rock',
    img: `${imagePath}magician.png`,
    winOf: [2],
    loseOf: [0]
  },
  {
    id: 2,
    name: 'Exodia',
    type: 'Scissors',
    img: `${imagePath}exodia.png`,
    winOf: [0],
    loseOf: [1]
  }
]

async function createCardImage(randomIdCard, fieldSide) {
  const cardImage = document.createElement('img')
  cardImage.setAttribute('height', '100px')
  cardImage.setAttribute('src', './src/assets/icons/card-back.png')
  cardImage.setAttribute('data-id', randomIdCard)
  cardImage.classList.add('card')

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener('click', () => {
      setCardsField(cardImage.getAttribute('data-id'))
    })

    cardImage.addEventListener('mouseover', () => {
      drawSelectCard(randomIdCard)
    })
  }

  return cardImage
}

async function showHiddenCardFildsImage(value) {
  if (value === 'true') {
    state.fieldCards.player.style.display = 'block'
    state.fieldCards.computer.style.display = 'block'
  } else {
    state.fieldCards.player.style.display = 'none'
    state.fieldCards.computer.style.display = 'none'
  }
}

async function hiddenCardDetails() {
  state.cardSprites.name.innerText = ''
  state.cardSprites.type.innerText = ''
  state.cardSprites.avatar.src = ''
}

async function setCardsField(cardId) {
  await removeAllCardsImages()
  let computerCardId = await getRandomCardId()
  hiddenCardDetails()

  showHiddenCardFildsImage(true)

  state.fieldCards.player.style.display = 'block'
  state.fieldCards.computer.style.display = 'block'
  state.fieldCards.player.src = cardData[cardId].img
  state.fieldCards.computer.src = cardData[computerCardId].img

  let duelResults = await checkDuelResults(cardId, computerCardId)

  await updateScore()
  await drawButton(duelResults)
}

async function updateScore() {
  state.score.scoreBox.innerText = `Wins: ${state.score.playerScore} | Loses: ${state.score.computerScore}`
}

async function drawButton(text) {
  state.actions.button.innerText = text
  state.actions.button.style.display = 'block'
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = 'Empate'
  let playerCard = cardData[playerCardId]

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = 'Ganhou'
    state.score.playerScore++
    playSound('win')
  } else if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = 'Perdeu'
    state.score.computerScore++
    playSound('lose')
  }
  return duelResults
}

async function removeAllCardsImages() {
  state.playerSides.computerBox
    .querySelectorAll('img')
    .forEach(img => img.remove())

  state.playerSides.player1Box
    .querySelectorAll('img')
    .forEach(img => img.remove())
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img
  state.cardSprites.name.innerText = cardData[index].name
  state.cardSprites.type.innerText = 'Attribute: ' + cardData[index].type
}

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length)
  return cardData[randomIndex].id
}

async function drawCards(cardsQuantity, fieldSide) {
  for (let index = 0; index < cardsQuantity; index++) {
    const randomIdCard = await getRandomCardId()
    const cardImage = await createCardImage(randomIdCard, fieldSide)
    console.log(cardImage)
    document.getElementById(fieldSide).appendChild(cardImage)
  }
}

async function resetDuel() {
  state.cardSprites.avatar.scr = ''
  state.actions.button.style.display = 'none'

  state.fieldCards.player.style.display = 'none'
  state.fieldCards.computer.style.display = 'none'

  init()
}

async function playSound(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`)
  try {
    audio.play()
  } catch {}
}

function init() {
  showHiddenCardFildsImage('false')
  drawCards(5, state.playerSides.player1)
  drawCards(5, state.playerSides.computer)
  const bgm = document.getElementById('bgm')
  bgm.play()
  bgm.volume = 0.09
}

init()
