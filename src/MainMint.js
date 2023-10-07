import {useState} from 'react';
import { ethers, BigNumber} from 'ethers';
import ArcETHNFT from './ARCETHNFT.json';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import GlassBox from './components/GlassBox';
import { Input } from './components/Inputjs.js';

const ArcETHaddress = '0xdfbd2ad9fa043692cb87ca24d784a1e9cce2c02e'

const MainMint = ({ accounts, setAccounts}) => {
	const [mintAmount, setMintAmount] = useState(1);
	const isConnected = Boolean(accounts[0]);

	async function handleMint() {
		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				ArcETHaddress,
				ArcETHNFT.abi,
				signer
			);
			try {
				const response = await contract.mint(BigNumber.from(mintAmount), {
					value: ethers.utils.parseEther((0.02).toString())
				});
				console.log('response: ', response)
			} catch (err) {
				console.log('error: ', err)
			}
		}
	}

	const handleDecrement = () => {
		if (mintAmount <= 1) return;
		setMintAmount(mintAmount - 1);

	};
	const handleIncrement = () => {
		if (mintAmount >= 3) return;
		setMintAmount(mintAmount + 1);

	};

	const [prompt, setPrompt] = useState("");
	const [rarity, setRarity] = useState("");

	return (
		// Glass box that shows please connect wallet to mint if isConnected not true:
		<Flex justify="center" align="center" height="100vh" paddingBottom="150px">
			{isConnected ? (
				<Box className="glass" padding="2" maxWidth="1000px" mx="auto">
					<Flex align="center">
						<Input type="email" placeholder="Email" />
					</Flex>
				</Box>
			) : (
				<Box className="glass" padding="2" maxWidth="1000px" mx="auto">
					<Text fontSize="60" flex="1" fontWeight="bold 700">
						Please connect wallet to mint
					</Text>
				</Box>
			)
			}
		</Flex>
	);
};

export default MainMint;
