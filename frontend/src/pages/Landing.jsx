/**
 * Landing Page
 * ------------
 * Public landing page with hero section, feature highlights, and CTA.
 * This is the first page visitors see before logging in.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiLink,
  HiChartBar,
  HiQrCode,
  HiShieldCheck,
  HiBolt,
  HiGlobeAlt,
  HiArrowRight,
} from 'react-icons/hi2';
import useAuth from '../hooks/useAuth';

const features = [
  {
    icon: HiBolt,
    title: 'Lightning Fast',
    description: 'Generate short URLs in milliseconds with our optimized engine.',
    color: 'text-amber-400',
  },
  {
    icon: HiChartBar,
    title: 'Detailed Analytics',
    description: 'Track clicks, devices, browsers, and geographic data in real-time.',
    color: 'text-primary-400',
  },
  {
    icon: HiQrCode,
    title: 'QR Code Generation',
    description: 'Auto-generate downloadable QR codes for every shortened link.',
    color: 'text-accent-400',
  },
  {
    icon: HiShieldCheck,
    title: 'Secure & Private',
    description: 'JWT authentication ensures your links and data stay protected.',
    color: 'text-emerald-400',
  },
  {
    icon: HiLink,
    title: 'Custom Aliases',
    description: 'Create branded, memorable short URLs with custom aliases.',
    color: 'text-rose-400',
  },
  {
    icon: HiGlobeAlt,
    title: 'Bulk Upload',
    description: 'Shorten hundreds of URLs at once with CSV bulk upload.',
    color: 'text-cyan-400',
  },
];

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow">
              <HiLink className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Sniplink</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-sm">
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-dark-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative hero-gradient overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-10 right-10 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute top-40 right-1/3 w-64 h-64 bg-primary-700/5 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '4s' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full text-sm text-primary-300 mb-6">
                ✨ Shorten. Track. Analyze.
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                Short Links,{' '}
                <span className="gradient-text">Big Insights</span>
              </h1>

              <p className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                Transform your long URLs into powerful short links with
                real-time analytics, QR codes, and custom aliases. Built for
                professionals who value data-driven decisions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to={user ? '/dashboard' : '/register'}
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
              >
                Start Shortening
                <HiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to={user ? '/dashboard' : '/login'}
                className="btn-secondary text-lg px-8 py-4"
              >
                {user ? 'Go to Dashboard' : 'Sign In'}
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-dark-800"
            >
              {[
                { value: 'Unlimited', label: 'Short Links' },
                { value: 'Real-time', label: 'Analytics' },
                { value: 'Free', label: 'Forever' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-bold gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-dark-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-dark-400 max-w-2xl mx-auto">
              Powerful features to help you manage and track your links effectively.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 hover:border-primary-500/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className={`mb-4 ${feature.color}`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:gradient-text transition-all">
                  {feature.title}
                </h3>
                <p className="text-dark-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 md:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 hero-gradient opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-dark-300 mb-8 max-w-xl mx-auto">
                Join now and start shortening your URLs with powerful analytics.
              </p>
              <Link
                to={user ? '/dashboard' : '/register'}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                Create Free Account
                <HiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <HiLink className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold gradient-text">Sniplink</span>
          </div>
          <p className="text-sm text-dark-500">
            © {new Date().getFullYear()} Sniplink. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
