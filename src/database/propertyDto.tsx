import { openDatabase } from '../services';
import { db } from '../services';

export type DataType = {
  id?: number;
  propertyType: string;
  bedrooms: string;
  dateTime: string;
  monthlyRentPrice: string;
  furnitureTypes?: string;
  notes?: string;
  reporterName: string;
  description?: string;
  image?: string;
};

export const converToDataType = (data: Array<any>) => {
  return data.map(item => ({
    id: item.id,
    propertyType: item.property_type,
    bedrooms: item.bedrooms,
    dateTime: item.date_time,
    monthlyRentPrice: item.monthly_rent_price,
    furnitureTypes: item.furniture_types,
    notes: item.notes,
    reporterName: item.reporter_name,
    description: item.description,
    image: item.image,
  })) as DataType[];
};

export const createTable = async (tableName: string) => {
  return new Promise<boolean>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id INTEGER PRIMARY KEY NOT NULL,
          property_type TEXT NOT NULL,
          bedrooms INTEGER NOT NULL,
          date_time TEXT NOT NULL,
          monthly_rent_price INTEGER NOT NULL,
          furniture_types TEXT,
          notes TEXT,
          reporter_name TEXT NOT NULL,
          description TEXT,
          image TEXT
        );
     `,
        [],
        () => {
          console.log('Table created successfully');
          resolve(true);
        },
        (_, error) => {
          console.log('Create table error', error);
          reject(false);
          return false;
        },
      );
    });
  });
};

export const insertData = async (tableName: string, data: DataType) => {
  return new Promise<boolean>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        INSERT INTO ${tableName} (
          property_type,
          bedrooms,
          date_time,
          monthly_rent_price,
          furniture_types,
          notes,
          reporter_name,
          description,
          image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          data.propertyType,
          data.bedrooms,
          data.dateTime,
          data.monthlyRentPrice,
          data.furnitureTypes || '',
          data.notes || '',
          data.reporterName,
          data.description || '',
          data.image || '',
        ],
        () => {
          console.log('Inserted successfully');
          resolve(true);
        },
        (_, error) => {
          console.log('Insert data error', error);
          reject(false);
          return false;
        },
      );
    });
  });
};

export const getData = async (tableName: string) => {
  return new Promise<Array<DataType>>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
          SELECT * FROM ${tableName}
        `,
        [],
        (_, { rows }) => {
          console.log('Get all data success');
          resolve(converToDataType(rows._array));
        },
        error => {
          console.log('Get all data error', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const getOneData = async (tableName: string, id: number | string) => {
  return new Promise<DataType>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
          SELECT * FROM ${tableName} WHERE id = ?
        `,
        [id],
        (_, { rows }) => {
          console.log('Get one data success');
          resolve(converToDataType(rows._array)[0]);
        },
        error => {
          console.log('Get one data error', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const updateData = async (
  tableName: string,
  id: number | string,
  data: DataType,
) => {
  return new Promise<boolean>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
          UPDATE ${tableName} SET
            property_type = ?,
            bedrooms = ?,
            date_time = ?,
            monthly_rent_price = ?,
            furniture_types = ?,
            notes = ?,
            reporter_name = ?,
            description = ?,
            image = ?
          WHERE id = ?
        `,
        [
          data.propertyType,
          data.bedrooms,
          data.dateTime,
          data.monthlyRentPrice,
          data.furnitureTypes || '',
          data.notes || '',
          data.reporterName,
          data.description || '',
          data.image || '',
          id,
        ],
        () => {
          console.log('Update data success');
          resolve(true);
        },
        error => {
          console.log('Update data error', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const getDataByField = async (
  tableName: string,
  field: string,
  value: string | number,
) => {
  return new Promise<Array<DataType>>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
          SELECT * FROM ${tableName} WHERE ${field} = ?
        `,
        [value],
        (_, { rows }) => {
          resolve(converToDataType(rows._array));
        },
        error => {
          reject(error);
          return false;
        },
      );
    });
  });
};

export const updateOneField = async (
  tableName: string,
  id: number | string,
  field: string,
  value: string | number,
) => {
  return new Promise<boolean>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
          UPDATE ${tableName} SET ${field} = ? WHERE id = ?
        `,
        [value, id],
        () => {
          console.log('Update one field success');
          resolve(true);
        },
        error => {
          console.log('Update one field error', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const deleteData = async (tableName: string, id: number | string) => {
  return new Promise<boolean>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
          DELETE FROM ${tableName} WHERE id = ?
        `,
        [id],
        () => {
          console.log('Delete data success');
          resolve(true);
        },
        error => {
          console.log('Delete data error', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const deleteAllData = async (tableName: string) => {
  return new Promise<boolean>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
          DELETE FROM ${tableName}
        `,
        [],
        () => {
          console.log('Delete all data success');
          resolve(true);
        },
        error => {
          console.log('Delete all data error', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const dropTable = async (tableName: string) => {
  return new Promise<boolean>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
          DROP TABLE ${tableName}
        `,
        [],
        () => {
          console.log('Drop table success');
          resolve(true);
        },
        error => {
          console.log('Drop table error', error);
          reject(error);
          return false;
        },
      );
    });
  });
};
