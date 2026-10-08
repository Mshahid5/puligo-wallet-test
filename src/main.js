import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { bsc } from '@reown/appkit/networks'

const projectId = '4ff8f6787643ce8700ec07b4b2ec83dc'

const metadata = {
  name: 'PuliGo',
  description: 'PuliGo Web3 Gaming',
  url: window.location.origin,
  icons: [
    'https://puligo.xyz/favicon.ico'
  ]
}

const ethersAdapter = new EthersAdapter()

const appKit = createAppKit({
  adapters: [ethersAdapter],
  networks: [bsc],
  projectId,
  metadata
})

const button = document.getElementById('connect')
const status = document.getElementById('status')

button.addEventListener('click', async () => {
  try {
    status.textContent = 'Opening wallet...'
    await appKit.open()
  } catch (error) {
    console.error(error)
    status.textContent = 'Wallet connection failed'
  }
})
