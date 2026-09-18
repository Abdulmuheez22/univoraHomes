import React from 'react'
import Header from './HomepageComponents/Header'
import Hero from './HomepageComponents/Hero'
import PainPoints from './HomepageComponents/painpoint'
import GettingStarted from './HomepageComponents/GettingStarted'
import Features from './HomepageComponents/Features'
import Pricing from './HomepageComponents/Pricing'
import FAQ from './HomepageComponents/FAQ'
import FinalCTA from './HomepageComponents/FinalCTA'
import Contact from './HomepageComponents/Contact'
import Footer from './HomepageComponents/Footer'

function Homepage() {
  return <>
  <Header />
  <Hero /> 
  <PainPoints />
  <GettingStarted />
  <Features />
  <Pricing />
  <FAQ />
  <Contact />
  <FinalCTA />
  <Footer />
  </>
}

export default Homepage