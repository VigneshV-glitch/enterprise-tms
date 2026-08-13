import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../../shell';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { notificationsRepository } from '../../../repositories/notificationsRepository';
import { TMSNotification } from '../../../types';
import { formatDate } from '../../../lib/utils';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<TMSNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifs = async () => {
    setIsLoading(true);
    try {
      const data = await notificationsRepository.getAll();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAll = async () => {
    await notificationsRepository.markAllAsRead();
    fetchNotifs();
  };

  return (
    <div className="px-4 py-[2px] space-y-6">
      <PageHeader
        title="System Notifications & Alerts"
        description="Critical route delay warnings, CDL renewals, and facility maintenance updates."
        breadcrumbs={[{ label: 'Notifications' }]}
        actions={
          <Button variant="outline" size="sm" leftIcon={<CheckCheck className="h-3.5 w-3.5" />} onClick={handleMarkAll}>
            Mark All as Read
          </Button>
        }
      />

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className={!n.read ? 'border-emerald-500/30 bg-[#141b27]' : ''}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-slate-800 text-emerald-400 shrink-0 mt-0.5">
                {n.severity === 'warning' ? (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                ) : n.severity === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Info className="h-4 w-4 text-sky-400" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-100">{n.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{formatDate(n.timestamp)}</span>
                </div>
                <p className="text-xs text-slate-300">{n.message}</p>
                <span className="inline-block text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {n.category}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
