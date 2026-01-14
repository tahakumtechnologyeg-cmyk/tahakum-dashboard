import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Hardware = () => {
    const tiers = [
        {
            name: "Economy Tier",
            chip: "ESP32 Based",
            description: "Cost-effective solution for basic automation tasks and IoT connectivity.",
            features: ["Dual-core 240MHz", "Wi-Fi & Bluetooth", "Basic I/O Control", "Low Power Consumption"],
            color: "border-gray-700",
            highlight: false
        },
        {
            name: "Standard Tier",
            chip: "STM32 Based",
            description: "Balanced performance for industrial applications requiring real-time control.",
            features: ["ARM Cortex-M4", "Industrial Communication", "High Reliability", "Extended Temp Range"],
            color: "border-takamul-blue",
            highlight: true
        },
        {
            name: "Pro Tier",
            chip: "RISC-V Based",
            description: "High-performance capabilities for complex processing and edge computing.",
            features: ["RISC-V Architecture", "Advanced DSP", "High-Speed I/O", "Edge AI Capable"],
            color: "border-purple-500",
            highlight: false
        }
    ];

    return (
        <section id="hardware" className="py-24 bg-takamul-dark bg-[url('/grid.svg')]">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-sm font-bold text-takamul-blue uppercase tracking-widest mb-2">Hardware Platform</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Micro-PLC Solutions</h3>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        Engineered for reliability and performance across all levels of industrial automation.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className={`relative glass p-8 rounded-2xl border-t-4 ${tier.color} ${tier.highlight ? 'bg-white/10 scale-105 shadow-2xl z-10' : 'bg-white/5 hover:bg-white/10'} transition-all duration-300`}
                        >
                            {tier.highlight && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-takamul-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Recommended
                                </div>
                            )}

                            <h4 className="text-2xl font-bold text-white mb-2">{tier.name}</h4>
                            <span className="inline-block bg-white/10 text-gray-300 text-xs px-2 py-1 rounded mb-4">{tier.chip}</span>
                            <p className="text-gray-400 text-sm mb-8 min-h-[40px]">
                                {tier.description}
                            </p>

                            <ul className="space-y-4 mb-8">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-sm text-gray-300">
                                        <Check className={`w-4 h-4 mr-3 ${tier.highlight ? 'text-takamul-blue' : 'text-gray-500'}`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${tier.highlight ? 'bg-takamul-blue text-white hover:bg-blue-600' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                View Specs
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hardware;
