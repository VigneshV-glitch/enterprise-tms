export type FilterFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'date_range'
  | 'select'
  | 'multi_select'
  | 'boolean'
  | 'status'
  | 'relationship'
  | 'range';

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'does_not_contain'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'between'
  | 'before'
  | 'after'
  | 'is_true'
  | 'is_false'
  | 'in'
  | 'not_in'
  | 'is_empty'
  | 'is_not_empty'
  | 'range';

export interface FilterOption {
  label: string;
  value: string | number | boolean;
}

export interface FilterFieldConfig {
  id: string; // Key matching data object e.g. "status", "priority", "vehicleUnit"
  label: string;
  type: FilterFieldType;
  operators?: FilterOperator[];
  options?: FilterOption[];
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface FilterConfig {
  pageId: string; // e.g. "trips", "vehicles", "drivers"
  title?: string;
  fields: FilterFieldConfig[];
}

export interface FilterCondition {
  id: string;
  fieldId: string;
  fieldLabel: string;
  fieldType: FilterFieldType;
  operator: FilterOperator;
  value: any;
  value2?: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface FilterState {
  conditions: FilterCondition[];
}
