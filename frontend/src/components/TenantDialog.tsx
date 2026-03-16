import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tenant, TenantRequest } from '../types';
import apiService from '../services/api';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

interface TenantDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tenant: Tenant | null;
}

const TenantDialog: React.FC<TenantDialogProps> = ({ open, onClose, onSuccess, tenant }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TenantRequest>({
    name: '',
    subscriptionPlan: 'FREE',
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        subscriptionPlan: tenant.subscriptionPlan,
      });
    } else {
      setFormData({
        name: '',
        subscriptionPlan: 'FREE',
      });
    }
  }, [tenant, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tenant) {
        await apiService.updateTenant(tenant.id, formData);
        toast.success('Tenant updated successfully');
      } else {
        await apiService.createTenant(formData);
        toast.success('Tenant created successfully');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{tenant ? 'Edit Tenant' : 'Create Tenant'}</DialogTitle>
          <DialogDescription>
            {tenant
              ? 'Update tenant information below.'
              : 'Add a new tenant to the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tenant Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <Select
                value={formData.subscriptionPlan}
                onValueChange={(value: 'FREE' | 'PRO') =>
                  setFormData({ ...formData, subscriptionPlan: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">FREE</SelectItem>
                  <SelectItem value="PRO">PRO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tenant ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                tenant ? 'Update' : 'Create'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TenantDialog;

