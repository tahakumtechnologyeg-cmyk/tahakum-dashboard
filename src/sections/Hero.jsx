import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, ChevronDown } from 'lucide-react';

const Hero = () => {
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 filter grayscale"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-takamul-dark via-takamul-dark/90 to-takamul-dark/60"></div>

                {/* Animated Red Glow */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-takamul-red/10 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="container mx-auto px-6 z-10 relative mt-16">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded px-4 py-1.5 mb-8 backdrop-blur-sm">
                            <Activity className="w-4 h-4 text-takamul-red" />
                            <span className="text-gray-300 text-xs font-mono tracking-widest uppercase">Efficiency • Scalability • Intelligence</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8 leading-tight">
                            End-to-End <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-takamul-red to-orange-500">Industrial Automation</span> <br />
                            & IIoT Solutions
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                            We bridge the gap between heavy-duty Classic Control and modern Embedded Intelligence.
                            The <span className="text-white font-medium">Digital Nervous System</span> for your factory.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <a
                                href="#hardware"
                                className="group relative px-8 py-4 bg-takamul-red text-white font-bold rounded overflow-hidden transition-all hover:scale-105 shadow-[0_5px_20px_rgba(220,38,38,0.4)]"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
                                <span className="relative flex items-center">
                                    Explore Hardware <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </a>

                            <a
                                href="#services"
                                className="px-8 py-4 text-gray-300 hover:text-white border border-white/20 hover:border-takamul-red hover:bg-takamul-red/5 rounded transition-all font-medium"
                            >
                                Our Services
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce"
            >
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Scroll</span>
                <ChevronDown className="text-takamul-red w-6 h-6" />
            </motion.div>
        </section>
    );
};

export default Hero;
