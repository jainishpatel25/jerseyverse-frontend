import React from 'react'
import HeroBanner from '../components/HeroBanner'
import TrendsSection from '../components/TrendsSection';
import InfoSection from '../components/InfoSection';
import Product from '../components/Product';
import Contactus from '../components/contactus';

function HomePage() {
  return (
    <div>
        <HeroBanner/>
        <TrendsSection/>
        <InfoSection/>
        <Product/>
        <Contactus/>
    </div>
  )
}

export default HomePage;