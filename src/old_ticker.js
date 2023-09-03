<Ticker 
duration={40} 
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
        //margin: '5px',
        height: hoveredIndex === index ? '400px' : '333px', 
        width: hoveredIndex === index ? '266px' : '200px',
        backgroundImage: `url(${item})`, // Set the background image
        backgroundSize: 'cover',
        borderRadius: '21px',
        transition: 'height 0.3s ease 0.3s ease, width 0.3s ease 0.3s ease',
        transformOrigin: 'center center',
    }}
/>
))}