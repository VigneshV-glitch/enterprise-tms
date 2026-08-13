import { Driver } from '../types';
import { IBaseRepository } from './baseRepository';
import { INITIAL_DRIVERS } from '../data/mockData';
import { supabase } from '../lib/supabaseClient';

class DriversRepository implements IBaseRepository<Driver> {
  private inMemoryDrivers: Driver[] = [...INITIAL_DRIVERS];

  async getAll(): Promise<Driver[]> {
    if (supabase) {
      const { data, error } = await supabase.from('drivers').select('*');
      if (!error && data && data.length > 0) return data as Driver[];
    }
    return [...this.inMemoryDrivers];
  }

  async getById(id: string): Promise<Driver | null> {
    if (supabase) {
      const { data } = await supabase.from('drivers').select('*').eq('id', id).single();
      if (data) return data as Driver;
    }
    return this.inMemoryDrivers.find(d => d.id === id) || null;
  }

  async create(item: Omit<Driver, 'id'>): Promise<Driver> {
    const newDriver: Driver = {
      ...item,
      id: `drv-${Date.now().toString().slice(-4)}`,
    };
    if (supabase) {
      const { data } = await supabase.from('drivers').insert(newDriver).select().single();
      if (data) return data as Driver;
    }
    this.inMemoryDrivers.unshift(newDriver);
    return newDriver;
  }

  async update(id: string, item: Partial<Driver>): Promise<Driver> {
    if (supabase) {
      const { data } = await supabase.from('drivers').update(item).eq('id', id).select().single();
      if (data) return data as Driver;
    }
    const idx = this.inMemoryDrivers.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.inMemoryDrivers[idx] = { ...this.inMemoryDrivers[idx], ...item };
      return this.inMemoryDrivers[idx];
    }
    throw new Error(`Driver ${id} not found`);
  }

  async delete(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase.from('drivers').delete().eq('id', id);
      if (!error) return true;
    }
    const lenBefore = this.inMemoryDrivers.length;
    this.inMemoryDrivers = this.inMemoryDrivers.filter(d => d.id !== id);
    return this.inMemoryDrivers.length < lenBefore;
  }
}

export const driversRepository = new DriversRepository();
