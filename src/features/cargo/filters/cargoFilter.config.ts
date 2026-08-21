import { FilterConfig } from '../../../components/filter/filter.types';

export const cargoFilterConfig: FilterConfig = {
  pageId: 'cargo',
  title: 'Cargo Filters',
  fields: [
    {
      id: 'status',
      label: 'Cargo Status',
      type: 'status',
      operators: ['in', 'equals'],
      options: [
        { label: 'Stored in Warehouse', value: 'stored' },
        { label: 'Assigned to Trip', value: 'assigned' },
        { label: 'In Transit', value: 'in_transit' },
        { label: 'Delivered', value: 'delivered' },
      ],
    },
    {
      id: 'cargoType',
      label: 'Cargo Classification',
      type: 'select',
      operators: ['in', 'equals'],
      options: [
        { label: 'Dry Commercial Goods', value: 'Dry Goods' },
        { label: 'Refrigerated Cold Storage', value: 'Refrigerated / Cold Storage' },
        { label: 'Hazardous Materials (HazMat)', value: 'Hazardous Materials' },
        { label: 'Heavy Industrial Machinery', value: 'Heavy Machinery' },
        { label: 'High-Value Electronics', value: 'Electronics' },
      ],
    },
    {
      id: 'weightKg',
      label: 'Weight Bucket',
      type: 'range',
      operators: ['range'],
      options: [
        { label: 'Light Weight (< 1,000 kg)', value: 'lt_1000' },
        { label: 'Medium Weight (1,000 - 5,000 kg)', value: '1000_5000' },
        { label: 'Heavy Freight (> 5,000 kg)', value: 'gt_5000' },
      ],
    },
    {
      id: 'volumeCbm',
      label: 'Volume Cubic Meters',
      type: 'range',
      operators: ['range'],
      options: [
        { label: 'Small (< 10 m³)', value: 'lt_10' },
        { label: 'Medium (10 - 30 m³)', value: '10_30' },
        { label: 'Large (> 30 m³)', value: 'gt_30' },
      ],
    },
    {
      id: 'destination',
      label: 'Target Destination',
      type: 'select',
      operators: ['in', 'contains'],
      options: [
        { label: 'New York Logistics Hub', value: 'New York' },
        { label: 'Miami Export Terminal', value: 'Miami' },
        { label: 'San Francisco Port Facility', value: 'San Francisco' },
        { label: 'Chicago Distribution Depot', value: 'Chicago' },
      ],
    },
  ],
};
