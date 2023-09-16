"use client"

import * as React from "react"
import { Link }from "@chakra-ui/react"

import { cn } from "../lib/utils"
import { Icons } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "./NavMenu"

const components = [
  {
    title: "Mint New Card",
    href: "/docs/primitives/alert-dialog",
    description:
      "Create your very own NFTs with our user-friendly minting process. Turn your creations into digital collectibles in just a few clicks."
  },
  {
    title: "Buy Packs",
    href: "/docs/primitives/hover-card",
    description: "The place to start! Buy a pack of cards and start trading!"
  },
  {
    title: "Opensea Marketplace",
    href: "/docs/primitives/progress",
    description:
      "Discover a selection of ArcETH NFTs, trade and buy."
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

export function NewNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
      <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About
            </NavigationMenuLink>
          </Link>
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
      </NavigationMenuList>
    </NavigationMenu>
  )
}

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
