// src/pages/auth/landing.jsx
import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="bg-background text-text min-h-screen">

            {/* NAVBAR */}
            <header className="flex items-center justify-between px-10 py-6 bg-surface">
                <h1 className="text-2xl font-bold">
                    Friend<span className="text-accent">Link</span>
                </h1>

                <div className="flex items-center gap-6">
                    <a href="#features" className="hidden lg:block text-subtext hover:text-accent">Features</a>
                    <a href="#how" className="hidden lg:block text-subtext hover:text-accent">How it Works</a>

                    <Link
                        to="/login"
                        className="px-5 py-2 rounded-full border border-accent text-accent hover:bg-accent hover:text-black transition"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="px-6 py-2 rounded-full bg-accent text-black font-semibold hover:opacity-90 transition"
                    >
                        Join Free
                    </Link>
                </div>
            </header>

            {/* HERO */}
            <section className="grid md:grid-cols-2 gap-16 px-10 py-28 items-center">
                <div>
                    <h2 className="text-5xl font-bold leading-tight">
                        Where Real <span className="text-accent">Connections</span> Begin
                    </h2>

                    <p className="mt-6 text-subtext max-w-lg">
                        FriendLink is a modern social platform to share moments, make friends,
                        and build meaningful connections in one powerful network.
                    </p>

                    <div className="mt-8 flex gap-5">
                        <Link
                            to="/register"
                            className="px-8 py-3 rounded-full bg-accent text-black font-semibold"
                        >
                            Get Started
                        </Link>

                        <a
                            href="#features"
                            className="px-8 py-3 rounded-full border border-accent text-accent"
                        >
                            Explore
                        </a>
                    </div>
                </div>

                {/* Fake App Preview */}
                <div className="bg-surface rounded-2xl p-6 shadow-xl">
                    <video src="/demo.mp4" autoPlay muted loop
                        className="w-full h-72 rounded-xl bg-background flex items-center justify-center text-subtext"
                    />
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="bg-surface py-24 px-10">
                <h3 className="text-3xl font-bold text-center">
                    Built for the New Generation
                </h3>

                <div className="grid md:grid-cols-4 gap-8 mt-16">
                    {[
                        ["🧑‍🤝‍🧑", "Smart Friends", "Find people who match your vibe"],
                        ["📸", "Moments", "Share photos, reels and stories"],
                        ["💬", "Real-time Chat", "Instant messaging & reactions"],
                        ["🔥", "Trending", "See what’s going viral"],
                    ].map(([icon, title, desc]) => (
                        <div key={title} className="bg-background p-8 rounded-2xl">
                            <div className="text-3xl">{icon}</div>
                            <h4 className="mt-4 text-xl font-semibold">{title}</h4>
                            <p className="mt-2 text-subtext">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how" className="py-24 px-10 text-center">
                <h3 className="text-3xl font-bold">How FriendLink Works</h3>

                <div className="grid md:grid-cols-3 gap-10 mt-16">
                    {[
                        ["1", "Create Account", "Sign up and build your profile"],
                        ["2", "Connect", "Send requests and make friends"],
                        ["3", "Share", "Post moments & interact"],
                    ].map(([num, title, desc]) => (
                        <div key={title} className="bg-surface p-10 rounded-2xl">
                            <div className="text-4xl font-bold text-accent">{num}</div>
                            <h4 className="mt-4 text-xl">{title}</h4>
                            <p className="mt-2 text-subtext">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-accent text-black py-24 text-center">

                <h3 className="text-4xl font-bold">Join FriendLink Today</h3>
                <p className="mt-4 max-w-xl mx-auto">
                    Connect, share and build real relationships with people around you.
                </p>

                <Link
                    to="/register"
                    className="inline-block mt-8 px-10 py-4 rounded-full bg-black text-white font-semibold"
                >
                    Create Free Account
                </Link>
            </section>

            {/* FOOTER */}
            <footer className="py-10 text-center text-subtext">
                © {new Date().getFullYear()} FriendLink. All rights reserved.
            </footer>

        </div>
    )
}
