import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings, Cpu, Network, Linkedin, Zap, FileText, Layers, Phone, Send } from 'lucide-react';

const NAV_LINKS = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
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

const slideInFromLeft = (delay = 0) => ({
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, delay, ease: "easeOut" }
});

const slideInFromRight = (delay = 0) => ({
    initial: { opacity: 0, x: 60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, delay, ease: "easeOut" }
});

const App = () => {
    const [navOpen, setNavOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);


    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Global smooth scrolling for all in-page anchors
        const originalScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'smooth';

        return () => {
            window.removeEventListener('scroll', handleScroll);
            // document.documentElement.style.scrollBehavior = originalScrollBehavior || 'auto'; // Keep smooth scroll behavior
        };
    }, []);

    const logoSrc = `${import.meta.env.BASE_URL}assets/logo-icon.jpg`;

    const handleMobileClick = (e, href) => {
        e.preventDefault();
        setNavOpen(false);
        const element = document.querySelector(href);
        if (element) {
            // Add a small delay to allow the menu to close and layout to stabilize if needed
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <div className="min-h-screen bg-takamul-dark text-white selection:bg-takamul-red/30 overflow-x-hidden">
            {/* Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-black/70 py-3 border-b border-white/5' : 'bg-transparent py-5'
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
                                        onClick={(e) => handleMobileClick(e, link.href)}
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
                    {/* Video background - Industrial Robotic Arms */}
                    <div className="absolute inset-0 z-0">
                        <video
                            className="w-full h-full object-cover"
                            src="https://player.vimeo.com/external/373233001.sd.mp4?s=ec9e3280917b7b0dff78eaefdd8f2fa2e9890ade&profile_id=164&oauth2_token_id=57447761"
                            poster="https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1920"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                        {/* Dark overlay for readability */}
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-takamul-dark/80" />
                        {/* Grid Overlay - Technical/Engineering Drawing Feel */}
                        <div
                            className="absolute inset-0 opacity-[0.15]"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px)
                                `,
                                backgroundSize: '50px 50px'
                            }}
                        />
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

                {/* About Us Section */}
                <section
                    id="about"
                    className="relative py-24 bg-black overflow-hidden"
                >
                    {/* Background industrial image + overlay - Smart Warehouse with AMRs/AGVs */}
                    <div className="absolute inset-0 -z-10">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-35"
                            style={{
                                backgroundImage:
                                    "url('https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=1920')"
                            }}
                        />
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-takamul-dark/90" />
                        <div className="absolute -top-32 right-10 w-80 h-80 bg-takamul-red/20 blur-[120px]" />
                    </div>

                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Copy / Identity */}
                            <motion.div {...slideInFromLeft(0.05)}>
                                <h2 className="text-sm font-semibold tracking-[0.22em] uppercase text-takamul-red mb-3">
                                    About Us
                                </h2>
                                <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                                    The Digital Nervous System Provider
                                </h3>
                                <p className="text-sm md:text-base text-gray-300 mb-4">
                                    We are <span className="font-semibold text-white">Takamul</span>, an
                                    engineering-driven firm specializing in bridging the gap between
                                    traditional industrial automation and the future of{' '}
                                    <span className="font-semibold text-white">IIoT</span>. We don't just automate;
                                    we build the <span className="font-semibold text-white">Digital Nervous System</span>{' '}
                                    for factories, ensuring every sensor and motor is connected, monitored, and intelligent.
                                </p>
                                <p className="text-sm md:text-base text-gray-300 mb-4">
                                    Our core expertise lies in designing high-end proprietary hardware, including{' '}
                                    <span className="font-semibold text-white">Micro-PLCs</span>, and developing
                                    customized embedded systems and PCBs from scratch. We combine deep engineering
                                    knowledge with practical factory experience to deliver solutions that work
                                    reliably in real-world industrial environments.
                                </p>
                                <div className="mt-6 space-y-3 text-sm text-gray-300">
                                    <div>
                                        <span className="font-semibold text-white">
                                            • High-end proprietary hardware (Micro‑PLCs)
                                        </span>
                                        <span className="block text-gray-400">
                                            — architected for industrial environments, open protocols,
                                            and long lifecycles.
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-white">
                                            • Customized embedded systems &amp; PCBs from scratch
                                        </span>
                                        <span className="block text-gray-400">
                                            — from schematics and layout to firmware and enclosures.
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-white">
                                            • Expert PLC / HMI / SCADA programming &amp; maintenance
                                        </span>
                                        <span className="block text-gray-400">
                                            — keeping legacy lines running while preparing them for IIoT.
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Stats / Identity Metrics */}
                            <motion.div
                                className="lg:pl-8"
                                {...slideInFromRight(0.1)}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                                    <motion.div
                                        className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur"
                                        whileHover={{ y: -4 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                                    >
                                        <p className="text-xs tracking-[0.18em] uppercase text-gray-400 mb-2">
                                            Custom PCBs Designed
                                        </p>
                                        <p className="text-3xl font-bold text-white">120+</p>
                                    </motion.div>
                                    <motion.div
                                        className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur"
                                        whileHover={{ y: -4 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                                    >
                                        <p className="text-xs tracking-[0.18em] uppercase text-gray-400 mb-2">
                                            Factories Optimized
                                        </p>
                                        <p className="text-3xl font-bold text-white">35+</p>
                                    </motion.div>
                                    <motion.div
                                        className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur"
                                        whileHover={{ y: -4 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                                    >
                                        <p className="text-xs tracking-[0.18em] uppercase text-gray-400 mb-2">
                                            Support
                                        </p>
                                        <p className="text-3xl font-bold text-white">24/7</p>
                                    </motion.div>
                                </div>
                                <div className="rounded-2xl border border-takamul-red/40 bg-gradient-to-br from-takamul-red/20 via-black to-black p-6">
                                    <p className="text-xs tracking-[0.18em] uppercase text-gray-200 mb-2">
                                        The Digital Nervous System
                                    </p>
                                    <p className="text-sm text-gray-200">
                                        A unified control and data layer that lets you see, predict, and
                                        act — not just react — across every machine, line, and site.
                                    </p>
                                </div>
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
                                {...slideInFromLeft(0.1)}
                            >
                                {/* Visual: Control Panel with PLC/HMI */}
                                <div className="absolute inset-y-0 right-0 w-1/3 opacity-30 pointer-events-none">
                                    <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{
                                            backgroundImage:
                                                "url('https://images.pexels.com/photos/3861971/pexels-photo-3861971.jpeg?auto=compress&cs=tinysrgb&w=1200')"
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/60" />
                                </div>

                                {/* Ladder Logic Diagram Background Pattern */}
                                <div
                                    className="absolute inset-0 opacity-[0.08]"
                                    style={{
                                        backgroundImage: `
                                            repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(220, 38, 38, 0.3) 20px, rgba(220, 38, 38, 0.3) 22px),
                                            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(220, 38, 38, 0.2) 40px, rgba(220, 38, 38, 0.2) 42px)
                                        `
                                    }}
                                />
                                {/* Scanning Effect Animation */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-takamul-red/20 to-transparent"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '200%' }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                        ease: "linear"
                                    }}
                                    style={{ width: '30%' }}
                                />
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
                                {/* Circuit Board Traces Background Pattern (Gold/Red lines on Dark) */}
                                <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="circuit-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                            <path d="M0,30 L60,30 M30,0 L30,60" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1" />
                                            <path d="M15,15 L45,15 M15,45 L45,45 M15,15 L15,45 M45,15 L45,45" stroke="rgba(234, 179, 8, 0.3)" strokeWidth="0.5" />
                                            <circle cx="15" cy="15" r="2" fill="rgba(220, 38, 38, 0.5)" />
                                            <circle cx="45" cy="45" r="2" fill="rgba(234, 179, 8, 0.4)" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
                                </svg>

                                {/* Visual: High-tech Circuit Board (PCB) */}
                                <div className="absolute inset-y-0 right-0 w-1/3 opacity-30 pointer-events-none">
                                    <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{
                                            backgroundImage:
                                                "url('https://images.pexels.com/photos/315938/pexels-photo-315938.jpeg?auto=compress&cs=tinysrgb&w=1200')"
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/60" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 space-y-4">
                                    <motion.div
                                        className="inline-flex items-center justify-center rounded-xl bg-slate-900/60 p-3"
                                        animate={{
                                            scale: [1, 1.05, 1],
                                            boxShadow: [
                                                "0 0 0px rgba(220, 38, 38, 0)",
                                                "0 0 20px rgba(220, 38, 38, 0.4)",
                                                "0 0 0px rgba(220, 38, 38, 0)"
                                            ]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 1
                                        }}
                                    >
                                        <Cpu className="w-7 h-7 text-gray-100" />
                                    </motion.div>
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
                                {...slideInFromRight(0.2)}
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
                                className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-black p-7 flex flex-col overflow-hidden"
                                {...slideInFromLeft(0.1)}
                            >
                                {/* Blueprint Pattern Background */}
                                <div
                                    className="absolute inset-0 opacity-[0.06]"
                                    style={{
                                        backgroundImage: `
                                            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(220, 38, 38, 0.2) 2px, rgba(220, 38, 38, 0.2) 4px),
                                            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(220, 38, 38, 0.2) 2px, rgba(220, 38, 38, 0.2) 4px)
                                        `,
                                        backgroundSize: '20px 20px'
                                    }}
                                />
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                            <FileText className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">Economy</h3>
                                    </div>
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
                                </div>
                            </motion.div>

                            {/* Standard - STM32 */}
                            <motion.div
                                className="group relative rounded-2xl border border-takamul-red/60 bg-gradient-to-b from-red-900/40 via-black to-black p-7 flex flex-col shadow-[0_0_32px_rgba(248,113,113,0.35)] overflow-hidden"
                                {...fadeInUp(0.15)}
                            >
                                {/* Blueprint Pattern Background */}
                                <div
                                    className="absolute inset-0 opacity-[0.08]"
                                    style={{
                                        backgroundImage: `
                                            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(220, 38, 38, 0.3) 2px, rgba(220, 38, 38, 0.3) 4px),
                                            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(220, 38, 38, 0.3) 2px, rgba(220, 38, 38, 0.3) 4px)
                                        `,
                                        backgroundSize: '20px 20px'
                                    }}
                                />
                                <div className="absolute top-4 right-5 text-[10px] px-2 py-1 rounded-full bg-takamul-red text-white tracking-[0.15em] uppercase z-10">
                                    Standard
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="p-2 rounded-lg bg-red-900/30 border border-takamul-red/30">
                                            <Layers className="w-5 h-5 text-takamul-red" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">Standard</h3>
                                    </div>
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
                                </div>
                            </motion.div>

                            {/* Pro - RISC-V */}
                            <motion.div
                                className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-7 flex flex-col overflow-hidden"
                                {...slideInFromRight(0.2)}
                            >
                                {/* Blueprint Pattern Background */}
                                <div
                                    className="absolute inset-0 opacity-[0.08]"
                                    style={{
                                        backgroundImage: `
                                            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(220, 38, 38, 0.3) 2px, rgba(220, 38, 38, 0.3) 4px),
                                            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(220, 38, 38, 0.3) 2px, rgba(220, 38, 38, 0.3) 4px)
                                        `,
                                        backgroundSize: '20px 20px'
                                    }}
                                />
                                {/* Cutting Edge Glowing Effect */}
                                <motion.div
                                    className="absolute -inset-[2px] bg-gradient-to-r from-takamul-red via-orange-500 to-takamul-red rounded-2xl opacity-50 blur-sm"
                                    animate={{
                                        opacity: [0.3, 0.6, 0.3],
                                        scale: [1, 1.02, 1]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                <div className="absolute top-4 right-5 z-10">
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-gradient-to-r from-takamul-red to-orange-500 text-white tracking-[0.15em] uppercase font-bold shadow-[0_0_12px_rgba(220,38,38,0.6)]">
                                        Cutting Edge
                                    </span>
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <motion.div
                                            className="p-2 rounded-lg bg-gradient-to-br from-takamul-red/20 to-orange-500/20 border border-takamul-red/40"
                                            animate={{
                                                boxShadow: [
                                                    "0 0 8px rgba(220, 38, 38, 0.3)",
                                                    "0 0 16px rgba(220, 38, 38, 0.5)",
                                                    "0 0 8px rgba(220, 38, 38, 0.3)"
                                                ]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity
                                            }}
                                        >
                                            <Zap className="w-5 h-5 text-takamul-red" />
                                        </motion.div>
                                        <h3 className="text-xl font-semibold text-white">Pro</h3>
                                    </div>
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
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section
                    id="contact"
                    className="relative py-24 bg-takamul-dark overflow-hidden"
                >
                    {/* Global Network/Data Mesh Background Image */}
                    <div className="absolute inset-0 -z-10">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30"
                            style={{
                                backgroundImage: "url('https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1920')"
                            }}
                        />
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-takamul-dark/95" />
                        {/* Overlay SVG pattern for connectivity feel */}
                        <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="network-mesh" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                    <circle cx="20" cy="20" r="3" fill="rgba(220, 38, 38, 0.4)" />
                                    <circle cx="80" cy="20" r="3" fill="rgba(220, 38, 38, 0.4)" />
                                    <circle cx="50" cy="50" r="3" fill="rgba(220, 38, 38, 0.4)" />
                                    <circle cx="20" cy="80" r="3" fill="rgba(220, 38, 38, 0.4)" />
                                    <circle cx="80" cy="80" r="3" fill="rgba(220, 38, 38, 0.4)" />
                                    <line x1="20" y1="20" x2="80" y2="20" stroke="rgba(220, 38, 38, 0.2)" strokeWidth="1" />
                                    <line x1="20" y1="20" x2="50" y2="50" stroke="rgba(220, 38, 38, 0.2)" strokeWidth="1" />
                                    <line x1="80" y1="20" x2="50" y2="50" stroke="rgba(220, 38, 38, 0.2)" strokeWidth="1" />
                                    <line x1="50" y1="50" x2="20" y2="80" stroke="rgba(220, 38, 38, 0.2)" strokeWidth="1" />
                                    <line x1="50" y1="50" x2="80" y2="80" stroke="rgba(220, 38, 38, 0.2)" strokeWidth="1" />
                                    <line x1="20" y1="80" x2="80" y2="80" stroke="rgba(220, 38, 38, 0.2)" strokeWidth="1" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#network-mesh)" />
                        </svg>
                    </div>
                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div
                            className="max-w-2xl mb-10"
                            {...slideInFromLeft(0)}
                        >
                            <h2 className="text-sm font-semibold tracking-[0.22em] uppercase text-takamul-red mb-3">
                                Contact
                            </h2>
                            <p className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                                Connect your Factory to the Future.
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
                                {...slideInFromLeft(0.1)}
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

                                    {/* Phone Number Input */}
                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="block text-xs font-medium tracking-wide text-gray-400 mb-2 uppercase"
                                        >
                                            Phone Number <span className='text-red-500'>*</span>
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            required
                                            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-takamul-red focus:ring-1 focus:ring-takamul-red"
                                            placeholder="Your phone number"
                                        />
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
                                {...slideInFromRight(0.15)}
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

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/201557526116"
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-105 transition-all duration-300 flex items-center justify-center"
                aria-label="Chat on WhatsApp"
            >
                <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                >
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
            </a>
        </div>
    );
};

export default App;
