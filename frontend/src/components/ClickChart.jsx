/**
 * Click Chart Component
 * ---------------------
 * Renders a gradient area chart showing click trends over time.
 * Uses Recharts for data visualization.
 *
 * Props:
 *   data: Array of { date: string, clicks: number }
 *   title: Optional chart title
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { HiChartBar } from 'react-icons/hi2';
import { formatChartDate } from '../utils/formatDate';

/**
 * Custom tooltip component for the chart.
 * Shows date and click count in a styled tooltip.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3">
        <p className="text-xs text-dark-400">{label}</p>
        <p className="text-sm font-semibold text-primary-400">
          {payload[0].value} clicks
        </p>
      </div>
    );
  }
  return null;
};

const ClickChart = ({ data = [], title = 'Click Trends (Last 30 Days)' }) => {
  // Format dates for display
  const formattedData = data.map((item) => ({
    ...item,
    displayDate: formatChartDate(item.date),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <HiChartBar className="w-5 h-5 text-primary-400" />
        {title}
      </h3>

      {formattedData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-dark-500">
          No click data available yet
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              {/* Gradient definition for the area fill */}
              <defs>
                <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />

              <XAxis
                dataKey="displayDate"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                allowDecimals={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#clickGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#6366f1',
                  stroke: '#1e1b4b',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default ClickChart;
