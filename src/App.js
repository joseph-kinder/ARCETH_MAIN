import { useState, useEffect } from 'react';
import './App.css';
import MainMint from './MainMint';
import NavBar from './NavBar';
import BuyPacks from './BuyPacks';
import Home from './Home';
import Balance from './Balance'
import Footer from './Footer';
import { useLocation, Routes, Route } from 'react-router-dom';
import { Box, Image, Button, Flex, Input, Text } from '@chakra-ui/react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import images from './assets/example-cards/tickerimages';
import backgroundim from './assets/background/newbackground.png';
import { FaDiscord } from 'react-icons/fa';
import GlassBox from './components/GlassBox';
import Ticker from 'framer-motion-ticker';
import Carousel from 'framer-motion-carousel';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';




function App() {
    const [accounts, setAccounts] = useState([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const location = useLocation();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    return (
        <Parallax pages={4}>
            <ParallaxLayer
            offset={0}
            speed={0.1}
            style={{
                height:'auto',
                backgroundImage: `url(${backgroundim})`,
                backgroundRepeat: 'repeat-y',
                backgroundSize: 'cover',
                /* Add your existing background styles here */
            }}
            />
        <div className="overlay">
            <div className="App">
                <ParallaxLayer factor={0.1} offset={0} speed={0.1} style={{zIndex:2}}>
                    <NavBar accounts={accounts} setAccounts={setAccounts}/>
                </ParallaxLayer>
                <ParallaxLayer offset={0.15} speed={0.2} style={{zIndex:1}}>
                    <Flex direction="column" justifyContent="center" align="center">
                        {location.pathname === "/" && (
                            <div>
                                <Flex direction="column" align="center" maxHeight="300px">
                                    <Text color="#e0e0e0" fontSize="124px" fontWeight = "bold 700" fontFamily="DM Sans" >
                                        ArcaneETH
                                    </Text>
                                </Flex>
                                <div>
                                    <a href="https://discord.com/" target="_blank" rel="noopener noreferrer">
                                        <Button 
                                            leftIcon={<FaDiscord />}
                                            backgroundColor="#FF6F00"
                                            borderRadius="10px"
                                            _hover={{ bg: '#AF4C00' }}
                                            color="white"
                                            cursor="pointer"
                                            fontFamily="inherit"
                                            fontSize="32"
                                            padding="15px"
                                            margin="0 15px"
                                            >Join the Discord now!</Button>   
                                    </a> 
                                </div>
                                <div style={{height:'50px'}}/>                        
                                <div>
                                    <Ticker 
                                        duration={40} 
                                        onMouseEnter={() => setIsPlaying(false)} 
                                        onMouseLeave={() => setIsPlaying(true)} 
                                        isPlaying={isPlaying}
                                        style={{overflow: 'visible'}}
                                    >
                                        {images.map((item, index) => (
                                            <div key={index}>

                                                <img
                                                    src={item}
                                                    onMouseEnter={() => setHoveredIndex(index)}
                                                    onMouseLeave={() => setHoveredIndex(null)}                              
                                                    style={{
                                                        //position: 'relative',
                                                        zIndex: hoveredIndex === index ? 1 : 0,
                                                        margin: '5px',
                                                        height: 'auto',
                                                        width: '220px',
                                                        borderRadius: '21px',
                                                        transform: hoveredIndex === index ? 'scale(1.5)' : 'none',
                                                        transition: 'transform 0.3s ease 0.3s',
                                                        // transformOrigin: 'center center',
                                                    }}
                                            />
                                            </div>
                                        ))}
                                    </Ticker>
                                </div>
                                <Flex direction="column" align="center" >
                                <Text
                                        fontSize="30px"
                                        fontWeight="700"
                                        letterSpacing="-5.5%"
                                        fontFamily="DM Sans"
                                        color="#e0e0e0"
                                        >
                                        A new wave of trading card NFTs. The only limit is your imagination.
                                    </Text> 
                                </Flex>
                                <Box className=" glass" padding="2" maxWidth="1000px" mx="auto">
                                    <Flex align="center">
                                        <Image src={images[5]} height="600px" alt="Image" borderRadius="30px" mr="4" />
                                        <Flex direction="column" align="center">
                                            <Text fontSize="60" flex="1" fontWeight="bold 700">
                                            AI-generated Masterpieces
                                            </Text>
                                            <Box maxWidth="400px">
                                                <Text fontSize="20" flex="1">
                                                Step into a realm where your imagination knows no bounds. With our platform, you have the power to bring your wildest ideas to life. Explore AI-generated masterpieces that are limited only by your creativity. Our advanced algorithms are at your service, ready to craft one-of-a-kind trading cards that encapsulate your unique vision. 
                                                </Text>
                                            </Box> 
                                        </Flex>
                                    </Flex>
                                </Box>
                                <div style={{ height: '50px'}}></div>
                                <Box className=" glass" padding="2" maxWidth="1000px" mx="auto">
                                    <Flex align="center">
                                        <Flex direction="column" align="center">
                                            <Text fontSize="60" flex="1" fontWeight="bold 700">
                                            Join Our Thriving Community
                                            </Text>
                                            <Box maxWidth="400px">
                                                <Text fontSize="20" flex="1">
                                                Become a part of our vibrant community, where collectors, creators, and AI enthusiasts come together to share their passion. Join our Discord community and connect with like-minded individuals who are equally passionate about NFT trading cards and the limitless possibilities of AI. 
                                                </Text>
                                            </Box> 
                                        </Flex>
                                        <Image src={images[6]} height = "600px" alt="Image" borderRadius="30px" mr="4" />

                                    </Flex>
                                </Box>
                            </div>
                        )}
                    </Flex>
                </ParallaxLayer>
                <ParallaxLayer offset={2.4} speed={0.2}>
                    <Flex direction="column" justifyContent="center" align="center">
                        <div style={{ width: 1000, height: 700 }}>
                        <Carousel autoPlay={false}>
                            {/* Card 1 */}
                            <div>
                                <GlassBox
                                title="Step 1: Choose Your Theme"
                                description="Select a theme or concept for your AI-generated trading card. Whether it's fantasy, sci-fi, or something entirely unique, the choice is yours."
                                imageUrl={images[5]} // Replace with the URL of your first card image
                                imageOnLeft={true} // Set to true for image on the left
                            />
                            </div>

                            {/* Card 2 */}
                            <div>
                            <GlassBox
                                title="Step 2: Customize Your Design"
                                description="Personalize your card's design by providing details and preferences. Our AI will use this information to create a one-of-a-kind masterpiece."
                                imageUrl={images[8]} // Replace with the URL of your second card image
                                imageOnLeft={false} // Set to false for image on the right
                                />
                            </div>

                            {/* Card 3 */}
                            <div>
                            <GlassBox
                                title="Step 3: Mint Your Card"
                                description="Once you're satisfied with the design, mint your AI-generated trading card as an NFT. Start or expand your collection with your unique creation."
                                imageUrl={images[7]} // Replace with the URL of your third card image
                                imageOnLeft={true} // Set to true for image on the left
                                />
                            </div>
                        </Carousel>
                        </div>
                    </Flex>
                </ParallaxLayer>

                <Routes>
                    <Route path="/home" element={<Home accounts={accounts} setAccounts={setAccounts} />} />
                    <Route path="/mint" element={<MainMint accounts={accounts} setAccounts={setAccounts} />} />
                    <Route path="/buypacks" element={<BuyPacks accounts={accounts} setAccounts={setAccounts} />} />
                    <Route path="/balance" element={<Balance accounts={accounts} setAccounts={setAccounts} />} />
                </Routes>
            </div>
            <ParallaxLayer 
                offset={4}
                speed={0} 
                style={{display: 'flex', alignItems: 'flex-end'}}
            >
                <Footer /> 
            </ParallaxLayer>
        </div>
    </Parallax>
    );
}

export default App;