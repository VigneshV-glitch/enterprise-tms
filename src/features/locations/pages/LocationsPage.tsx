import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Building2, Plus, MapPin, Anchor } from 'lucide-react';
import { PageHeader } from '../../../shell';
import { DataTable } from '../../../components/table/DataTable';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { locationsRepository } from '../../../repositories/locationsRepository';
import { HubLocation, StatusType } from '../../../types';

export const LocationsPage: React.FC = () => {
  const [hubs, setHubs] = useState<HubLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHubs = async () => {
    setIsLoading(true);
    try {
      const data = await locationsRepository.getAll();
      setHubs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);

  const columns = useMemo<ColumnDef<HubLocation>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Hub Code',
        cell: (info) => <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Terminal Name',
        cell: (info) => <span className="font-semibold text-slate-100 text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'type',
        header: 'Facility Type',
        cell: (info) => <span className="text-xs text-slate-300 font-medium">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'location',
        header: 'City / State',
        cell: ({ row }) => <span className="text-xs text-slate-300">{row.original.city}, {row.original.state}</span>,
      },
      {
        accessorKey: 'currentCapacityPercent',
        header: 'Capacity Used',
        cell: (info) => {
          const cap = Number(info.getValue());
          return (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cap > 85 ? 'bg-rose-400' : cap > 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  style={{ width: `${cap}%` }}
                />
              </div>
              <span className="font-mono text-xs text-slate-300">{cap}%</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'availableDocks',
        header: 'Open Docks',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-200">
            {row.original.availableDocks} / {row.original.totalDocks}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => <Badge status={info.getValue() as StatusType} />,
      },
    ],
    []
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full space-y-2">
      <div className="px-[10px] h-[24px] flex items-center">
        <PageHeader
          breadcrumbs={[{ label: 'Locations' }]}
        />
      </div>

      <DataTable
        columns={columns}
        data={hubs}
        isLoading={isLoading}
        tableName="public.locations"
        onRefresh={fetchHubs}
        onImportRows={async (rows) => {
          for (const row of rows) {
            await locationsRepository.create({
              code: row.code || row['Hub Code'] || row['code'] || `HUB-${Math.floor(100 + Math.random() * 900)}`,
              name: row.name || row['Terminal Name'] || row['name'] || 'New Terminal Hub',
              type: row.type || row['Facility Type'] || row['type'] || 'Distribution Center',
              city: row.city || row['City'] || 'Chicago',
              state: row.state || row['State'] || 'IL',
              currentCapacityPercent: Number(row.currentCapacityPercent || row['Capacity Used'] || 50),
              totalDocks: Number(row.totalDocks || 10),
              availableDocks: Number(row.availableDocks || 5),
              status: (row.status || row['Status'] || 'available').toLowerCase() as any,
            });
          }
          await fetchHubs();
        }}
        searchPlaceholder="Filter by id, code, name... or ask AI"
      />
    </div>
  );
};
