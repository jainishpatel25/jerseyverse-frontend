// src/components/HeroBanner.js
import React from 'react';
import { Button } from 'react-bootstrap';
import './styles/HeroBanner.css';
import { motion } from 'framer-motion';
import {useNavigate} from 'react-router-dom';

function HeroBanner() {

  const navigate=useNavigate();

  return (
    <motion.div className="hero-banner"
     initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <motion.h1 className="display-5 fw-bold"
           initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >Elevate Your Game<br />Wear the Legacy</motion.h1>
          <motion.p className="lead"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
              Discover authentic football jerseys from legendary clubs & national teams<br />
               Limited editions, premium quality — made for true fans.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
          <Button onClick={()=> navigate('/shop')} variant="light" className="mt-3 px-4 py-2 resbtn">
            Shop Now &nbsp;›
          </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default HeroBanner;
