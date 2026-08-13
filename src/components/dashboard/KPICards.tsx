/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import { useTMSData } from "../../utils/useTMSData";
import { ToggleGroup } from "../common/ToggleGroup";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Package,
  Building2,
  Activity
} from "lucide-react";

export const KPICards: React.FC = () => {
  const { trips, vehicles, drivers } = useTMSData();
  const [activeTab, setActiveTab] = useState<"Overview" | "Trips" | "Fleet" | "Drivers" | "Cargo" | "Facilities">("Overview");

  // Computed metrics per tab
  const getMetricsForTab = () => {
    const activeTripsCount = trips.filter(t => t.status === "In Transit" || t.status === "in_transit" || (t as any).status === "Active").length;
    const completedTripsCount = trips.filter(t => t.status === "Completed" || t.status === "completed" || t.status === "Delivered").length;
    const pendingTripsCount = trips.filter(t => t.status === "Scheduled" || t.status === "pending" || t.status === "Draft" || t.status === "Planned").length;
    const delayedTripsCount = trips.filter(t => t.status === "Delayed" || t.status === "delayed").length;
    const totalVehiclesCount = vehicles.length;
    const activeDriversCount = drivers.filter(d => d.status !== "Off Duty" && d.status !== "off_duty" && d.status !== "Resting").length;
    const maintenanceVehiclesCount = vehicles.filter(v => v.status === "Maintenance" || v.status === "maintenance" || v.status === "Out of Service").length;
    const availableVehiclesCount = vehicles.filter(v => v.status === "Available" || v.status === "available").length;
    const assignedVehiclesCount = vehicles.filter(v => v.status === "Assigned" || v.status === "assigned").length;
    const transitVehiclesCount = vehicles.filter(v => v.status === "In Transit" || v.status === "in_transit").length;
    const availableDriversCount = drivers.filter(d => d.status === "Available" || d.status === "available").length;
    const assignedDriversCount = drivers.filter(d => d.status === "Loading" || d.status === "Driving" || d.status === "Assigned" || d.status === "assigned").length;
    const drivingDriversCount = drivers.filter(d => d.status === "Driving" || d.status === "driving" || trips.some(t => t.driverId === d.id && (t.status === "In Transit" || t.status === "in_transit"))).length;

    switch (activeTab) {
      case "Overview":
        return [
          { 
            title: "Active Trips", 
            value: activeTripsCount.toString(), 
            trend: "+ 2", 
            trendDesc: "vs yesterday", 
            color: "text-blue-500", 
            bg: "bg-blue-500/10", 
            icon: Truck, 
            trendUp: true,
            filter: { status: "In Transit" }
          },
          { 
            title: "Completed Today", 
            value: completedTripsCount.toString(), 
            trend: "+ 5", 
            trendDesc: "91% completion", 
            color: "text-green-500", 
            bg: "bg-emerald-500/10", 
            icon: CheckCircle2, 
            trendUp: true,
            filter: { status: "Completed" }
          },
          { 
            title: "Pending Dispatch", 
            value: pendingTripsCount.toString(), 
            trend: "- 3", 
            trendDesc: "awaiting assignment", 
            color: "text-purple-500", 
            bg: "bg-purple-500/10", 
            icon: Clock, 
            trendUp: false,
            filter: { status: "Scheduled" }
          },
          { 
            title: "Delayed Routes", 
            value: delayedTripsCount.toString(), 
            trend: "+ 1", 
            trendDesc: "need attention", 
            color: "text-red-500", 
            bg: "bg-rose-500/10", 
            icon: AlertCircle, 
            trendUp: true,
            filter: { status: "Delayed" }
          },
          { 
            title: "Total Vehicles", 
            value: totalVehiclesCount.toString(), 
            trend: "0", 
            trendDesc: "fleet capacity", 
            color: "text-blue-500", 
            bg: "bg-blue-500/10", 
            icon: Truck, 
            trendUp: true,
            path: "/vehicles"
          },
          { 
            title: "Active Drivers", 
            value: activeDriversCount.toString(), 
            trend: "+ 2", 
            trendDesc: "on duty", 
            color: "text-orange-500", 
            bg: "bg-orange-500/10", 
            icon: Download, 
            trendUp: true,
            path: "/drivers"
          },
          { 
            title: "Maintenance", 
            value: maintenanceVehiclesCount.toString(), 
            trend: "- 1", 
            trendDesc: "in workshop", 
            color: "text-purple-500", 
            bg: "bg-purple-500/10", 
            icon: FileText, 
            trendUp: false,
            path: "/vehicles",
            filter: { status: "Maintenance" }
          },
          { 
            title: "Incidents", 
            value: delayedTripsCount.toString(), 
            trend: "0", 
            trendDesc: "safety status", 
            color: "text-green-500", 
            bg: "bg-emerald-500/10", 
            icon: CheckCircle2, 
            trendUp: false 
          },
        ];

      case "Trips":
        const onTimeRate = trips.length > 0 ? Math.round(((completedTripsCount) / (trips.length || 1)) * 100) : 94;
        return [
          { 
            title: "Active Trips", 
            value: activeTripsCount.toString(), 
            trend: "+ 2", 
            trendDesc: "in progress", 
            color: "text-blue-500", 
            bg: "bg-blue-500/10", 
            icon: Truck, 
            trendUp: true,
            filter: { status: "In Transit" }
          },
          { 
            title: "Delayed Trips", 
            value: delayedTripsCount.toString(), 
            trend: "+ 1", 
            trendDesc: "requires action", 
            color: "text-red-500", 
            bg: "bg-rose-500/10", 
            icon: AlertCircle, 
            trendUp: true,
            filter: { status: "Delayed" }
          },
          { 
            title: "Unassigned Trips", 
            value: trips.filter(t => !t.driverId && (t.status === "Scheduled" || t.status === "pending" || t.status === "Draft")).length.toString(), 
            trend: "- 3", 
            trendDesc: "unassigned", 
            color: "text-purple-500", 
            bg: "bg-purple-500/10", 
            icon: Clock, 
            trendUp: false 
          },
          { 
            title: "On-Time %", 
            value: `${onTimeRate}%`, 
            trend: "+0.5%", 
            trendDesc: "adherence", 
            color: "text-green-500", 
            bg: "bg-emerald-500/10", 
            icon: CheckCircle2, 
            trendUp: true 
          },
          { 
            title: "Scheduled Trips", 
            value: pendingTripsCount.toString(), 
            trend: "+4", 
            trendDesc: "upcoming", 
            color: "text-blue-500", 
            bg: "bg-blue-500/10", 
            icon: Clock, 
            trendUp: true 
          },
          { 
            title: "POD Pending", 
            value: Math.max(0, completedTripsCount - 2).toString(), 
            trend: "0", 
            trendDesc: "docs audit", 
            color: "text-orange-500", 
            bg: "bg-orange-500/10", 
            icon: FileText, 
            trendUp: false 
          }
        ];

      case "Fleet":
        const utilPct = Math.round(((transitVehiclesCount + assignedVehiclesCount) / (totalVehiclesCount || 1)) * 100);
        return [
          { 
            title: "Available Vehicles", 
            value: availableVehiclesCount.toString(), 
            trend: "+2", 
            trendDesc: "ready for dispatch", 
            color: "text-green-500", 
            bg: "bg-emerald-500/10", 
            icon: Truck, 
            trendUp: true,
            path: "/vehicles"
          },
          { 
            title: "Assigned Vehicles", 
            value: assignedVehiclesCount.toString(), 
            trend: "0", 
            trendDesc: "allocated", 
            color: "text-blue-500", 
            bg: "bg-blue-500/10", 
            icon: Truck, 
            trendUp: true,
            path: "/vehicles"
          },
          { 
            title: "In Transit", 
            value: transitVehiclesCount.toString(), 
            trend: "+1", 
            trendDesc: "on road", 
            color: "text-purple-500", 
            bg: "bg-purple-500/10", 
            icon: Activity, 
            trendUp: true,
            path: "/vehicles"
          },
          { 
            title: "Maintenance", 
            value: maintenanceVehiclesCount.toString(), 
            trend: "-1", 
            trendDesc: "in workshop", 
            color: "text-red-500", 
            bg: "bg-rose-500/10", 
            icon: AlertCircle, 
            trendUp: false,
            path: "/vehicles"
          },
          { 
            title: "Utilization", 
            value: `${utilPct}%`, 
            trend: "+3.2%", 
            trendDesc: "fleet efficiency", 
            color: "text-green-500", 
            bg: "bg-emerald-500/10", 
            icon: CheckCircle2, 
            trendUp: true 
          },
          { 
            title: "Service Due", 
            value: vehicles.filter(v => v.nextServiceDueDate && new Date(v.nextServiceDueDate) <= new Date(Date.now() + 86400000 * 30)).length.toString(), 
            trend: "0", 
            trendDesc: "preventive maintenance", 
            color: "text-orange-500", 
            bg: "bg-orange-500/10", 
            icon: Clock, 
            trendUp: false 
          }
        ];

      case "Drivers":
        const avgSafety = drivers.length > 0 ? Math.round(drivers.reduce((acc, d) => acc + (d.safetyScore || 95), 0) / drivers.length) : 98;
        return [
          { 
            title: "Available Drivers", 
            value: availableDriversCount.toString(), 
            trend: "+1", 
            trendDesc: "on standby", 
            color: "text-green-500", 
            bg: "bg-emerald-500/10", 
            icon: Download, 
            trendUp: true,
            path: "/drivers"
          },
          { 
            title: "Assigned Drivers", 
            value: assignedDriversCount.toString(), 
            trend: "0", 
            trendDesc: "allocated", 
            color: "text-blue-500", 
            bg: "bg-blue-500/10", 
            icon: Download, 
            trendUp: true,
            path: "/drivers"
          },
          { 
            title: "Active Drivers", 
            value: activeDriversCount.toString(), 
            trend: "+2", 
            trendDesc: "on duty today", 
            color: "text-purple-500", 
            bg: "bg-purple-500/10", 
            icon: Activity, 
            trendUp: true,
            path: "/drivers"
          },
          { 
            title: "Drivers With Active Trips", 
            value: drivingDriversCount.toString(), 
            trend: "+1", 
            trendDesc: "in transit", 
            color: "text-blue-500", 
            bg: "bg-blue-500/10", 
            icon: Truck, 
            trendUp: true,
            path: "/drivers"
          },
          { 
            title: "Workload Risk", 
            value: drivers.some(d => d.drivingHoursThisWeek > 40) ? "Moderate" : "Low Risk", 
            trend: "0", 
            trendDesc: "HOS compliant", 
            color: "text-green-500", 
            bg: "bg-emerald-500/10", 
            icon: Shield, 
            trendUp: true 
          },
          { 
            title: "Safety Score", 
            value: `${avgSafety}%`, 
            trend: "+0.2%", 
            trendDesc: "telematics rating", 
            color: "text-green-500", 
            bg: "bg-emerald-500/10", 
            icon: CheckCircle2, 
            trendUp: true 
          }
        ];

      case "Cargo":
        return [
          { 
            title: "Pending Pickup", 
            value: pendingTripsCount.toString(), 
            trend: "+3", 
            trendDesc: "awaiting loading", 
            color: "text-blue-500", 
            bg: "bg-blue-500/10", 
            icon: Package, 
            trendUp: true,
            path: "/cargo"
          },
          { 
            title: "Pickup In Progress", 
            value: Math.min(activeTripsCount, 5).toString(), 
            trend: "0", 
            trendDesc: "at origin dock", 
            color: "text-purple-500", 
            bg: "bg-purple-500/10", 
            icon: Activity, 
            trendUp: true,
            path: "/cargo"
          },
          { 
            title: "Pending Drop", 
            value: activeTripsCount.toString(), 
            trend: "-2", 
            trendDesc: "in transit", 
            color: "text-orange-500", 
            bg: "bg-orange-500/10", 
            icon: Clock, 
            trendUp: false,
            path: "/cargo"
          },
          { 
            title: "Drop Completed", 
            value: completedTripsCount.toString(), 
            trend: "+8", 
            trendDesc: "delivered today", 
            color: "text-green-500", 
            bg: "bg-emerald-500/10", 
            icon: CheckCircle2, 
            trendUp: true,
            path: "/cargo"
          },
          { 
            title: "Exceptions", 
            value: delayedTripsCount.toString(), 
            trend: "-1", 
            trendDesc: "damaged / short", 
            color: "text-red-500", 
            bg: "bg-rose-500/10", 
            icon: AlertCircle, 
            trendUp: false,
            path: "/cargo"
          },
          { 
            title: "Quantity Variance", 
            value: "0.4%", 
            trend: "-0.1%", 
            trendDesc: "audit threshold", 
            color: "text-green-500", 
            bg: "bg-emerald-500/10", 
            icon: CheckCircle2, 
            trendUp: true 
          }
        ];

      case "Facilities":
        return [
          { 
            title: "Hubs Active", 
            value: "4", 
            trend: "0", 
            trendDesc: "operational", 
            color: "text-blue-500", 
            bg: "bg-blue-500/10", 
            icon: Building2, 
            trendUp: true,
            path: "/facilities"
          },
          { 
            title: "Warehouses Online", 
            value: "12", 
            trend: "+1", 
            trendDesc: "fully staffed", 
            color: "text-green-500", 
            bg: "bg-emerald-500/10", 
            icon: Building2, 
            trendUp: true,
            path: "/facilities"
          },
          { 
            title: "Dock Utilization", 
            value: `${Math.min(95, 60 + activeTripsCount * 5)}%`, 
            trend: "+4%", 
            trendDesc: "throughput rate", 
            color: "text-purple-500", 
            bg: "bg-purple-500/10", 
            icon: Activity, 
            trendUp: true 
          },
          { 
            title: "Inbound Queue", 
            value: pendingTripsCount.toString(), 
            trend: "-3", 
            trendDesc: "trucks waiting", 
            color: "text-orange-500", 
            bg: "bg-orange-500/10", 
            icon: Clock, 
            trendUp: false 
          },
          { 
            title: "Outbound Queue", 
            value: activeTripsCount.toString(), 
            trend: "+2", 
            trendDesc: "staging area", 
            color: "text-blue-500", 
            bg: "bg-blue-500/10", 
            icon: Truck, 
            trendUp: true 
          },
          { 
            title: "Facility Alerts", 
            value: delayedTripsCount.toString(), 
            trend: "0", 
            trendDesc: "safety & security", 
            color: "text-green-500", 
            bg: "bg-emerald-500/10", 
            icon: CheckCircle2, 
            trendUp: true 
          }
        ];

      default:
        return [];
    }
  };

  const metrics = getMetricsForTab();

  const handleDrillDown = (metric: any) => {
    if (metric.path) {
      const tabName = metric.path.replace("/", "");
      const formattedTab = tabName.charAt(0).toUpperCase() + tabName.slice(1);
      window.dispatchEvent(new CustomEvent("tms-navigate", { detail: { tab: formattedTab } }));
    } else if (metric.filter) {
      const field = Object.keys(metric.filter)[0];
      const value = metric.filter[field];
      window.dispatchEvent(new CustomEvent("tms-navigate", { 
        detail: { 
          tab: "Trips",
          filter: field.charAt(0).toUpperCase() + field.slice(1),
          value: value
        } 
      }));
    }
  };

  return (
    <div id="dashboard-kpi-grid" className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-[#2d2d2d] p-4 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="font-semibold text-gray-900 dark:text-white leading-[28px] text-[16px]">Operational KPIs</h2>
        
        {/* Toggle Buttons */}
        <ToggleGroup
          options={["Overview", "Trips", "Fleet", "Drivers", "Cargo", "Facilities"]}
          value={activeTab}
          onChange={(val) => setActiveTab(val as any)}
        />
      </div>

      <div className={metrics.length === 8 ? "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 border-t border-l border-gray-100 dark:border-[#2d2d2d] rounded-xl overflow-hidden" : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-t border-l border-gray-100 dark:border-[#2d2d2d] rounded-xl overflow-hidden"}>
        {metrics.map((m, i) => (
          <div 
            key={i}
            onClick={() => handleDrillDown(m)}
            className="p-5 flex flex-col justify-between gap-2 transition-all border-r border-b border-gray-100 dark:border-[#2d2d2d] bg-white dark:bg-[#121212] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] cursor-pointer group" 
          >
            <div className="flex items-start justify-between mb-1">
              <div className={`w-8 h-8 rounded-full ${m.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <m.icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className={`flex items-center px-2 py-0.5 rounded-full text-[12px] font-semibold ${m.trendUp ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                {m.trendUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                {m.trend}
              </div>
            </div>
            
            <div className="flex flex-col mt-2">
              <div className="text-[28px] font-bold text-gray-900 dark:text-white leading-none mb-1">
                {m.value}
              </div>
              <p className="text-[13px] font-medium text-gray-900 dark:text-gray-300 font-sans truncate">
                {m.title}
              </p>
              <div className="text-[#9c9c9c] font-normal font-sans truncate text-[11px] mt-0.5">
                {m.trendDesc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


