import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography, Container, Card, CardContent, Button, LinearProgress } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

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

const ClassQuiz = () => {
  const { classId } = useParams();
  const { id } = useParams();
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizTitle, setQuizTitle] = useState('');

  useEffect(() => {
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

    fetchQuizData();
  }, [id]);

  // Logic to handle answer selection
  const handleAnswerSelect = (selectedAnswer) => {
    if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
    // Move to the next question
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };

  const isQuizCompleted = currentQuestion >= quizData.length;

  return (
    <QuizContainer maxWidth="sm">
      <QuizTitle>
        <Typography variant="h4">{quizTitle}</Typography>
      </QuizTitle>

      {isQuizCompleted ? (
        <QuizResult>
          <Typography variant="h5">Quiz Selesai! Score: {score}</Typography>
          <Link to={`/class/${classId}`}>
            <HomeButton variant="contained" color="primary">
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
      )}
    </QuizContainer>
  );
};

export default ClassQuiz;



// const quizData = [
//   {
//     question: 'Apa yang dimaksud dengan UI dalam konteks desain?',
//     options: ['User Interaction', 'User Interface', 'User Integration', 'User Interest'],
//     correctAnswer: 'User Interface',
//   },
//   {
//     question: 'Apa yang dimaksud dengan UX dalam konteks desain?',
//     options: ['User Experience', 'User Excellence', 'User Expression', 'User Expansion'],
//     correctAnswer: 'User Experience',
//   },
//   {
//     question: 'Apa yang dimaksud dengan wireframe dalam desain UI/UX?',
//     options: ['Presentasi visual produk akhir', 'Desain akhir yang interaktif', 'Ilustrasi tampilan visual', 'Sketsa kasar struktur halaman'],
//     correctAnswer: 'Sketsa kasar struktur halaman',
//   },
//   {
//     question: 'Apa yang dimaksud dengan "persona" dalam UX design?',
//     options: ['Pencitraan merek', 'Pemirsa target yang fiktif', 'Keahlian dalam desain UI', 'Teknik animasi interaktif'],
//     correctAnswer: 'Pemirsa target yang fiktif',
//   },
//   {
//     question: 'Apa tujuan dari usability testing (pengujian kegunaan) dalam desain UI/UX?',
//     options: ['Meningkatkan performa website', 'Memperindah tampilan visual', 'Menguji keamanan sistem', 'Memvalidasi kode sumber'],
//     correctAnswer: 'Meningkatkan performa website',
//   },
//   {
//     question: 'Apakah perbedaan antara UI dan UX?',
//     options: ['UI berfokus pada kepuasan pengguna, UX pada estetika', 'UI berfokus pada estetika, UX pada kepuasan pengguna', 'UI berfokus pada perancangan, UX pada pengembangan', 'UI berfokus pada pengembangan, UX pada perancangan'],
//     correctAnswer: 'UI berfokus pada estetika, UX pada kepuasan pengguna',
//   },
//   {
//     question: 'Apa manfaat dari membuat prototipe dalam desain UI/UX?',
//     options: ['Menampilkan versi final dari produk', 'Memvalidasi desain sebelum implementasi', 'Mengurangi waktu pengembangan', 'Menggantikan tahap pengujian kegunaan'],
//     correctAnswer: 'Memvalidasi desain sebelum implementasi',
//   },
//   {
//     question: 'Apa yang dimaksud dengan "affordance" dalam desain UI?',
//     options: ['Keterbacaan teks pada layar', 'Tampilan visual yang menarik', 'Kemampuan elemen untuk memberi petunjuk penggunaan', 'Kapasitas penyimpanan data pada perangkat'],
//     correctAnswer: 'Kemampuan elemen untuk memberi petunjuk penggunaan',
//   },
//   {
//     question: 'Bagaimana cara meningkatkan UX pada aplikasi mobile?',
//     options: ['Menambahkan lebih banyak fitur', 'Mengurangi interaksi pengguna', 'Mempercepat waktu respons aplikasi', 'Menggunakan ikon yang tidak familiar'],
//     correctAnswer: 'Mempercepat waktu respons aplikasi',
//   },
//   {
//     question: 'Apa itu "information architecture" dalam konteks desain UX?',
//     options: ['Proses menyusun informasi dalam tata letak visual', 'Studi tentang psikologi pengguna', 'Teknik mengkodekan data informasi', 'Ilmu komputer dan statistik'],
//     correctAnswer: 'Proses menyusun informasi dalam tata letak visual',
//   },
//   // Tambahkan pertanyaan lainnya sesuai kebutuhan
// ];

