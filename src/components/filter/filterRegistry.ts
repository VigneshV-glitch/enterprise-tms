import { FilterConfig } from './filter.types';
import { tripsFilterConfig } from '../../features/trips/filters/tripsFilter.config';
import { vehiclesFilterConfig } from '../../features/vehicles/filters/vehiclesFilter.config';
import { driversFilterConfig } from '../../features/drivers/filters/driversFilter.config';
import { cargoFilterConfig } from '../../features/cargo/filters/cargoFilter.config';
import { locationsFilterConfig } from '../../features/locations/filters/locationsFilter.config';
import { dockFilterConfig } from '../../features/dock/filters/dockFilter.config';
import { reportsFilterConfig } from '../../features/reports/filters/reportsFilter.config';

export const FILTER_CONFIG_REGISTRY: Record<string, FilterConfig> = {
  trips: tripsFilterConfig,
  vehicles: vehiclesFilterConfig,
  drivers: driversFilterConfig,
  cargo: cargoFilterConfig,
  locations: locationsFilterConfig,
  dock: dockFilterConfig,
  reports: reportsFilterConfig,
};

/**
 * Resolves filter configuration automatically based on current location pathname or explicit module key.
 */
export function getFilterConfigForPath(pathnameOrKey: string): FilterConfig {
  const cleanKey = pathnameOrKey.replace(/^\//, '').split('/')[0].toLowerCase();
  
  if (FILTER_CONFIG_REGISTRY[cleanKey]) {
    return FILTER_CONFIG_REGISTRY[cleanKey];
  }

  // Generic fallback configuration if page is unknown
  return {
    pageId: cleanKey || 'default',
    title: 'Filters',
    fields: [
      {
        id: 'status',
        label: 'Status',
        type: 'status',
        operators: ['equals', 'not_equals'],
      },
      {
        id: 'code',
        label: 'Code / ID',
        type: 'text',
        operators: ['equals', 'contains', 'starts_with'],
      },
      {
        id: 'name',
        label: 'Name / Label',
        type: 'text',
        operators: ['contains', 'equals'],
      },
    ],
  };
}
