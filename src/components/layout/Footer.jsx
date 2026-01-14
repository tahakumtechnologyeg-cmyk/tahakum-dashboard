import React from 'react';
import { Linkedin, Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-black py-12 border-t border-takamul-red/30">
            <div className="container mx-auto px-6 flex flex-col items-center justify-center space-y-6">
                {/* Brand */}
                <div className="flex items-center space-x-3">
                    <img src={`${import.meta.env.BASE_URL}assets/logo-icon.jpg`} alt="Takamul Logo" className="w-10 h-10 rounded" />
                    <h3 className="text-2xl font-bold text-white tracking-tighter">TAKAMUL</h3>
                </div>

                {/* Social Icons Row */}
                <div className="flex items-center space-x-8">
                    <a
                        href="https://wa.me/201055357422"
                        target="_blank"
                        rel="noreferrer"
                        className="group p-3 rounded-full bg-white/5 border border-white/10 hover:border-takamul-red hover:bg-takamul-red/10 transition-all duration-300"
                        aria-label="WhatsApp"
                    >
                        <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-takamul-red transition-colors" />
                    </a>
                    <a
                        href="https://www.linkedin.com/company/takamull/"
                        target="_blank"
                        rel="noreferrer"
                        className="group p-3 rounded-full bg-white/5 border border-white/10 hover:border-takamul-red hover:bg-takamul-red/10 transition-all duration-300"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-takamul-red transition-colors" />
                    </a>
                    <a
                        href="mailto:team.takamul.eg@gmail.com"
                        className="group p-3 rounded-full bg-white/5 border border-white/10 hover:border-takamul-red hover:bg-takamul-red/10 transition-all duration-300"
                        aria-label="Email"
                    >
                        <Mail className="w-5 h-5 text-gray-400 group-hover:text-takamul-red transition-colors" />
                    </a>
                </div>

                <div className="text-center text-gray-600 text-xs font-mono">
                    &copy; {new Date().getFullYear()} Takamul Industrial Automation Systems. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
