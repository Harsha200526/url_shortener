/**
 * Stats Cards Component
 * ---------------------
 * Displays summary statistics in a grid of animated cards.
 *
 * Props:
 *   stats: Array of { label, value, icon, color, subtext? }
 */

import { motion } from 'framer-motion';

const colorMap = {
  primary: 'from-primary-600/20 to-primary-600/5 border-primary-500/30 text-primary-400',
  accent: 'from-accent-600/20 to-accent-600/5 border-accent-500/30 text-accent-400',
  emerald: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400',
  amber: 'from-amber-600/20 to-amber-600/5 border-amber-500/30 text-amber-400',
  rose: 'from-rose-600/20 to-rose-600/5 border-rose-500/30 text-rose-400',
};

const StatsCards = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const colors = colorMap[stat.color] || colorMap.primary;
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${colors} border rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-xl bg-dark-800/50">
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-dark-400">{stat.label}</p>
            {stat.subtext && (
              <p className="text-xs text-dark-500 mt-1">{stat.subtext}</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;
