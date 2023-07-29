import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography, Container, Card, CardContent, Button, TextField } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import addExpToUser from '../utils/levelingUtils'

const MentorContent = () => {
  const navigate = useNavigate();
  const { id, classId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const submissionsCollectionRef = collection(firestore, 'submissions', classId, id);
        const submissionsSnapshot = await getDocs(submissionsCollectionRef);

        if (!submissionsSnapshot.empty) {
          // Convert the submissions array to an array of data objects and set it to the state
          const submissionData = submissionsSnapshot.docs.map((doc) => doc.data());
          setSubmissions(submissionData);
        } else {
          console.log('No submissions found!');
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, [classId, id]);

  const handleScoreChange = (userId, score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [userId]: score,
    }));
  };

  const handleScoreSubmission = async (event, userId) => {
    event.preventDefault();
    const score = scores[userId];

    try {
      const submissionDocRef = doc(firestore, 'submissions', classId, id, userId);
      await updateDoc(submissionDocRef, {
        score: parseFloat(score),
      });
      addExpToUser(userId, parseInt(score))
      console.log(`Score for User ID ${userId} submitted successfully.`);
      navigate(-1)
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  return (
    <MentorContainer maxWidth="sm">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Lengkap</TableCell>
              <TableCell>Jawaban Tugas</TableCell>
              <TableCell>Nilai</TableCell>
              <TableCell>Input Nilai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body1">Belum Ada Jawaban.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission.userId}>
                  <TableCell>{submission.namaLengkap}</TableCell>
                  <TableCell>{submission.submissionText}</TableCell>
                  <TableCell>{submission.score}</TableCell>
                  <TableCell>
                    {
                      submission.score ? (
                        <>
                          Nilai Sudah Diinput
                        </>
                      ) : (
                        <ScoreFormContainer>
                          <ScoreForm onSubmit={(e) => handleScoreSubmission(e, submission.userId)}>
                            <ScoreInput
                              type="number"
                              label="Score"
                              variant="outlined"
                              value={scores[submission.userId] || ''}
                              onChange={(e) => handleScoreChange(submission.userId, e.target.value)}
                              required
                            />
                            <ScoreButton variant="contained" color="primary" type="submit">
                              Submit Nilai
                            </ScoreButton>
                          </ScoreForm>
                        </ScoreFormContainer>
                      )
                    }
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MentorContainer>
  );
};

export default MentorContent;

const MentorContainer = styled(Container)`
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

const SubmissionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
`;

const ScoreFormContainer = styled.div`
  &&{display: flex;
  align-items: center;}
`;

const SubmissionCard = styled(Card)`
  && {
    width: 400px;
    max-width: 90%;
    background-color: #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: left;
    margin: 8px;
  }
`;

const ScoreForm = styled.form`
 && {
  display: flex;
  align-items: center;
  margin-right: 8px;
}
`;

const ScoreInput = styled(TextField)`
  && {
    margin-right: 8px;
  }
`;

const ScoreButton = styled(Button)`
  && {
  }
`;