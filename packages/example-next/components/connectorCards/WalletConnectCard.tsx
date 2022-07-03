import { URI_AVAILABLE } from '@web3-react/walletconnect'
import { useEffect, useState } from 'react'
import { getAddChainParamsHex } from '../../chains'
import { hooks, walletConnect } from '../../connectors/walletConnect'
import { Card } from '../Card'
import { createLinkWalletSignature } from './createSig'

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

const sleep = (m: number) => new Promise((r) => setTimeout(r, m))

export default function WalletConnectCard() {
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()

  const isActive = useIsActive()

  const provider = useProvider()
  const ENSNames = useENSNames(provider)

  const [error, setError] = useState(undefined)
  const [spawnBug, setSpawnBug] = useState(false)

  const switchNetwork = () => {
    const params = getAddChainParamsHex(97)
    provider.send('wallet_addEthereumChain', [params]).then(console.log).catch(console.error)
  }

  const signData = async () => {
    if (spawnBug) {
      const response = await fetch('https://catfact.ninja/fact')
      const data = await response.json()
      console.log('cats response', data)
    }
    const msgParams = createLinkWalletSignature(chainId, 'sign:link-wallet', accounts[0])
    console.log('msgParams', msgParams)
    const res = await provider.send('eth_signTypedData_v4', [accounts[0], JSON.stringify(msgParams)])
    console.log('res', res)
  }

  useEffect(() => console.log('accounts', accounts?.[0]), [accounts])

  // log URI when available
  useEffect(() => {
    walletConnect.events.on(URI_AVAILABLE, (uri: string) => {
      console.log(`uri: ${uri}`)
    })
  }, [])

  // attempt to connect eagerly on mount
  useEffect(() => {
    walletConnect.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to walletconnect')
    })
  }, [])

  return (
    <>
      <Card
        connector={walletConnect}
        chainId={chainId}
        isActivating={isActivating}
        isActive={isActive}
        error={error}
        setError={setError}
        accounts={accounts}
        provider={provider}
        ENSNames={ENSNames}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button onClick={switchNetwork}>switch network</button>
        <div style={{ border: '1px solid black', margin: '12px 0', padding: '12px 6px' }}>
          <input type="checkbox" onChange={() => setSpawnBug(!spawnBug)} style={{ display: 'inline' }} />
          <p style={{ display: 'inline' }}>
            Cause iOS app store redirection issue for "sign data" request below (RPC API "eth_signTypedData_v4")
          </p>
        </div>
        <button onClick={signData}>sign data</button>
      </div>
    </>
  )
}
