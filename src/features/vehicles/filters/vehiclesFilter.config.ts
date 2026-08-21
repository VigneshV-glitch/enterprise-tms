import { FilterConfig } from '../../../components/filter/filter.types';

export const vehiclesFilterConfig: FilterConfig = {
  pageId: 'vehicles',
  title: 'Vehicle Filters',
  fields: [
    {
      id: 'status',
      label: 'Operational Status',
      type: 'status',
      operators: ['in', 'equals'],
      options: [
        { label: 'Available', value: 'available' },
        { label: 'In Transit', value: 'in_transit' },
        { label: 'In Maintenance', value: 'maintenance' },
        { label: 'Delayed', value: 'delayed' },
      ],
    },
    {
      id: 'type',
      label: 'Vehicle Type',
      type: 'select',
      operators: ['in', 'equals'],
      options: [
        { label: 'Semi-Truck', value: 'Semi-Truck' },
        { label: 'Refrigerated (Reefer)', value: 'Refrigerated' },
        { label: 'Flatbed Trailer', value: 'Flatbed' },
        { label: 'Box Truck', value: 'Box Truck' },
        { label: 'Sprinter Cargo Van', value: 'Sprinter Van' },
      ],
    },
    {
      id: 'make',
      label: 'Manufacturer',
      type: 'select',
      operators: ['in', 'equals'],
      options: [
        { label: 'Freightliner', value: 'Freightliner' },
        { label: 'Volvo Trucks', value: 'Volvo' },
        { label: 'Peterbilt', value: 'Peterbilt' },
        { label: 'Kenworth', value: 'Kenworth' },
        { label: 'International', value: 'International' },
      ],
    },
    {
      id: 'fuelLevelPercent',
      label: 'Fuel Level Range',
      type: 'range',
      operators: ['range'],
      options: [
        { label: 'High Fuel (> 75%)', value: 'gt_75' },
        { label: 'Medium Fuel (25% - 75%)', value: '25_75' },
        { label: 'Low Fuel (< 25%)', value: 'lt_25' },
      ],
    },
    {
      id: 'odometerMiles',
      label: 'Odometer Mileage',
      type: 'range',
      operators: ['range'],
      options: [
        { label: 'Low Mileage (< 50,000 mi)', value: 'lt_50k' },
        { label: 'Mid Mileage (50k - 150k mi)', value: '50k_150k' },
        { label: 'High Mileage (> 150,000 mi)', value: 'gt_150k' },
      ],
    },
    {
      id: 'currentLocation',
      label: 'Current Depot / Hub',
      type: 'select',
      operators: ['in', 'contains'],
      options: [
        { label: 'Chicago Central Depot', value: 'Chicago' },
        { label: 'Dallas Distribution Hub', value: 'Dallas' },
        { label: 'Seattle Northwest Terminal', value: 'Seattle' },
        { label: 'Atlanta Logistics Yard', value: 'Atlanta' },
      ],
    },
  ],
};
