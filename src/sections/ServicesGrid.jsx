import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Box, MonitorPlay } from 'lucide-react';

const ServicesGrid = () => {
    const services = [
        {
            title: "PCB Design",
            desc: "Custom layouts and schematics for your specific industrial needs.",
            icon: <PenTool className="w-8 h-8 text-white" />,
            bg: "bg-red-900/20"
        },
        {
            title: "Firmware Dev",
            desc: "Optimized, real-time control firmware for any MCU architecture.",
            icon: <Box className="w-8 h-8 text-white" />,
            bg: "bg-blue-900/20"
        },
        {
            title: "Training",
            desc: "Comprehensive On-site and Video training for your engineering team.",
            icon: <MonitorPlay className="w-8 h-8 text-white" />,
            bg: "bg-green-900/20"
        }
    ];

    return (
        <section id="services" className="py-24 bg-takamul-dark">
            <div className="container mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-takamul-red font-mono text-sm tracking-widest uppercase mb-2">Our Capabilities</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-white">Full Lifecycle Services</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((s, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="group relative h-64 rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-takamul-red/50 transition-colors"
                        >
                            <div className={`absolute inset-0 ${s.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                                <div className="mb-auto p-3 bg-white/10 w-fit rounded-lg">
                                    {s.icon}
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">{s.title}</h4>
                                <p className="text-gray-400 text-sm">{s.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesGrid;
