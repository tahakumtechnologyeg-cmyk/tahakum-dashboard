import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import Hardware from './sections/Hardware';
import Software from './sections/Software';
import Lifecycle from './sections/Lifecycle';
import Contact from './sections/Contact';

function App() {
  return (
    <div className="min-h-screen bg-takamul-dark text-white selection:bg-takamul-blue/30 overflow-x-hidden">
      <Navbar />

      <main>
        <Hero />
        <About />
        <Services />
        <Hardware />
        <Software />
        <Lifecycle />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
