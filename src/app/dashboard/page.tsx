'use client';

import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  // Remove custom session handling - let SessionMonitor handle it globally
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}