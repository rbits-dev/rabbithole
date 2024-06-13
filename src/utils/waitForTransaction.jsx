import { ethers } from 'ethers';

let provider;

if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
   window.alert('Please install MetaMask');
}

export const waitForTransaction = async (transactionHash) => {
    try {
        const receipt = await provider.waitForTransaction(transactionHash);
        return receipt;
    } catch (error) {
        throw error;
    }
}
