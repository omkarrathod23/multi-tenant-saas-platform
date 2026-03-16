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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import apiService from '@/services/api';
import { User } from '../types';
import { toast } from 'react-toastify';
import { Search, MoreVertical, Edit, Trash2, UserPlus, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import UserDialog from '@/components/UserDialog';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'TENANT_ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
  }, [currentUser, navigate]);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to fetch users: ' + error.message);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await apiService.deleteUser(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowDialog(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingUser(null);
  };

  const handleDialogSuccess = () => {
    fetchUsers();
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
              User Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} in your tenant
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>
                    A list of all users in your tenant with detailed information
                  </CardDescription>
                </div>
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 mb-6 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full md:w-[200px] h-10 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
                    {currentUser?.role === 'SUPER_ADMIN' && (
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Name</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Email</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Role</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Status</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Created</TableHead>
                      <TableHead className="text-right font-semibold text-slate-900 dark:text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-slate-600 dark:text-slate-400">
                          No users found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200"
                        >
                          <TableCell className="font-medium text-slate-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-300">{user.email}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-cyan-400">
                              {user.role.replace('_', ' ')}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                user.active
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                              }`}
                            >
                              {user.active ? '✓ Active' : '✕ Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400">
                            {new Date(user.createdAt).toLocaleDateString()}
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
                                  onClick={() => handleEdit(user)}
                                  className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(user.id)}
                                  className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
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

              {filteredUsers.length > 0 && (
                <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                  Showing {filteredUsers.length} of {users.length} total users
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <UserDialog
          open={showDialog}
          onClose={handleDialogClose}
          onSuccess={handleDialogSuccess}
          user={editingUser}
        />
      </motion.div>
    </AppShell>
  );
};

export default UserManagement;
