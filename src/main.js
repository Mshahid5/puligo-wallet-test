
import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { bsc } from '@reown/appkit/networks'

// Existing Reown wallet setup
const projectId = '4ff8f6787643ce8700ec07b4b2ec83dc'

const metadata = {
  name: 'PuliGo',
  description: 'PuliGo Web3 Gaming',
  url: window.location.origin,
  icons: ['https://puligo.xyz/favicon.ico']
}

const ethersAdapter = new EthersAdapter()

const appKit = createAppKit({
  adapters: [ethersAdapter],
  networks: [bsc],
  projectId,
  metadata
})

// Wallet connection — preserved
const connectButton = document.getElementById('connect')
const walletStatus = document.getElementById('status')

connectButton.addEventListener('click', async () => {
  try {
    walletStatus.textContent = 'Opening wallet...'
    await appKit.open()
    walletStatus.textContent =
      'Wallet window opened. Complete connection in your wallet.'
  } catch (error) {
    console.error('Wallet connection error:', error)
    walletStatus.textContent = 'Wallet connection failed.'
  }
})

// PuliGo Crash — demo mode only
const multiplierDisplay = document.getElementById('multiplier')
const gameMessage = document.getElementById('game-message')
const balanceDisplay = document.getElementById('balance')
const currencySelect = document.getElementById('currency')
const betInput = document.getElementById('bet-amount')
const startButton = document.getElementById('start-game')
const cashOutButton = document.getElementById('cash-out')
const gameStatus = document.getElementById('game-status')
const chartLine = document.getElementById('chart-line')
const historyDisplay = document.getElementById('history')

let demoBalance = 1000
let betAmount = 0
let multiplier = 1
let crashPoint = 1
let roundStartTime = 0
let roundTimer = null
let roundActive = false
let roundNumber = 0
let history = []

function updateBalance() {
  balanceDisplay.textContent = demoBalance.toFixed(2)
}

function updateChart(elapsedMs) {
  const x = Math.min(590, 10 + elapsedMs * 0.04)
  const y = Math.max(
    25,
    205 - Math.min(180, Math.log(multiplier) * 65)
  )

  chartLine.setAttribute('d', `M 10 205 L ${x} ${y}`)
}

function renderHistory() {
  historyDisplay.replaceChildren()

  if (history.length === 0) {
    historyDisplay.textContent = 'No rounds played yet.'
    return
  }

  history.forEach((item) => {
    const badge = document.createElement('span')
    badge.className = item.crashed
      ? 'history-item crashed'
      : 'history-item'
    badge.textContent = `#${item.number} · ${item.multiplier.toFixed(2)}×`
    historyDisplay.appendChild(badge)
  })
}

function finishRound(crashed) {
  if (!roundActive) return

  roundActive = false
  clearInterval(roundTimer)
  roundTimer = null
  cashOutButton.disabled = true
  startButton.disabled = false
  startButton.textContent = 'Play Again'

  if (crashed) {
    multiplier = crashPoint
    multiplierDisplay.textContent = `${multiplier.toFixed(2)}×`
    multiplierDisplay.style.color = '#ff737e'
    gameMessage.textContent = 'CRASH!'
    gameStatus.textContent =
      `Round ${roundNumber}: demo bet lost (${betAmount.toFixed(2)} credits).`
  }

  history.unshift({
    number: roundNumber,
    multiplier,
    crashed
  })

  history = history.slice(0, 10)
  renderHistory()
}

function startRound() {
  if (roundActive) return

  const amount = Number(betInput.value)

  if (!Number.isFinite(amount) || amount <= 0) {
    gameStatus.textContent = 'Enter a valid bet amount.'
    return
  }

  if (amount > 100) {
    gameStatus.textContent = 'Maximum demo bet is 100 credits.'
    return
  }

  if (amount > demoBalance) {
    gameStatus.textContent = 'Insufficient demo credits.'
    return
  }

  betAmount = amount
  demoBalance -= betAmount
  updateBalance()

  roundNumber += 1
  multiplier = 1
  // Random crash point for demonstration only.
  // This is NOT secure randomness for real-money gaming.
  crashPoint = 1.1 + Math.random() * 4.9
  roundStartTime = Date.now()
  roundActive = true

  multiplierDisplay.textContent = '1.00×'
  multiplierDisplay.style.color = '#36e0a1'
  gameMessage.textContent = 'Good luck!'
  gameStatus.textContent =
    `Round ${roundNumber} running · ${currencySelect.value} demo credits`
  chartLine.setAttribute('d', 'M 10 205')

  startButton.disabled = true
  cashOutButton.disabled = false

  roundTimer = setInterval(() => {
    if (!roundActive) return

    const elapsed = Date.now() - roundStartTime
    multiplier = Math.pow(1.035, elapsed / 100)

    if (multiplier >= crashPoint) {
      finishRound(true)
      return
    }

    multiplierDisplay.textContent = `${multiplier.toFixed(2)}×`
    updateChart(elapsed)
  }, 100)
}

function cashOut() {
  if (!roundActive) return

  // The demo pays the current multiplier before the crash.
  const payout = betAmount * multiplier
  demoBalance += payout
  updateBalance()

  gameMessage.textContent = `Cashed out at ${multiplier.toFixed(2)}×`
  gameStatus.textContent =
    `Demo payout: ${payout.toFixed(2)} credits · ` +
    `Profit: ${(payout - betAmount).toFixed(2)} credits`

  finishRound(false)
}

startButton.addEventListener('click', startRound)
cashOutButton.addEventListener('click', cashOut)

updateBalance()
renderHistory()
