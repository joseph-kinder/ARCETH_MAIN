import React from 'react';
import { Box, Button, Flex, Image, Link, ListItem, Spacer } from '@chakra-ui/react'; 
import Facebook from "./assets/social-media-icons/facebook_32x32.png";
import Twitter from "./assets/social-media-icons/twitter_32x32.png";
import Email from "./assets/social-media-icons/email_32x32.png";
import { Link as RouteLink } from 'react-router-dom'
import LogoImage from "./assets/Firefly ARCETH-Dark Fantasy, Medieval weapons 40699 (1).png"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle
  } from "./components/NavMenu.js"
import { NewNavigationMenu } from './components/NavBarComp';

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
				width="%"
				padding="30px">
				<NewNavigationMenu />

				{/* Connect */}
				{isConnected ? (
					<Box margin="0 15px">Connected</Box>
				) : (
					<Button
						backgroundColor="#FF6F00"
						borderRadius="5px"
						_hover={{ bg: '#AF4C00' }}
						color="white"
						cursor="pointer"
						fontFamily="inherit"
						fontSize="18"
						padding="15px"
						margin="0 15px"
						onClick={connectAccount}>Connect</Button>
				)}

			</Flex>
		</Flex>

	);
};

export default NavBar;