import { Trip } from '../types';
import { tripsRepository } from '../repositories/tripsRepository';

export const tripsService = {
  async getTrips(): Promise<Trip[]> {
    return await tripsRepository.getAll();
  },

  async getTripById(id: string): Promise<Trip | null> {
    return await tripsRepository.getById(id);
  },

  async createTrip(payload: Omit<Trip, 'id'>): Promise<Trip> {
    return await tripsRepository.create(payload);
  },

  async updateTrip(id: string, payload: Partial<Trip>): Promise<Trip> {
    return await tripsRepository.update(id, payload);
  },

  async deleteTrip(id: string): Promise<boolean> {
    return await tripsRepository.delete(id);
  },
};
