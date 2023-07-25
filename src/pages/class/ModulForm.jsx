import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField, Typography, Button, IconButton, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ModulForm = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([{ name: '', url: '' }]);

  const handleAddAttachment = () => {
    setAttachments([...attachments, { name: '', url: '' }]);
  };

  const handleAttachmentChange = (index, field, value) => {
    const updatedAttachments = attachments.map((attachment, i) =>
      i === index ? { ...attachment, [field]: value } : attachment
    );
    setAttachments(updatedAttachments);
  };

  const handleSubmit = async () => {
    try {
      // Create a new modul object to be added to Firestore
      const newModul = {
        title,
        description,
        date: new Date().toISOString(),
        attachments,
        type: 'modul',
      };

      // Add the new modul to the "moduls" collection in Firestore
      const modulsCollectionRef = collection(firestore, 'classes', classId, 'moduls');

      await addDoc(modulsCollectionRef, newModul);

      // Reset the form fields after successful submission
      setTitle('');
      setDescription('');
      setAttachments([{ name: '', url: '' }]);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Modul Berhasil Ditambah.',
        showConfirmButton: false,
        timer: 1500, // Automatically close the alert after 1.5 seconds
      });
      navigate(-1);
    } catch (error) {
      console.error('Error adding modul:', error);
    }
  };

  return (
    <FormContainer>
      <Typography variant="h6">Tambah Modul Baru</Typography>
      <TextField
        label="Judul"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Deskripsi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />

      <Typography variant="subtitle1">Attachments:</Typography>
      {attachments.map((attachment, index) => (
        <AttachmentInputContainer key={index}>
          <TextField
            label="Name"
            value={attachment.name}
            onChange={(e) => handleAttachmentChange(index, 'name', e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="URL"
            value={attachment.url}
            onChange={(e) => handleAttachmentChange(index, 'url', e.target.value)}
            fullWidth
            margin="normal"
          />
        </AttachmentInputContainer>
      ))}
      <IconButton onClick={handleAddAttachment}>
        <AddIcon />
      </IconButton>

      <SubmitButton variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </SubmitButton>
    </FormContainer>
  );
};

export default ModulForm;

const FormContainer = styled(Paper)`
 &&{ padding: 16px;
  margin-top: 16px;}
`;

const AttachmentInputContainer = styled.div`
  &&{display: flex;
  gap: 16px;}
`;

const SubmitButton = styled(Button)`
  &&{margin-top: 16px;}
`;
