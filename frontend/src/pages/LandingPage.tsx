import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  Globe, 
  Zap, 
  Users, 
  BarChart3, 
  Lock, 
  ArrowRight,
  Layout,
  Server,
  Database,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Building2,
  Activity,
  Mail,
  MessageSquare,
  Phone,
  Github,
  Twitter,
  Linkedin,
  TrendingUp,
  CreditCard,
  Settings,
  Bell
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Preview State
  const [activePreviewTenant, setActivePreviewTenant] = useState<'Acme' | 'Globex'>('Acme');

  // Refs for smooth scrolling
  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    setMobileMenuOpen(false);
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const previewData = {
    Acme: {
      name: "Acme Corp",
      revenue: "$1,240,500",
      growth: "+14.2%",
      users: "1,240",
      color: "#3b82f6",
      chart: [40, 70, 45, 90, 65, 80, 50, 85]
    },
    Globex: {
      name: "Globex Inc",
      revenue: "$840,200",
      growth: "+8.7%",
      users: "850",
      color: "#6366f1",
      chart: [30, 50, 60, 40, 75, 55, 90, 70]
    }
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Isolation",
      description: "Dedicated schemas per tenant ensuring absolute privacy and zero cross-tenant contamination.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Edge Performance",
      description: "Optimized multi-tenant routing with sub-100ms response times globally.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Smart Hierarchy",
      description: "Powerful RBAC system designed for complex organizational structures.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Zero Trust Auth",
      description: "Built-in JWT security with multi-layer verification and audit trails.",
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Deep Analytics",
      description: "Real-time tenant performance metrics and resource utilization monitoring.",
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "White Labeling",
      description: "Complete UI customization for every tenant with zero code changes.",
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "49",
      description: "Perfect for early stage startups and small teams.",
      features: ["Up to 5 Tenants", "Basic Analytics", "Community Support"],
      cta: "Start for Free",
      highlighted: false
    },
    {
      name: "Professional",
      price: "199",
      description: "Scale your business with advanced management tools.",
      features: ["Up to 50 Tenants", "Advanced RBAC", "Priority Support", "Custom Domains"],
      cta: "Get Started",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Maximum performance and security for large organizations.",
      features: ["Unlimited Tenants", "Dedicated Infrastructure", "24/7 Support", "SLA Guarantee"],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 -z-10 bg-[#020617]">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" 
        />
      </div>

      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? "bg-slate-950/80 backdrop-blur-xl border-slate-800 py-3" 
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                NexusSaaS
              </span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection(featuresRef)} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollToSection(previewRef)} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Demo</button>
              <button onClick={() => scrollToSection(pricingRef)} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</button>
              <button onClick={() => scrollToSection(contactRef)} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Contact</button>
              
              <div className="h-4 w-px bg-slate-800"></div>

              {isAuthenticated ? (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-slate-200 transition-all flex items-center space-x-2"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
                    Log in
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              The Multi-Tenant Standard
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8">
              The OS for <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Modern SaaS
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              Scale from zero to infinity with native data isolation, built-in RBAC, and seamless white labeling. Engineered for reliability.
            </p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-black font-extrabold text-lg hover:bg-slate-200 transition-all shadow-xl flex items-center justify-center space-x-2 group"
              >
                <span>Deploy Engine</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => scrollToSection(previewRef)}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-slate-900 border border-slate-800 text-white font-extrabold text-lg hover:bg-slate-800 transition-all flex items-center justify-center"
              >
                Live Preview
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Preview Section */}
      <section ref={previewRef} className="py-24 lg:py-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black mb-6">Experience the Architecture</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium mb-10">
              Switch tenants in real-time. See how Nexus handles data isolation and UI personality for every client instantly.
            </p>
            
            {/* Tenant Switcher */}
            <div className="inline-flex items-center p-1.5 bg-slate-900/50 border border-slate-800 rounded-2xl mb-12">
              <button 
                onClick={() => setActivePreviewTenant('Acme')}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${activePreviewTenant === 'Acme' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Acme Corp
              </button>
              <button 
                onClick={() => setActivePreviewTenant('Globex')}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${activePreviewTenant === 'Globex' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Globex Inc
              </button>
            </div>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Professional Mockup Window */}
            <div className="relative rounded-[3rem] bg-gradient-to-b from-slate-800 to-slate-950 p-[1px] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              <div className="bg-[#020617] rounded-[3rem] overflow-hidden aspect-[16/10] lg:aspect-[21/10]">
                {/* Mockup App Interface */}
                <div className="w-full h-full flex flex-col">
                  {/* Dashboard Sidebar (Simulated) */}
                  <div className="flex flex-1">
                    <div className="w-20 lg:w-64 border-r border-slate-800 p-6 flex flex-col space-y-8 hidden lg:flex">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                          <Activity className="w-5 h-5" />
                        </div>
                        <span className="font-black text-sm">NEXUS PANEL</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { icon: <Layout className="w-5 h-5" />, label: "Dashboard", active: true },
                          { icon: <Users className="w-5 h-5" />, label: "Teams", active: false },
                          { icon: <Shield className="w-5 h-5" />, label: "Security", active: false },
                          { icon: <Settings className="w-5 h-5" />, label: "Settings", active: false }
                        ].map((item, i) => (
                          <div key={i} className={`flex items-center space-x-3 p-3 rounded-xl ${item.active ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
                            {item.icon}
                            <span className="text-sm font-bold">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col">
                      {/* Top Header */}
                      <div className="h-20 border-b border-slate-800 px-8 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: previewData[activePreviewTenant].color }}></div>
                          <span className="font-extrabold text-lg text-slate-200 animate-in fade-in slide-in-from-left-4">
                            {previewData[activePreviewTenant].name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-6">
                          <Bell className="w-5 h-5 text-slate-500" />
                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700"></div>
                        </div>
                      </div>

                      {/* Dashboard Content */}
                      <div className="p-8 lg:p-12 overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={activePreviewTenant}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-10"
                          >
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[
                                { label: "Revenue", value: previewData[activePreviewTenant].revenue, icon: <CreditCard />, trend: "+12%" },
                                { label: "Growth", value: previewData[activePreviewTenant].growth, icon: <TrendingUp />, trend: "Real-time" },
                                { label: "Active Users", value: previewData[activePreviewTenant].users, icon: <Users />, trend: "Connected" }
                              ].map((card, i) => (
                                <div key={i} className="bg-slate-900 px-8 py-10 rounded-[2.5rem] border border-slate-800/50 group hover:border-blue-500/50 transition-all">
                                  <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-slate-800 rounded-2xl text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
                                      {card.icon}
                                    </div>
                                    <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">{card.trend}</span>
                                  </div>
                                  <div className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest">{card.label}</div>
                                  <div className="text-3xl lg:text-4xl font-black">{card.value}</div>
                                </div>
                              ))}
                            </div>

                            {/* Chart Simulation */}
                            <div className="bg-slate-900 p-8 lg:p-12 rounded-[3rem] border border-slate-800/50">
                              <div className="flex justify-between items-center mb-12">
                                <div>
                                  <h4 className="text-2xl font-black mb-2">Performance Metrics</h4>
                                  <p className="text-slate-500 font-bold uppercase text-xs tracking-tighter">Tenant-Specific Database Analysis</p>
                                </div>
                                <div className="flex space-x-2">
                                  <div className="w-40 h-10 rounded-xl bg-slate-800/50 border border-slate-800"></div>
                                </div>
                              </div>
                              <div className="h-64 flex items-end space-x-3 lg:space-x-4">
                                {previewData[activePreviewTenant].chart.map((h, i) => (
                                  <motion.div 
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: 0.2 + i * 0.05, type: 'spring' }}
                                    className="flex-1 rounded-t-2xl relative group"
                                    style={{ backgroundColor: `${previewData[activePreviewTenant].color}33`, borderTop: `2px solid ${previewData[activePreviewTenant].color}` }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Float Badges */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-8 p-6 bg-slate-900 border border-slate-700 rounded-[2rem] shadow-2xl hidden lg:block z-20"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black uppercase text-slate-500">Security</div>
                  <div className="font-extrabold">Data Encrypted</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section ref={featuresRef} className="py-24 lg:py-40 relative bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 lg:mb-32">
            <h2 className="text-4xl lg:text-7xl font-black mb-6">Engineered for Scale</h2>
            <p className="text-slate-400 text-lg lg:text-xl max-w-2xl mx-auto font-medium">
              Nexus provides the infrastructure you need to launch a secure, scalable, and white-labeled SaaS product in record time.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="group p-10 rounded-[3rem] bg-slate-900/30 border border-slate-800/50 hover:bg-slate-900/50 hover:border-blue-500/30 transition-all cursor-default relative overflow-hidden"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-bold text-lg">
                  {feature.description}
                </p>
                {/* Decoration */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-7xl font-black mb-8">Simple Infrastructure Pricing</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium">
              Choose the plan that fits your current needs and scale as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pricingPlans.map((plan, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-12 rounded-[3.5rem] border relative overflow-hidden flex flex-col ${
                  plan.highlighted 
                    ? "bg-blue-600 border-blue-400 shadow-[0_40px_100px_rgba(37,99,235,0.2)]" 
                    : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                {plan.highlighted && <div className="absolute top-8 right-8 px-4 py-1.5 bg-white text-blue-600 text-xs font-black uppercase tracking-widest rounded-full">Popular</div>}
                
                <h3 className="text-3xl font-black mb-4">{plan.name}</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-black">{plan.price === "Custom" ? "" : "$"}</span>
                  <span className="text-6xl lg:text-7xl font-black tracking-tighter">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="ml-2 font-black uppercase text-sm opacity-50">/ mo</span>}
                </div>
                
                <p className={`mb-10 font-bold text-lg leading-relaxed ${plan.highlighted ? "text-blue-50" : "text-slate-400"}`}>
                  {plan.description}
                </p>
                
                <ul className="space-y-6 mb-12 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center space-x-4 font-black text-sm uppercase tracking-tight">
                      <CheckCircle2 className={`w-6 h-6 flex-shrink-0 ${plan.highlighted ? "text-white" : "text-blue-500"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => plan.price === "Custom" ? scrollToSection(contactRef) : navigate('/register')}
                  className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all shadow-xl ${
                    plan.highlighted 
                      ? "bg-white text-blue-600 hover:scale-105 active:scale-95" 
                      : "bg-slate-800 text-white hover:bg-slate-700 hover:scale-105"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-24 lg:py-40 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="inline-flex px-4 py-2 bg-blue-500/10 rounded-xl text-blue-400 font-black text-xs uppercase tracking-widest mb-8">24/7 Global Support</div>
              <h2 className="text-4xl lg:text-7xl font-black mb-8 tracking-tighter">Let's build <br /> your next legacy.</h2>
              <p className="text-xl text-slate-400 mb-12 font-medium leading-relaxed">
                Whether you're starting from scratch or scaling an existing enterprise, our experts are here to help you architect the perfect solution.
              </p>
              
              <div className="space-y-10">
                <div className="flex items-center space-x-8 group">
                  <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-all">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Direct Line</div>
                    <div className="text-2xl font-black hover:text-blue-400 transition-colors cursor-pointer">hello@nexussaas.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-8 group">
                  <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Global HQ</div>
                    <div className="text-2xl font-black">+1 (555) 123-4567</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-12 lg:p-16 rounded-[4rem] backdrop-blur-2xl shadow-2xl relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); alert("Inquiry submitted successfully. We'll be in touch within 24 hours."); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <input type="text" className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg" placeholder="First Name" required />
                  </div>
                  <div>
                    <input type="text" className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg" placeholder="Last Name" required />
                  </div>
                </div>
                <input type="email" className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg" placeholder="Business Email" required />
                <textarea rows={4} className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg resize-none" placeholder="Tell us about your project..." required></textarea>
                <button type="submit" className="w-full py-6 rounded-[2rem] bg-blue-600 text-white font-black text-2xl hover:bg-blue-700 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-slate-900 bg-[#01040f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                  <Layout className="w-7 h-7 text-slate-950" />
                </div>
                <span className="text-2xl font-black tracking-tighter">NexusSaaS</span>
              </div>
              <p className="text-slate-500 font-bold text-lg mb-10 italic leading-relaxed">
                Empowering the next generation of SaaS with high-fidelity architecture and absolute isolation.
              </p>
              <div className="flex space-x-6">
                {[<Github />, <Twitter />, <Linkedin />].map((icon, i) => (
                  <a key={i} href="#" className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 hover:text-white hover:bg-blue-600 transition-all border border-slate-800">
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: "Product", links: ["Features", "Live Demo", "Deployments", "Security", "SLA"] },
              { title: "Company", links: ["About Us", "Careers", "Customers", "Contact", "Partners"] },
              { title: "Resources", links: ["Documentation", "API Guide", "Community", "Blog", "Legal"] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-white">{col.title}</h4>
                <ul className="space-y-6">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <button 
                        onClick={() => link === "Live Demo" ? scrollToSection(previewRef) : link === "Features" ? scrollToSection(featuresRef) : scrollToSection(contactRef)} 
                        className="text-slate-500 hover:text-blue-400 transition-colors font-black text-sm uppercase tracking-tight"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-600 font-black text-xs uppercase tracking-widest">
            <div>© 2026 NexusSaaS Architecture. All Rights Reserved.</div>
            <div className="flex space-x-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
