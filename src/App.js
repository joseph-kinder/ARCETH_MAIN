import { useState, useEffect } from 'react';
import './App.css';
import MainMint from './MainMint';
import NavBar from './NavBar';
import BuyPacks from './BuyPacks';
import Home from './Home';
import Footer from './Footer';
import { useLocation, Routes, Route } from 'react-router-dom';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import images from './assets/example-cards/tickerimages'
import Ticker from 'framer-motion-ticker'



function App() {
    const [accounts, setAccounts] = useState([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const location = useLocation();

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
        setIsPlaying(false); // Stop the ticker
    };
      
    const handleMouseLeave = () => {
        setHoveredIndex(null);
        setIsPlaying(true); // Continue playing the ticker
    };

    return (
        <div className="overlay background">
            <div className="App">
                <NavBar accounts={accounts} setAccounts={setAccounts} />
                <Flex direction="column" justifyContent="center" align="center" height="100vh">
                    {location.pathname === "/" && (
                        <div>
                            <Flex direction="column" align="center" style={{marginTop:"-100px"}}>
                                <Text fontSize="100px" fontWeight = "bold 700" fontFamily="DM Sans" >
                                    ArcaneETH
                                </Text>
                            </Flex>                        
                            <div style={{position: 'relative'}}>
                                <Ticker 
                                    duration={20} 
                                    onMouseEnter={() => setIsPlaying(false)} 
                                    onMouseLeave={() => setIsPlaying(true)} 
                                    isPlaying={isPlaying}
                                >
                                    {images.map((item, index) => (
                                    <div
                                        key={index}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={handleMouseLeave}                                  
                                        style={{
                                            position: 'relative',
                                            zIndex: hoveredIndex === index ? 2 : 1,
                                            margin: '5px',
                                            height: hoveredIndex === index ? '400px' : '333px', 
                                            width: hoveredIndex === index ? '266px' : '200px',
                                            backgroundImage: `url(${item})`, // Set the background image
                                            backgroundSize: 'cover',
                                            borderRadius: '21px',
                                            transition: 'height 0.3s ease, width 0.3s ease',
                                        }}
                                    />
                                    ))}
                                </Ticker>
                            </div>
                            <Flex direction="column" align="center" >
                            <Text
                                    fontSize="30px"
                                    fontWeight="700"
                                    letterSpacing="-5.5%"
                                    fontFamily="DM Sans"
                                    textShadow="0 2px 2px #000000"
                                    >
                                    A new wave of trading card NFTs. The only limit is your imagination.
                                </Text> 
                            </Flex>
                        </div>
                    )}
                </Flex>
                <Routes>
                    <Route path="/home" element={<Home accounts={accounts} setAccounts={setAccounts} />} />
                    <Route path="/mint" element={<MainMint accounts={accounts} setAccounts={setAccounts} />} />
                    <Route path="/buypacks" element={<BuyPacks accounts={accounts} setAccounts={setAccounts} />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;