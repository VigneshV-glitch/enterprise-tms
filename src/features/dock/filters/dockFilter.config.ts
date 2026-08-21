import { FilterConfig } from '../../../components/filter/filter.types';

export const dockFilterConfig: FilterConfig = {
  pageId: 'dock',
  title: 'Dock Door Filters',
  fields: [
    {
      id: 'status',
      label: 'Dock Door Status',
      type: 'status',
      operators: ['in', 'equals'],
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Occupied', value: 'occupied' },
        { label: 'In Maintenance', value: 'maintenance' },
        { label: 'Reserved Staging', value: 'reserved' },
      ],
    },
    {
      id: 'dockType',
      label: 'Door Operation Type',
      type: 'select',
      operators: ['in', 'equals'],
      options: [
        { label: 'Inbound Unloading', value: 'Inbound Loading' },
        { label: 'Outbound Staging', value: 'Outbound Staging' },
        { label: 'Cross-Dock Facility', value: 'Cross-Dock' },
        { label: 'Refrigerated Cold Ramp', value: 'Refrigerated Ramp' },
      ],
    },
    {
      id: 'priority',
      label: 'Staging Priority',
      type: 'select',
      operators: ['in', 'equals'],
      options: [
        { label: 'Critical', value: 'Critical' },
        { label: 'High', value: 'High' },
        { label: 'Normal', value: 'Normal' },
      ],
    },
    {
      id: 'assignedVehicle',
      label: 'Docked Vehicle Unit',
      type: 'relationship',
      operators: ['in', 'equals'],
      options: [
        { label: 'TRK-8012', value: 'TRK-8012' },
        { label: 'TRK-8015', value: 'TRK-8015' },
        { label: 'TRK-9020', value: 'TRK-9020' },
        { label: 'TRK-7710', value: 'TRK-7710' },
        { label: 'None (Unassigned)', value: 'unassigned' },
      ],
    },
  ],
};
