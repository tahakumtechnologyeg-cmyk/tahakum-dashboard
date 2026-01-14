import React from 'react';
import { motion } from 'framer-motion';
import { Code, Layers, Smartphone } from 'lucide-react';

const Software = () => {
    return (
        <section id="software" className="py-24 bg-black relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-takamul-blue/5 to-transparent"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-sm font-bold text-takamul-blue uppercase tracking-widest mb-2">Software Innovation</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Open Standards, Limitless Possibilities</h3>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            We leverage the power of open-source technologies to provide flexible and cost-effective automation solutions.
                            Say goodbye to vendor lock-in and hello to the future of open industrial control.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-takamul-blue/10 rounded-lg">
                                    <Layers className="w-6 h-6 text-takamul-blue" />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Node-RED Dashboards</h4>
                                    <p className="text-gray-400 text-sm">Visual programming for wiring together hardware devices, APIs and online services in new and interesting ways.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-takamul-blue/10 rounded-lg">
                                    <Code className="w-6 h-6 text-takamul-blue" />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">OpenPLC Native Support</h4>
                                    <p className="text-gray-400 text-sm">IEC 61131-3 compatible open-source PLC runtime. Write Ladder Logic, Structured Text, and more without expensive licenses.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Abstract Visual Representation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-takamul-blue/30 transition-colors duration-500">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-takamul-blue/10 rounded-full blur-[80px] -z-10 group-hover:bg-takamul-blue/20 transition-colors duration-500"></div>

                            {/* Code Snippet Look */}
                            <div className="font-mono text-xs md:text-sm text-gray-300 space-y-2">
                                <div className="flex space-x-2">
                                    <span className="text-purple-400">const</span>
                                    <span className="text-yellow-200">controlLoop</span>
                                    <span className="text-white">=</span>
                                    <span className="text-purple-400">async</span>
                                    <span className="text-white">()</span>
                                    <span className="text-purple-400">=&gt;</span>
                                    <span className="text-white">{`{`}</span>
                                </div>
                                <div className="pl-4 flex space-x-2">
                                    <span className="text-purple-400">const</span>
                                    <span className="text-blue-300">sensorData</span>
                                    <span className="text-white">=</span>
                                    <span className="text-purple-400">await</span>
                                    <span className="text-blue-300">plc</span>
                                    <span className="text-white">.</span>
                                    <span className="text-yellow-200">readInputs</span>
                                    <span className="text-white">();</span>
                                </div>
                                <div className="pl-4 flex space-x-2">
                                    <span className="text-purple-400">if</span>
                                    <span className="text-white">(</span>
                                    <span className="text-blue-300">sensorData</span>
                                    <span className="text-white">.</span>
                                    <span className="text-blue-300">temp</span>
                                    <span className="text-white">&gt;</span>
                                    <span className="text-orange-400">45</span>
                                    <span className="text-white">)</span>
                                    <span className="text-white">{`{`}</span>
                                </div>
                                <div className="pl-8 flex space-x-2">
                                    <span className="text-purple-400">await</span>
                                    <span className="text-blue-300">system</span>
                                    <span className="text-white">.</span>
                                    <span className="text-yellow-200">triggerCooling</span>
                                    <span className="text-white">(</span>
                                    <span className="text-purple-400">true</span>
                                    <span className="text-white">);</span>
                                </div>
                                <div className="pl-4 text-white">{`}`}</div>
                                <div className="text-white">{`}`}</div>
                            </div>

                            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                                <div className="flex items-center space-x-2 text-green-400 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                    <span>System Online</span>
                                </div>
                                <Smartphone className="text-gray-500 w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Software;
