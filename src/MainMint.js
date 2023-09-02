import {useState} from 'react';
import { ethers, BigNumber} from 'ethers';
import ArcETHNFT from './ARCETHNFT.json';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';

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
		<Flex justify="center" align="center" height="100vh" paddingBottom="150px">
			<Box width="520px">
			<div>
				<Text fontSize="48px" textShadow="0 5px #000000">ArcaneETH</Text>
				<Text
					fontSize="30px"
					letterSpacing="-5.5%"
					fontFamily="VT323"
					textShadow="0 2px 2px #000000"
				>A new wave of trading card NFTs. The only limit is your imagination.</Text>
			</div>


			{isConnected ? (
				<div>
					<Flex align="center" justify="center">
						<div>
							<Input
								fontFamily="inherit"
								width="100px"
								height="40px"
								textAlign="center"
								paddingLeft="19px"
								marginTop="10px"
								type="text"
								value={prompt}
								onChange={e => setPrompt(e.target.value)}
							/>
						</div>
						<div>
							<Input
								fontFamily="inherit"
								width="100px"
								height="40px"
								textAlign="center"
								paddingLeft="19px"
								marginTop="10px"
								type='number' 
								value={rarity}
								onChange={e => setRarity(e.target.value)}
							/>
						</div>
					</Flex>
					<Button
						backgroundColor="#FF6F00"
						borderRadius="5px"
						boxShadow="0px 2px 2px 1px #0F0F0F"
						color='white'
						cursor='pointer'
						fontFamily='inherit'
						padding='15px'
						marginTop='10px'
						onClick={handleMint}
					>
						Mint Now
					</Button>
				</div>
			) : (
				<Text
					marginTop='70px'
					fontSize='30px'
					letterSpacing='-5.5%'
					fontFamily="VT323"
					textShadow='0 3px #000000'
					color="#FF6F00"
				>
					Please connect your wallet in order to mint.
				</Text>
			)}
			</Box>
		</Flex>
	);
};

export default MainMint;
