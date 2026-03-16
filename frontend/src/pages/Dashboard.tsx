import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import apiService from '@/services/api';
import Chatbot from '@/components/Chatbot';
import websocketService, { DashboardMetrics as WSDashboardMetrics } from '@/services/websocket';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTenants: 0,
    activeUsers: 0,
    growth: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', value: 4000, target: 3800 },
    { month: 'Feb', value: 3000, target: 3200 },
    { month: 'Mar', value: 5000, target: 4500 },
    { month: 'Apr', value: 4500, target: 4200 },
    { month: 'May', value: 6000, target: 5800 },
    { month: 'Jun', value: 5500, target: 5200 },
  ];

  const userActivityData = [
    { day: 'Mon', active: 400, new: 120 },
    { day: 'Tue', active: 300, new: 180 },
    { day: 'Wed', active: 500, new: 200 },
    { day: 'Thu', active: 450, new: 150 },
    { day: 'Fri', active: 600, new: 250 },
    { day: 'Sat', active: 350, new: 100 },
    { day: 'Sun', active: 400, new: 140 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.role === 'SUPER_ADMIN' || user?.role === 'TENANT_ADMIN') {
          const usersResponse = await apiService.getUsers();
          if (usersResponse.success && usersResponse.data) {
            setStats({
              totalUsers: usersResponse.data.length,
              totalTenants: 0,
              activeUsers: usersResponse.data.filter(u => u.active).length,
              growth: 12.5,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Subscribe to real-time metrics updates
    const unsubscribeMetrics = websocketService.onMetrics((metrics: WSDashboardMetrics) => {
      setStats(prev => ({
        ...prev,
        totalUsers: metrics.totalUsers || prev.totalUsers,
        activeUsers: metrics.activeUsers || prev.activeUsers,
        growth: metrics.growthRate || prev.growth,
      }));
      setLoading(false);
    });

    return () => {
      unsubscribeMetrics();
    };
  }, [user]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      description: 'Active users in your tenant',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Active Now',
      value: stats.activeUsers,
      change: '+8.2%',
      trend: 'up',
      icon: Activity,
      description: 'Users online this month',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Growth Rate',
      value: `${stats.growth}%`,
      change: '+2.4%',
      trend: 'up',
      icon: TrendingUp,
      description: 'Month-over-month growth',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Performance',
      value: '98%',
      change: '+0.5%',
      trend: 'up',
      icon: Zap,
      description: 'System uptime this month',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <AppShell>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome back, {user?.firstName}. Here's your performance overview.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                whileHover={{ translateY: -5 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
                  {/* Gradient background */}
                  <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -mr-12 -mt-12`} />
                  
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                    <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {loading ? (
                      <>
                        <Skeleton className="h-8 w-24 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                          {stat.value}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          {stat.trend === 'up' ? (
                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-500" />
                          )}
                          <span className={stat.trend === 'up' ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
                            {stat.change}
                          </span>
                          <span>from last month</span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{stat.description}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue trends with targets</CardDescription>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" dark-stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                    <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Activity</CardTitle>
                    <CardDescription>Daily active and new users</CardDescription>
                  </div>
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="active" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="new" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions in your tenant</CardDescription>
                </div>
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        New user registered
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {2 + i} hours ago
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* AI Chatbot */}
      <Chatbot />
    </AppShell>
  );
};

export default Dashboard;
