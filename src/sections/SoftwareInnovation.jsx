import React from 'react';
import { motion } from 'framer-motion';
import { Code, Layers, MousePointerClick } from 'lucide-react';

const SoftwareInnovation = () => {
    return (
        <section id="software" className="py-24 bg-black relative">
            {/* Decorative Lines */}
            <div className="absolute left-0 top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-takamul-red/30 to-transparent"></div>

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-takamul-red font-mono text-sm tracking-widest uppercase mb-2">Next-Gen Control</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-white">Software Ecosystem</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Node-RED Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-card p-10 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Layers className="w-32 h-32 text-takamul-red" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center mb-6">
                                <MousePointerClick className="w-6 h-6 text-takamul-red" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-4">Node-RED Dashboards</h4>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                Replace expensive, proprietary HMIs with flexible, web-based dashboards.
                                Visualize data, control processes remotely, and integrate with any API—all through a drag-and-drop interface.
                            </p>
                            <span className="text-xs font-mono text-gray-500 border border-gray-700 px-2 py-1 rounded">V 3.1.0 Compatible</span>
                        </div>
                    </motion.div>

                    {/* OpenPLC Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-card p-10 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Code className="w-32 h-32 text-blue-500" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                                <Code className="w-6 h-6 text-blue-500" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-4">OpenPLC Native Support</h4>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                Adhere to industry standards (IEC 61131-3) without the licensing fees.
                                Write Ladder Logic, Structured Text, or Function Block Diagrams directly for our hardware.
                            </p>
                            <span className="text-xs font-mono text-gray-500 border border-gray-700 px-2 py-1 rounded">IEC 61131-3 Standard</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default SoftwareInnovation;
