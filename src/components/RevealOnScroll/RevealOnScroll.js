import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const RevealOnScroll = ({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.5,
    className = '',
    amount = 0.2
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: amount });

    const getVariants = () => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const distance = isMobile ? (direction === 'left' || direction === 'right' ? 0 : 30) : 50;

        const initial = { opacity: 0 };

        switch (direction) {
            case 'up':
                initial.y = distance;
                break;
            case 'down':
                initial.y = -distance;
                break;
            case 'left':
                initial.x = distance;
                break;
            case 'right':
                initial.x = -distance;
                break;
            default:
                initial.y = distance;
        }

        return {
            hidden: initial,
            visible: {
                opacity: 1,
                y: 0,
                x: 0,
                transition: {
                    duration: duration,
                    delay: delay,
                    ease: [0.25, 0.1, 0.25, 1.0]
                }
            }
        };
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={getVariants()}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default RevealOnScroll;
