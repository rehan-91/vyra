import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
    ArrowRight,
    BarChart2,
    Briefcase,
    Calendar,
    Cpu,
    DollarSign,
    ExternalLink,
    Globe,
    Heart,
    Menu,
    MessageSquare,
    Package,
    Phone,
    Radio,
    Sparkles,
    Store,
    TrendingUp,
    User,
    Users,
    X,
} from 'lucide-react';
import VyraLogo from '@/components/vyra-logo';

type IconProps = { className?: string };

const Icon = ({ name, className }: { name: string } & IconProps) => {
    const icons: Record<string, ReactNode> = {
        'arrow-right': <ArrowRight className={className} />,
        'bar-chart-2': <BarChart2 className={className} />,
        briefcase: <Briefcase className={className} />,
        calendar: <Calendar className={className} />,
        cpu: <Cpu className={className} />,
        'dollar-sign': <DollarSign className={className} />,
        'external-link': <ExternalLink className={className} />,
        globe: <Globe className={className} />,
        heart: <Heart className={className} />,
        menu: <Menu className={className} />,
        'message-square': <MessageSquare className={className} />,
        package: <Package className={className} />,
        phone: <Phone className={className} />,
        radio: <Radio className={className} />,
        sparkles: <Sparkles className={className} />,
        store: <Store className={className} />,
        'trending-up': <TrendingUp className={className} />,
        user: <User className={className} />,
        users: <Users className={className} />,
        x: <X className={className} />,
    };

    return icons[name] ?? null;
};

export default function CreatorOsZenithHomepage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [modalTitle, setModalTitle] = useState<string | null>(null);
    const [hovering, setHovering] = useState(false);

    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorRingRef = useRef<HTMLDivElement>(null);

    const showToast = (message: string) => {
        setToast(message);
        window.setTimeout(() => setToast(null), 4000);
    };

    const openModal = (title: string) => {
        setModalTitle(title);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalTitle(null);
        document.body.style.overflow = '';
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        document.body.style.overflow = '';
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen((open) => {
            const next = !open;
            document.body.style.overflow = next ? 'hidden' : '';
            return next;
        });
    };

    useEffect(() => {
        const dot = cursorDotRef.current;
        const ring = cursorRingRef.current;

        if (!dot || !ring) return;

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;
        let frame = 0;

        const move = (event: MouseEvent) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        };

        const render = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            frame = requestAnimationFrame(render);
        };

        const onScroll = () => {
            const header = document.getElementById('header');
            if (!header) return;

            if (window.scrollY > 20) {
                header.classList.add(
                    'bg-[#030406]/85',
                    'backdrop-blur-md',
                    'border-b',
                    'border-white/10',
                    'py-4',
                );
                header.classList.remove('py-6');
            } else {
                header.classList.remove(
                    'bg-[#030406]/85',
                    'backdrop-blur-md',
                    'border-b',
                    'border-white/10',
                    'py-4',
                );
                header.classList.add('py-6');
            }
        };

        window.addEventListener('mousemove', move);
        window.addEventListener('scroll', onScroll, { passive: true });
        frame = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(frame);
        };
    }, []);

    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const interactiveProps = {
        onMouseEnter: () => setHovering(true),
        onMouseLeave: () => setHovering(false),
    };

    return (
        <>
            <style>{`
                body {
                    font-family: 'Inter', sans-serif;
                    cursor: default;
                    background-color: #030406;
                    color: #f1f5f9;
                }

                .font-serif-italic {
                    font-family: 'Playfair Display', serif;
                    font-style: italic;
                }

                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #030406; }
                ::-webkit-scrollbar-thumb { background: #1e222b; border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: #d4af37; }

                .cursor-dot {
                    width: 6px;
                    height: 6px;
                    background-color: #d4af37;
                    border-radius: 50%;
                    position: fixed;
                    pointer-events: none;
                    z-index: 9999;
                    transition: transform 0.1s ease, opacity 0.2s ease;
                    transform: translate(-50%, -50%);
                    box-shadow: 0 0 10px rgba(212, 175, 55, 0.6);
                }

                .cursor-ring {
                    width: 34px;
                    height: 34px;
                    border: 1.5px solid rgba(212, 175, 55, 0.35);
                    border-radius: 50%;
                    position: fixed;
                    pointer-events: none;
                    z-index: 9998;
                    transition:
                        transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                        width 0.2s,
                        height 0.2s,
                        border-color 0.2s;
                    transform: translate(-50%, -50%);
                }

                .zenith-hovering .cursor-ring {
                    width: 52px;
                    height: 52px;
                    border-color: rgba(212, 175, 55, 0.8);
                    background-color: rgba(212, 175, 55, 0.04);
                }

                .zenith-hovering .cursor-dot {
                    transform: translate(-50%, -50%) scale(1.4);
                }

                @keyframes floatZenith {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-8px) rotate(0.8deg); }
                }

                .animate-float-zenith {
                    animation: floatZenith 7s ease-in-out infinite;
                }

                @keyframes pulseGold {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.45; transform: scale(1.05); }
                }

                .animate-pulse-gold {
                    animation: pulseGold 6s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .animate-float-zenith,
                    .animate-pulse-gold {
                        animation: none !important;
                    }

                    html {
                        scroll-behavior: auto !important;
                    }
                }
            `}</style>

            <div
                className={`relative min-h-screen overflow-x-hidden bg-[#030406] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 ${
                    hovering ? 'zenith-hovering' : ''
                }`}
            >
                <div
                    ref={cursorDotRef}
                    className="cursor-dot hidden md:block"
                />
                <div
                    ref={cursorRingRef}
                    className="cursor-ring hidden md:block"
                />

                <div className="animate-pulse-gold pointer-events-none absolute top-0 left-1/3 h-[600px] w-[600px] rounded-full bg-amber-600/10 blur-[180px]" />
                <div
                    className="animate-pulse-gold pointer-events-none absolute top-[35%] right-1/4 h-[550px] w-[550px] rounded-full bg-yellow-700/8 blur-[180px]"
                    style={{ animationDelay: '3s' }}
                />

                {toast && (
                    <div className="fixed top-20 right-6 z-50 flex max-w-sm items-center space-x-3 rounded-2xl border border-amber-500/30 bg-[#0a0d14]/95 px-4 py-3 text-slate-200 shadow-2xl backdrop-blur-md">
                        <div className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-amber-400" />
                        <span className="text-xs font-medium">{toast}</span>
                        <button
                            type="button"
                            className="text-slate-400 hover:text-white"
                            {...interactiveProps}
                            onClick={() => setToast(null)}
                        >
                            <Icon name="x" className="h-3.5 w-3.5" />
                        </button>
                    </div>
                )}

                <header
                    id="header"
                    className="fixed top-0 right-0 left-0 z-40 bg-transparent py-6 transition-all duration-300"
                >
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
                        <button
                            type="button"
                            className="flex cursor-pointer items-center space-x-3 border-0 bg-transparent p-0 text-left"
                            onClick={scrollToTop}
                            {...interactiveProps}
                        >
                            <VyraLogo
                                variant="icon"
                                iconClassName="h-10 w-10 rounded-xl shadow-lg transition-transform hover:scale-105"
                            />
                            <div>
                                <span className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
                                    VYRA
                                    <span className="xs:inline-block hidden rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] tracking-wider text-amber-300">
                                        ZENITH
                                    </span>
                                </span>
                            </div>
                        </button>

                        <nav className="hidden items-center space-x-8 text-sm font-medium text-slate-300 md:flex">
                            <a
                                href="#platform"
                                className="transition-colors hover:text-amber-300"
                                {...interactiveProps}
                            >
                                Platform
                            </a>
                            <a
                                href="#monetize"
                                className="transition-colors hover:text-amber-300"
                                {...interactiveProps}
                            >
                                Monetize
                            </a>
                            <a
                                href="#discover"
                                className="transition-colors hover:text-amber-300"
                                {...interactiveProps}
                            >
                                Discover
                            </a>
                            <a
                                href="#business"
                                className="transition-colors hover:text-amber-300"
                                {...interactiveProps}
                            >
                                For your business
                            </a>
                        </nav>

                        <div className="hidden items-center space-x-4 md:flex">
                            <a
                                href="/login"
                                className="px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                                {...interactiveProps}
                            >
                                Log in
                            </a>
                            <a
                                href="/register"
                                className="group relative overflow-hidden rounded-full p-[1px] focus:outline-none"
                                {...interactiveProps}
                            >
                                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300 group-hover:scale-105" />
                                <span className="relative flex items-center space-x-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-6 py-2.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20">
                                    <span>Start Creating</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </a>
                        </div>

                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:text-white focus:outline-none md:hidden"
                            aria-label="Toggle menu"
                            {...interactiveProps}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </header>

                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#030406]/98 px-6 pt-24 pb-12 backdrop-blur-2xl md:hidden">
                        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-6">
                            <div className="flex items-center space-x-3">
                                <VyraLogo
                                    variant="icon"
                                    iconClassName="h-8 w-8 rounded-lg"
                                />
                                <span className="font-bold text-white">
                                    VYRA Navigation
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={closeMobileMenu}
                                className="rounded-full bg-white/10 p-2 text-white"
                                {...interactiveProps}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex flex-col space-y-3 text-base font-medium">
                            {[
                                ['#platform', 'Platform & Features'],
                                ['#monetize', 'Monetization Tools'],
                                ['#discover', 'Discover Creators'],
                                ['#business', 'For Your Business'],
                            ].map(([href, label]) => (
                                <a
                                    key={href}
                                    href={href}
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-3 text-slate-200"
                                    {...interactiveProps}
                                >
                                    <span>{label}</span>
                                    <ArrowRight className="h-4 w-4 text-amber-400" />
                                </a>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col space-y-4 border-t border-white/10 pt-6">
                            <a
                                href="/login"
                                onClick={closeMobileMenu}
                                className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 text-center font-medium text-slate-200"
                                {...interactiveProps}
                            >
                                Log in to account
                            </a>
                            <a
                                href="/register"
                                onClick={closeMobileMenu}
                                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 py-4 font-bold text-black shadow-lg shadow-amber-500/25"
                                {...interactiveProps}
                            >
                                <span>Start Creating</span>
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                )}

                <main>
                    <section className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 sm:pt-42 md:pb-32">
                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                            <div className="z-10 flex flex-col items-start space-y-6 lg:col-span-5">
                                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-amber-400 uppercase">
                                    THE ELITE CREATOR STANDARD
                                </span>
                                <h1 className="text-4xl leading-[1.08] font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                                    Build the world around{' '}
                                    <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                                        your work.
                                    </span>
                                </h1>
                                <p className="max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
                                    VYRA unites high-end digital architecture,
                                    bespoke commerce, and immaculate design into
                                    one sanctuary for world-class creators.
                                </p>

                                <div className="flex w-full flex-col items-stretch space-y-3 pt-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                                    <a
                                        href="/register"
                                        className="flex transform items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-7 py-4 text-base font-bold text-black shadow-xl shadow-amber-500/25 transition-all hover:-translate-y-0.5 hover:opacity-95"
                                        {...interactiveProps}
                                    >
                                        <span>Start Creating</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showToast(
                                                'Exploring Zenith Directory...',
                                            )
                                        }
                                        className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-center text-base font-semibold text-white transition-all hover:bg-white/[0.08]"
                                        {...interactiveProps}
                                    >
                                        Explore Creators
                                    </button>
                                </div>

                                <p className="pt-1 text-xs text-slate-500">
                                    Institutional-grade security. Zero
                                    compromise on elegance.
                                </p>

                                <div className="flex items-center space-x-3 pt-4">
                                    <div className="flex -space-x-2.5">
                                        <img
                                            className="h-8 w-8 rounded-full border-2 border-[#030406] object-cover"
                                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                                            alt="Creator"
                                        />
                                        <img
                                            className="h-8 w-8 rounded-full border-2 border-[#030406] object-cover"
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                                            alt="Creator"
                                        />
                                        <img
                                            className="h-8 w-8 rounded-full border-2 border-[#030406] object-cover"
                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                                            alt="Creator"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-slate-300">
                                        Trusted by top echelon creators
                                    </span>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-center lg:col-span-7">
                                <div className="animate-float-zenith relative flex h-[520px] w-full max-w-[620px] items-center justify-center overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-b from-[#0a0d14]/90 to-[#030406]/95 p-6 shadow-2xl backdrop-blur-xl sm:h-[580px]">
                                    <div className="group absolute z-20 h-[340px] w-[220px] overflow-hidden rounded-2xl border border-amber-500/30 shadow-2xl sm:h-[380px] sm:w-[260px]">
                                        <img
                                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                                            alt="Luna Kai"
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4">
                                            <div className="mb-2 flex items-center space-x-3">
                                                <img
                                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                                                    className="h-10 w-10 rounded-full border border-amber-400/50 object-cover"
                                                    alt="Luna Avatar"
                                                />
                                                <div>
                                                    <h4 className="text-sm leading-none font-bold text-white">
                                                        Luna Kai
                                                    </h4>
                                                    <span className="text-[11px] text-amber-300">
                                                        @lunakai
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="mb-3 text-[10px] font-medium text-slate-300">
                                                Artist · Creator · Visionary
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    showToast(
                                                        'Now following Luna Kai!',
                                                    )
                                                }
                                                className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 py-1.5 text-xs font-bold text-black shadow-md transition-opacity hover:opacity-90"
                                                {...interactiveProps}
                                            >
                                                Follow
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        className="absolute top-6 left-6 z-30 hidden w-44 rounded-2xl border border-amber-500/20 bg-[#0d1017]/95 p-4 shadow-xl backdrop-blur-md transition-transform hover:scale-105 sm:block"
                                        {...interactiveProps}
                                    >
                                        <div className="mb-2 flex items-center space-x-2.5">
                                            <VyraLogo
                                                variant="icon"
                                                iconClassName="h-7 w-7 rounded-lg"
                                            />
                                            <span className="text-xs font-bold text-white">
                                                Create
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 text-[11px] text-slate-300">
                                            <div className="flex items-center space-x-2">
                                                <User className="h-3 w-3 text-amber-400" />
                                                <span>Profile</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Store className="h-3 w-3 text-amber-400" />
                                                <span>Storefront</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Globe className="h-3 w-3 text-amber-400" />
                                                <span>Your space</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="absolute top-6 right-6 z-30 hidden w-44 rounded-2xl border border-amber-500/20 bg-[#0d1017]/95 p-4 shadow-xl backdrop-blur-md transition-transform hover:scale-105 sm:block"
                                        {...interactiveProps}
                                    >
                                        <div className="mb-2 flex items-center space-x-2.5">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-300">
                                                <DollarSign className="h-4 w-4" />
                                            </div>
                                            <span className="text-xs font-bold text-white">
                                                Monetize
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 text-[11px] text-slate-300">
                                            <div className="flex items-center space-x-2">
                                                <Heart className="h-3 w-3 text-amber-400" />
                                                <span>Memberships</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Package className="h-3 w-3 text-amber-400" />
                                                <span>Digital products</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-3 w-3 text-amber-400" />
                                                <span>Bookings</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Sparkles className="h-3 w-3 text-amber-400" />
                                                <span>Tips</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="absolute bottom-6 left-6 z-30 hidden w-44 rounded-2xl border border-amber-500/20 bg-[#0d1017]/95 p-4 shadow-xl backdrop-blur-md transition-transform hover:scale-105 sm:block"
                                        {...interactiveProps}
                                    >
                                        <div className="mb-2 flex items-center space-x-2.5">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600/20 text-amber-300">
                                                <Users className="h-4 w-4" />
                                            </div>
                                            <span className="text-xs font-bold text-white">
                                                Connect
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 text-[11px] text-slate-300">
                                            <div className="flex items-center space-x-2">
                                                <MessageSquare className="h-3 w-3 text-amber-400" />
                                                <span>Messages</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="h-3 w-3 text-amber-400" />
                                                <span>Calls</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Radio className="h-3 w-3 text-amber-400" />
                                                <span>Live</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-3 w-3 text-amber-400" />
                                                <span>Community</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="absolute right-6 bottom-6 z-30 hidden w-44 rounded-2xl border border-amber-500/20 bg-[#0d1017]/95 p-4 shadow-xl backdrop-blur-md transition-transform hover:scale-105 sm:block"
                                        {...interactiveProps}
                                    >
                                        <div className="mb-2 flex items-center space-x-2.5">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-600/20 text-yellow-300">
                                                <TrendingUp className="h-4 w-4" />
                                            </div>
                                            <span className="text-xs font-bold text-white">
                                                Grow
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 text-[11px] text-slate-300">
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-3 w-3 text-amber-400" />
                                                <span>Audience</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <BarChart2 className="h-3 w-3 text-amber-400" />
                                                <span>Insights</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Cpu className="h-3 w-3 text-amber-400" />
                                                <span>AI tools</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Sparkles className="h-3 w-3 text-amber-400" />
                                                <span>More to come</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="font-serif-italic pointer-events-none absolute top-36 right-8 hidden rotate-12 text-sm tracking-widest text-amber-300/80 sm:block">
                                        Zenith & Champagne Edition
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="platform"
                        className="mx-auto max-w-7xl border-t border-white/5 px-6 py-24"
                    >
                        <div className="mb-16 flex flex-col justify-between md:flex-row md:items-end">
                            <div>
                                <span className="text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
                                    The Zenith Ecosystem
                                </span>
                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                                    One identity. Every way
                                    <br />
                                    your business can scale.
                                </h2>
                            </div>
                            <p className="mt-4 max-w-sm text-sm text-slate-400 md:mt-0 md:text-base">
                                From your profile to bespoke commerce, community
                                architecture to intelligence—VYRA provides
                                absolute dominion over your business.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                [
                                    'store',
                                    'Create',
                                    'Own your sovereign identity and digital storefront.',
                                ],
                                [
                                    'dollar-sign',
                                    'Monetize',
                                    'Transform attention into robust recurring revenue.',
                                ],
                                [
                                    'users',
                                    'Connect',
                                    'Foster elite relationships with your core community.',
                                ],
                                [
                                    'trending-up',
                                    'Grow',
                                    'Gain institutional insights to scale your enterprise.',
                                ],
                            ].map(([icon, title, description]) => (
                                <div
                                    key={title}
                                    className="group flex h-72 flex-col justify-between rounded-2xl border border-white/10 bg-[#080b12] p-6 transition-all duration-300 hover:border-amber-500/50 hover:bg-[#0c101b]"
                                    {...interactiveProps}
                                >
                                    <div>
                                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400 transition-transform group-hover:scale-110">
                                            <Icon
                                                name={icon}
                                                className="h-6 w-6"
                                            />
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold text-white">
                                            {title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-slate-400">
                                            {description}
                                        </p>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-300 transition-all group-hover:bg-amber-500 group-hover:text-black">
                                            <ExternalLink className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section
                        id="monetize"
                        className="mx-auto max-w-7xl border-t border-white/5 px-6 py-24"
                    >
                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                            <div className="flex flex-col items-start space-y-6 lg:col-span-5">
                                <span className="text-[11px] font-semibold tracking-[0.2em] text-amber-400 uppercase">
                                    Monetize Your Work
                                </span>
                                <h2 className="text-3xl leading-tight font-black tracking-tight text-white sm:text-5xl">
                                    Turn the work into an offer.
                                </h2>
                                <p className="text-base leading-relaxed text-slate-400">
                                    Make your profile the definitive destination
                                    where fans discover, support, acquire, and
                                    return.
                                </p>
                                <a
                                    href="/register"
                                    className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-7 py-4 text-base font-bold text-black shadow-xl shadow-amber-500/25 transition-all hover:opacity-95"
                                    {...interactiveProps}
                                >
                                    <span>Start Creating</span>
                                    <ArrowRight className="h-5 w-5" />
                                </a>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
                                <div className="group relative flex flex-col justify-between rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#11141d] to-[#080b12] p-5 shadow-2xl sm:col-span-2 lg:col-span-1">
                                    <div className="mb-4 h-56 w-full overflow-hidden rounded-2xl border border-white/10">
                                        <img
                                            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80"
                                            alt="Digital Products"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">
                                            Digital Products
                                        </h4>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Guides, presets, templates and
                                            assets.
                                        </p>
                                    </div>
                                </div>

                                {[
                                    [
                                        'heart',
                                        'Memberships',
                                        'Recurring patronage from core fans.',
                                    ],
                                    [
                                        'video',
                                        'PPV',
                                        'Exclusive high-value media drops.',
                                    ],
                                    [
                                        'sparkles',
                                        'Tips',
                                        'Direct gestures of appreciation.',
                                    ],
                                    [
                                        'briefcase',
                                        'Paid Requests',
                                        'Custom commissions and projects.',
                                    ],
                                    [
                                        'calendar',
                                        'Bookings',
                                        '1-on-1 calls and masterclasses.',
                                    ],
                                ].map(([icon, title, description]) => (
                                    <div
                                        key={title}
                                        className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#080b12] p-6 transition-all hover:border-amber-500/30"
                                    >
                                        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                                            {icon === 'video' ? (
                                                <Icon
                                                    name="radio"
                                                    className="h-5 w-5"
                                                />
                                            ) : (
                                                <Icon
                                                    name={icon}
                                                    className="h-5 w-5"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-white">
                                                {title}
                                            </h4>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section
                        id="discover"
                        className="mx-auto max-w-7xl border-t border-white/5 px-6 py-24"
                    >
                        <div className="mx-auto mb-16 max-w-2xl text-center">
                            <span className="text-[11px] font-semibold tracking-[0.2em] text-amber-400 uppercase">
                                Discover Creators
                            </span>
                            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
                                Built for independent visionaries worldwide.
                            </h2>
                            <p className="mt-3 text-sm text-slate-400">
                                Join top-tier artists, creators, educators, and
                                innovators running their business on VYRA.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {[
                                [
                                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
                                    'Marcus Vance',
                                    'Design & Code',
                                    'amber-400',
                                ],
                                [
                                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
                                    'Elena Rostova',
                                    'Cinematography',
                                    'yellow-400',
                                ],
                                [
                                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
                                    'Julian Ray',
                                    'Audio Engineering',
                                    'amber-300',
                                ],
                                [
                                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
                                    'Luna Kai',
                                    'Visual Arts',
                                    'amber-400',
                                ],
                            ].map(([image, name, category, accent]) => (
                                <div
                                    key={name}
                                    className="group relative h-64 overflow-hidden rounded-2xl"
                                    {...interactiveProps}
                                >
                                    <img
                                        src={image}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        alt="Creator"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent p-4">
                                        <h4 className="text-sm font-bold text-white">
                                            {name}
                                        </h4>
                                        <span
                                            className={`text-xs text-${accent}`}
                                        >
                                            {category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section
                        id="business"
                        className="mx-auto max-w-7xl border-t border-white/5 px-6 py-24"
                    >
                        <div className="flex flex-col items-center justify-between rounded-3xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent p-8 sm:p-12 md:flex-row">
                            <div className="mb-8 max-w-xl md:mb-0">
                                <span className="text-[11px] font-semibold tracking-[0.2em] text-amber-400 uppercase">
                                    Enterprise & Collectives
                                </span>
                                <h2 className="mt-2 mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                    For your enterprise, agency, or studio
                                </h2>
                                <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                                    Scale operations with role-based team
                                    permissions, custom revenue splits,
                                    automated international compliance, and 24/7
                                    dedicated concierge support.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => openModal('Enterprise Inquiry')}
                                className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-8 py-4 text-base font-bold whitespace-nowrap text-black shadow-xl transition-all hover:opacity-90"
                                {...interactiveProps}
                            >
                                Contact Concierge
                            </button>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-white/10 bg-[#010204] px-6 py-16">
                    <div className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-4">
                        <div>
                            <div className="mb-4 flex items-center space-x-3">
                                <VyraLogo
                                    variant="icon"
                                    iconClassName="h-8 w-8 rounded-lg"
                                />
                                <span className="text-lg font-bold text-white">
                                    VYRA
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-400">
                                The preeminent business operating system built
                                for world-class independent creators and digital
                                enterprises.
                            </p>
                        </div>

                        {[
                            [
                                'Platform',
                                [
                                    ['#platform', 'Overview'],
                                    ['#platform', 'Storefront'],
                                    ['#discover', 'Analytics'],
                                    ['#platform', 'AI Suite'],
                                ],
                            ],
                            [
                                'Monetize',
                                [
                                    ['#monetize', 'Memberships'],
                                    ['#monetize', 'Digital Products'],
                                    ['#monetize', 'Bookings & Calls'],
                                    ['#monetize', 'Tips & Donations'],
                                ],
                            ],
                            [
                                'Company',
                                [
                                    ['#', 'About Us'],
                                    ['#', 'Careers'],
                                    ['#', 'Privacy Policy'],
                                    ['#', 'Terms of Service'],
                                ],
                            ],
                        ].map(([heading, links]) => (
                            <div key={heading as string}>
                                <h5 className="mb-4 text-sm font-semibold text-white">
                                    {heading as string}
                                </h5>
                                <ul className="space-y-2 text-xs text-slate-400">
                                    {(links as string[][]).map(
                                        ([href, label]) => (
                                            <li key={label}>
                                                <a
                                                    href={href}
                                                    onClick={
                                                        href === '#'
                                                            ? (event) => {
                                                                  event.preventDefault();
                                                                  openModal(
                                                                      label,
                                                                  );
                                                              }
                                                            : undefined
                                                    }
                                                    className="transition-colors hover:text-amber-300"
                                                    {...interactiveProps}
                                                >
                                                    {label}
                                                </a>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between border-t border-white/5 pt-8 text-xs text-slate-500 sm:flex-row">
                        <p>© 2026 VYRA. All rights reserved.</p>
                        <div className="mt-4 flex space-x-6 sm:mt-0">
                            <a
                                href="#"
                                className="hover:text-slate-300"
                                {...interactiveProps}
                            >
                                Twitter / X
                            </a>
                            <a
                                href="#"
                                className="hover:text-slate-300"
                                {...interactiveProps}
                            >
                                Instagram
                            </a>
                            <a
                                href="#"
                                className="hover:text-slate-300"
                                {...interactiveProps}
                            >
                                Discord
                            </a>
                        </div>
                    </div>
                </footer>

                {modalTitle && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                        <div className="relative w-full max-w-md rounded-3xl border border-amber-500/30 bg-[#0a0d14] p-6 shadow-2xl sm:p-8">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="absolute top-5 right-5 rounded-full bg-white/5 p-2 text-slate-400 hover:text-white"
                                {...interactiveProps}
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <VyraLogo
                                variant="icon"
                                iconClassName="mb-5 h-12 w-12 rounded-2xl shadow-lg"
                            />
                            <h3 className="mb-2 text-2xl font-bold text-white">
                                {modalTitle}
                            </h3>
                            <p className="mb-6 text-sm text-slate-400">
                                Enter your email to initiate your creator
                                workspace.
                            </p>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    closeModal();
                                    showToast(
                                        'Success! Redirecting to your VYRA workspace...',
                                    );
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        className="w-full rounded-xl border border-amber-500/30 bg-black/50 px-4 py-3 text-sm text-white transition-colors focus:border-amber-400 focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/25 transition-all hover:opacity-95"
                                    {...interactiveProps}
                                >
                                    Continue to Workspace
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
