import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { month: 'Jan', revenue: 45000, active: 120 },
  { month: 'Feb', revenue: 52000, active: 145 },
  { month: 'Mar', revenue: 48000, active: 160 },
  { month: 'Apr', revenue: 61000, active: 190 },
  { month: 'May', revenue: 75000, active: 230 },
  { month: 'Jun', revenue: 89000, active: 280 },
  { month: 'Jul', revenue: 105000, active: 310 },
  { month: 'Aug', revenue: 98000, active: 350 },
  { month: 'Sep', revenue: 125000, active: 420 },
  { month: 'Oct', revenue: 142000, active: 480 },
  { month: 'Nov', revenue: 168000, active: 550 },
  { month: 'Dec', revenue: 195000, active: 620 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-morphism p-3 rounded-lg border-white/10 shadow-xl">
        <p className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-widest">{label}</p>
        <div className="space-y-1">
          <p className="text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Revenue: <span className="text-white">${payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Active: <span className="text-white">{payload[1]?.value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 h-[400px] flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold">Revenue Analytics</h3>
          <p className="text-xs text-muted-foreground">Detailed revenue growth and active subscriptions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Active Tenants</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="active" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenue)"
              animationDuration={2000}
            />
            <Area
              type="monotone"
              dataKey="active"
              stroke="#a855f7"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#active)"
              animationDuration={2500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
