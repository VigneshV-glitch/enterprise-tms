import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Users, Plus, Edit3, Shield, Award, Phone } from 'lucide-react';
import { PageHeader } from '../../../shell';
import { DataTable } from '../../../components/table/DataTable';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Drawer } from '../../../components/common/Drawer';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { driversService } from '../../../services/driversService';
import { Driver, StatusType } from '../../../types';

export const DriversPage: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Form
  const [fullName, setFullName] = useState('');
  const [cdlNumber, setCdlNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<StatusType>('available');
  const [licenseClass, setLicenseClass] = useState<Driver['licenseClass']>('Class A CDL');
  const [homeTerminal, setHomeTerminal] = useState('Chicago Logistics Hub');

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const data = await driversService.getDrivers();
      setDrivers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleOpenDrawer = (d?: Driver) => {
    if (d) {
      setSelectedDriver(d);
      setFullName(d.fullName);
      setCdlNumber(d.cdlNumber);
      setEmail(d.email);
      setPhone(d.phone);
      setStatus(d.status);
      setLicenseClass(d.licenseClass);
      setHomeTerminal(d.homeTerminal);
    } else {
      setSelectedDriver(null);
      setFullName('');
      setCdlNumber(`CDL-IL-${Math.floor(1000000 + Math.random() * 9000000)}`);
      setEmail('');
      setPhone('+1 (312) 555-0100');
      setStatus('available');
      setLicenseClass('Class A CDL');
      setHomeTerminal('Chicago Logistics Hub');
    }
    setIsDrawerOpen(true);
  };

  const handleSaveDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedDriver) {
        await driversService.updateDriver(selectedDriver.id, {
          fullName,
          cdlNumber,
          email,
          phone,
          status,
          licenseClass,
          homeTerminal,
        });
      } else {
        await driversService.createDriver({
          fullName,
          cdlNumber,
          email,
          phone,
          status,
          licenseClass,
          homeTerminal,
          safetyScore: 98,
          drivingHoursThisWeek: 15,
          certifications: ['HazMat', 'TWIC Card'],
        });
      }
      setIsDrawerOpen(false);
      fetchDrivers();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = useMemo<ColumnDef<Driver>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: 'Driver Name',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-100 text-xs">{row.original.fullName}</p>
            <p className="text-[10px] text-slate-400 font-mono">{row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: 'cdlNumber',
        header: 'CDL License #',
        cell: (info) => <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'licenseClass',
        header: 'License Class',
        cell: (info) => <span className="text-xs text-slate-300 font-medium">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => <Badge status={info.getValue() as StatusType} />,
      },
      {
        accessorKey: 'safetyScore',
        header: 'Safety Rating',
        cell: (info) => (
          <span className="font-mono font-bold text-xs text-emerald-400">{Number(info.getValue())}%</span>
        ),
      },
      {
        accessorKey: 'drivingHoursThisWeek',
        header: 'HOS Hours',
        cell: (info) => (
          <span className="font-mono text-xs text-slate-300">{Number(info.getValue())} / 60 hrs</span>
        ),
      },
      {
        accessorKey: 'homeTerminal',
        header: 'Home Hub',
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
            isDrawerOpen && selectedDriver
              ? [{ label: 'Drivers', href: '/drivers' }, { label: selectedDriver.cdlNumber || selectedDriver.fullName }]
              : isDrawerOpen
              ? [{ label: 'Drivers', href: '/drivers' }, { label: 'Register Driver' }]
              : [{ label: 'Drivers' }]
          }
        />
      </div>

      <DataTable
        columns={columns}
        data={drivers}
        isLoading={isLoading}
        tableName="public.drivers"
        onRefresh={fetchDrivers}
        onInsertRow={() => handleOpenDrawer()}
        searchPlaceholder="Filter by id, code, name... or ask AI"
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedDriver ? `Edit Driver: ${selectedDriver.fullName}` : 'Register Commercial Driver'}
        description="Maintain regulatory CDL certifications and contact info."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveDriver}>Save Driver</Button>
          </>
        }
      >
        <form onSubmit={handleSaveDriver} className="space-y-4">
          <Input label="Full Name" placeholder="e.g., John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="CDL License Number" placeholder="e.g., CDL-998877" value={cdlNumber} onChange={(e) => setCdlNumber(e.target.value)} required />
            <Select
              label="License Class"
              value={licenseClass}
              onChange={(e) => setLicenseClass(e.target.value as any)}
              options={[
                { value: 'Class A CDL', label: 'Class A CDL (Heavy Combinations)' },
                { value: 'Class B CDL', label: 'Class B CDL (Single Vehicle 26k+ lbs)' },
                { value: 'HazMat Certified', label: 'HazMat Endorsement' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Email Address" type="email" placeholder="e.g., john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Phone Number" placeholder="e.g., +1 (555) 019-2834" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusType)}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'in_transit', label: 'In Transit' },
                { value: 'delayed', label: 'Delayed' },
                { value: 'off_duty', label: 'Off Duty' },
              ]}
            />
            <Input label="Home Terminal Hub" placeholder="e.g., Chicago Depot" value={homeTerminal} onChange={(e) => setHomeTerminal(e.target.value)} />
          </div>
        </form>
      </Drawer>
    </div>
  );
};
