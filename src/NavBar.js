import React from 'react';
import { Box, Button, Flex, Image, Link, Spacer } from '@chakra-ui/react'; 
import Facebook from "./assets/social-media-icons/facebook_32x32.png";
import Twitter from "./assets/social-media-icons/twitter_32x32.png";
import Email from "./assets/social-media-icons/email_32x32.png";
import { Link as RouteLink } from 'react-router-dom'
import LogoImage from "./assets/Firefly ARCETH-Dark Fantasy, Medieval weapons 40699 (1).png"

const NavBar = ({ accounts, setAccounts }) => {
	const isConnected = Boolean(accounts[0]);

	async function connectAccount() {
		if (window.ethereum) {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts"
			});
			setAccounts(accounts);
		}
	}


	return (
		<Flex justify='space-between' align='center' padding='10px 30px'>
			{/* Left Side - Social Media Icons */}


            {/* Center - Logo Image Link */}
			<Flex justify="space-around" width="30%" padding="0 100px">
				<Link
					as={RouteLink}
					to="/"
					_hover={{ textDecoration: 'none' }}>
					<Image src={LogoImage} alt="Logo" width="auto" height="0px"/>
				</Link>
			</Flex>


			{/* Right Side - Sections and Connect */}
			<Flex
				justify="space-around"
				align="center"
				width="40%"
				padding="30px">
				<Link as={RouteLink} to="/about" color = "#FF6F00" margin="0 15px" textDecoration="none">About</Link>
				<Spacer />
				<Box margin="0 15px" textAlign="center">
                    <Link as={RouteLink} to="/mint" color="#FF6F00" fontSize="xl" textDecoration="none">
                        <span style={{ whiteSpace: 'normal' }}>Mint Card</span>
                    </Link>
                </Box>
				<Spacer />
				<Box margin="0 15px" textAlign="center">
                    <Link as={RouteLink} to="/buypacks" color="#FF6F00" fontSize="xl" textDecoration="none">
                        <span style={{ whiteSpace: 'normal' }}>Buy Packs</span>
                    </Link>
                </Box>


				{/* Connect */}
				{isConnected ? (
					<Box margin="0 15px">Connected</Box>
				) : (
					<Button
						backgroundColor="#FF6F00"
						borderRadius="5px"
						boxShadow="0px 2px 2px 1px #0F0F0F"
						color="white"
						cursor="pointer"
						fontFamily="inherit"
						padding="15px"
						margin="0 15px"
						onClick={connectAccount}>Connect</Button>
				)}

			</Flex>
		</Flex>

	);
};

export default NavBar;