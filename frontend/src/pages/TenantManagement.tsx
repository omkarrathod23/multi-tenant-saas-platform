import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import apiService from '@/services/api';
import { Tenant } from '../types';
import { toast } from 'react-toastify';
import { Plus, Search, MoreVertical, Edit, Trash2, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import TenantDialog from '@/components/TenantDialog';

const TenantManagement: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchTenants();
  }, [currentUser, navigate]);

  useEffect(() => {
    filterTenants();
  }, [searchQuery, tenants]);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTenants();
      if (response.success && response.data) {
        setTenants(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to fetch tenants: ' + error.message);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const filterTenants = () => {
    let filtered = tenants;

    if (searchQuery) {
      filtered = filtered.filter(
        (tenant) =>
          tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tenant.schema.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTenants(filtered);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this tenant?')) return;

    try {
      await apiService.deleteTenant(id);
      toast.success('Tenant deleted successfully');
      fetchTenants();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete tenant');
    }
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setShowDialog(true);
  };

  const handleCreate = () => {
    setEditingTenant(null);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingTenant(null);
  };

  const handleDialogSuccess = () => {
    fetchTenants();
    handleDialogClose();
  };

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppShell>
    );
  }

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
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
              Tenant Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage {filteredTenants.length} tenant{filteredTenants.length !== 1 ? 's' : ''} in the system
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Tenants</CardTitle>
                  <CardDescription>
                    A complete list of all tenants in the system
                  </CardDescription>
                </div>
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <Input
                    placeholder="Search by name or schema..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Name</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Schema</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Plan</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Status</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Created</TableHead>
                      <TableHead className="text-right font-semibold text-slate-900 dark:text-white">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-slate-600 dark:text-slate-400">
                          No tenants found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTenants.map((tenant, index) => (
                        <motion.tr
                          key={tenant.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200"
                        >
                          <TableCell className="font-medium text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
                                {tenant.name[0].toUpperCase()}
                              </div>
                              {tenant.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-mono text-slate-700 dark:text-slate-300">
                              {tenant.schema}
                            </code>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                tenant.subscriptionPlan === 'PRO'
                                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                  : tenant.subscriptionPlan === 'ENTERPRISE'
                                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {tenant.subscriptionPlan}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                tenant.active
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                              }`}
                            >
                              {tenant.active ? '✓ Active' : '✕ Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400">
                            {new Date(tenant.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleEdit(tenant)}
                                  className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Tenant
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(tenant.id)}
                                  className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Tenant
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredTenants.length > 0 && (
                <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                  Showing {filteredTenants.length} of {tenants.length} total tenants
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <TenantDialog
          open={showDialog}
          onClose={handleDialogClose}
          onSuccess={handleDialogSuccess}
          tenant={editingTenant}
        />
      </motion.div>
    </AppShell>
  );
};

export default TenantManagement;
