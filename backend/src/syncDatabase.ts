// src/syncDatabase.ts
import sequelize from './sequelize';
import User from './models/User';
import Todo from './models/Todo';

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // `alter: true` will automatically create tables if they do not exist and update them if needed
    console.log('Database synchronized');
  } catch (err) {
    console.error('Error synchronizing database', err);
  }
};

syncDatabase();
