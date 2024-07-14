import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import User from './User';

class Todo extends Model {
  public id!: number;
  public userId!: number;
  public title!: string;
  public completed!: boolean;
  public taskType!: 'work' | 'personal' | 'other';
  public status!: 'pending' | 'in_progress' | 'completed';
  public description!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Todo.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  taskType: {
    type: DataTypes.ENUM('work', 'personal', 'other'),
    allowNull: false,
    defaultValue: 'other',
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Todo',
  tableName: 'todos',
  timestamps: true, // This enables the createdAt and updatedAt fields
});

export default Todo;
