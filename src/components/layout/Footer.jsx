import React from 'react';
import { Linkedin, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-black py-12 border-t border-takamul-red/30">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <img src={`${import.meta.env.BASE_URL}assets/logo-icon.jpg`} alt="Takamul Logo" className="w-10 h-10 rounded" />
                            <h3 className="text-2xl font-bold text-white tracking-tighter">TAKAMUL</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Empowering industry with scalable, open-source automation solutions.
                            Designed for the future of manufacturing.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Solutions</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><a href="#hardware" className="hover:text-takamul-red transition-colors">Micro-PLCs</a></li>
                            <li><a href="#power" className="hover:text-takamul-red transition-colors">Power Systems</a></li>
                            <li><a href="#software" className="hover:text-takamul-red transition-colors">Software</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact</h4>
                        <div className="space-y-4">
                            <a href="mailto:info@takamul.tech" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                                <Mail className="w-4 h-4 text-takamul-red" />
                                <span>info@takamul.tech</span>
                            </a>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <MapPin className="w-4 h-4 text-takamul-red" />
                                <span>Cairo, Egypt</span>
                            </div>
                            <a href="https://linkedin.com/company/takamull" target="_blank" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="w-4 h-4 text-takamul-red" />
                                <span>LinkedIn</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-600 text-xs font-mono">
                    &copy; {new Date().getFullYear()} Takamul Industrial Automation Systems. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
