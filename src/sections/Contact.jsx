import React from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="py-24 bg-black relative">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-bold text-takamul-blue uppercase tracking-widest mb-2">Get in Touch</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Upgrade Your Factory?</h3>
                        <p className="text-gray-400 mb-8">
                            Reach out to us for a consultation. Whether you need a custom PCB, a full SCADA system, or training for your team, we are here to help.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 text-gray-300">
                                <Mail className="w-5 h-5 text-takamul-blue" />
                                <span>info@takamul.tech</span>
                            </div>
                            <div className="flex items-center space-x-4 text-gray-300">
                                <Phone className="w-5 h-5 text-takamul-blue" />
                                <span>+20 123 456 7890</span>
                            </div>
                            <div className="flex items-center space-x-4 text-gray-300">
                                <MapPin className="w-5 h-5 text-takamul-blue" />
                                <span>Cairo, Egypt</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass p-8 rounded-2xl border border-white/10"
                    >
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                    <input type="text" id="name" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-takamul-blue transition-colors" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                    <input type="email" id="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-takamul-blue transition-colors" placeholder="john@company.com" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                <textarea id="message" rows="4" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-takamul-blue transition-colors" placeholder="Tell us about your project..."></textarea>
                            </div>

                            <button type="submit" className="w-full bg-takamul-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                                <span>Send Message</span>
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
