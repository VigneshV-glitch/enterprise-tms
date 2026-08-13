/**
 * Generic Base Repository Interface
 * Follows Clean Architecture & SOLID design principles.
 */

export interface IBaseRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}
