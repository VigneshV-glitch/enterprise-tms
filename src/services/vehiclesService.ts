import { Vehicle } from '../types';
import { vehiclesRepository } from '../repositories/vehiclesRepository';

export const vehiclesService = {
  async getVehicles(): Promise<Vehicle[]> {
    return await vehiclesRepository.getAll();
  },

  async getVehicleById(id: string): Promise<Vehicle | null> {
    return await vehiclesRepository.getById(id);
  },

  async createVehicle(payload: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    // Validate unit number & VIN format if required
    return await vehiclesRepository.create(payload);
  },

  async updateVehicle(id: string, payload: Partial<Vehicle>): Promise<Vehicle> {
    return await vehiclesRepository.update(id, payload);
  },

  async deleteVehicle(id: string): Promise<boolean> {
    return await vehiclesRepository.delete(id);
  },
};
