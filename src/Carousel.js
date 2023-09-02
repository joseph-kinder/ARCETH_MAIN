import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Carousel = ({ images }) => {
    const [currentImage, setCurrentImage] = useState(0);

    const handleNextImage = () => {
        setCurrentImage(currentImage === images.length - 1 ? 0 : currentImage + 1);
    };

    const handlePrevImage = () => {
        setCurrentImage(currentImage === 0 ? images.length - 1 : currentImage - 1);
    };

    return(
        <div>
            <AnimatePresence>
                <motion.img
                    key={currentImage}
                    src={images[currentImage]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                />
            </AnimatePresence>
            <button onClick={handlePrevImage}>Prev</button>
            <button onClick={handleNextImage}>Next</button>
        </div>
    );
};

export default Carousel;
