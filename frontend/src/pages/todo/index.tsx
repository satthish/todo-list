import React, { useState } from 'react';
import TodoList from '@/components/TodoList';
import { Container, Typography } from '@mui/material';


const Todo: React.FC = () => {
  return (
    <Container>
      <TodoList />
    </Container>
  );
};

export default Todo;
