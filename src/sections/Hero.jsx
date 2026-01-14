import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity } from 'lucide-react';

const Hero = () => {
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-takamul-blue/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -z-10"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-takamul-dark via-takamul-dark/80 to-transparent"></div>
            </div>

            <div className="container mx-auto px-6 z-10 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1 mb-8 backdrop-blur-sm">
                            <Activity className="w-4 h-4 text-takamul-blue" />
                            <span className="text-gray-300 text-sm tracking-wide uppercase">Next Gen Industrial Automation</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-tight">
                            The Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-takamul-blue to-cyan-400">Nervous System</span> <br />
                            for Industry
                        </h1>

                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Bridging the gap between Classic Control and Embedded Intelligence.
                            Scalable, efficient, and future-proof solutions for the modern factory.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <a
                                href="#services"
                                className="group relative px-8 py-4 bg-takamul-blue text-white font-semibold rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                            >
                                <span className="relative z-10 flex items-center">
                                    Explore Solutions <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </a>

                            <a
                                href="#contact"
                                className="px-8 py-4 text-gray-300 hover:text-white border border-white/20 hover:border-white/50 rounded-lg transition-all hover:bg-white/5"
                            >
                                Contact Us
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2"
            >
                <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-takamul-blue/50 to-transparent"></div>
            </motion.div>
        </section>
    );
};

export default Hero;
