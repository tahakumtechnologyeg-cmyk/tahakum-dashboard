import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Cpu, Network } from 'lucide-react';

const ServicesGrid = () => {
    const services = [
        {
            title: "Industrial Automation & Maintenance",
            desc: "End‑to‑end PLC, HMI, and SCADA engineering — from design and programming to preventive maintenance — to keep your industrial operations safe, reliable, and always online.",
            icon: <Settings className="w-8 h-8 text-white" />,
            bg: "bg-red-900/30"
        },
        {
            title: "Smart Embedded Solutions",
            desc: "Customized PCBs and Embedded Systems engineered from scratch — including high‑end Custom PCB Design, firmware, and enclosure integration — to match your exact application and constraints.",
            icon: <Cpu className="w-8 h-8 text-white" />,
            bg: "bg-slate-900/40"
        },
        {
            title: "IIoT & Digital Transformation",
            desc: "Bridging traditional automation with modern data monitoring, secure connectivity, and dashboards so you can capture real‑time insights from every machine and production line.",
            icon: <Network className="w-8 h-8 text-white" />,
            bg: "bg-red-900/20"
        }
    ];

    return (
        <section id="services" className="py-24 bg-takamul-dark">
            <div className="container mx-auto px-6">
                <div className="mb-12 max-w-3xl">
                    <h2 className="text-takamul-red font-mono text-sm tracking-widest uppercase mb-2">
                        Core Engineering Expertise
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        Industrial‑grade services from shop floor to cloud
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((s, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="group relative min-h-[240px] rounded-xl overflow-hidden bg-black/40 border border-white/5 hover:border-takamul-red/60 transition-colors"
                        >
                            <div
                                className={`absolute inset-0 ${s.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                            ></div>
                            <div className="relative z-10 h-full p-8 flex flex-col">
                                <div className="mb-6 p-3 bg-white/10 w-fit rounded-lg">
                                    {s.icon}
                                </div>
                                <h4 className="text-xl font-bold text-white mb-3">
                                    {s.title}
                                </h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {s.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesGrid;
