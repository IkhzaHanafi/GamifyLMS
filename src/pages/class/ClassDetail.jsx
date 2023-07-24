import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Card, CardContent, IconButton, LinearProgress, AppBar, Toolbar, Modal, TextField, Button, Backdrop, Fade } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { getAuth, currentUser } from 'firebase/auth';

// Import your Quiz, Modul, and Task form components here
import QuizForm from './QuizForm';
import ModulForm from './ModulForm';
import TaskForm from './TaskForm';

const dummyClassMaterials = [
  {
    id: 1,
    title: 'Quiz Pengantar UIUX',
    type: 'quiz',
    date: '2023-07-26',
  },
  {
    id: 2,
    title: 'Modul Pengantar UIUX',
    type: 'modul',
    date: '2023-07-27',
  },
  {
    id: 3,
    title: 'Task Pengantar UIUX',
    type: 'task',
    date: '2023-07-28',
  },
  {
    id: 4,
    title: 'Modul Lanjutan UIUX',
    type: 'modul',
    date: '2023-07-27',
  },
];


const StyledContainer = styled(Container)`
&& {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;
}
  `;

const ModalContainer = styled.div`
&& {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
}
`;

const ModalButton = styled.button`
&& {
  background-color: #3f51b5;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  margin: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #2c387e;
  }
}
`;

const StyledDate = styled(Typography)`
  && {
    color: #9e9e9e;
    }
  `;

const StyledAppBar = styled(AppBar)`
    && {
      background-color: #3f51b5;
      color: white;
      margin-bottom: 20px;
    }
  `;

const StyledToolbar = styled(Toolbar)`
    display: flex;
    justify-content: space-between;
  `;

const StyledClassName = styled(Typography)`
    && {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    }
  `;

const StyledClassInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0;
  `;

const StyledClassInfo2 = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%; 
  margin-bottom: 20px;
`;

const StyledClassLevel = styled(Typography)`
    && {
      margin-right: 10px;
    }
  `;

const StyledClassRanking = styled(Typography)`
    && {
      margin-left: 10px;
    }
  `;

const StyledCard = styled(Card)`
  && {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two columns with equal width */
    grid-template-rows: auto auto; /* Two rows with auto height */
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 16px;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: translateY(-4px);
    }
  }
`;

const StyledCardContent = styled(CardContent)`
  &&{display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr; /* Two columns with equal width */
  grid-template-rows: auto; /* Single row with auto height */
  gap: 8px; /* Spacing between columns */
  align-items: center; /* Center the content vertically */

  /* Left column for title and date */
  & > div:nth-child(1) {
    grid-column: 1; /* Left column */
  }

  /* Right column for material type */
  & > div:nth-child(2) {
    grid-column: 2; /* Right column */
    display: flex; /* Use flex container for the right column */
    justify-content: flex-end; /* Justify material type to the end (right) */
    text-align: right; /* Align text to the right */
  }

  /* Ensure that the material type is aligned to the end */
  & > div:nth-child(2) > p {
    width: 100%;
  }}
`;

const StyledLink = styled(Link)`
    && {
      text-decoration: none;
      width: 100%;
      margin-top: 10px;
    }
  `;



const ClassView = () => {
  const navigate = useNavigate();
  const { classId } = useParams(); // Get the class ID from the URL parameters
  const [currentUserId, setCurrentUserId] = useState(null);
  const [classData, setClassData] = useState(null);
  const [materialInput, setMaterialInput] = useState('');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        // Fetch the class document from Firestore based on the class ID
        console.log(classId);
        const classDocRef = doc(firestore, 'classes', classId);
        const classDocSnap = await getDoc(classDocRef);

        if (classDocSnap.exists()) {
          // Convert the class document data to an object and set it to the state
          setClassData({ id: classDocSnap.id, ...classDocSnap.data() });
          console.log(classData);
        } else {
          console.log('Class not found!');
        }
      } catch (error) {
        console.error('Error fetching class data:', error);
      }
    };

    const auth = getAuth();
    if (auth.currentUser) {
      setCurrentUserId(auth.currentUser.uid);
    }

    fetchClassData();
  }, [classId]);

  // Handle Modal Open
  const handleModalOpen = () => {
    setOpenModal(true);
  };

  // Handle Modal Close
  const handleModalClose = () => {
    setOpenModal(false);
  };

  // Handle Click on Class Material Item (Task, Quiz, Modul, Discussion)
  const handleClassMaterialClick = (type) => {
    // Redirect to the appropriate form page based on the type of class material
    switch (type) {
      case 'task':
        navigate(`/class/${classId}/task`);
        break;
      case 'quiz':
        navigate(`/class/${classId}/quiz`);
        break;
      case 'modul':
        navigate(`/class/${classId}/modul`);
        break;
      case 'discussion':
        navigate(`/class/${classId}/discussion-form`);
        break;
      default:
        // Handle any other cases if needed
        break;
    }
  };

  return (
    <>
      <StyledAppBar position="static">
        <StyledToolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <StyledClassName variant="h6">{classData?.className}</StyledClassName>
          <div></div> {/* Add any additional content to the header here */}
        </StyledToolbar>
      </StyledAppBar>

      <StyledContainer maxWidth="sm">

      <Modal
          open={openModal}
          onClose={handleModalClose}
          closeAfterTransition
        >
          <Fade in={openModal}>
            <ModalContainer>
              {/* Show Choices for Class Material */}
              <h2>Pilih Tipe Materi Kelas:</h2>
              <ModalButton onClick={() => handleClassMaterialClick('task')}>Task</ModalButton>
              <ModalButton onClick={() => handleClassMaterialClick('quiz')}>Quiz</ModalButton>
              <ModalButton onClick={() => handleClassMaterialClick('modul')}>Modul</ModalButton>
              {/* <ModalButton onClick={() => handleClassMaterialClick('discussion')}>Discussion</ModalButton> */}
            </ModalContainer>
          </Fade>
        </Modal>
        {/* <Typography variant="h5">Progress Kelas</Typography>
        <StyledClassInfo>
          <StyledClassLevel variant="subtitle1">Level {classData?.classLevel}</StyledClassLevel>
          <Typography variant="subtitle1">Exp: {classData?.exp}</Typography>
        </StyledClassInfo>
        <LinearProgress variant="determinate" value={(classData?.exp / 500) * 100} />
        <StyledClassInfo2>
          <StyledClassRanking variant="subtitle1">Ranking Kamu: {classData?.classRanking}</StyledClassRanking>
        </StyledClassInfo2> */}
        {/* {classData?.mentorId === currentUserId && (
          <Button variant="contained" color="primary" onClick={handleModalOpen}>
            Tambah Materi Kelas
          </Button>
        )} */}

        {dummyClassMaterials?.map((material) => (
          <StyledLink to={`/class/${material.type}/${material.id}`} key={material.id}>
            <StyledCard>
              <StyledCardContent>
                <div>
                  <Typography variant="subtitle1">{material.title}</Typography>
                  <StyledDate variant="body2">{material.date}</StyledDate>
                </div>
              </StyledCardContent>
            </StyledCard>
          </StyledLink>
        ))}
      </StyledContainer>
    </>
  );
};

export default ClassView;
