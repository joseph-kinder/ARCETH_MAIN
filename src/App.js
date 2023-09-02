import { useState, useEffect } from 'react';
import './App.css';
import MainMint from './MainMint';
import NavBar from './NavBar';
import BuyPacks from './BuyPacks';
import Home from './Home';
import { useLocation, Routes, Route } from 'react-router-dom';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
// import { Carousel } from 'react-responsive-carousel';
import Carousel from './Carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import image1 from './assets/example-cards/74fdb7f13498e0161eef058ea7558025.png';
import image2 from './assets/example-cards/44aec5a88437827c1edae998838a470a.png';
import image3 from './assets/example-cards/5949f4b2054fb20de5319ab5ca0c5b9c.png'
import Slideshow from './Slideshow';
import TickerSlider from './TickerSlider';




function App() {
    const [accounts, setAccounts] = useState([]);
    const images = [
        image1,
        image2,
        image3
    ]
    const location = useLocation();

    return (
        <div className="overlay background">
            <div className="App">
                <NavBar accounts={accounts} setAccounts={setAccounts} />
                <Routes>
                    <Route path="/home" element={<Home accounts={accounts} setAccounts={setAccounts} />} />
                    <Route path="/mint" element={<MainMint accounts={accounts} setAccounts={setAccounts} />} />
                    <Route path="/buypacks" element={<BuyPacks accounts={accounts} setAccounts={setAccounts} />} />
                </Routes>
                <Flex justify="center" align="center" height="100vh">
                    {location.pathname === "/" && <TickerSlider images={images}/>}
                    <Flex direction="column" align="center" >
                        <Text fontSize="48px" fontFamily="Press+Start+2P" textShadow="0 5px #000000">
                            ArcaneETH
                        </Text>
                        <Text
                            fontSize="30px"
                            letterSpacing="-5.5%"
                            fontFamily="VT323"
                            textShadow="0 2px 2px #000000">
                            A new wave of trading card NFTs. The only limit is your imagination.
                        </Text> 
                    </Flex>
                </Flex>
            </div>
        </div>
    );
}

export default App;