import { FilterConfig } from '../../../components/filter/filter.types';

export const reportsFilterConfig: FilterConfig = {
  pageId: 'reports',
  title: 'Report Filters',
  fields: [
    {
      id: 'category',
      label: 'Report Category',
      type: 'select',
      operators: ['in', 'equals'],
      options: [
        { label: 'Financial & Cost Analysis', value: 'Financial & Cost' },
        { label: 'Fleet & Mileage Metrics', value: 'Fleet & Mileage' },
        { label: 'Safety & HOS Compliance', value: 'Safety & HOS Compliance' },
        { label: 'Cargo & Storage Operations', value: 'Cargo & Storage' },
        { label: 'Maintenance & Fuel Log', value: 'Maintenance & Fuel' },
      ],
    },
    {
      id: 'format',
      label: 'Export File Format',
      type: 'select',
      operators: ['in', 'equals'],
      options: [
        { label: 'PDF Document', value: 'PDF' },
        { label: 'CSV Data Export', value: 'CSV' },
        { label: 'Excel Spreadsheet (XLSX)', value: 'XLSX' },
      ],
    },
    {
      id: 'generatedDate',
      label: 'Generation Period',
      type: 'date',
      operators: ['in', 'equals'],
      options: [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 Days', value: 'last_7_days' },
        { label: 'Last 30 Days', value: 'last_30_days' },
        { label: 'This Month', value: 'this_month' },
      ],
    },
  ],
};
