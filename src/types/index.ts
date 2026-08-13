/**
 * Enterprise Transportation Management System (TMS) Domain Types
 */

export type StatusType = 
  | 'active'
  | 'in_transit'
  | 'pending'
  | 'delayed'
  | 'completed'
  | 'cancelled'
  | 'maintenance'
  | 'available'
  | 'assigned'
  | 'off_duty';

export interface Vehicle {
  id: string;
  vin: string;
  unitNumber: string;
  make: string;
  model: string;
  year: number;
  type: 'Semi-Truck' | 'Box Truck' | 'Sprinter Van' | 'Flatbed' | 'Refrigerated';
  status: StatusType;
  fuelLevelPercent: number;
  odometerMiles: number;
  maxPayloadKg: number;
  currentLocation: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  lastServiceDate: string;
  nextServiceDueDate: string;
}

export interface Driver {
  id: string;
  cdlNumber: string;
  fullName: string;
  email: string;
  phone: string;
  status: StatusType;
  licenseClass: 'Class A CDL' | 'Class B CDL' | 'HazMat Certified' | 'Standard';
  safetyScore: number; // e.g. 98%
  drivingHoursThisWeek: number;
  assignedVehicleUnit?: string;
  homeTerminal: string;
  certifications: string[];
}

export interface Trip {
  id: string;
  tripCode: string;
  origin: string;
  destination: string;
  customerName: string;
  cargoDescription: string;
  weightKg: number;
  status: StatusType;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  scheduledDeparture: string;
  estimatedArrival: string;
  actualDeparture?: string;
  actualArrival?: string;
  driverId?: string;
  driverName?: string;
  vehicleId?: string;
  vehicleUnit?: string;
  routeDistanceMiles: number;
  totalCostUSD: number;
}

export interface HubLocation {
  id: string;
  code: string;
  name: string;
  type: 'Distribution Center' | 'Port Hub' | 'Cross-Dock Facility' | 'Customer Warehouse';
  city: string;
  state: string;
  totalDocks: number;
  availableDocks: number;
  currentCapacityPercent: number;
  status: StatusType;
}

export interface CargoItem {
  id: string;
  trackingNumber: string;
  description: string;
  weightKg: number;
  volumeM3: number;
  isHazardous: boolean;
  temperatureControlled: boolean;
  targetTempC?: number;
  status: StatusType;
  originHub: string;
  destinationHub: string;
  tripId?: string;
}

export interface DockSlot {
  id: string;
  hubId: string;
  hubName: string;
  dockNumber: string;
  status: 'Available' | 'Loading' | 'Unloading' | 'Maintenance' | 'Reserved';
  assignedTripCode?: string;
  assignedVehicleUnit?: string;
  etaTime?: string;
}

export interface TMSNotification {
  id: string;
  title: string;
  message: string;
  category: 'Trip Alert' | 'Maintenance' | 'CDL Expiry' | 'Dock Delay' | 'System';
  severity: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
  read: boolean;
}

export interface DashboardMetrics {
  activeTripsCount: number;
  fleetUtilizationRate: number;
  onTimeDeliveryRate: number;
  totalFreightCostUSD: number;
  availableDriversCount: number;
  delayedTripsCount: number;
  openDockSlotsCount: number;
  totalCarbonSavedTons: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: 'Logistics Director' | 'Fleet Dispatcher' | 'Driver Supervisor' | 'System Admin';
  avatarUrl?: string;
  department: string;
}
