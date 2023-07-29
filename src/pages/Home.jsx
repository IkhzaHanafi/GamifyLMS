import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Container, Card, CardContent, CardHeader, Avatar, IconButton } from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';
import FloatingAddButton from '../components/FloatingButton';
import checkAuthStatus from '../auth';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from '../firebase';

import BottomNavbar from '../components/BottomNavbar';

const StyledContainer = styled(Container)`
  && {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
  }
`;

const StyledClassListContainer = styled.div`
width: 100%;
  max-height: 600px;
  overflow-y: auto; 
`;

const StyledCard = styled(Card)`
  && {
    margin: 16px 0;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: translateY(-4px);
    }
  }
`;

const StyledCardHeader = styled(CardHeader)`
  && {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #f3f3f3;
    border-radius: 8px 8px 0 0;
  }
`;

const StyledAvatar = styled(Avatar)`
  && {
    background-color: #3f51b5;
  }
`;

const StyledLink = styled(Link)`
  && {
    text-decoration: none;
    width: 100%;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState(null);
  const [classesData, setClassesData] = React.useState([]);

  useEffect(() => {
    checkAuthStatus()
      .then((user) => {
        // User is authenticated, fetch user data from Firestore and save to local storage
        const docRef = doc(firestore, 'users', user.uid); // Assuming you have a collection named "users" in Firestore
        getDoc(docRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              // Save user data to local storage
              localStorage.setItem('userData', JSON.stringify(userData));
              // For example, set user data to state or perform other actions
              setUserData(userData);

              // Fetch the class documents where the current user is a participant
              const classesQuery = query(collection(firestore, 'classes'), where('participants', 'array-contains', user.uid));
              getDocs(classesQuery)
                .then((querySnapshot) => {
                  const userClasses = [];
                  querySnapshot.forEach((doc) => {
                    userClasses.push({ id: doc.id, ...doc.data() }); // Add the id field along with the class data
                  });
                  setClassesData(userClasses);
                  localStorage.setItem('userClasses', JSON.stringify(userClasses));
                })
                .catch((error) => {
                  console.error('Error fetching classes:', error);
                });
            } else {
              // User document does not exist in Firestore
              console.log('No user data found in Firestore!');
            }
          })
          .catch((error) => {
            console.log('Error fetching user data:', error);
          });
      })
      .catch((error) => {
        // User is not authenticated, redirect to login page
        navigate('/login');
      });
  }, [navigate]);


  return (
    <>
      <StyledContainer>
        <Typography variant="h4" align="center">
          Selamat Datang
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {userData?.namaLengkap}
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Daftar Kelas Kamu
        </Typography>

        <StyledClassListContainer>
          {classesData.map((classData) => (
            <RouterLink to={`/class/${classData.id}`} key={classData.id} style={{ textDecoration: 'none' }}>
              <StyledCard>
                <StyledCardHeader
                  avatar={
                    <StyledAvatar>
                      <PeopleIcon />
                    </StyledAvatar>
                  }
                  titleTypographyProps={{ variant: 'h6' }}
                  title={classData.className}
                  subheader={`Mentor: ${classData.mentor || 'Unknown Mentor'}`}
                  action={
                    <IconButton aria-label="participants">
                      <PeopleIcon />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary" align="right">
                    Peserta: {classData.participants.length}
                  </Typography>
                </CardContent>
              </StyledCard>
            </RouterLink>
          ))}
        </StyledClassListContainer>
        <BottomNavbar />
        <FloatingAddButton />
      </StyledContainer>
    </>
  );
};

export default Home;
