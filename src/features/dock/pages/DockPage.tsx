import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Anchor, Plus, Clock, Truck } from 'lucide-react';
import { PageHeader } from '../../../shell';
import { DataTable } from '../../../components/table/DataTable';
import { Button } from '../../../components/common/Button';
import { dockRepository } from '../../../repositories/dockRepository';
import { DockSlot } from '../../../types';

export const DockPage: React.FC = () => {
  const [docks, setDocks] = useState<DockSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocks = async () => {
    setIsLoading(true);
    try {
      const data = await dockRepository.getAll();
      setDocks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocks();
  }, []);

  const columns = useMemo<ColumnDef<DockSlot>[]>(
    () => [
      {
        accessorKey: 'dockNumber',
        header: 'Dock Door',
        cell: (info) => <span className="font-mono font-bold text-slate-100 text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'hubName',
        header: 'Hub Facility',
        cell: (info) => <span className="font-medium text-slate-200 text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const val = String(info.getValue());
          const isAvail = val === 'Available';
          const isLoading = val === 'Loading' || val === 'Unloading';
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                isAvail
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : isLoading
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isAvail ? 'bg-emerald-400' : isLoading ? 'bg-sky-400' : 'bg-amber-400'}`} />
              {val}
            </span>
          );
        },
      },
      {
        accessorKey: 'assignedTripCode',
        header: 'Assigned Shipment',
        cell: (info) =>
          info.getValue() ? (
            <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold text-xs">{String(info.getValue())}</span>
          ) : (
            <span className="text-slate-500 text-xs">—</span>
          ),
      },
      {
        accessorKey: 'assignedVehicleUnit',
        header: 'Assigned Vehicle',
        cell: (info) =>
          info.getValue() ? (
            <span className="font-mono text-slate-300 text-xs">{String(info.getValue())}</span>
          ) : (
            <span className="text-slate-500 text-xs">—</span>
          ),
      },
      {
        accessorKey: 'etaTime',
        header: 'Scheduled Slot ETA',
        cell: (info) =>
          info.getValue() ? (
            <span className="font-mono text-slate-300 text-xs flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-400" /> {String(info.getValue())}
            </span>
          ) : (
            <span className="text-slate-500 text-xs">—</span>
          ),
      },
    ],
    []
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full space-y-2">
      <div className="px-[10px] h-[24px] flex items-center">
        <PageHeader
          breadcrumbs={[{ label: 'Dock' }]}
        />
      </div>

      <DataTable
        columns={columns}
        data={docks}
        isLoading={isLoading}
        onRefresh={fetchDocks}
        searchPlaceholder="Filter dock doors by hub, status..."
      />
    </div>
  );
};
