import React from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';

const CardSection = ({ title, description, imageUrl, imageOnLeft }) => {
  const flexDirection = imageOnLeft ? 'row' : 'row-reverse';

  return (
    <Box className="glass" padding="2" maxWidth="1000px" mx="auto">
      <Flex align="center" flexDirection={flexDirection}>
        {imageOnLeft && (
          <Image src={imageUrl} height="600px" alt="Image" borderRadius="30px" mr="4" />
        )}
        <Flex direction="column" align="center">
          <Text fontSize="60" flex="1" fontWeight="bold 700">
            {title}
          </Text>
          <Box maxWidth="400px">
            <Text fontSize="20" flex="1">
              {description}
            </Text>
          </Box>
        </Flex>
        {!imageOnLeft && (
          <Image src={imageUrl} height="600px" alt="Image" borderRadius="30px" ml="4" />
        )}
      </Flex>
    </Box>
  );
};

export default CardSection;
