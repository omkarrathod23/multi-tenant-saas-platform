import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  CreditCard, 
  History, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Search,
  Bell,
  Command
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, path, isCollapsed, isActive }) => (
  <Link to={path}>
    <motion.div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group ${
        isActive 
          ? 'bg-primary/10 text-primary border border-primary/20' 
          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
      }`}
      whileHover={{ x: 4 }}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
      {!isCollapsed && (
        <span className="font-medium text-sm whitespace-nowrap overflow-hidden">
          {label}
        </span>
      )}
      {isActive && !isCollapsed && (
        <motion.div 
          layoutId="active-indicator"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        />
      )}
    </motion.div>
  </Link>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['USER', 'TENANT_ADMIN', 'SUPER_ADMIN'] },
    { icon: Users, label: 'User Management', path: '/users', roles: ['TENANT_ADMIN', 'SUPER_ADMIN'] },
    { icon: Building2, label: 'Tenant Management', path: '/tenants', roles: ['SUPER_ADMIN'] },
    { icon: History, label: 'Audit Logs', path: '/audit-logs', roles: ['TENANT_ADMIN', 'SUPER_ADMIN'] },
    { icon: CreditCard, label: 'Billing', path: '/billing', roles: ['TENANT_ADMIN'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['USER', 'TENANT_ADMIN', 'SUPER_ADMIN'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Premium Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        className="premium-sidebar relative flex flex-col z-50 shrink-0"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight animated-gradient-text">
                  MultiSaaS
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md hover:bg-white/5 border border-white/5 text-muted-foreground"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <SidebarItem
              key={item.path}
              {...item}
              isCollapsed={isCollapsed}
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_top_right,hsl(var(--glow-primary)),transparent_50%),radial-gradient(circle_at_bottom_left,hsl(var(--glow-secondary)),transparent_50%)]">
        {/* Top Navigation */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 glass-morphism-dark sticky top-0 z-40">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search anything... (Ctrl + K)"
                className="w-full bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
                <Command size={12} />
                <span className="text-[10px] font-bold">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors border border-white/5">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
            </button>
            
            <div className="h-8 w-[1px] bg-white/5 mx-2" />

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-600 border-2 border-white/10 flex items-center justify-center shadow-lg p-[1px]">
                 <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    <span className="font-bold text-xs">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
