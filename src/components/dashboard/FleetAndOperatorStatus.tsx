import React from 'react';
import { DriverStatusWidget } from './DriverStatusWidget';
import { VehicleStatusWidget } from './VehicleStatusWidget';

export const FleetAndOperatorStatus: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <DriverStatusWidget />
      <VehicleStatusWidget />
    </div>
  );
};
