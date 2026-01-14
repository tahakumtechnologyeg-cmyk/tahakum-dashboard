import React from 'react';
import { Linkedin, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black py-12 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold text-white mb-4">TAKAMUL</h3>
                        <p className="text-gray-400 max-w-md">
                            Bridging the gap between Classic Control and Embedded Intelligence.
                            The Digital Nervous System for modern industry.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="#about" className="text-gray-400 hover:text-takamul-blue transition-colors">About Us</a></li>
                            <li><a href="#services" className="text-gray-400 hover:text-takamul-blue transition-colors">Services</a></li>
                            <li><a href="#hardware" className="text-gray-400 hover:text-takamul-blue transition-colors">Hardware</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="https://linkedin.com/company/takamull" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-takamul-blue transition-colors">
                                <Linkedin />
                            </a>
                            <a href="mailto:info@takamul.tech" className="text-gray-400 hover:text-takamul-blue transition-colors">
                                <Mail />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Takamul Engineering. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
