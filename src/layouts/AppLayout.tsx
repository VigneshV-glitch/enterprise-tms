import React, { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '../shell';
import { Drawer } from '../components/common/Drawer';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { SearchOverlay } from '../components/search/SearchOverlay';
import { tripsService } from '../services/tripsService';
import { LoadingFallback } from '../components/common/LoadingFallback';

export const AppLayout: React.FC = () => {
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [newTripOrigin, setNewTripOrigin] = useState('');
  const [newTripDestination, setNewTripDestination] = useState('');
  const [newTripCustomer, setNewTripCustomer] = useState('');
  const [newTripWeight, setNewTripWeight] = useState('15000');
  const [newTripPriority, setNewTripPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateQuickTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await tripsService.createTrip({
        tripCode: `SHIP-${Math.floor(1000 + Math.random() * 9000)}`,
        origin: newTripOrigin || 'Chicago Gateway Hub',
        destination: newTripDestination || 'Dallas Inland Port',
        customerName: newTripCustomer || 'Global Distribution Logistics',
        cargoDescription: 'Express Priority Freight Shipment',
        weightKg: Number(newTripWeight) || 15000,
        status: 'pending',
        priority: newTripPriority,
        scheduledDeparture: new Date().toISOString(),
        estimatedArrival: new Date(Date.now() + 86400000 * 2).toISOString(),
        routeDistanceMiles: 850,
        totalCostUSD: 3400,
      });
      setIsQuickActionOpen(false);
      window.location.reload(); // Refresh views
    } catch (err) {
      console.error('Failed to create trip', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#121212]">
      <AppShell
        onOpenSearch={() => setIsSearchOpen(true)}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </AppShell>

      {/* Universal Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Global Quick Action Drawer */}
      <Drawer
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        title="Create Freight Shipment"
        description="Dispatch a new transportation trip with automated route calculation."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsQuickActionOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" isLoading={isSubmitting} onClick={handleCreateQuickTrip}>
              Dispatch Trip
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateQuickTrip} className="space-y-4">
          <Input
            label="Customer Name"
            placeholder="e.g., Apex Electronics Logistics"
            value={newTripCustomer}
            onChange={(e) => setNewTripCustomer(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Origin Terminal"
              placeholder="e.g., Chicago Hub (IL)"
              value={newTripOrigin}
              onChange={(e) => setNewTripOrigin(e.target.value)}
              required
            />
            <Input
              label="Destination Terminal"
              placeholder="e.g., Dallas Port (TX)"
              value={newTripDestination}
              onChange={(e) => setNewTripDestination(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Payload Weight (Kg)"
              type="number"
              value={newTripWeight}
              onChange={(e) => setNewTripWeight(e.target.value)}
              required
            />
            <Select
              label="Dispatch Priority"
              value={newTripPriority}
              onChange={(e) => setNewTripPriority(e.target.value as any)}
              options={[
                { value: 'Low', label: 'Low Priority' },
                { value: 'Medium', label: 'Medium Priority' },
                { value: 'High', label: 'High Priority' },
                { value: 'Critical', label: 'Critical Expedited' },
              ]}
            />
          </div>
        </form>
      </Drawer>
    </div>
  );
};
