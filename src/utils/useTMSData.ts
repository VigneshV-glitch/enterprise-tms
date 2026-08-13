import { useState, useEffect, useCallback } from 'react';
import { Trip, Vehicle, Driver } from '../types';
import { tripsService } from '../services/tripsService';
import { vehiclesService } from '../services/vehiclesService';
import { driversService } from '../services/driversService';

export function useTMSData() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const [t, v, d] = await Promise.all([
        tripsService.getTrips(),
        vehiclesService.getVehicles(),
        driversService.getDrivers(),
      ]);
      setTrips(t);
      setVehicles(v);
      setDrivers(d);
    } catch (err) {
      console.error('Failed to load TMS data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const handleDataChanged = () => refresh();
    window.addEventListener('tms_data_changed', handleDataChanged);
    return () => {
      window.removeEventListener('tms_data_changed', handleDataChanged);
    };
  }, [refresh]);

  return { trips, vehicles, drivers, isLoading, refresh };
}
