import Link from 'next/link';
import { Activity, LayoutDashboard, MonitorPlay, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-blue-500/30">
      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8 mb:animate-fade-in">
          <Activity size={16} className="animate-pulse" />
          <span>v2.0 — Next.js Edition</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
          Courtside <span className="text-blue-500">Pro</span>
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl font-light">
          A high-impact, real-time scoreboard experience crafted specifically for arena LED walls, courtside TVs, and large displays. Complete control from a single sleek dashboard.
        </p>

        <Link
          href="/control"
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 font-bold text-lg rounded-xl overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] active:scale-95"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500 ease-in-out" />
          <LayoutDashboard size={24} />
          <span>Open Control Panel</span>
        </Link>
      </main>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="grid md:grid-cols-3 gap-8">

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Socket.io Real-Time Sync</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sub-millisecond updates across all open displays. Push score changes instantly without refreshing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-6">
              <MonitorPlay size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">OBS Optimized Views</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Dedicated, fluid-resizing URLs for Scoreboards, Halftime, Fulltime, and Match Countdowns.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Commercial Quality UI</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Modern dark/light themes, keyboard hotkeys, and premium font rendering designed for professional broadcasts.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
