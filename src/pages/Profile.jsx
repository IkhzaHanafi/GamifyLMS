import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography, Container, Avatar, Card, CardContent, IconButton } from '@mui/material';
import BottomNavbar from '../components/BottomNavbar';
import { doc, getDoc } from "firebase/firestore";
import { firestore, auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import checkAuthStatus from '../auth';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LinearProgress from '@mui/material/LinearProgress';
import addExpToUser from '../utils/levelingUtils'

// const userData2 = {
//   photoUrl: 'https://example.com/user-photo.jpg', // Replace with the URL of the user's photo
//   userName: 'John Doe', // Replace with the user's name
//   level: 3,
//   exp: 350,
//   totalExpNeeded: 500, // The total experience points needed to level up
//   achievements: [
//     { id: 1, title: 'Achievement 1', avatarUrl: 'https://example.com/achievement1.jpg' },
//     { id: 2, title: 'Achievement 2', avatarUrl: 'https://example.com/achievement2.jpg' },
//   ],
// };

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userClasses, setUserClasses] = useState([]);

  useEffect(() => {
    // Retrieve classesData from localStorage
    const classesData = JSON.parse(localStorage.getItem('userClasses'));
    setUserClasses(classesData);
  }, []);

  useEffect(() => {
    checkAuthStatus()
      .then((user) => {
        // User is authenticated, fetch user data from Firestore and save to local storage
        const docRef = doc(firestore, 'users', user.uid); // Assuming you have a collection named "users" in Firestore
        // addExpToUser(user.uid, 90)
        getDoc(docRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              // Save user data to local storage
              localStorage.setItem('userData', JSON.stringify(userData));
              // For example, set user data to state or perform other actions
              setUserData(userData);
            } else {
              // User document does not exist in Firestore
              console.log('No user data found in Firestore!');
            }
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            console.log('Error fetching user data:', error);
          });
      })
      .catch((error) => {
        // User is not authenticated, redirect to login page
        // navigate('/login');
        setIsLoading(false);
      });
  }, [navigate]);


  const calculateProgress = (currentExp, totalExpNeeded) => {
    return (currentExp / totalExpNeeded) * 100;
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('userData');
      navigate('/login');
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  // Function to calculate remaining Exp to reach next level
  const calculateRemainingExp = (currentExp, expThreshold) => {
    return currentExp % expThreshold;
  };

  return (
    <ProfileContainer maxWidth="sm">
      <LogoutIcon onClick={handleLogout}>
        <ExitToAppIcon />
      </LogoutIcon>

      {
        isLoading ? ( // Render loading state while fetching data
          <Typography variant="h5">Loading...</Typography>
        ) : (
          <>
            <ProfileAvatar alt={userData?.namaLengkap} src={userData?.photoUrl} />

            <Typography variant="h5" gutterBottom>
              {userData?.namaLengkap}
            </Typography>
            <LevelText variant="subtitle1">Level {userData?.level}</LevelText>
            <LevelInfo>
              <LinearProgress
                sx={
                  {
                    width: '100%',
                    height: '10px',
                  }
                }
                variant="determinate"
                value={calculateProgress(calculateRemainingExp(userData?.exp, 500), 500)}
              />
              <Typography variant="body2">
                {calculateRemainingExp(userData?.exp, 500)} Exp / {500} Exp
              </Typography>
            </LevelInfo>
            {/* <Typography variant="h6" gutterBottom>
              Penghargaan
            </Typography> */}
            {/* <AchievementsContainer>
              {userData2?.achievements?.map((achievement) => (
                <Avatar key={achievement.id} alt={achievement.title} src={achievement.avatarUrl} />
              ))}
            </AchievementsContainer> */}

            <Typography variant="h6" gutterBottom>
              Daftar kelas yang diikuti
            </Typography>
            {userClasses.map((classData) => (
              <ClassCard key={classData.id}>
                <CardContent>
                  <ClassTitle>{classData.className}</ClassTitle>
                </CardContent>
              </ClassCard>
            ))}
          </>
        )
      }
      < BottomNavbar />
    </ProfileContainer>
  );
};

export default ProfilePage;


const LogoutIcon = styled(IconButton)`
  && {
    position: absolute;
    top: 16px;
    right: 16px;
    color: #3f51b5;
  }
`;


const ProfileContainer = styled(Container)`
&& {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f0f0;
    padding: 16px;
    position: relative; /* Required for absolute positioning */
}
`;

const ProfileAvatar = styled(Avatar)`
&& {

    width: 100px;
    height: 100px;
    margin-bottom: 16px;
}
`;

const LevelInfo = styled.div`
&& {
    display: flex;
    align-items: center;
    text-align: center;
    margin-bottom: 16px;
    width: 100%;
}
  
`;

const LevelText = styled(Typography)`
  && {
    margin-right: 16px;
  }
`;

const AchievementsContainer = styled.div`
&& {
    display: flex;
  overflow-x: auto;
  margin-bottom: 16px;

  & > * {
    margin-left: 8px;
  }
}
`;

const ClassCard = styled(Card)`
  && {
    width: 400px;
    max-width: 90%;
    background-color: #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
    padding: 16px;
    margin-bottom: 20px;
  }
`;

const ClassTitle = styled(Typography)`
  && {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
  }
`;
