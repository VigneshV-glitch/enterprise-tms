import { Trip } from '../types';
import { IBaseRepository } from './baseRepository';
import { INITIAL_TRIPS } from '../data/mockData';
import { supabase } from '../lib/supabaseClient';

class TripsRepository implements IBaseRepository<Trip> {
  private inMemoryTrips: Trip[] = [...INITIAL_TRIPS];

  async getAll(): Promise<Trip[]> {
    if (supabase) {
      const { data, error } = await supabase.from('trips').select('*');
      if (!error && data && data.length > 0) return data as Trip[];
    }
    return [...this.inMemoryTrips];
  }

  async getById(id: string): Promise<Trip | null> {
    if (supabase) {
      const { data } = await supabase.from('trips').select('*').eq('id', id).single();
      if (data) return data as Trip;
    }
    return this.inMemoryTrips.find(t => t.id === id) || null;
  }

  async create(item: Omit<Trip, 'id'>): Promise<Trip> {
    const newTrip: Trip = {
      ...item,
      id: `trp-${Date.now().toString().slice(-4)}`,
    };
    if (supabase) {
      const { data } = await supabase.from('trips').insert(newTrip).select().single();
      if (data) return data as Trip;
    }
    this.inMemoryTrips.unshift(newTrip);
    return newTrip;
  }

  async update(id: string, item: Partial<Trip>): Promise<Trip> {
    if (supabase) {
      const { data } = await supabase.from('trips').update(item).eq('id', id).select().single();
      if (data) return data as Trip;
    }
    const idx = this.inMemoryTrips.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.inMemoryTrips[idx] = { ...this.inMemoryTrips[idx], ...item };
      return this.inMemoryTrips[idx];
    }
    throw new Error(`Trip ${id} not found`);
  }

  async delete(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase.from('trips').delete().eq('id', id);
      if (!error) return true;
    }
    const lenBefore = this.inMemoryTrips.length;
    this.inMemoryTrips = this.inMemoryTrips.filter(t => t.id !== id);
    return this.inMemoryTrips.length < lenBefore;
  }
}

export const tripsRepository = new TripsRepository();
