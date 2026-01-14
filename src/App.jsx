import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './sections/Hero';
import HardwareTiers from './sections/HardwareTiers';
import PowerFeature from './sections/PowerFeature';
import SoftwareInnovation from './sections/SoftwareInnovation';
import ServicesGrid from './sections/ServicesGrid';

function App() {
    return (
        <div className="min-h-screen bg-takamul-dark text-white selection:bg-takamul-red/30 overflow-x-hidden">
            <Navbar />

            <main>
                <Hero />
                <HardwareTiers />
                <PowerFeature />
                <SoftwareInnovation />
                <ServicesGrid />
            </main>

            <Footer />
        </div>
    );
}

export default App;
