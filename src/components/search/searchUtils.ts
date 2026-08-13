import { SearchResultItem } from './types';
import { mockTrips, mockVehicles, mockDrivers, mockLocations } from '../../data/mockData';

export function performUniversalSearch(query: string): SearchResultItem[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResultItem[] = [];

  mockTrips.forEach((trip) => {
    if (
      trip.tripCode.toLowerCase().includes(q) ||
      trip.customerName.toLowerCase().includes(q) ||
      trip.origin.toLowerCase().includes(q) ||
      trip.destination.toLowerCase().includes(q)
    ) {
      results.push({
        id: trip.id,
        type: 'trip',
        title: `${trip.tripCode} - ${trip.customerName}`,
        subtitle: `${trip.origin} → ${trip.destination}`,
        url: '/trips',
      });
    }
  });

  mockVehicles.forEach((v) => {
    if (v.unitNumber.toLowerCase().includes(q) || v.make.toLowerCase().includes(q) || v.vin.toLowerCase().includes(q)) {
      results.push({
        id: v.id,
        type: 'vehicle',
        title: `Vehicle ${v.unitNumber} (${v.make})`,
        subtitle: `VIN: ${v.vin}`,
        url: '/vehicles',
      });
    }
  });

  mockDrivers.forEach((d) => {
    if (d.fullName.toLowerCase().includes(q) || d.cdlNumber.toLowerCase().includes(q)) {
      results.push({
        id: d.id,
        type: 'driver',
        title: d.fullName,
        subtitle: `CDL: ${d.cdlNumber}`,
        url: '/drivers',
      });
    }
  });

  return results;
}
