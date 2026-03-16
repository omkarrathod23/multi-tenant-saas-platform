import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['USER', 'TENANT_ADMIN', 'SUPER_ADMIN'],
    },
    {
      title: 'Users',
      href: '/users',
      icon: Users,
      roles: ['TENANT_ADMIN', 'SUPER_ADMIN'],
    },
    {
      title: 'Tenants',
      href: '/tenants',
      icon: Building2,
      roles: ['SUPER_ADMIN'],
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['USER', 'TENANT_ADMIN', 'SUPER_ADMIN'],
    },
    {
      title: 'Billing',
      href: '/billing',
      icon: CreditCard,
      roles: ['TENANT_ADMIN', 'SUPER_ADMIN'],
    },
  ].filter(item => user?.role && item.roles.includes(user.role));

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? '80px' : '256px',
      }}
      className={cn(
        "relative flex flex-col border-r bg-gradient-to-b from-white via-blue-50/40 to-white dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950 transition-all duration-300",
        "h-screen sticky top-0 shadow-sm"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 px-4 backdrop-blur-sm">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-2"
          >
            <div className="relative h-9 w-9">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0.5 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                SaaS
              </span>
            </div>
          </motion.div>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700/50 transition-colors duration-200"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          )}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/30"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/40",
                  collapsed && "justify-center"
                )}
              >
                {/* Active indicator */}
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 -z-10"
                  />
                )}
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-white" : "group-hover:text-blue-600 dark:group-hover:text-cyan-400"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>

                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1"
                  >
                    {item.title}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile */}
      {!collapsed && user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-slate-200/50 dark:border-slate-700/50 p-4 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-md"
            >
              {user.firstName[0]}{user.lastName[0]}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default Sidebar;

