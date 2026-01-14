import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Zap } from 'lucide-react';

const PowerFeature = () => {
    return (
        <section id="power" className="py-24 bg-takamul-dark relative border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-takamul-red font-mono text-sm tracking-widest uppercase mb-2">Industrial Reliability</h2>
                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Robust Power Handling</h3>
                        <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                            Our hardware is designed to withstand the harshest industrial environments.
                            We utilize <span className="text-white font-medium">Industrial-Grade Solid State Relays (SSR)</span> to ensure high-speed switching and longevity.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                    <ShieldCheck className="w-6 h-6 text-takamul-red" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Galvanic Isolation</h4>
                                    <p className="text-gray-400 text-sm">Complete optical isolation protects the microcontroller from high-voltage spikes and noise.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                    <Zap className="w-6 h-6 text-takamul-red" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">High-Speed Switching</h4>
                                    <p className="text-gray-400 text-sm">SSRs allow for rapid switching frequencies impossible with mechanical relays, ideal for PWM and PID control.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Abstract representation of SSR/Isolation */}
                        <div className="aspect-video bg-gradient-to-br from-gray-800 to-black rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1624391697204-7473724c96e3?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                            <div className="absolute inset-0 bg-takamul-red/10 mix-blend-multiply group-hover:bg-takamul-red/20 transition-colors duration-500"></div>

                            <div className="z-10 text-center">
                                <Activity className="w-16 h-16 text-white mb-4 mx-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                <span className="text-xs font-mono text-takamul-red uppercase tracking-widest border border-takamul-red px-2 py-1 rounded">Optocoupler Active</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PowerFeature;
