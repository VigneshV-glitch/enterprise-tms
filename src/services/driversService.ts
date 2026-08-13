import { Driver } from '../types';
import { driversRepository } from '../repositories/driversRepository';

export const driversService = {
  async getDrivers(): Promise<Driver[]> {
    return await driversRepository.getAll();
  },

  async getDriverById(id: string): Promise<Driver | null> {
    return await driversRepository.getById(id);
  },

  async createDriver(payload: Omit<Driver, 'id'>): Promise<Driver> {
    return await driversRepository.create(payload);
  },

  async updateDriver(id: string, payload: Partial<Driver>): Promise<Driver> {
    return await driversRepository.update(id, payload);
  },

  async deleteDriver(id: string): Promise<boolean> {
    return await driversRepository.delete(id);
  },
};
