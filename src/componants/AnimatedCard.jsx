import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';


const AnimatedCard = forwardRef(({imagePath }, ref) => {
    useImperativeHandle(ref, () => ({
        callChildFunction() {
            handleAnimation()
        }
    }));
    const textRef = useRef(null);
    const imageRef = useRef(null);
    const confettiRef = useRef(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (showConfetti) {
            const myConfetti = confetti.create(confettiRef.current, {
                resize: true,
                useWorker: true,
            });
            myConfetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.7 },
                zIndex: 1,
                disableForReducedMotion: true,
                colors: ['#ffffff'],
                shapes: ['circle'],
                scalar: 0.5 // Adjust this to make the particles smaller
            });
        }
    }, [showConfetti]);

    const handleAnimation = () => {
        gsap.to(textRef.current, {
            duration: 1,
            scale: 0,
            opacity: 0,
            onComplete: () => {
                setShowConfetti(true);
                setTimeout(() => {
                    setShowConfetti(false);
                    gsap.to(imageRef.current, {
                        duration: 1,
                        opacity: 1,
                    });
                }, 2000); // Adjust this timeout to match particle animation duration
            },
        });
    };
    const backgroundImage = "url('/assets/img/silhouet.webp')";
    const gradient =
      "radial-gradient(circle, rgba(14, 105, 42, 1) 8%, rgba(10, 102, 55, 1) 42%, rgba(0, 56, 17, 1) 88%)";
    const userImageStyle = {
      background: `${gradient}, ${backgroundImage}`,
    };
  
    return (
        <div>
            <div className="animation-box userImage" style={userImageStyle}>
                
                <span  id="text" ref={textRef}>?</span>
                <canvas ref={confettiRef} className="confetti-canvas"></canvas>
                 <img id="image" ref={imageRef} src={imagePath} alt="Placeholder" />
    
            </div>
        </div>
    );
})

export default AnimatedCard;
