import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Box, BookOpen } from 'lucide-react';

const Lifecycle = () => {
    const steps = [
        {
            icon: <PenTool className="w-8 h-8 text-white" />,
            title: "PCB Design",
            description: "Professional multilayer PCB layout and schematic design ensuring signal integrity and manufacturability.",
            color: "bg-blue-600"
        },
        {
            icon: <Box className="w-8 h-8 text-white" />,
            title: "Firmware Development",
            description: "Robust embedded C/C++ firmware optimized for real-time constraints and reliability.",
            color: "bg-cyan-600"
        },
        {
            icon: <BookOpen className="w-8 h-8 text-white" />,
            title: "On-site Training",
            description: "Empowering your team with hands-on training for maintenance and system operation.",
            color: "bg-indigo-600"
        }
    ];

    return (
        <section id="lifecycle" className="py-24 bg-takamul-dark">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-sm font-bold text-takamul-blue uppercase tracking-widest mb-2">End-to-End Support</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Full Lifecycle Services</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className="group relative overflow-hidden rounded-2xl glass hover:bg-white/10 transition-all duration-300 border border-white/5"
                        >
                            <div className={`absolute top-0 right-0 p-4 rounded-bl-2xl ${step.color} transition-transform duration-300 group-hover:scale-110`}>
                                {step.icon}
                            </div>

                            <div className="p-8 pt-16">
                                <h4 className="text-xl font-bold text-white mb-4">{step.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            <div className={`absolute bottom-0 left-0 w-full h-1 ${step.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Lifecycle;
