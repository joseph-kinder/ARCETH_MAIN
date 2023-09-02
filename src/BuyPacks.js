import { useState } from 'react';
import MainMint from './MainMint';
import NavBar from './NavBar';
import { Routes,  Route } from 'react-router-dom';
import { Box, Button, Flex, Image, Link, Spacer, Select, Stack, Heading, Text } from '@chakra-ui/react'; 

function BuyPacks() {

  const packs = [
    {
      name: 'Starter Pack',
      description: '5 random common cards',
      cards: 5, 
      price: 0.01 
    },
    { 
      name: 'Epic Pack',
      description: '3 random epic cards',
      cards: 3,
      price: 0.05
    }
    //...
  ];

  const [ownedPacks, setOwnedPacks] = useState([]);

  const BuyPack = (pack) => {
    
    async function buyPack(){

    }
    // Logic to buy pack using web3

    setOwnedPacks(prev => [...prev, pack]);
  }

  const [selectedPack, setSelectedPack] = useState(null);

  function handlePackSelect(event) {
    setSelectedPack(event.target.value);
  }

  return (
    <div>
      <Select 
        placeholder='Select pack to buy' 
        size='lg'
        onChange={handlePackSelect}
      >
        {packs.map(pack => (
          <option key={pack.id} value={pack.id}>{pack.name}</option>
        ))}
      </Select>

      <Stack spacing={6} align='center'>
        {selectedPack && (
          <>
            <Heading size='md'>{selectedPack.name} Pack</Heading>
            <Text>{selectedPack.description}</Text>
            <Button colorScheme='blue'>Buy Pack</Button>
          </>
        )}
      </Stack>
    </div>
  );
}

export default BuyPacks;