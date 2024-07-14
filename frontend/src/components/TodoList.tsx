import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '../redux/store';
import { logout } from '../redux/authSlice';
import EditIcon from '@mui/icons-material/Edit';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  taskType: 'work' | 'personal' | 'other';
  status: 'pending' | 'in_progress' | 'completed';
  description: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState<string>('');
  const [taskType, setTaskType] = useState<'work' | 'personal' | 'other'>('other');
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [description, setDescription] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Use the base URL from environment variables
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${baseUrl}/todos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos(response.data.todos);
      } catch (error: any) {
        console.error('Failed to fetch todos:', error);
        if (error.response && error.response.status === 401) {
          router.push('/login');
        }
      }
    };

    fetchTodos();
  }, [token, router, baseUrl]);

  const handleAddTodo = async () => {
    try {
      const newTodo = { title, completed: false, taskType, status, description };
      const response = await axios.post(`${baseUrl}/todos`, newTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos([...todos, response.data.todo]);
      resetForm();
    } catch (error: any) {
      console.error('Failed to add todo:', error);
      if (error.response && error.response.status === 401) {
        router.push('/login');
      }
    }
  };

  const handleEditTodo = async () => {
    if (selectedTodo) {
      try {
        const updatedTodo = { title, taskType, status, description, completed: selectedTodo.completed };
        await axios.put(`${baseUrl}/todos/${selectedTodo.id}`, updatedTodo, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(todos.map(todo => (todo.id === selectedTodo.id ? { ...todo, ...updatedTodo } : todo)));
        resetForm();
      } catch (error: any) {
        console.error('Failed to update todo:', error);
        if (error.response && error.response.status === 401) {
          router.push('/login');
        }
      }
    }
  };

  const handleToggleCompletion = async (id: number) => {
    try {
      const updatedTodo = todos.find(todo => todo.id === id);
      if (updatedTodo) {
        await axios.patch(`${baseUrl}/todos/${id}`, { completed: !updatedTodo.completed }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
      }
    } catch (error: any) {
      console.error('Failed to update todo:', error);
      if (error.response && error.response.status === 401) {
        router.push('/login');
      }
    }
  };

  const handleOpenEditDialog = (todo: Todo) => {
    setSelectedTodo(todo);
    setTitle(todo.title);
    setTaskType(todo.taskType);
    setStatus(todo.status);
    setDescription(todo.description);
    setIsEditing(true);
    setOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setTaskType('other');
    setStatus('pending');
    setDescription('');
    setSelectedTodo(null);
    setIsEditing(false);
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const filteredTodos = statusFilter === 'all'
    ? todos
    : todos.filter(todo => todo.status === statusFilter);

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Todo List
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Todo
      </Button>
      <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mb: 2, ml: 2 }}>
        Logout
      </Button>
      <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
        <InputLabel id="status-filter-label">Filter by Status</InputLabel>
        <Select
          labelId="status-filter-label"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'in_progress' | 'completed')}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Task Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTodos.map(todo => (
              <TableRow key={todo.id} hover>
                <TableCell>{todo.title}</TableCell>
                <TableCell>{todo.taskType}</TableCell>
                <TableCell>{todo.status}</TableCell>
                <TableCell>{todo.description}</TableCell>
                <TableCell>
                  <Checkbox checked={todo.completed} onChange={() => handleToggleCompletion(todo.id)} />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditDialog(todo)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={resetForm}>
        <DialogTitle>{isEditing ? 'Edit Todo' : 'Add Todo'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="taskType-label">Task Type</InputLabel>
            <Select
              labelId="taskType-label"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value as 'work' | 'personal' | 'other')}
            >
              <MenuItem value="work">Work</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'in_progress' | 'completed')}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>
          <Button onClick={isEditing ? handleEditTodo : handleAddTodo}>
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TodoList;
