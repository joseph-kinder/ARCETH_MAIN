// Balance.js

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Box, Grid, Heading, Text, Flex } from '@chakra-ui/react';

import nftContract from './ARCETHNFT.json';

const ArcETHaddress = '0xdfbd2ad9fa043692cb87ca24d784a1e9cce2c02e'

export default function Balance({ accounts, setAccounts }) {

  const [balances, setBalances] = useState({
    common: 0, 
    rare: 0,
    epic: 0,
    legendary: 0
  });

  useEffect(() => {
    const getBalances = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const nft = new ethers.Contract(ArcETHaddress, nftContract.abi, signer);
      
      const commonBalance = await nft.balanceOf(accounts, 0); 
      const rareBalance = await nft.balanceOf(accounts, 1);
      const epicBalance = await nft.balanceOf(accounts, 1);
      const legendaryBalance = await nft.balanceOf(accounts, 1);

      setBalances({
        common: commonBalance.toNumber(),
        rare: rareBalance.toNumber(),
        epic: epicBalance.toNumber(),
        legendary: legendaryBalance.toNumber()
      })
    }

    getBalances();
  }, []);

  return (
    <Flex justifyContent="center" align="center">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>

        <Box className="glass" maxW="300px" borderRadius="lg" overflow="hidden" p="4">
        <Heading as="h3" size="md">Common Pass</Heading>
        <Text>Balance: {balances.common}</Text>  
        </Box>

        <Box maxW="300px" borderWidth="1px" borderRadius="lg" overflow="hidden" p="4">
        <Heading as="h3" size="md">Rare Pass</Heading>
        <Text>Balance: {balances.rare}</Text>
        </Box>

        <Box maxW="300px" borderWidth="1px" borderRadius="lg" overflow="hidden" p="4">
        <Heading as="h3" size="md">Rare Pass</Heading>
        <Text>Balance: {balances.rare}</Text>
        </Box>  

        <Box maxW="300px" borderWidth="1px" borderRadius="lg" overflow="hidden" p="4">
        <Heading as="h3" size="md">Rare Pass</Heading>
        <Text>Balance: {balances.rare}</Text>
        </Box>    

        {/* Other rarity balances */}

        </Grid>

        <Box maxW="300px" borderWidth="1px" borderRadius="lg" overflow="hidden" p="4">
        <Heading as="h3" size="md">ARCETH</Heading> 
        <Text>Balance: {0} ARC</Text>
        </Box>

    </Flex>
  )

}