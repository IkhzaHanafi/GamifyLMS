import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  AppBar,
  Toolbar,
  Modal,
  Button,
  Backdrop,
  Fade,
  Tab,
  Tabs,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { getAuth } from 'firebase/auth';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

import ClassParticipantTab from '../../components/ClassParticipants';

const ClassView = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [classData, setClassData] = useState(null);
  const [materialInput, setMaterialInput] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [moduls, setModuls] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const classDocRef = doc(firestore, 'classes', classId);
        const classDocSnap = await getDoc(classDocRef);

        if (classDocSnap.exists()) {
          setClassData({ id: classDocSnap.id, ...classDocSnap.data() });
        } else {
          console.log('Class not found!');
        }
      } catch (error) {
        console.error('Error fetching class data:', error);
      }
    };

    const fetchModuls = async () => {
      try {
        const modulsCollectionRef = collection(firestore, 'classes', classId, 'moduls');
        const modulsQuerySnapshot = await getDocs(modulsCollectionRef);
        const modulsData = modulsQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setModuls(modulsData);
      } catch (error) {
        console.error('Error fetching moduls:', error);
      }
    };

    const fetchQuizzes = async () => {
      try {
        const quizzesCollectionRef = collection(firestore, 'classes', classId, 'quizzes');
        const quizzesQuerySnapshot = await getDocs(quizzesCollectionRef);
        const quizzesData = quizzesQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizzes(quizzesData);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    const fetchTasks = async () => {
      try {
        const tasksCollectionRef = collection(firestore, 'classes', classId, 'tasks');
        const tasksQuerySnapshot = await getDocs(tasksCollectionRef);
        const tasksData = tasksQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const auth = getAuth();
    if (auth.currentUser) {
      setCurrentUserId(auth.currentUser.uid);
    }

    fetchClassData();
    fetchModuls();
    fetchQuizzes();
    fetchTasks();
  }, [classId]);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleAddMaterial = () => {
    setOpenModal(true);
  };

  const handleClassMaterialClick = (type) => {
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
        break;
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  function formatDate(dateString) {
    const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
  
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dateNumber = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${dayOfWeek}, ${dateNumber} ${month} ${year}`;
  }

  return (
    <>
      <StyledAppBar position="static">
        <StyledToolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <StyledClassName variant="h6">{classData?.className}</StyledClassName>
          <div>Class ID : {classId}</div> {/* Add any additional content to the header here */}
        </StyledToolbar>
      </StyledAppBar>

      <StyledContainer maxWidth="sm">
        <Tabs value={currentTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab label="Class Material" />
          <Tab label="Class Participant" />
        </Tabs>

        {/* Class Material Tab */}
        {currentTab === 0 && (
          <>
            <Modal open={openModal} onClose={handleModalClose} closeAfterTransition>
              <Fade in={openModal}>
                <ModalContainer>
                  <h2>Pilih Tipe Materi Kelas:</h2>
                  <ModalButton onClick={() => handleClassMaterialClick('task')}>Task</ModalButton>
                  <ModalButton onClick={() => handleClassMaterialClick('quiz')}>Quiz</ModalButton>
                  <ModalButton onClick={() => handleClassMaterialClick('modul')}>Modul</ModalButton>
                </ModalContainer>
              </Fade>
            </Modal>

            {currentUserId === classData?.mentorId && (
              <StyledFab color="primary" aria-label="add" onClick={handleAddMaterial}>
                <AddIcon />
              </StyledFab>
            )}

            {moduls.map((material) => (
              <StyledLink to={`/class/${classId}/modul/${material.id}`} key={material.id}>
                <StyledCard>
                  <StyledCardContent>
                    <div>
                      <Typography variant="subtitle1">{material.title}</Typography>
                      <StyledDate variant="body2">{material.type}</StyledDate>
                      <StyledDate variant="body2">{formatDate(material.date)}</StyledDate>
                    </div>
                  </StyledCardContent>
                </StyledCard>
              </StyledLink>
            ))}

            {quizzes.map((material) => (
              <StyledLink to={`/class/${classId}/quiz/${material.id}`} key={material.id}>
                <StyledCard>
                  <StyledCardContent>
                    <div>
                      <Typography variant="subtitle1">{material.title}</Typography>
                      <StyledDate variant="body2">{(material.type)}</StyledDate>
                      <StyledDate variant="body2">{formatDate(material.date)}</StyledDate>
                    </div>
                  </StyledCardContent>
                </StyledCard>
              </StyledLink>
            ))}

            {tasks.map((material) => (
              <StyledLink to={`/class/${classId}/task/${material.id}`} key={material.id}>
                <StyledCard>
                  <StyledCardContent>
                    <div>
                      <Typography variant="subtitle1">{material.title}</Typography>
                      <StyledDate variant="body2">{material.type}</StyledDate>
                      <StyledDate variant="body2">{formatDate(material.date)}</StyledDate>
                    </div>
                  </StyledCardContent>
                </StyledCard>
              </StyledLink>
            ))}
          </>
        )}

        {/* Class Info Tab */}
        {currentTab === 1 && (
          <ClassParticipantTab classId={classId} classMentor={classData?.mentorId} />
        )}
      </StyledContainer>
    </>
  );
};

export default ClassView;

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
  && {
    display: grid;
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
    }
  }
`;

const StyledLink = styled(Link)`
  && {
    text-decoration: none;
    width: 100%;
    margin-top: 10px;
  }
`;

const MaterialListContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  width: 100%;
`;

const MaterialCard = styled(Card)`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledFab = styled(Fab)`
  && {
    position: fixed;
    bottom: 16px;
    right: 16px;
  }
`;