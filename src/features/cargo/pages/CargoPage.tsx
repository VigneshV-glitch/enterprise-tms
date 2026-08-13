import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PackageCheck, Plus, AlertCircle, Thermometer } from 'lucide-react';
import { PageHeader } from '../../../shell';
import { DataTable } from '../../../components/table/DataTable';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { cargoRepository } from '../../../repositories/cargoRepository';
import { CargoItem, StatusType } from '../../../types';
import { formatNumber } from '../../../lib/utils';

export const CargoPage: React.FC = () => {
  const [cargo, setCargo] = useState<CargoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCargo = async () => {
    setIsLoading(true);
    try {
      const data = await cargoRepository.getAll();
      setCargo(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCargo();
  }, []);

  const columns = useMemo<ColumnDef<CargoItem>[]>(
    () => [
      {
        accessorKey: 'trackingNumber',
        header: 'Tracking #',
        cell: (info) => <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'description',
        header: 'Cargo Description',
        cell: (info) => <span className="font-medium text-slate-100 text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'weightKg',
        header: 'Weight (Kg)',
        cell: (info) => <span className="font-mono text-xs text-slate-300">{formatNumber(Number(info.getValue()))} kg</span>,
      },
      {
        accessorKey: 'volumeM3',
        header: 'Volume (m³)',
        cell: (info) => <span className="font-mono text-xs text-slate-300">{Number(info.getValue())} m³</span>,
      },
      {
        accessorKey: 'isHazardous',
        header: 'HazMat',
        cell: (info) =>
          info.getValue() ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              <AlertCircle className="h-3 w-3" /> HazMat
            </span>
          ) : (
            <span className="text-slate-500 text-xs">—</span>
          ),
      },
      {
        accessorKey: 'temperatureControlled',
        header: 'Reefer Temp',
        cell: ({ row }) =>
          row.original.temperatureControlled ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              <Thermometer className="h-3 w-3" /> {row.original.targetTempC}°C
            </span>
          ) : (
            <span className="text-slate-500 text-xs">Ambient</span>
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
          breadcrumbs={[{ label: 'Cargo' }]}
        />
      </div>

      <DataTable
        columns={columns}
        data={cargo}
        isLoading={isLoading}
        onRefresh={fetchCargo}
        searchPlaceholder="Filter cargo by tracking number, description..."
      />
    </div>
  );
};
