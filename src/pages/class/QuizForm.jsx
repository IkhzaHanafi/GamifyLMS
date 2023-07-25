import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField, Typography, Button, Paper, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const QuizForm = () => {
  const navigate = useNavigate();
  const { classId } = useParams();

  // State for the quiz data
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDate, setQuizDate] = useState('');
  const [quizData, setQuizData] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    },
  ]);

  // Function to add a new quiz question
  const handleAddQuestion = () => {
    setQuizData([...quizData, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  // Function to handle changes to the quiz data
  const handleChange = (index, field, value) => {
    const updatedQuizData = quizData.map((question, i) => (i === index ? { ...question, [field]: value } : question));
    setQuizData(updatedQuizData);
  };

  // Function to handle changes to the options
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuizData = quizData.map((question, i) =>
      i === questionIndex
        ? {
            ...question,
            options: question.options.map((option, j) => (j === optionIndex ? value : option)),
          }
        : question
    );
    setQuizData(updatedQuizData);
  };

  // Function to submit the quiz data to Firestore
  const handleSubmit = async () => {
    try {
      // Create a new quiz object with the form data
      const newQuiz = {
        title: quizTitle,
        date: quizDate,
        questions: quizData,
        type: 'quiz',
      };

      // Add the quiz to the "quizzes" collection under the class in Firestore
      const quizzesCollectionRef = collection(firestore, 'classes', classId, 'quizzes');
      await addDoc(quizzesCollectionRef, newQuiz);

      // Reset the form fields after successful submission
      setQuizTitle('');
      setQuizDate('');
      setQuizData([
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
        },
      ]);

      navigate(-1);
    } catch (error) {
      console.error('Error adding quiz:', error);
    }
  };

  return (
    <FormContainer>
      <Typography variant="h6">Tambah Quiz Baru</Typography>

      <TextField
        label="Judul Quiz"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Tanggal Quiz"
        type="date"
        value={quizDate}
        onChange={(e) => setQuizDate(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />

      {quizData.map((question, index) => (
        <QuestionContainer key={index}>
          <Typography variant="subtitle1">Pertanyaan {index + 1}:</Typography>
          <TextField
            label="Question"
            value={question.question}
            onChange={(e) => handleChange(index, 'question', e.target.value)}
            fullWidth
            margin="normal"
          />

          <Typography variant="subtitle1">Pilihan Jawaban:</Typography>
          {question.options.map((option, optionIndex) => (
            <TextField
              key={optionIndex}
              label={`Pilihan ${optionIndex + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
              fullWidth
              margin="normal"
            />
          ))}

          <TextField
            select
            label="Jawaban Benar"
            value={question.correctAnswer}
            onChange={(e) => handleChange(index, 'correctAnswer', e.target.value)}
            fullWidth
            margin="normal"
          >
            {question.options.map((option, optionIndex) => (
              <MenuItem key={optionIndex} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </QuestionContainer>
      ))}

      <AddButton variant="outlined" color="primary" onClick={handleAddQuestion} startIcon={<AddIcon />}>
        Tambah Pertanyaan
      </AddButton>

      <SubmitButton variant="contained" color="primary" onClick={handleSubmit}>
        Submit Quiz
      </SubmitButton>
    </FormContainer>
  );
};

export default QuizForm;

const FormContainer = styled(Paper)`
  &&{padding: 16px;
  margin-top: 16px;}
`;

const QuestionContainer = styled.div`
  &&{margin-bottom: 16px;}
`;

const AddButton = styled(Button)`
  &&{margin-top: 16px;}
`;

const SubmitButton = styled(Button)`
  && {margin-top: 16px;}
`;

export { QuizForm };
