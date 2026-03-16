import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CreditCard, Check, Zap, Download, AlertCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Billing: React.FC = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('FREE');

  const plans = [
    {
      name: 'FREE',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        { text: 'Up to 10 users', included: true },
        { text: 'Basic support', included: true },
        { text: '1GB storage', included: true },
        { text: 'Community access', included: true },
        { text: 'Advanced analytics', included: false },
        { text: 'API access', included: false },
      ],
      color: 'from-slate-500 to-slate-600',
      current: true,
    },
    {
      name: 'PRO',
      price: '$29',
      period: '/month',
      description: 'For growing teams',
      features: [
        { text: 'Unlimited users', included: true },
        { text: 'Priority support', included: true },
        { text: '100GB storage', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'API access', included: true },
        { text: 'Custom integrations', included: true },
      ],
      color: 'from-blue-500 to-cyan-500',
      current: false,
    },
    {
      name: 'ENTERPRISE',
      price: 'Custom',
      period: 'Contact sales',
      description: 'For enterprises',
      features: [
        { text: 'Everything in PRO', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Unlimited storage', included: true },
        { text: 'SLA guarantee', included: true },
        { text: 'Custom training', included: true },
        { text: 'White-label options', included: true },
      ],
      color: 'from-purple-500 to-pink-500',
      current: false,
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
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
            Billing & Subscription
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your plan, payment methods, and billing history
          </p>
        </motion.div>

        {/* Plans */}
        <motion.div variants={itemVariants}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Choose Your Plan
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Select the perfect plan for your team. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ translateY: -5 }}
              >
                <Card
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                    plan.current
                      ? 'ring-2 ring-blue-500 dark:ring-cyan-400'
                      : 'bg-white dark:bg-slate-800/50'
                  } backdrop-blur-sm`}
                >
                  {plan.current && (
                    <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      {plan.current && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                          Current
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1 mt-6">
                      <div className="text-4xl font-bold text-slate-900 dark:text-white">
                        {plan.price}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {plan.period}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className={`flex items-center gap-2 text-sm ${
                            feature.included
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-400 dark:text-slate-600'
                          }`}
                        >
                          <div
                            className={`h-5 w-5 rounded flex items-center justify-center ${
                              feature.included
                                ? 'bg-gradient-to-br ' + plan.color
                                : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          >
                            {feature.included && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      {plan.current ? (
                        <Button
                          variant="outline"
                          className="w-full h-10"
                          disabled
                        >
                          Current Plan
                        </Button>
                      ) : (
                        <Button
                          className={`w-full h-10 bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold`}
                          onClick={() => setSelectedPlan(plan.name)}
                        >
                          {plan.name === 'ENTERPRISE' ? 'Contact Sales' : `Upgrade to ${plan.name}`}
                          <Zap className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Visa ending in 4242
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Expires December 25, 2025
                    </p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="h-9">
                    Update
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing History */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>View your past invoices and payments</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Invoice #{1000 + i}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        ${(29 + Math.random() * 10).toFixed(2)}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-medium"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing Alert */}
        <motion.div variants={itemVariants}>
          <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                Subscription Notice
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Your next billing date is January 15, 2026. You can cancel anytime from your account settings.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  );
};

export default Billing;

