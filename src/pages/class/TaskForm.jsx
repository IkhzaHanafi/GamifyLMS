import React, { useState } from 'react';
import { Typography, TextField, Button } from '@mui/material';
import styled from 'styled-components';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const FormContainer = styled.div`
  &&{display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;}
`;

const TaskForm = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new task object with the form data
      const task = {
        title: taskTitle,
        description: taskDescription,
        date: new Date().toISOString(),
        type: 'task', // You can adjust this based on your data model
      };

      // Get a reference to the "tasks" collection under the class
      const tasksCollectionRef = collection(firestore, 'classes', classId, 'tasks');

      // Add the task to the "tasks" collection under the class
      await addDoc(tasksCollectionRef, task);

      // Reset the form fields
      setTaskTitle('');
      setTaskDescription('');
      navigate(-1);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <FormContainer>
        <Typography variant="h6">Tambah Tugas Baru</Typography>
        <TextField
          label="Judul Tugas"
          variant="outlined"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
        />
        <TextField
          label="Deskripsi Tugas"
          variant="outlined"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          required
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" color="primary">
          Tambah Tugas
        </Button>
      </FormContainer>
    </form>
  );
};

export default TaskForm;
