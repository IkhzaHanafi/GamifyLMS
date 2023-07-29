import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography, Container, Card, CardContent, Button, LinearProgress } from '@mui/material';
import { Table, TableHead, TableContainer, TableBody, TableRow, TableCell, Modal, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { getAuth } from 'firebase/auth';
import addExpToUser from '../../utils/levelingUtils'

const ClassQuiz = () => {
  const { classId } = useParams();
  const { id } = useParams();
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizTitle, setQuizTitle] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [classData, setClassData] = useState(null);
  const [currentUserName, setCurrentUserName] = useState('');
  const [submittedUsers, setSubmittedUsers] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userHasSubmitted, setUserHasSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) {
      setCurrentUserId(auth.currentUser.uid);
      const userDataJSON = localStorage.getItem('userData');
      const userData = JSON.parse(userDataJSON);
      setCurrentUserName(userData.namaLengkap)
    }

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

    const fetchQuizData = async () => {
      try {
        const quizDocRef = doc(firestore, 'classes', classId, 'quizzes', id);
        const quizDocSnap = await getDoc(quizDocRef);

        if (quizDocSnap.exists()) {
          // Convert the quiz document data to an object and set it to the state
          setQuizData(quizDocSnap.data().questions);
          setQuizTitle(quizDocSnap.data().title);
        } else {
          console.log('Quiz not found!');
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    const fetchSubmittedUsersData = async () => {
      try {
        const usersData = await getSubmittedUsersData(classId, id);
        setSubmittedUsers(usersData);
        console.log(usersData); // Log the retrieved data here, not in the return statement
      } catch (error) {
        console.error('Error fetching submitted users data:', error);
      }
    };

    const fetchUserSubmissionStatus = async () => {
      try {
        const hasSubmitted = await checkUserSubmission(classId, id, currentUserId);
        setUserHasSubmitted(hasSubmitted);
      } catch (error) {
        console.error('Error fetching user submission status:', error);
      }
    };

    const fetchUserSubmission = async () => {
      try {
        const submissionDocRef = doc(firestore, 'submissions', classId, id, currentUserId);
        const submissionDocSnap = await getDoc(submissionDocRef);

        if (submissionDocSnap.exists()) {
          setSubmissionData(submissionDocSnap.data());
        } else {
          console.log('User submission not found!');
        }
      } catch (error) {
        console.error('Error fetching user submission data:', error);
      }
    };

    fetchQuizData();
    fetchClassData();
    fetchUserSubmissionStatus();
    fetchSubmittedUsersData();
    fetchUserSubmission();
  }, [classId, currentUserId, id]);

  // Function to calculate quiz score
  const calculateQuizScore = (correctAnswers, totalQuestions) => {
    const percentageCorrect = (correctAnswers / totalQuestions) * 100;
    const roundedScore = Math.round(percentageCorrect * 100) / 100;
    return roundedScore;
  };


  const submitQuiz = async () => {
    try {
      const finalScore = calculateQuizScore(score, totalQuestions);
      // Create a new document reference with the appropriate path
      const submissionRef = doc(firestore, 'submissions', classId, id, currentUserId);

      // Create the submission document with the data
      await setDoc(submissionRef, {
        userId: currentUserId,
        userName: currentUserName,
        score : finalScore,
        answers: questionData.map((question) => ({
          question: question.question,
          selectedAnswer: question.selectedAnswer || null,
          correctAnswer: quizData.find((item) => item.question === question.question)?.correctAnswer || null,
        })),
        submittedAt: serverTimestamp(),
      });

      addExpToUser(currentUserId, calculateQuizScore(score, totalQuestions))

      console.log('Quiz submitted successfully.');
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };



  const handleAnswerSelect = (selectedAnswer) => {
    // Create a copy of the current question data
    const updatedQuestionData = [...questionData];
    // Update the selected answer for the current question
    updatedQuestionData[currentQuestion] = { ...quizData[currentQuestion], selectedAnswer };
    // Update the questionData state with the updated question data
    setQuestionData(updatedQuestionData);

    if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
    // Update the total questions count
    setTotalQuestions((prevTotal) => prevTotal + 1);
    // Move to the next question
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };

  const isQuizCompleted = currentQuestion >= quizData.length;

  const getSubmittedUsersData = async (classId, quizId) => {
    try {
      const submissionsRef = collection(firestore, 'submissions', classId, quizId);
      const querySnapshot = await getDocs(submissionsRef);

      // Create an array to store the submitted user data
      const submittedUsersData = [];

      // Use a for...of loop to correctly handle asynchronous calls
      for (const doc of querySnapshot.docs) {
        if (doc.exists()) {
          const userData = doc.data();
          const { userId, userName, score, answers, submittedAt } = userData;
          submittedUsersData.push({ userId, userName, score, answers, submittedAt });
        }
      }

      return submittedUsersData;
    } catch (error) {
      console.error('Error fetching submitted user data:', error);
      return [];
    }
  };

  const checkUserSubmission = async (classId, quizId, userId) => {
    try {
      // Reference the specific submission document for the user
      const submissionRef = doc(firestore, 'submissions', classId, quizId, userId);

      // Get the document snapshot
      const submissionDocSnap = await getDoc(submissionRef);

      // Check if the document exists
      return submissionDocSnap.exists();
    } catch (error) {
      console.error('Error checking user submission:', error);
      return false;
    }
  };

  // Function to handle opening the modal and setting the selected user
  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
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
    <QuizContainer maxWidth="sm">
      <QuizTitle>
        <Typography variant="h4">{quizTitle}</Typography>
      </QuizTitle>
      {currentUserId !== classData?.mentorId ? (
        !userHasSubmitted ? <QuizContent /> : <QuizResult2 />
      ) : (
        <>
          <Typography variant="h5">Jawaban Anggota Kelas</Typography>
          {/* Table to display submitted user data */}
          <StyledTable>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Tanggal</StyledTableCell>
                <StyledTableCell>Nama Lengkap</StyledTableCell>
                <StyledTableCell>Score</StyledTableCell>
                <StyledTableCell>Jawaban</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {/* Iterate through each user who submitted the quiz and show their data */}
              {submittedUsers?.map((user) => (
                <StyledTableRow key={user.userId}>
                  <StyledTableCell>{formatDate(user.submittedAt.toDate().toString())}</StyledTableCell>
                  <StyledTableCell>{user.userName}</StyledTableCell>
                  <StyledTableCell>{user.score}</StyledTableCell>
                  <StyledTableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleOpenModal(user)}>
                      Lihat Jawaban
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </>
      )}

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <StyledModal>
          {selectedUser && (
            <>
              <DialogTitle>Jawaban: {selectedUser.userName}</DialogTitle>
              <DialogContent>
                {/* Display list of answers for the selected user */}
                <ul>
                  {selectedUser.answers.map((answer, index) => (
                    <li key={index}>
                      <strong>{answer.question}:</strong> {answer.selectedAnswer}
                    </li>
                  ))}
                </ul>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} color="primary">
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </StyledModal>
      </Modal>

    </QuizContainer>
  );

  function QuizResult2() {
    return (
      <>
        <Typography variant="h5">Quiz Selesai!</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Pertanyaan</TableCell>
                <TableCell>Jawaban Kamu</TableCell>
                <TableCell>Jawaban Benar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissionData?.answers?.map((answer, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{answer.question}</TableCell>
                  <TableCell>{answer.selectedAnswer}</TableCell>
                  <TableCell>{answer.correctAnswer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Link to={`/class/${classId}`}>
          <Button variant="contained" color="primary">
            Selesai
          </Button>
        </Link>
      </>
    );
  };

  function QuizContent() {
    return (
      isQuizCompleted ? (
        <QuizResult>
          <Typography variant="h5">Quiz Selesai! Score: {calculateQuizScore(score, totalQuestions)}</Typography>
          <Link to={`/class/${classId}`}>
            <HomeButton variant="contained" color="primary" onClick={submitQuiz}>
              Selesai
            </HomeButton>
          </Link>
        </QuizResult>
      ) : (
        <QuizCard>
          <ProgressContainer>
            <LinearProgress
              variant="determinate"
              value={(currentQuestion / quizData.length) * 100}
              style={{ width: '80%' }}
            />
          </ProgressContainer>
          <CardContent>
            <Typography variant="h6">{quizData[currentQuestion].question}</Typography>
            {quizData[currentQuestion].options.map((option, index) => (
              <QuizOption
                key={index}
                variant="contained"
                color="primary"
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </QuizOption>
            ))}
          </CardContent>
        </QuizCard>
      )
    )
  }

};

export default ClassQuiz;


const QuizContainer = styled(Container)`
  && {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f0f0;
    padding: 16px;
  }
`;

const QuizTitle = styled.div`
 && { margin-bottom: 20px;}
`;

const QuizCard = styled(Card)`
  && {
    width: 400px;
    max-width: 90%;
    background-color: #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
    padding: 16px;
  }
`;

const QuizOption = styled(Button)`
  && {
    margin-top: 8px;
    width: 100%;
    text-transform: none;
  }
`;

const QuizResult = styled.div`
  && {
    text-align: center;
  }
`;

const ProgressContainer = styled.div`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
`;

const HomeButton = styled(Button)`
  && {
    margin-top: 20px;
    width: 200px;
  }
`;

// Styled components for table elements
const StyledTable = styled(Table)`
  &&{margin-top: 20px;
  border-collapse: collapse;
  width: 100%;}
`;

const StyledTableRow = styled(TableRow)`
 &&{ &:nth-child(odd) {
    background-color: #f2f2f2;
  }}
`;

const StyledTableCell = styled(TableCell)`
  &&{padding: 12px;
  text-align: center;}
`;

const StyledModal = styled.div`
 && {
   position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
}

  /* Customize modal styles as needed */
`;
