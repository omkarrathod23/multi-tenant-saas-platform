import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  icon: LucideIcon;
  data: { value: number }[];
  color?: 'primary' | 'purple' | 'blue' | 'emerald' | 'amber';
}

const Counter = ({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
      ease: "easeOut",
    });
    return controls.stop;
  }, [value]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

export const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  prefix, 
  suffix, 
  change, 
  icon: Icon, 
  data,
  color = 'primary' 
}) => {
  const isPositive = change > 0;
  
  const colorMap = {
    primary: 'from-primary/20 to-primary/5 text-primary',
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-400',
    blue: 'from-blue-500/20 to-blue-500/5 text-blue-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-400',
  };

  const chartColorMap = {
    primary: '#3b82f6',
    purple: '#a855f7',
    blue: '#3b82f6',
    emerald: '#10b981',
    amber: '#f59e0b',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card p-6 min-h-[160px] flex flex-col justify-between overflow-hidden relative group"
    >
      {/* Decorative Glow */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 bg-${color === 'primary' ? 'primary' : color + '-500'}`} />

      <div className="flex justify-between items-start z-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight">
            <Counter value={value} prefix={prefix} suffix={suffix} />
          </h3>
          <div className="flex items-center gap-1 mt-2">
            <span className={`flex items-center text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(change)}%
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold opacity-50">vs last month</span>
          </div>
        </div>
        
        <div className={`p-2.5 rounded-xl border border-white/5 bg-gradient-to-br ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
      </div>

      {/* Mini Sparkline */}
      <div className="absolute inset-x-0 bottom-0 h-12 overflow-hidden opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColorMap[color]} stopOpacity={0.4} />
                <stop offset="100%" stopColor={chartColorMap[color]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColorMap[color]}
              strokeWidth={2}
              fill={`url(#gradient-${color})`}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
