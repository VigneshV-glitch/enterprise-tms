import { HubLocation } from '../types';
import { IBaseRepository } from './baseRepository';
import { INITIAL_HUBS } from '../data/mockData';

class LocationsRepository implements IBaseRepository<HubLocation> {
  private memory: HubLocation[] = [...INITIAL_HUBS];

  async getAll(): Promise<HubLocation[]> {
    return [...this.memory];
  }

  async getById(id: string): Promise<HubLocation | null> {
    return this.memory.find(h => h.id === id) || null;
  }

  async create(item: Omit<HubLocation, 'id'>): Promise<HubLocation> {
    const newHub: HubLocation = {
      ...item,
      id: `hub-${Date.now().toString().slice(-4)}`,
    };
    this.memory.unshift(newHub);
    return newHub;
  }

  async update(id: string, item: Partial<HubLocation>): Promise<HubLocation> {
    const idx = this.memory.findIndex(h => h.id === id);
    if (idx !== -1) {
      this.memory[idx] = { ...this.memory[idx], ...item };
      return this.memory[idx];
    }
    throw new Error(`Hub ${id} not found`);
  }

  async delete(id: string): Promise<boolean> {
    const before = this.memory.length;
    this.memory = this.memory.filter(h => h.id !== id);
    return this.memory.length < before;
  }
}

export const locationsRepository = new LocationsRepository();
