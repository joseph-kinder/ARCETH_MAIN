import React from 'react';
import MainMint from './MainMint';
import NavBar from './NavBar';
import { Routes,  Route } from 'react-router-dom';
import { Heading, Button, Image, Box, Text } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block" 
        as="h2" 
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text">
        NFT Collection Name
      </Heading>

      <Text fontSize="18px" mt={3} mb={2}>
        Welcome to my NFT collection! 
      </Text>

      <Image 
        src="/images/nft-preview.png"
        size="350px"
        alt="NFT Preview"
      />

      <Text>
        My nft collection description here
      </Text>

      <Button 
        mt={6} 
        as="a" 
        href="/mint"
        bgGradient="linear(to-r, red.400,pink.400)"
        color="white"
        variant="solid">
        Mint your nft
      </Button>
    </Box>
  );
}