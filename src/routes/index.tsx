import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';

// Lazy loading feature pages for optimal code-splitting
const DashboardPage = lazy(() =>
  import('../features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const TripsPage = lazy(() =>
  import('../features/trips/pages/TripsPage').then((m) => ({ default: m.TripsPage }))
);
const VehiclesPage = lazy(() =>
  import('../features/vehicles/pages/VehiclesPage').then((m) => ({ default: m.VehiclesPage }))
);
const DriversPage = lazy(() =>
  import('../features/drivers/pages/DriversPage').then((m) => ({ default: m.DriversPage }))
);
const LocationsPage = lazy(() =>
  import('../features/locations/pages/LocationsPage').then((m) => ({ default: m.LocationsPage }))
);
const CargoPage = lazy(() =>
  import('../features/cargo/pages/CargoPage').then((m) => ({ default: m.CargoPage }))
);
const DockPage = lazy(() =>
  import('../features/dock/pages/DockPage').then((m) => ({ default: m.DockPage }))
);
const NotificationsPage = lazy(() =>
  import('../features/notifications/pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage }))
);
const ReportsPage = lazy(() =>
  import('../features/reports/pages/ReportsPage').then((m) => ({ default: m.ReportsPage }))
);
const SettingsPage = lazy(() =>
  import('../features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

import { LoadingFallback } from '../components/common/LoadingFallback';


export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="trips" element={<TripsPage />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="drivers" element={<DriversPage />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="cargo" element={<CargoPage />} />
            <Route path="dock" element={<DockPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
