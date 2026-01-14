import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Cpu, Home, Wind } from 'lucide-react';

const Services = () => {
    const services = [
        {
            id: 1,
            title: "Industrial Automation",
            description: "Comprehensive PLC, SCADA, and HMI solutions for seamless factory control.",
            icon: <Settings className="w-10 h-10 text-takamul-blue" />
        },
        {
            id: 2,
            title: "Embedded Solutions",
            description: "Custom Micro-PLCs and IoT devices based on ESP32, STM32, and RISC-V architectures.",
            icon: <Cpu className="w-10 h-10 text-takamul-blue" />
        },
        {
            id: 3,
            title: "Smart Buildings",
            description: "KNX integration and precision design for intelligent, energy-efficient infrastructure.",
            icon: <Home className="w-10 h-10 text-takamul-blue" />
        },
        {
            id: 4,
            title: "Pneumatic Control",
            description: "Advanced pneumatic schematics and control systems for automated machinery.",
            icon: <Wind className="w-10 h-10 text-takamul-blue" />
        }
    ];

    return (
        <section id="services" className="py-24 bg-black relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-takamul-blue/5 skew-x-12 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-sm font-bold text-takamul-blue uppercase tracking-widest mb-2">Our Expertise</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">The 4 Pillars of Takamul</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group glass p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 border-t border-white/5 hover:border-takamul-blue/50"
                        >
                            <div className="bg-takamul-blue/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {service.icon}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{service.title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
