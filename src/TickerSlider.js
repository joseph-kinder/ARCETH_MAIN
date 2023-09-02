import React, { useEffect, useState } from "react";
import { Box, Avatar, Flex } from "@chakra-ui/react";
import Ticker from "infobae-react-ticker";
import './App.css'

const TickerSlider = ({images}) => {
  const [sliders, setSliders] = useState([0, 1, 2, 3, 4]);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    setInterval(() => {
      setSliders([...sliders, sliders.length]);
    }, 10000);
  });

  return (
    <Ticker move={!isHover} speed={3} height="100%">
      {() => (
        <Flex height="100%" alignItems="center" justifyContent = "center">
          {sliders.map((slider) => (
            <Box
              key={slider}
              mr="20px"
              onMouseOver={() => {
                console.log("isHover", isHover);
                setIsHover(true);
              }}
              onMouseLeave={() => {
                setIsHover(false);
              }}
            >
            <img
                src={images[slider % images.length]} // Use image URL from props
                alt={`Image ${slider}`}
                style={{objectFit: 'contain', transform: 'none'}}
                width="100%" // Adjust image size as needed
                height="100%"
            />
            </Box>
          ))}
        </Flex>
      )}
    </Ticker>
  );
};

export default TickerSlider;
