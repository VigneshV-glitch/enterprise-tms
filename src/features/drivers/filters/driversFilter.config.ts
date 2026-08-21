import { FilterConfig } from '../../../components/filter/filter.types';

export const driversFilterConfig: FilterConfig = {
  pageId: 'drivers',
  title: 'Driver Filters',
  fields: [
    {
      id: 'status',
      label: 'Driver Status',
      type: 'status',
      operators: ['in', 'equals'],
      options: [
        { label: 'Available', value: 'available' },
        { label: 'In Transit', value: 'in_transit' },
        { label: 'Delayed', value: 'delayed' },
        { label: 'Off Duty / Rest', value: 'off_duty' },
      ],
    },
    {
      id: 'licenseClass',
      label: 'License Certification',
      type: 'select',
      operators: ['in', 'equals'],
      options: [
        { label: 'Class A CDL', value: 'Class A CDL' },
        { label: 'Class B CDL', value: 'Class B CDL' },
        { label: 'HazMat Endorsed', value: 'HazMat Certified' },
        { label: 'Tanker Endorsed', value: 'Tanker' },
      ],
    },
    {
      id: 'safetyScore',
      label: 'Safety Score Rating',
      type: 'range',
      operators: ['range'],
      options: [
        { label: 'Excellent (90% - 100%)', value: '90_100' },
        { label: 'Good (80% - 89%)', value: '80_89' },
        { label: 'Needs Attention (< 80%)', value: 'lt_80' },
      ],
    },
    {
      id: 'drivingHoursThisWeek',
      label: 'Weekly HOS Worked',
      type: 'range',
      operators: ['range'],
      options: [
        { label: 'Light Hours (< 20 hrs)', value: 'lt_20' },
        { label: 'Standard Hours (20 - 45 hrs)', value: '20_45' },
        { label: 'Near Capacity (> 45 hrs)', value: 'gt_45' },
      ],
    },
    {
      id: 'homeTerminal',
      label: 'Home Base Terminal',
      type: 'select',
      operators: ['in', 'equals'],
      options: [
        { label: 'Chicago Main Terminal', value: 'Chicago' },
        { label: 'Dallas Regional Depot', value: 'Dallas' },
        { label: 'Seattle Coastal Hub', value: 'Seattle' },
        { label: 'Atlanta Southeast Terminal', value: 'Atlanta' },
      ],
    },
  ],
};
