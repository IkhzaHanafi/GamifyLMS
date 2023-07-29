import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography, Container, Card, CardContent, Button, TextField } from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { getAuth } from 'firebase/auth';

import MentorTaskContent from '../../components/MentorTaskContent';

const ClassTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { classId } = useParams();
  const [taskData, setTaskData] = useState({});
  const [submissionData, setSubmissionData] = useState({});
  const [classData, setClassData] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');

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

    const fetchTaskData = async () => {
      try {
        const taskDocRef = doc(firestore, 'classes', classId, 'tasks', id);
        const taskDocSnap = await getDoc(taskDocRef);

        if (taskDocSnap.exists()) {
          // Convert the task document data to an object and set it to the state
          setTaskData(taskDocSnap.data());
        } else {
          console.log('Task not found!');
        }
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };

    const fetchSubmissionData = async () => {
      // Check if both classId and currentUserId are available
      if (classId && currentUserId) {
        try {
          // Create a reference to the document for the specific class
          const classDocRef = doc(firestore, 'submissions', classId);

          // Create a reference to the document for the specific task and user
          const taskUserDocRef = doc(classDocRef, id, currentUserId);

          const submissionDocSnap = await getDoc(taskUserDocRef);

          if (submissionDocSnap.exists()) {
            // Convert the submission document data to an object and set it to the state
            setSubmissionData(submissionDocSnap.data());
          } else {
            console.log('Submission not found!');
          }
        } catch (error) {
          console.error('Error fetching submission data:', error);
        }
      }
    };

    // Fetch task data and submission data
    fetchTaskData();
    fetchSubmissionData();
    fetchClassData();
  }, [classId, id, currentUserId]);

  useEffect(() => {
    if (submissionData && submissionData.submissionText) {
      setSubmissionText(submissionData.submissionText);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newSubmissionData = {
        userId: currentUserId,
        namaLengkap: currentUserName,
        submissionText,
        submittedAt: serverTimestamp(),
        score: null, // You can set the score to null initially for the mentor to fill later
      };

      // Create a reference to the collection for submissions
      const submissionsCollectionRef = collection(firestore, 'submissions');

      // Create a reference to the document for the specific class
      const classDocRef = doc(submissionsCollectionRef, classId);

      // Create a reference to the document for the specific task and user
      const taskUserDocRef = doc(classDocRef, id, currentUserId);

      // Add the submission data to the document
      await setDoc(taskUserDocRef, newSubmissionData);

      console.log('Submission ID:', taskUserDocRef.id);
      // Update the UI or show a success message after successful submission
      navigate(-1)

    } catch (error) {
      console.error('Error submitting task:', error);
      // Handle error case
    }
  };

  const handleFormSubmit = (e) => {
    handleSubmit(e, submissionText);
    setSubmissionText(''); // Clear the input field after submission
  };


  return (
    <TaskContainer maxWidth="sm">
      <TaskCard>
        <CardContent>
          <TaskTitle>{taskData.title}</TaskTitle>
          <TaskDescription>{taskData.description}</TaskDescription>
        </CardContent>
      </TaskCard>

      {currentUserId !== classData?.mentorId ? (
        // If the user is a mentor, show mentor-specific content
        <TaskCard>
          <CardContent>
            {submissionData.submittedAt ? (
              // If the user already submitted the task, show task info and score
              <>
                <Typography variant="h6">Jawaban Kamu:</Typography>
                <Typography>{submissionData.submissionText}</Typography>
                <Typography>Nilai: {submissionData.score || 'Belum DiNilai'}</Typography>
              </>
            ) : (
              // If the user has not yet submitted the task, show task form
              <TaskForm onSubmit={handleFormSubmit}>
                <TaskInput
                  variant="outlined"
                  label="Jawaban atau URL Tugas"
                  multiline
                  rows={4}
                  fullWidth
                  required
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                />
                <TaskButton variant="contained" color="primary" type="submit">
                  Submit Tugas
                </TaskButton>
              </TaskForm>
            )}
          </CardContent>
        </TaskCard>
      ) : (
        // If the user is a student, show student-specific content
        <MentorTaskContent />
      )}
    </TaskContainer>
  );

  function StudentContent() {
    // Implement student-specific content here (e.g., show task form or task info)
    return (
      <TaskCard>
        <CardContent>
          {submissionData.submittedAt ? (
            // If the user already submitted the task, show task info and score
            <>
              <Typography variant="h6">Jawaban Kamu:</Typography>
              <Typography>{submissionData.submissionText}</Typography>
              <Typography>Nilai: {submissionData.score || 'Belum DiNilai'}</Typography>
            </>
          ) : (
            // If the user has not yet submitted the task, show task form
            <TaskForm onSubmit={handleFormSubmit}>
              <TaskInput
                variant="outlined"
                label="Jawaban atau URL Tugas"
                multiline
                rows={4}
                fullWidth
                required
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
              />
              <TaskButton variant="contained" color="primary" type="submit">
                Submit Tugas
              </TaskButton>
            </TaskForm>
          )}
        </CardContent>
      </TaskCard>
    );
  }
};

export default ClassTask;


const TaskContainer = styled(Container)`
  && {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f0f0;
    padding: 16px;
  }
`;

const TaskCard = styled(Card)`
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

const TaskTitle = styled(Typography)`
  && {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
  }
`;

const TaskDescription = styled(Typography)`
  && {
    color: #616161;
    margin-bottom: 20px;
  }
`;

const TaskForm = styled.form`
&& {
    display: flex;
    flex-direction: column;
    width: 100%;
}
`;

const TaskInput = styled(TextField)`
  && {
    margin-bottom: 16px;
  }
`;

const TaskButton = styled(Button)`
  && {
    margin-top: 16px;
  }
`;