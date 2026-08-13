import { Vehicle } from '../types';
import { IBaseRepository } from './baseRepository';
import { INITIAL_VEHICLES } from '../data/mockData';
import { supabase } from '../lib/supabaseClient';

class VehiclesRepository implements IBaseRepository<Vehicle> {
  private inMemoryVehicles: Vehicle[] = [...INITIAL_VEHICLES];

  async getAll(): Promise<Vehicle[]> {
    if (supabase) {
      const { data, error } = await supabase.from('vehicles').select('*');
      if (!error && data && data.length > 0) return data as Vehicle[];
    }
    return [...this.inMemoryVehicles];
  }

  async getById(id: string): Promise<Vehicle | null> {
    if (supabase) {
      const { data } = await supabase.from('vehicles').select('*').eq('id', id).single();
      if (data) return data as Vehicle;
    }
    return this.inMemoryVehicles.find(v => v.id === id) || null;
  }

  async create(item: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const newVehicle: Vehicle = {
      ...item,
      id: `veh-${Date.now().toString().slice(-4)}`,
    };
    if (supabase) {
      const { data } = await supabase.from('vehicles').insert(newVehicle).select().single();
      if (data) return data as Vehicle;
    }
    this.inMemoryVehicles.unshift(newVehicle);
    return newVehicle;
  }

  async update(id: string, item: Partial<Vehicle>): Promise<Vehicle> {
    if (supabase) {
      const { data } = await supabase.from('vehicles').update(item).eq('id', id).select().single();
      if (data) return data as Vehicle;
    }
    const idx = this.inMemoryVehicles.findIndex(v => v.id === id);
    if (idx !== -1) {
      this.inMemoryVehicles[idx] = { ...this.inMemoryVehicles[idx], ...item };
      return this.inMemoryVehicles[idx];
    }
    throw new Error(`Vehicle ${id} not found`);
  }

  async delete(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (!error) return true;
    }
    const lenBefore = this.inMemoryVehicles.length;
    this.inMemoryVehicles = this.inMemoryVehicles.filter(v => v.id !== id);
    return this.inMemoryVehicles.length < lenBefore;
  }
}

export const vehiclesRepository = new VehiclesRepository();
