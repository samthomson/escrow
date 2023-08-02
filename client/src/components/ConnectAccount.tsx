import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'


export const injected = new InjectedConnector({ supportedChainIds: [1337] })

const formatAddress = (address: string) =>
    address.replace(/(.{9}).{3,}(.{7})/, '$1...$2')

export default function ConnectAccount() {
    const { account, activate } = useWeb3React<Web3Provider>()

    return (
        <div>
            {!account ? (
                <button
                    onClick={() => activate(injected)}
                >
                    Connect to MetaMask
                </button>
            ) : (
                <div>{formatAddress(account)}</div>
            )}
        </div>
    )
}
