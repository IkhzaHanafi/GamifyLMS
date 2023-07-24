import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, TextField, Button, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { firestore, auth } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { doc, setDoc } from "firebase/firestore";

const StyledContainer = styled(Container)`
    && {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 100px;
    }
  `;

const StyledTypography = styled(Typography)`
    && {
      margin-bottom: 16px;
    }
  `;

const StyledLockIcon = styled(LockOutlinedIcon)`
    && {
      font-size: 48px;
      color: #3f51b5;
      margin-bottom: 16px;
    }
  `;

const StyledButton = styled(Button)`
    && {
      margin-bottom: 16px;
      background-color: #3f51b5;
      color: #ffffff;
      &:hover {
        background-color: #2c387e;
      }
    }
  `;

const StyledLink = styled(Link)`
    && {
      text-decoration: none;
    }
  `;

const Register = () => {
  const navigate = useNavigate();
  const [namaLengkap, setNamaLengkap] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  // const [nim, setNim] = useState('');
  const MySwal = withReactContent(Swal);

  const handleRegister = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Registration success, you can do further actions here if needed
        console.log('Registration successful:', userCredential.user);

        try {
          // Save user data to Firestore
          const userRef = doc(firestore, "users", userCredential.user.uid);
          setDoc(userRef, {
            namaLengkap: namaLengkap,
            username: username,
            email: email,
          });

          // Registration and data saving success
          console.log('User data saved to Firestore successfully!');
          MySwal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Kamu berhasil daftar! Silahkan login',
          });
          navigate('/login');
        } catch (error) {
          // Handle error
          console.error('Error saving user data to Firestore:', error);
        }

      })
      .catch((error) => {
        // Handle registration error
        console.error('Registration error:', error);
        MySwal.fire({
          icon: 'error',
          title: 'Gagal',
          text: error.message,
        });
      });
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledLockIcon />

      <StyledTypography variant="h4" align="center" gutterBottom>
        Register
      </StyledTypography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Silahkan isi data berikut untuk registrasi
      </Typography>

      <TextField
        fullWidth
        label="Nama lengkap"
        variant="outlined"
        value={namaLengkap}
        onChange={(e) => setNamaLengkap(e.target.value)}
        margin="normal"
      />

      {/* <TextField
        fullWidth
        label="NIM"
        variant="outlined"
        value={nim}
        onChange={(e) => setNim(e.target.value)}
        margin="normal"
      /> */}
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />

      

      <StyledButton variant="contained" onClick={handleRegister} fullWidth>
        Register
      </StyledButton>

      <Typography variant="body2" align="center" gutterBottom>
        Sudah punya akun? <StyledLink to="/login">Login disini</StyledLink>
      </Typography>
    </StyledContainer>
  );
};

export default Register;
