import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Route, Plus, Trash2, Edit3, MapPin, Truck, User } from 'lucide-react';
import { PageHeader } from '../../../shell';
import { DataTable } from '../../../components/table/DataTable';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Drawer } from '../../../components/common/Drawer';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { tripsService } from '../../../services/tripsService';
import { Trip, StatusType } from '../../../types';
import { formatCurrency, formatDate, formatNumber, cn } from '../../../lib/utils';

export const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Form State
  const [tripCode, setTripCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [cargoDescription, setCargoDescription] = useState('');
  const [weightKg, setWeightKg] = useState('15000');
  const [costUSD, setCostUSD] = useState('3500');
  const [status, setStatus] = useState<StatusType>('pending');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const data = await tripsService.getTrips();
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleOpenDrawer = (trip?: Trip) => {
    if (trip) {
      setSelectedTrip(trip);
      setTripCode(trip.tripCode);
      setCustomerName(trip.customerName);
      setOrigin(trip.origin);
      setDestination(trip.destination);
      setCargoDescription(trip.cargoDescription);
      setWeightKg(String(trip.weightKg));
      setCostUSD(String(trip.totalCostUSD));
      setStatus(trip.status);
      setPriority(trip.priority);
    } else {
      setSelectedTrip(null);
      setTripCode(`SHIP-${Math.floor(1000 + Math.random() * 9000)}`);
      setCustomerName('');
      setOrigin('');
      setDestination('');
      setCargoDescription('');
      setWeightKg('15000');
      setCostUSD('3500');
      setStatus('pending');
      setPriority('Medium');
    }
    setIsDrawerOpen(true);
  };

  const handleSaveTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedTrip) {
        await tripsService.updateTrip(selectedTrip.id, {
          tripCode,
          customerName,
          origin,
          destination,
          cargoDescription,
          weightKg: Number(weightKg),
          totalCostUSD: Number(costUSD),
          status,
          priority,
        });
      } else {
        await tripsService.createTrip({
          tripCode,
          customerName,
          origin,
          destination,
          cargoDescription,
          weightKg: Number(weightKg),
          totalCostUSD: Number(costUSD),
          status,
          priority,
          scheduledDeparture: new Date().toISOString(),
          estimatedArrival: new Date(Date.now() + 86400000 * 2).toISOString(),
          routeDistanceMiles: 750,
        });
      }
      setIsDrawerOpen(false);
      fetchTrips();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDelete = async (selected: Trip[]) => {
    if (confirm(`Are you sure you want to delete ${selected.length} trips?`)) {
      for (const t of selected) {
        await tripsService.deleteTrip(t.id);
      }
      fetchTrips();
    }
  };

  const columns = useMemo<ColumnDef<Trip>[]>(
    () => [
      {
        accessorKey: 'tripCode',
        header: 'Trip ID',
        cell: (info) => (
          <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 text-xs min-w-[100px] block">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: (info) => (
          <span
            className={`text-[11px] font-mono font-medium min-w-[80px] block ${
              info.getValue() === 'Critical'
                ? 'text-rose-400'
                : info.getValue() === 'High'
                ? 'text-amber-400'
                : 'text-slate-400'
            }`}
          >
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => <div className="min-w-[100px]"><Badge status={info.getValue() as StatusType} /></div>,
      },
      {
        accessorKey: 'vehicleUnit',
        header: 'Vehicle',
        cell: (info) => <span className="font-mono text-xs text-slate-300 min-w-[100px] block">{String(info.getValue() || 'Unassigned')}</span>,
      },
      {
        accessorKey: 'driverName',
        header: 'Driver',
        cell: (info) => <span className="text-slate-300 text-xs font-medium min-w-[120px] block">{String(info.getValue() || 'Unassigned')}</span>,
      },
      {
        accessorKey: 'origin',
        header: 'Origin',
        cell: (info) => <span className="text-slate-300 text-xs min-w-[160px] block" title={String(info.getValue())}>{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'destination',
        header: 'Destination',
        cell: (info) => <span className="text-slate-300 text-xs min-w-[160px] block" title={String(info.getValue())}>{String(info.getValue())}</span>,
      },
      {
        id: 'currentStop',
        header: 'Current Stop',
        cell: ({ row }) => {
          const status = row.original.status;
          const stop = status === 'in_transit' ? 'Interstate Checkpoint B' : status === 'delayed' ? 'Hub Gateway A' : status === 'completed' ? 'Destination Facility' : 'Origin Terminal';
          return <span className="text-xs text-slate-400 font-mono min-w-[160px] block">{stop}</span>;
        },
      },
      {
        accessorKey: 'estimatedArrival',
        header: 'ETA',
        cell: (info) => <span className="text-xs font-mono text-slate-300 min-w-[130px] block">{formatDate(info.getValue() as string)}</span>,
      },
      {
        id: 'delay',
        header: 'Delay',
        cell: ({ row }) => {
          const isDelayed = row.original.status === 'delayed';
          return (
            <span className={cn('text-xs font-mono font-medium min-w-[90px] block', isDelayed ? 'text-rose-400' : 'text-emerald-400')}>
              {isDelayed ? '+1h 45m' : 'On Time'}
            </span>
          );
        },
      },
      {
        id: 'progress',
        header: 'Progress',
        cell: ({ row }) => {
          const status = row.original.status;
          const pct = status === 'completed' ? 100 : status === 'in_transit' ? 65 : status === 'delayed' ? 40 : 10;
          return (
            <div className="w-28 flex items-center gap-1.5 min-w-[110px]">
              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[10px] font-mono text-slate-400">{pct}%</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'weightKg',
        header: 'Cargo Weight / Volume',
        cell: ({ row }) => (
          <div className="text-xs min-w-[160px]">
            <span className="font-mono text-slate-200">{formatNumber(row.original.weightKg)} kg</span>
            <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{row.original.cargoDescription}</div>
          </div>
        ),
      },
      {
        accessorKey: 'customerName',
        header: 'Customer',
        cell: (info) => <span className="font-medium text-slate-200 text-xs min-w-[140px] block">{String(info.getValue())}</span>,
      },
      {
        id: 'lastUpdated',
        header: 'Last Updated',
        cell: () => <span className="text-[11px] font-mono text-slate-400 min-w-[100px] block">12m ago</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenDrawer(row.original)}
              title="Edit Trip"
            >
              <Edit3 className="h-3.5 w-3.5 text-slate-400 hover:text-slate-200" />
            </Button>
          </div>
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
            isDrawerOpen && selectedTrip
              ? [{ label: 'Trips', href: '/trips' }, { label: selectedTrip.tripCode }]
              : isDrawerOpen
              ? [{ label: 'Trips', href: '/trips' }, { label: 'New Trip' }]
              : [{ label: 'Trips' }]
          }
        />
      </div>

      <DataTable
        columns={columns}
        data={trips}
        isLoading={isLoading}
        tableName="public.trips"
        onRefresh={fetchTrips}
        onBulkDelete={handleBulkDelete}
        onInsertRow={() => handleOpenDrawer()}
        searchPlaceholder="Filter by Conditions..."
      />

      {/* Drawer Edit Form */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedTrip ? `Edit Trip: ${selectedTrip.tripCode}` : 'Create New Freight Shipment'}
        description="Configure dispatch parameters, priority level, and financial cost allocation."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveTrip}>
              {selectedTrip ? 'Save Changes' : 'Create Trip'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveTrip} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Trip Code" placeholder="e.g., TRIP-1001" value={tripCode} onChange={(e) => setTripCode(e.target.value)} required />
            <Input label="Customer Name" placeholder="e.g., Apex Logistics" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Origin Terminal" placeholder="e.g., Chicago Hub" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
            <Input label="Destination Terminal" placeholder="e.g., Dallas Port" value={destination} onChange={(e) => setDestination(e.target.value)} required />
          </div>
          <Input label="Cargo Description" placeholder="e.g., Industrial machinery parts and equipment" value={cargoDescription} onChange={(e) => setCargoDescription(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Weight (Kg)" type="number" placeholder="e.g., 15000" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
            <Input label="Total Cost (USD)" type="number" placeholder="e.g., 3500" value={costUSD} onChange={(e) => setCostUSD(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Trip Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusType)}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'in_transit', label: 'In Transit' },
                { value: 'delayed', label: 'Delayed' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
            <Select
              label="Priority Level"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
                { value: 'Critical', label: 'Critical' },
              ]}
            />
          </div>
        </form>
      </Drawer>
    </div>
  );
};
