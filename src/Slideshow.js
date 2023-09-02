import { motion, useAnimation } from 'framer-motion';
import './App.css';
import { useRef, useState } from 'react';

const Slideshow = ({ images }) => {
    const controls = useAnimation();

    const variants = {
      initial: {
        x: '110%', // Start the image off-screen to the right with a slight overlap
      },
      animate: {
        x: '-100%', // Animate the image to the left (off-screen to the left)
        transition: {
          duration: 10, // Adjust the duration for a slower movement
          ease: 'linear', // Use linear easing for a constant speed
        },
      },
    };
  
    const slideImages = async () => {
      while (true) {
        await controls.start('animate');
        await controls.start('initial');
      }
    };
  
    return (
      <motion.div
        className="image-slider"
        variants={variants}
        initial="initial"
        animate="animate"
        onAnimationComplete={slideImages}
        style={{
          display: 'flex',
          width: '100%', // Set the width to take the full available width
          height: '200px', // Set a hard limit for the height
          overflow: 'hidden', // Hide any content that overflows the container
        }}
      >
        {images.map((image, index) => (
          <motion.img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            style={{
              flex: '0 0 auto', // Allow the image to resize based on its content
              width: 'calc(100% - 10px)', // Each image takes the full container width with a slight gap
              height: 'auto', // Maintain the aspect ratio
              marginRight: '5px', // Add a slight gap between images
            }}
            variants={variants}
            animate={controls}
          />
        ))}
      </motion.div>
    );
  };

export default Slideshow;