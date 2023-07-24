import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, TextField, Button, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

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

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const MySwal = withReactContent(Swal);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login successful, do something with the user data if needed
        console.log('Login successful:', userCredential.user);
  
        // Show a success alert using SweetAlert
        MySwal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Kamu berhasil login.',
        });
  
        // Redirect to the desired page after successful login
        navigate('/');
      })
      .catch((error) => {
        // Handle login error here
        console.error('Login error:', error.message);
  
        // Show an error alert using SweetAlert
        MySwal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Email atau Password Salah!.',
        });
      });
  };


  return (
    <StyledContainer maxWidth="sm">
      <StyledLockIcon />

      <StyledTypography variant="h4" align="center" gutterBottom>
        Login
      </StyledTypography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Silahkan isi data berikut untuk login
      </Typography>

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
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />

      <StyledButton variant="contained" onClick={handleLogin} fullWidth>
        Login
      </StyledButton>

      <Typography variant="body2" align="center" gutterBottom>
        Belum Memiliki Akun? <StyledLink to="/register">Daftar Disini</StyledLink>
      </Typography>
    </StyledContainer>
  );
};

export default Login;
