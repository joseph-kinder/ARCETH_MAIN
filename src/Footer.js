// Footer.js

import { Text, Flex, Link, Image } from '@chakra-ui/react'
import Facebook from "./assets/social-media-icons/facebook_32x32.png";
import Twitter from "./assets/social-media-icons/twitter_32x32.png";
import Email from "./assets/social-media-icons/email_32x32.png";
import './App.css'

export default function Footer() {

  return (
    <Flex 
      as="footer"
      width="full"
      align="center"
      justify="space-between"
      padding="40px"
      background="gray.900"
      color="white"
    >
      {/* Social Icons */}
        <Flex justify="space-around" width="20%" padding="0 75px">
            <Link href='https://www.facebook.com'>
                <Image src={Facebook} boxSize="42px" margin="0 15px"/>
            </Link>
            <Link href='https://www.twitter.com'>
                <Image src={Twitter} boxSize="42px" margin="0 15px"/>
            </Link>
            <Link href='https://www.gmail.com'>
                <Image src={Email} boxSize="42px" margin="0 15px"/>
            </Link>
	    </Flex>

      {/* Copyright */} 
      <Text fontFamily="DM Sans" fontSize="sm">
        &copy; {new Date().getFullYear()} ArcaneETH. All rights reserved.
      </Text>
      
    </Flex>
  )
}