// src/controllers/todoController.ts
import { Request, Response } from 'express';
import Todo from '../models/Todo';

export const create = async (req: any, res: Response) => {
  const { title, completed, taskType, status, description } = req.body;
  const userId = req.userId;

  try {
    const newTodo = await Todo.create({ 
      userId, 
      title, 
      completed, 
      taskType, 
      status, 
      description 
    });
    res.status(201).json({ Success: 1, message: 'Todo created', todo: newTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Success: 0, message: 'Error creating todo', status: 500 });
  }
};

export const list = async (req: any, res: Response) => {
  const userId = req.userId;

  try {
    const todos = await Todo.findAll({ where: { userId } });
    res.json({ Success: 1, todos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Success: 0, message: 'Error fetching todos', status: 500 });
  }
};

// New update function
export const update = async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, completed, taskType, status, description } = req.body;
  const userId = req.userId;

  try {
    const todo = await Todo.findOne({ where: { id, userId } });

    if (!todo) {
      return res.status(404).json({ Success: 0, message: 'Todo not found' });
    }

    await todo.update({ title, completed, taskType, status, description });
    res.json({ Success: 1, message: 'Todo updated', todo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Success: 0, message: 'Error updating todo', status: 500 });
  }
};
