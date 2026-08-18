import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Truck, Plus, Edit3, ShieldAlert, Wrench, Fuel } from 'lucide-react';
import { PageHeader } from '../../../shell';
import { DataTable } from '../../../components/table/DataTable';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Drawer } from '../../../components/common/Drawer';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { vehiclesService } from '../../../services/vehiclesService';
import { Vehicle, StatusType } from '../../../types';
import { formatNumber } from '../../../lib/utils';

export const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Form State
  const [unitNumber, setUnitNumber] = useState('');
  const [vin, setVin] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState<Vehicle['type']>('Semi-Truck');
  const [status, setStatus] = useState<StatusType>('available');
  const [fuelLevelPercent, setFuelLevelPercent] = useState('85');
  const [odometerMiles, setOdometerMiles] = useState('120000');
  const [currentLocation, setCurrentLocation] = useState('');

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await vehiclesService.getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenDrawer = (v?: Vehicle) => {
    if (v) {
      setSelectedVehicle(v);
      setUnitNumber(v.unitNumber);
      setVin(v.vin);
      setMake(v.make);
      setModel(v.model);
      setType(v.type);
      setStatus(v.status);
      setFuelLevelPercent(String(v.fuelLevelPercent));
      setOdometerMiles(String(v.odometerMiles));
      setCurrentLocation(v.currentLocation);
    } else {
      setSelectedVehicle(null);
      setUnitNumber(`TRK-${Math.floor(8000 + Math.random() * 1000)}`);
      setVin('1XKDDB9X3MD' + Math.floor(100000 + Math.random() * 900000));
      setMake('Freightliner');
      setModel('Cascadia 126');
      setType('Semi-Truck');
      setStatus('available');
      setFuelLevelPercent('90');
      setOdometerMiles('110000');
      setCurrentLocation('Chicago Logistics Hub');
    }
    setIsDrawerOpen(true);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedVehicle) {
        await vehiclesService.updateVehicle(selectedVehicle.id, {
          unitNumber,
          vin,
          make,
          model,
          type,
          status,
          fuelLevelPercent: Number(fuelLevelPercent),
          odometerMiles: Number(odometerMiles),
          currentLocation,
        });
      } else {
        await vehiclesService.createVehicle({
          unitNumber,
          vin,
          make,
          model,
          year: 2024,
          type,
          status,
          fuelLevelPercent: Number(fuelLevelPercent),
          odometerMiles: Number(odometerMiles),
          maxPayloadKg: 22000,
          currentLocation,
          lastServiceDate: new Date().toISOString().slice(0, 10),
          nextServiceDueDate: new Date(Date.now() + 86400000 * 90).toISOString().slice(0, 10),
        });
      }
      setIsDrawerOpen(false);
      fetchVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDelete = async (selected: Vehicle[]) => {
    if (confirm(`Delete ${selected.length} vehicles?`)) {
      for (const v of selected) {
        await vehiclesService.deleteVehicle(v.id);
      }
      fetchVehicles();
    }
  };

  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        accessorKey: 'unitNumber',
        header: 'Unit #',
        cell: (info) => (
          <span className="font-mono font-bold text-slate-100 text-xs">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'makeModel',
        header: 'Make / Model',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-slate-200">{row.original.make} {row.original.model}</p>
            <p className="text-[10px] text-slate-500 font-mono">{row.original.type} ({row.original.year})</p>
          </div>
        ),
      },
      {
        accessorKey: 'vin',
        header: 'VIN Number',
        cell: (info) => <span className="font-mono text-[11px] text-slate-400">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => <Badge status={info.getValue() as StatusType} />,
      },
      {
        accessorKey: 'fuelLevelPercent',
        header: 'Fuel %',
        cell: (info) => {
          const fuel = Number(info.getValue());
          return (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${fuel > 40 ? 'bg-emerald-400' : fuel > 20 ? 'bg-amber-400' : 'bg-rose-400'}`}
                  style={{ width: `${fuel}%` }}
                />
              </div>
              <span className="font-mono text-[11px] text-slate-300">{fuel}%</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'odometerMiles',
        header: 'Odometer',
        cell: (info) => (
          <span className="font-mono text-xs text-slate-300">{formatNumber(Number(info.getValue()))} mi</span>
        ),
      },
      {
        accessorKey: 'currentLocation',
        header: 'Current Location',
        cell: (info) => <span className="text-xs text-slate-300">{String(info.getValue())}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" onClick={() => handleOpenDrawer(row.original)}>
            <Edit3 className="h-3.5 w-3.5 text-slate-400" />
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full space-y-2">
      <div className="px-[10px] h-[24px] flex items-center">
        <PageHeader
          breadcrumbs={
            isDrawerOpen && selectedVehicle
              ? [{ label: 'Vehicles', href: '/vehicles' }, { label: selectedVehicle.unitNumber }]
              : isDrawerOpen
              ? [{ label: 'Vehicles', href: '/vehicles' }, { label: 'New Vehicle' }]
              : [{ label: 'Vehicles' }]
          }
        />
      </div>

      <DataTable
        columns={columns}
        data={vehicles}
        isLoading={isLoading}
        tableName="public.vehicles"
        onRefresh={fetchVehicles}
        onBulkDelete={handleBulkDelete}
        onInsertRow={() => handleOpenDrawer()}
        onImportRows={async (rows) => {
          for (const row of rows) {
            await vehiclesService.createVehicle({
              unitNumber: row.unitNumber || row['Unit Number'] || row['unitNumber'] || `TRK-${Math.floor(8000 + Math.random() * 1000)}`,
              vin: row.vin || row['VIN Code'] || row['vin'] || '1XKDDB9X3MD' + Math.floor(100000 + Math.random() * 900000),
              make: row.make || row['Manufacturer Make'] || row['make'] || 'Freightliner',
              model: row.model || row['Model Name'] || row['model'] || 'Cascadia 126',
              type: (row.type || row['Vehicle Type'] || 'Semi-Truck') as any,
              status: (row.status || row['Operational Status'] || 'available').toLowerCase() as any,
              fuelLevelPercent: Number(row.fuelLevelPercent || row['Fuel Level'] || 80),
              odometerMiles: Number(row.odometerMiles || row['Odometer Miles'] || 100000),
              currentLocation: row.currentLocation || row['Location'] || 'Chicago Logistics Hub',
              year: 2024,
              maxPayloadKg: 22000,
              lastServiceDate: new Date().toISOString().slice(0, 10),
              nextServiceDueDate: new Date(Date.now() + 86400000 * 90).toISOString().slice(0, 10),
            });
          }
          await fetchVehicles();
        }}
        searchPlaceholder="Filter by id, code, name... or ask AI"
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedVehicle ? `Edit Unit: ${selectedVehicle.unitNumber}` : 'Register New Fleet Unit'}
        description="Define transport vehicle specifications and operational status."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveVehicle}>Save Vehicle</Button>
          </>
        }
      >
        <form onSubmit={handleSaveVehicle} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Unit Number" value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} required />
            <Input label="VIN Code" value={vin} onChange={(e) => setVin(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Manufacturer Make" value={make} onChange={(e) => setMake(e.target.value)} required />
            <Input label="Model Name" value={model} onChange={(e) => setModel(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Vehicle Type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              options={[
                { value: 'Semi-Truck', label: 'Semi-Truck (Class 8)' },
                { value: 'Refrigerated', label: 'Refrigerated Trailer' },
                { value: 'Flatbed', label: 'Flatbed Transport' },
                { value: 'Box Truck', label: 'Box Truck' },
                { value: 'Sprinter Van', label: 'Sprinter Cargo Van' },
              ]}
            />
            <Select
              label="Operational Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusType)}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'in_transit', label: 'In Transit' },
                { value: 'maintenance', label: 'In Maintenance' },
                { value: 'delayed', label: 'Delayed' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Fuel Level %" type="number" value={fuelLevelPercent} onChange={(e) => setFuelLevelPercent(e.target.value)} />
            <Input label="Odometer Miles" type="number" value={odometerMiles} onChange={(e) => setOdometerMiles(e.target.value)} />
          </div>
          <Input label="Current Location / Depot" value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)} />
        </form>
      </Drawer>
    </div>
  );
};
