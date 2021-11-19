import * as SQLite from 'expo-sqlite';

// Open database with name and version
export const openDatabase = (name: string, version?: string) => {
  return SQLite.openDatabase(`${name}.db`, version, 'database', 1);
};

// Open
export const db = openDatabase('rental_properties_db', '1.1');
