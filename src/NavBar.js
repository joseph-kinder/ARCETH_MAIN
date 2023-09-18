import React, { useState } from 'react';
import './App.css';
import { Box, Button, Flex, Image, Link, Spacer, Text } from '@chakra-ui/react';
import { Link as RouteLink } from 'react-router-dom'
import LogoImage from "./assets/Firefly ARCETH-Dark Fantasy, Medieval weapons 40699 (1).png"
import { cn } from "./lib/utils"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle
  } from "./components/NavMenu"

const NavBar = ({ accounts, setAccounts }) => {

	const storedAccount = localStorage.getItem('connectedAccount');
	const [isConnected, setIsConnected] = useState(Boolean(storedAccount));

	async function connectAccount() {
		if (window.ethereum) {
		  const accounts = await window.ethereum.request({
			method: "eth_requestAccounts"
		  });
		  setAccounts(accounts);
		  setIsConnected(true); // Set the isConnected state to true after connecting

		  localStorage.setItem('connectedAccount', accounts[0])
		}
	  }
	
	const disconnect = () => {
		setIsConnected(false);
		localStorage.removeItem('connectedAccount');
	}

	return (
		<Flex justify='space-between' align='center' padding='10px 30px'>
			{/* Left Side - Social Media Icons */}
			<Flex className="h1" direction="column" align="center" maxHeight="300px">
				<Link as={RouteLink} to="/">
				<Text color="#e0e0e0" fontSize="48px" fontWeight = "bold 700" fontFamily="DM Sans" >
					ArcaneETH
				</Text>
				</Link>
			</Flex>


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
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
							Home
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
							About
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuTrigger>Market</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
									<li className="row-span-3">
										<NavigationMenuLink asChild>
										<a
											className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
											href="/buypacks"
										>
											<div className="mb-2 mt-4 text-lg font-medium">
											Buy Packs
											</div>
											<p className="text-sm leading-tight text-muted-foreground">
											The place to start! Buy a pack of cards and start trading!
											</p>
										</a>
										</NavigationMenuLink>
									</li>
									<ListItem href="/mint" title="Mint Cards">
									Create your very own NFTs with our user-friendly minting process. Turn your creations into digital collectibles in just a few clicks.
									</ListItem>
									<ListItem href="/docs/installation" title="OpenSea Marketplace">
									Discover a selection of ArcETH NFTs, trade and buy.
									</ListItem>
									<ListItem href="/docs/primitives/typography" title="ARCETH">
									Buy our native token on Pancakeswap!
									</ListItem>
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
						{isConnected ? (
							<NavigationMenuItem>
								<NavigationMenuTrigger>Wallet</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[300px]">
										<ListItem href="/collection" title="Your Collection">
										View your collection of NFTs.
										</ListItem>
										<ListItem href="/balance" title="Your Passes">
										View your pass balances.
										</ListItem>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						) : (
							<NavigationMenuItem>
								<Button
									backgroundColor="#FF6F00"
									borderRadius="5px"
									_hover={{ bg: '#AF4C00' }}
									color="white"
									cursor="pointer"
									fontFamily="inherit"
									fontSize="18"
									padding="15px"
									margin="0 1px"
									onClick={connectAccount}>Connect</Button>
							</NavigationMenuItem>
						)}
					</NavigationMenuList>
				</NavigationMenu>
			</Flex>
		</Flex>

	);
};

const ListItem = React.forwardRef(
	({ className, title, children, ...props }, ref) => {
	  return (
		<li>
		  <NavigationMenuLink asChild>
			<a
			  ref={ref}
			  className={cn(
				"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
				className
			  )}
			  {...props}
			>
			  <div className="text-sm font-medium leading-none">{title}</div>
			  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
				{children}
			  </p>
			</a>
		  </NavigationMenuLink>
		</li>
	  )
	}
  )
  ListItem.displayName = "ListItem"

export default NavBar;