import { CargoItem } from '../types';
import { IBaseRepository } from './baseRepository';
import { INITIAL_CARGO } from '../data/mockData';

class CargoRepository implements IBaseRepository<CargoItem> {
  private memory: CargoItem[] = [...INITIAL_CARGO];

  async getAll(): Promise<CargoItem[]> {
    return [...this.memory];
  }

  async getById(id: string): Promise<CargoItem | null> {
    return this.memory.find(c => c.id === id) || null;
  }

  async create(item: Omit<CargoItem, 'id'>): Promise<CargoItem> {
    const newItem: CargoItem = {
      ...item,
      id: `crg-${Date.now().toString().slice(-4)}`,
    };
    this.memory.unshift(newItem);
    return newItem;
  }

  async update(id: string, item: Partial<CargoItem>): Promise<CargoItem> {
    const idx = this.memory.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.memory[idx] = { ...this.memory[idx], ...item };
      return this.memory[idx];
    }
    throw new Error(`Cargo ${id} not found`);
  }

  async delete(id: string): Promise<boolean> {
    const before = this.memory.length;
    this.memory = this.memory.filter(c => c.id !== id);
    return this.memory.length < before;
  }
}

export const cargoRepository = new CargoRepository();
