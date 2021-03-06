import React, { useState } from 'react';
import HeroSection from '../HeroSection';
import Sidebar from '../Sidebar';

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <HeroSection />
    </>
  );
};

export default Home;
