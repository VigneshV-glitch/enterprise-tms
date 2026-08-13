import { DockSlot } from '../types';
import { IBaseRepository } from './baseRepository';
import { INITIAL_DOCKS } from '../data/mockData';

class DockRepository implements IBaseRepository<DockSlot> {
  private memory: DockSlot[] = [...INITIAL_DOCKS];

  async getAll(): Promise<DockSlot[]> {
    return [...this.memory];
  }

  async getById(id: string): Promise<DockSlot | null> {
    return this.memory.find(d => d.id === id) || null;
  }

  async create(item: Omit<DockSlot, 'id'>): Promise<DockSlot> {
    const newDock: DockSlot = {
      ...item,
      id: `dock-${Date.now().toString().slice(-4)}`,
    };
    this.memory.unshift(newDock);
    return newDock;
  }

  async update(id: string, item: Partial<DockSlot>): Promise<DockSlot> {
    const idx = this.memory.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.memory[idx] = { ...this.memory[idx], ...item };
      return this.memory[idx];
    }
    throw new Error(`Dock ${id} not found`);
  }

  async delete(id: string): Promise<boolean> {
    const before = this.memory.length;
    this.memory = this.memory.filter(d => d.id !== id);
    return this.memory.length < before;
  }
}

export const dockRepository = new DockRepository();
