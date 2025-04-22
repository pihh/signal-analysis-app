import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SensorDB extends DBSchema {
  readings: {
    key: number;
    value: {
      id?: number;
      timestamp: number;
      position: number;

      magnetometer: { x: number; y: number; z: number };
      accelerometer: { x: number; y: number; z: number };
      rssi: number | null;
      label?: string; // "stud" or "empty" or unknown
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class SensorStorageService {
  private db!: IDBPDatabase<SensorDB>;

  constructor() {
    this.initDB();
  }

  private async initDB() {
    this.db = await openDB<SensorDB>('StudFinderDB', 1, {
      upgrade(db) {
        db.createObjectStore('readings', {
          keyPath: 'id',
          autoIncrement: true
        });
      }
    });
  }

  async saveReading(reading: Omit<SensorDB['readings']['value'], 'id'>) {
    await this.db.add('readings', reading);
  }

  async getAllReadings(): Promise<SensorDB['readings']['value'][]> {
    return await this.db.getAll('readings');
  }

  async clearReadings() {
    await this.db.clear('readings');
  }
}
