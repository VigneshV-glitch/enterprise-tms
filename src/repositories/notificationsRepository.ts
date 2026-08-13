import { TMSNotification } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

class NotificationsRepository {
  private memory: TMSNotification[] = [...INITIAL_NOTIFICATIONS];

  async getAll(): Promise<TMSNotification[]> {
    return [...this.memory];
  }

  async markAsRead(id: string): Promise<TMSNotification> {
    const item = this.memory.find(n => n.id === id);
    if (item) {
      item.read = true;
      return item;
    }
    throw new Error(`Notification ${id} not found`);
  }

  async markAllAsRead(): Promise<void> {
    this.memory.forEach(n => { n.read = true; });
  }

  async create(item: Omit<TMSNotification, 'id' | 'timestamp' | 'read'>): Promise<TMSNotification> {
    const newNotif: TMSNotification = {
      ...item,
      id: `notif-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    this.memory.unshift(newNotif);
    return newNotif;
  }
}

export const notificationsRepository = new NotificationsRepository();
