import { FilterConfig } from '../../../components/filter/filter.types';

export const locationsFilterConfig: FilterConfig = {
  pageId: 'locations',
  title: 'Location Filters',
  fields: [
    {
      id: 'status',
      label: 'Facility Status',
      type: 'status',
      operators: ['in', 'equals'],
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Congested', value: 'congested' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      id: 'type',
      label: 'Facility Type',
      type: 'select',
      operators: ['in', 'equals'],
      options: [
        { label: 'Logistics Hub', value: 'hub' },
        { label: 'Maritime Port', value: 'port' },
        { label: 'Storage Warehouse', value: 'warehouse' },
        { label: 'Border Crossing Depot', value: 'border_crossing' },
      ],
    },
    {
      id: 'city',
      label: 'Metropolitan Area',
      type: 'select',
      operators: ['in', 'contains'],
      options: [
        { label: 'Chicago, IL', value: 'Chicago' },
        { label: 'Dallas, TX', value: 'Dallas' },
        { label: 'Seattle, WA', value: 'Seattle' },
        { label: 'Atlanta, GA', value: 'Atlanta' },
        { label: 'New York, NY', value: 'New York' },
        { label: 'Los Angeles, CA', value: 'Los Angeles' },
      ],
    },
    {
      id: 'capacity',
      label: 'Staging Capacity',
      type: 'range',
      operators: ['range'],
      options: [
        { label: 'Small Facility (< 50 bays)', value: 'lt_50' },
        { label: 'Medium Facility (50 - 150 bays)', value: '50_150' },
        { label: 'Major Hub (> 150 bays)', value: 'gt_150' },
      ],
    },
  ],
};
