import { useState, useEffect } from "react";
import {
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import { Contract, Signer, BrowserProvider, formatEther } from 'ethers';
import babyDogeAbi from '../abi/babyDoge.json'
import bnbAbi from '../abi/bnb.json'

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function ConnectButton() {
    const [provider, setProvider] = useState<BrowserProvider>();
    const [signer, setSigner] = useState<Signer>();
    const [connected, setConnected] = useState<boolean>(false);
    const [account, setAccount] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [balance, setBalance] = useState<string>("0");
    const [babyBalance, setBabyBalance] = useState<string>("0");
    const [loadingBabyDogeBalance, setLoadingBabyDogeBalance] = useState<boolean>(true);
    const [loadingBnbBalance, setLoadingBnbBalance] = useState<boolean>(true);
    const babyDogeAddress = '0xAC57De9C1A09FeC648E93EB98875B212DB0d460B';
    const bnbAddress = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52';

    const handleConnectWallet = () => {
        if (!provider) return;
        if (!connected) {
            provider.send("eth_requestAccounts", []).then(async () => {
                const signer = await provider.getSigner(0);
                setSigner(signer);
                
                const address = await signer.getAddress();
                setAccount(address);

                setConnected(true);
            });
        } else {
            setAccount('');
            setSigner(undefined)
            setConnected(false);
        }
    }

    const accountChangedHandler = async (accounts: Array<string>) => {
        if (accounts[0] !== account) {
            setAccount(accounts[0]);
        }
    }

    const getBabyDogeBalance = async (address: string) => {
        console.log('Fetching baby')
        const contract = new Contract(babyDogeAddress,babyDogeAbi,provider);
        const balance = formatEther(await contract.balanceOf(address));
        setBabyBalance(balance);
        setLoadingBabyDogeBalance(false);
    }

    const getBnbBalance = async (address: string) => {
        console.log('Fetching bnb')
        const contract = new Contract(bnbAddress,bnbAbi,provider);
        const balance = formatEther(await contract.balanceOf(address));
        setBalance(balance);
        setLoadingBnbBalance(false);
    }

    useEffect(() => {
        if (window.ethereum) {
            const provider = new BrowserProvider(window.ethereum)
            setProvider(provider);
            window.ethereum.on('accountsChanged',accountChangedHandler)
        } else {
            setError("Please Install Metamask!!!");
        }
        return () => {
            window.ethereum?.removeListener("accountsChanged", accountChangedHandler);
        };
    },[])

    useEffect(() => {
        if(!provider || !connected) return;
        getBabyDogeBalance(account);
        getBnbBalance(account);
    },[account])

    return (
        <>
        <h1>Metamask Login</h1>
        {account ? (
            <Box
            display="block"
            alignItems="center"
            background="white"
            borderRadius="xl"
            p="4"
            width="300px"
            >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb="2"
            >
                <Text color="#158DE8" fontWeight="medium">
                Account:
                </Text>
                <Text color="#6A6A6A" fontWeight="medium">
                {`${account.slice(0, 6)}...${account.slice(
                    account.length - 4,
                    account.length
                )}`}
                </Text>
            </Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb="2"
            >
                <Text color="#158DE8" fontWeight="medium">
                BabyDoge Balance :
                </Text>
                <Text color="#6A6A6A" fontWeight="medium">
                {loadingBabyDogeBalance ? 'Loading' : babyBalance}
                </Text>
            </Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb="2"
            >
                <Text color="#158DE8" fontWeight="medium">
                BNB Balance:
                </Text>
                <Text color="#6A6A6A" fontWeight="medium">
                {loadingBnbBalance ? 'Loading' : balance}
                </Text>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
                <Button
                onClick={handleConnectWallet}
                bg="#158DE8"
                color="white"
                fontWeight="medium"
                borderRadius="xl"
                border="1px solid transparent"
                width="300px"
                _hover={{
                    borderColor: "blue.700",
                    color: "gray.800",
                }}
                _active={{
                    backgroundColor: "blue.800",
                    borderColor: "blue.700",
                }}
                >
                Disconnect Wallet
                </Button>
            </Box>
            </Box>
        ) : (
            <Box bg="white" p="4" borderRadius="xl">
            <Button
                onClick={handleConnectWallet}
                bg="#158DE8"
                color="white"
                fontWeight="medium"
                borderRadius="xl"
                border="1px solid transparent"
                width="300px"
                _hover={{
                borderColor: "blue.700",
                color: "gray.800",
                }}
                _active={{
                backgroundColor: "blue.800",
                borderColor: "blue.700",
                }}
            >
                Connect Wallet
            </Button>
            </Box>
        )}
        {error && <div>
            <p style={{color: 'red'}}>{error}</p>
        </div>}
        </>
    );
}
