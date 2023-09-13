import React from 'react';
import { Box, Button, Flex, Image, Link, ListItem, Spacer, List } from '@chakra-ui/react'; 
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


const components = [
	{
	  title: "Alert Dialog",
	  href: "/docs/primitives/alert-dialog",
	  description:
		"A modal dialog that interrupts the user with important content and expects a response."
	},
	{
	  title: "Hover Card",
	  href: "/docs/primitives/hover-card",
	  description: "For sighted users to preview content available behind a link."
	},
	{
	  title: "Progress",
	  href: "/docs/primitives/progress",
	  description:
		"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar."
	},
	{
	  title: "Scroll-area",
	  href: "/docs/primitives/scroll-area",
	  description: "Visually or semantically separates content."
	},
	{
	  title: "Tabs",
	  href: "/docs/primitives/tabs",
	  description:
		"A set of layered sections of content—known as tab panels—that are displayed one at a time."
	},
	{
	  title: "Tooltip",
	  href: "/docs/primitives/tooltip",
	  description:
		"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."
	}
  ]

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

				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
						<NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
								<li className="row-span-3">
									<NavigationMenuLink asChild>
									<a
										className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
										href="/"
									>
										<div className="mb-2 mt-4 text-lg font-medium">
										shadcn/ui
										</div>
										<p className="text-sm leading-tight text-muted-foreground">
										Beautifully designed components built with Radix UI and
										Tailwind CSS.
										</p>
									</a>
									</NavigationMenuLink>
								</li>
								<ListItem href="/docs" title="Introduction">
									Re-usable components built using Radix UI and Tailwind CSS.
								</ListItem>
								<ListItem href="/docs/installation" title="Installation">
									How to install dependencies and structure your app.
								</ListItem>
								<ListItem href="/docs/primitives/typography" title="Typography">
									Styles for headings, paragraphs, lists...etc
								</ListItem>
								</ul>
							</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
							<NavigationMenuTrigger>Components</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
								<List>
								{components.map(component => (
									<ListItem
									key={component.title}
									title={component.title}
									href={component.href}
									>
									{component.description}
									</ListItem>
								))}
								</List>
								</ul>
							</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
							<Link href="/docs" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								Documentation
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>			

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