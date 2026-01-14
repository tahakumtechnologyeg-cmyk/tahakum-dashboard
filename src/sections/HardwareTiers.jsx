import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Wifi, Zap, Server } from 'lucide-react';

const HardwareTiers = () => {
    const tiers = [
        {
            name: "Economy Tier",
            chip: "ESP32 Based",
            desc: "Cost-effective solution for basic automation tasks and IoT connectivity.",
            features: ["Dual-Core 240MHz", "Wi-Fi & Bluetooth Native", "Basic I/O Control", "Low Power Consumption"],
            color: "border-gray-600",
            icon: <Wifi className="w-8 h-8 mb-4 text-gray-400" />
        },
        {
            name: "Standard Tier",
            chip: "STM32 Based",
            desc: "Balanced performance for industrial applications requiring real-time control.",
            features: ["ARM Cortex-M4 Core", "Industrial Communication (Rs485)", "High Reliability", "Extended Temp Range"],
            color: "border-takamul-red",
            highlight: true,
            icon: <Zap className="w-8 h-8 mb-4 text-takamul-red" />
        },
        {
            name: "Pro Tier",
            chip: "RISC-V Based",
            desc: "High-performance capabilities for complex processing and edge AI.",
            features: ["RISC-V Architecture", "Advanced DSP & FPU", "High-Speed I/O", "Edge Computing Ready"],
            color: "border-blue-500",
            icon: <Server className="w-8 h-8 mb-4 text-blue-500" />
        }
    ];

    return (
        <section id="hardware" className="py-24 bg-black relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-takamul-red font-mono text-sm tracking-widest uppercase mb-2">Hardware Platform</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-white">Micro-PLC Solutions</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className={`glass-card p-8 rounded-xl relative ${tier.highlight ? 'bg-white/10 scale-105 z-10' : ''}`}
                        >
                            {tier.highlight && (
                                <span className="absolute top-0 right-0 bg-takamul-red text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase">Top Choice</span>
                            )}

                            {tier.icon}
                            <h4 className="text-2xl font-bold text-white mb-1">{tier.name}</h4>
                            <span className="text-xs font-mono text-gray-500 uppercase">{tier.chip}</span>
                            <p className="text-gray-400 mt-4 mb-8 text-sm leading-relaxed">{tier.desc}</p>

                            <ul className="space-y-3 mb-8">
                                {tier.features.map((f, i) => (
                                    <li key={i} className="flex items-center text-sm text-gray-300">
                                        <span className={`w-1.5 h-1.5 rounded-full mr-3 ${tier.highlight ? 'bg-takamul-red' : 'bg-gray-600'}`}></span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3 rounded font-bold text-sm uppercase tracking-wide transition-all ${tier.highlight ? 'bg-takamul-red hover:bg-red-700 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}>
                                View Specs
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HardwareTiers;
