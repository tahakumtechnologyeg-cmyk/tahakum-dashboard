import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Globe } from 'lucide-react';

const About = () => {
    const features = [
        {
            icon: <Target className="w-6 h-6 text-takamul-blue" />,
            title: "Precision Engineering",
            description: "Delivering high-accuracy control systems tailored for complex industrial needs."
        },
        {
            icon: <Zap className="w-6 h-6 text-takamul-blue" />,
            title: "Scalable Solutions",
            description: "From micro-PLCs to full-scale SCADA systems, our solutions grow with your business."
        },
        {
            icon: <Globe className="w-6 h-6 text-takamul-blue" />,
            title: "Global Standards",
            description: "Adhering to international protocols like IEC 61131-3 for reliability and compatibility."
        }
    ];

    return (
        <section id="about" className="py-24 bg-takamul-dark relative">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-sm font-bold text-takamul-blue uppercase tracking-widest mb-2">About Takamul</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Redefining Industrial Intelligence</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            At Takamul, we believe that the future of industry lies in the seamless integration of robust mechanical control and advanced digital intelligence.
                            Our mission is to transform industrial automation by bridging the gap between traditional PLC systems and modern embedded IoT solutions.
                        </p>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            We empower factories and buildings with our "Digital Nervous System," a holistic approach that ensures every component communicates effectively,
                            optimizing performance and reducing downtime.
                        </p>

                        <a href="#contact" className="text-takamul-blue hover:text-white transition-colors font-medium inline-flex items-center">
                            Learn more about our mission <ArrowRight className="ml-2 w-4 h-4" />
                        </a>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                className="glass p-6 rounded-xl hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-takamul-blue/10 rounded-lg">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                                        <p className="text-gray-400 text-sm">{feature.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Need access to ArrowRight for the link
import { ArrowRight } from 'lucide-react';

export default About;
