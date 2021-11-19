import { db } from '../services';

export type UserType = {
  id?: number;
  username: string;
  password: string;
  isLoggedIn: number;
};

// Create user table
export const createUserTable = () => {
  return new Promise<boolean>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            isLoggedIn INTEGER NOT NULL
        );
        `,
        [],
        () => {
          console.log('Create user table success');
          resolve(true);
        },
        error => {
          console.log('Create user table error', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

// Insert user
export const insertUser = (user: UserType) => {
  return new Promise<boolean>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        INSERT INTO user (
          username, 
          password, 
          isLoggedIn
          ) VALUES (?, ?, ?);
        `,
        [user.username, user.password, user.isLoggedIn],
        () => {
          console.log('Insert user success');
          resolve(true);
        },
        error => {
          console.log('Insert user error', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

// Get one user
export const getOneUser = (username: string) => {
  return new Promise<UserType>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT * FROM user WHERE username = ?
        `,
        [username],
        (_, { rows }) => {
          console.log('Get one user success');
          resolve(rows._array[0]);
        },
        error => {
          console.log('Get one user error', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

// Update logged in status
export const updateLoggedInStatus = (username: string, isLoggedIn: number) => {
  return new Promise<boolean>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        UPDATE user SET isLoggedIn = ? WHERE username = ?
        `,
        [isLoggedIn, username],
        () => {
          console.log('Update logged in status success');
          resolve(true);
        },
        error => {
          console.log('Update logged in status error', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

// Get all users
export const getAllUsers = () => {
  return new Promise<UserType[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT * FROM user
        `,
        [],
        (_, { rows }) => {
          console.log('Get all users success');
          resolve(rows._array);
        },
        error => {
          console.log('Get all users error', error);
          reject(error);
          return false;
        },
      );
    });
  });
};
