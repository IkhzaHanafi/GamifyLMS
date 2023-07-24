import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField, Button } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

const StyledForm = styled.form`
  &&{display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 16px;}
`;

const ModulForm = () => {
  const [modulData, setModulData] = useState({
    title: '',
    description: '',
    date: '',
    attachments: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModulData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add the modul data to Firestore
      const docRef = await addDoc(collection(firestore, 'moduls'), modulData);
      console.log('Modul added with ID: ', docRef.id);

      // Reset the form after successful submission
      setModulData({
        title: '',
        description: '',
        date: '',
        attachments: [],
      });
    } catch (error) {
      console.error('Error adding modul:', error);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <TextField
        label="Title"
        variant="outlined"
        name="title"
        value={modulData.title}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Description"
        variant="outlined"
        name="description"
        value={modulData.description}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Date"
        type="date"
        variant="outlined"
        name="date"
        value={modulData.date}
        onChange={handleInputChange}
        required
        InputLabelProps={{
          shrink: true,
        }}
      />
      {/* Attachments input goes here */}
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </StyledForm>
  );
};

export default ModulForm;

