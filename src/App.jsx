import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings, Cpu, Network, Linkedin } from 'lucide-react';

const NAV_LINKS = [
    { name: 'Home', href: '#hero' },
    { name: 'Services', href: '#services' },
    { name: 'Hardware', href: '#hardware' },
    { name: 'Contact', href: '#contact' }
];

const fadeInUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, delay }
});

const App = () => {
    const [navOpen, setNavOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoSrc = `${import.meta.env.BASE_URL}assets/logo-icon.jpg`;

    return (
        <div className="min-h-screen bg-takamul-dark text-white selection:bg-takamul-red/30 overflow-x-hidden">
            {/* Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled ? 'backdrop-blur-xl bg-black/70 py-3 border-b border-white/5' : 'bg-transparent py-5'
                }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <a href="#hero" className="flex items-center space-x-3">
                        <img
                            src={logoSrc}
                            alt="Takamul Logo"
                            className="w-9 h-9 rounded"
                        />
                        <span className="text-2xl font-bold tracking-tighter text-white">
                            TAKAMUL
                        </span>
                    </a>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {NAV_LINKS.map(link => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-300 hover:text-takamul-red transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            className="px-5 py-2 rounded bg-takamul-red text-xs font-bold tracking-widest uppercase shadow-[0_0_18px_rgba(239,68,68,0.55)] hover:bg-red-600 transition-colors"
                        >
                            Get Quote
                        </a>
                    </div>

                    {/* Mobile trigger */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setNavOpen(o => !o)}
                        aria-label="Toggle navigation"
                    >
                        {navOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {navOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
                        >
                            <div className="flex flex-col px-6 py-4 space-y-4">
                                {NAV_LINKS.map(link => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setNavOpen(false)}
                                        className="text-gray-200 text-sm font-medium tracking-wide"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <main>
                {/* Hero Section with Video */}
                <section
                    id="hero"
                    className="relative min-h-screen flex items-center justify-center overflow-hidden"
                >
                    {/* Video background */}
                    <div className="absolute inset-0 z-0">
                        <video
                            className="w-full h-full object-cover"
                            src="https://player.vimeo.com/external/494251261.sd.mp4?s=164620601f7096f4c45b85a3637172b528e5e786&profile_id=164&oauth2_token_id=57447761"
                            poster="https://images.pexels.com/photos/1439097/pexels-photo-1439097.jpeg?auto=compress&cs=tinysrgb&w=1920"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                        {/* Dark overlay for readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-takamul-dark/80" />
                        {/* Subtle red glow */}
                        <div className="absolute -bottom-32 right-0 w-[420px] h-[420px] bg-takamul-red/25 blur-[140px] pointer-events-none" />
                    </div>

                    <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
                        <div className="max-w-4xl">
                            <motion.div {...fadeInUp(0)}>
                                <div className="inline-flex items-center space-x-2 rounded-full bg-white/5 border border-white/15 px-4 py-1.5 backdrop-blur">
                                    <span className="w-2 h-2 rounded-full bg-takamul-red animate-pulse" />
                                    <span className="text-[11px] tracking-[0.18em] uppercase text-gray-300">
                                        Industrial Automation • IIoT • Embedded
                                    </span>
                                </div>
                            </motion.div>

                            <motion.h1
                                className="mt-8 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
                                {...fadeInUp(0.1)}
                            >
                                Takamul:{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-takamul-red via-red-400 to-orange-400">
                                    The Digital Nervous System
                                </span>
                                <br />
                                <span className="text-2xl sm:text-3xl md:text-4xl text-gray-100">
                                    End-to-End Industrial Automation &amp; IIoT Solutions
                                </span>
                            </motion.h1>

                            <motion.p
                                className="mt-6 max-w-2xl text-base md:text-lg text-gray-300 leading-relaxed"
                                {...fadeInUp(0.2)}
                            >
                                We connect PLCs, SCADA, and embedded edge devices into one coherent,
                                data-driven control layer — giving your factory reflexes, memory, and
                                real-time intelligence.
                            </motion.p>

                            <motion.div
                                className="mt-10 flex flex-col sm:flex-row gap-4"
                                {...fadeInUp(0.3)}
                            >
                                <a
                                    href="#services"
                                    className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-takamul-red text-sm font-semibold tracking-wide uppercase shadow-[0_0_24px_rgba(239,68,68,0.6)] hover:bg-red-600 transition-colors"
                                >
                                    Explore Services
                                </a>
                                <a
                                    href="#hardware"
                                    className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-white/25 text-sm font-semibold tracking-wide uppercase text-gray-100 hover:border-takamul-red hover:bg-takamul-red/10 transition-colors"
                                >
                                    View Hardware Tiers
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section
                    id="services"
                    className="py-24 bg-takamul-dark relative"
                >
                    <div className="absolute inset-0 pointer-events-none opacity-40">
                        <div className="absolute -top-32 left-16 w-72 h-72 bg-takamul-red/20 blur-[120px]" />
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-900/20 blur-[120px]" />
                    </div>

                    <div className="relative container mx-auto px-6">
                        <motion.div
                            className="max-w-3xl mb-12"
                            {...fadeInUp(0)}
                        >
                            <h2 className="text-sm font-semibold tracking-[0.22em] text-takamul-red uppercase mb-3">
                                Core Engineering Services
                            </h2>
                            <p className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                From legacy PLC panels to cloud-native dashboards — one partner for
                                your entire stack.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Industrial Automation & Maintenance */}
                            <motion.div
                                className="group relative rounded-2xl border border-white/10 bg-black/40 p-7 overflow-hidden"
                                {...fadeInUp(0.1)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 space-y-4">
                                    <div className="inline-flex items-center justify-center rounded-xl bg-red-900/40 p-3">
                                        <Settings className="w-7 h-7 text-takamul-red" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">
                                        Industrial Automation &amp; Maintenance
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        Engineering, programming, and lifecycle support for{' '}
                                        <span className="font-semibold text-white">
                                            PLC, HMI, and SCADA systems
                                        </span>
                                        — designed for uptime, safety, and industrial reliability.
                                    </p>
                                    <ul className="text-xs text-gray-400 space-y-1">
                                        <li>• New panel design &amp; retrofits</li>
                                        <li>• Preventive and corrective maintenance</li>
                                        <li>• Migration from legacy platforms</li>
                                    </ul>
                                </div>
                            </motion.div>

                            {/* Smart Embedded Solutions */}
                            <motion.div
                                className="group relative rounded-2xl border border-white/10 bg-black/40 p-7 overflow-hidden"
                                {...fadeInUp(0.15)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 space-y-4">
                                    <div className="inline-flex items-center justify-center rounded-xl bg-slate-900/60 p-3">
                                        <Cpu className="w-7 h-7 text-gray-100" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">
                                        Smart Embedded Solutions
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        <span className="font-semibold text-white">
                                            Custom PCB Design &amp; Embedded Systems from scratch
                                        </span>
                                        — tailored boards, firmware, and enclosures built around your
                                        electrical, mechanical, and cost constraints.
                                    </p>
                                    <ul className="text-xs text-gray-400 space-y-1">
                                        <li>• High-end Custom PCB Design</li>
                                        <li>• MCU, RTOS, and fieldbus integration</li>
                                        <li>• Edge gateways and smart IO modules</li>
                                    </ul>
                                </div>
                            </motion.div>

                            {/* IIoT & Digital Transformation */}
                            <motion.div
                                className="group relative rounded-2xl border border-white/10 bg-black/40 p-7 overflow-hidden"
                                {...fadeInUp(0.2)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 space-y-4">
                                    <div className="inline-flex items-center justify-center rounded-xl bg-emerald-900/40 p-3">
                                        <Network className="w-7 h-7 text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">
                                        IIoT &amp; Digital Transformation
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        Securely connect your assets for{' '}
                                        <span className="font-semibold text-white">
                                            remote monitoring &amp; data analytics
                                        </span>
                                        — from machine-level signals to plant-wide dashboards and
                                        cloud APIs.
                                    </p>
                                    <ul className="text-xs text-gray-400 space-y-1">
                                        <li>• Data acquisition and historian design</li>
                                        <li>• KPI dashboards &amp; production analytics</li>
                                        <li>• On-prem, edge, or cloud architectures</li>
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Hardware Tiers */}
                <section
                    id="hardware"
                    className="py-24 bg-black"
                >
                    <div className="container mx-auto px-6">
                        <motion.div
                            className="max-w-3xl mb-12"
                            {...fadeInUp(0)}
                        >
                            <h2 className="text-sm font-semibold tracking-[0.22em] uppercase text-takamul-red mb-3">
                                Hardware Tiers
                            </h2>
                            <p className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                One architecture, three power levels — from prototyping to
                                mission‑critical.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Economy - ESP32 */}
                            <motion.div
                                className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-black p-7 flex flex-col"
                                {...fadeInUp(0.1)}
                            >
                                <h3 className="text-xl font-semibold text-white mb-2">Economy</h3>
                                <p className="text-sm text-takamul-red font-mono mb-4">
                                    ESP32 Platform
                                </p>
                                <p className="text-sm text-gray-300 mb-4 flex-1">
                                    Cost‑optimized controllers and gateways built on ESP32 — ideal
                                    for pilot cells, light industrial automation, and IoT
                                    experiments.
                                </p>
                                <ul className="text-xs text-gray-400 space-y-1 mb-4">
                                    <li>• Wi‑Fi / BLE connectivity</li>
                                    <li>• Fast iteration for PoCs</li>
                                    <li>• Upgrade path to STM32 / RISC‑V</li>
                                </ul>
                            </motion.div>

                            {/* Standard - STM32 */}
                            <motion.div
                                className="relative rounded-2xl border border-takamul-red/60 bg-gradient-to-b from-red-900/40 via-black to-black p-7 flex flex-col shadow-[0_0_32px_rgba(248,113,113,0.35)]"
                                {...fadeInUp(0.15)}
                            >
                                <div className="absolute top-4 right-5 text-[10px] px-2 py-1 rounded-full bg-takamul-red text-white tracking-[0.15em] uppercase">
                                    Standard
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Standard</h3>
                                <p className="text-sm text-takamul-red font-mono mb-4">
                                    STM32 Platform
                                </p>
                                <p className="text-sm text-gray-300 mb-4 flex-1">
                                    Industrial‑grade STM32 controllers for robust motion, IO, and
                                    safety applications in harsh environments.
                                </p>
                                <ul className="text-xs text-gray-300 space-y-1 mb-4">
                                    <li>• Deterministic real‑time control</li>
                                    <li>• Fieldbus &amp; industrial ethernet ready</li>
                                    <li>• Wide temperature and EMC‑aware design</li>
                                </ul>
                            </motion.div>

                            {/* Pro - RISC-V */}
                            <motion.div
                                className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-7 flex flex-col"
                                {...fadeInUp(0.2)}
                            >
                                <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
                                <p className="text-sm text-takamul-red font-mono mb-4">
                                    RISC‑V Platform
                                </p>
                                <p className="text-sm text-gray-300 mb-4 flex-1">
                                    High‑performance RISC‑V compute for advanced analytics, vision,
                                    and coordination of fleets of robots or AGVs.
                                </p>
                                <ul className="text-xs text-gray-400 space-y-1 mb-4">
                                    <li>• Parallel processing for heavy workloads</li>
                                    <li>• AI‑ready at the edge</li>
                                    <li>• Open, extensible ISA for long‑term roadmaps</li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section
                    id="contact"
                    className="py-24 bg-takamul-dark"
                >
                    <div className="container mx-auto px-6">
                        <motion.div
                            className="max-w-2xl mb-10"
                            {...fadeInUp(0)}
                        >
                            <h2 className="text-sm font-semibold tracking-[0.22em] uppercase text-takamul-red mb-3">
                                Contact
                            </h2>
                            <p className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                                Ready to build your Digital Nervous System?
                            </p>
                            <p className="text-sm md:text-base text-gray-300">
                                Share a bit about your plant, constraints, and ambitions — we&apos;ll
                                respond with practical architecture and next steps, not buzzwords.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Form */}
                            <motion.div
                                className="lg:col-span-2 glass rounded-2xl border border-white/10 bg-black/50 p-8"
                                {...fadeInUp(0.1)}
                            >
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-xs font-medium tracking-wide text-gray-400 mb-2 uppercase"
                                            >
                                                Name
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-takamul-red focus:ring-1 focus:ring-takamul-red"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="company"
                                                className="block text-xs font-medium tracking-wide text-gray-400 mb-2 uppercase"
                                            >
                                                Company
                                            </label>
                                            <input
                                                id="company"
                                                type="text"
                                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-takamul-red focus:ring-1 focus:ring-takamul-red"
                                                placeholder="Your organization"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-xs font-medium tracking-wide text-gray-400 mb-2 uppercase"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            rows="5"
                                            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-takamul-red focus:ring-1 focus:ring-takamul-red resize-none"
                                            placeholder="Tell us about your factory, current stack, and what success looks like..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-takamul-red text-sm font-semibold tracking-wide uppercase text-white shadow-[0_0_22px_rgba(239,68,68,0.55)] hover:bg-red-600 transition-colors w-full md:w-auto"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </motion.div>

                            {/* Sidebar info */}
                            <motion.div
                                className="space-y-5"
                                {...fadeInUp(0.15)}
                            >
                                <div>
                                    <h3 className="text-sm font-semibold tracking-[0.22em] uppercase text-gray-400 mb-2">
                                        Email
                                    </h3>
                                    <p className="text-sm text-white">info@takamul.tech</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold tracking-[0.22em] uppercase text-gray-400 mb-2">
                                        Location
                                    </h3>
                                    <p className="text-sm text-white">Cairo, Egypt</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold tracking-[0.22em] uppercase text-gray-400 mb-2">
                                        LinkedIn
                                    </h3>
                                    <a
                                        href="https://www.linkedin.com/company/takamull/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
                                    >
                                        <Linkedin className="w-4 h-4 text-takamul-red" />
                                        <span>/takamull</span>
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-black border-t border-white/10 py-8">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <img
                            src={logoSrc}
                            alt="Takamul Logo"
                            className="w-8 h-8 rounded"
                        />
                        <span className="text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} Takamul. All rights reserved.
                        </span>
                    </div>
                    <a
                        href="https://www.linkedin.com/company/takamull/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
                    >
                        <Linkedin className="w-4 h-4 text-takamul-red" />
                        <span>Connect on LinkedIn</span>
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default App;
