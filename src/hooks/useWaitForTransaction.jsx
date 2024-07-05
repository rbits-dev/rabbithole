import { createPublicClient, http } from 'viem'
import { mainnet, base, baseSepolia, sepolia } from 'viem/chains'
import { useAccount } from 'wagmi'


function useWaitForTransaction() {

    const networkList = {
        1: mainnet,
        11155111: sepolia,
        8453: base,
        84532: baseSepolia
    }

    const { chainId,isConnected } = useAccount()
    if(isConnected){
        var publicClient = createPublicClient({
            chain: networkList[chainId],
            transport: http()
        })
    }

    const waitForTransaction = async (hash) => {
        try {
            const result = await publicClient.waitForTransactionReceipt({ hash: hash })
            return result
        } catch (error) {
            throw error
        }
    }

    return {
        waitForTransaction
    }
}

export default useWaitForTransaction