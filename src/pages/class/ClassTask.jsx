import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography, Container, Card, CardContent, Button, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';



const ClassTask = () => {
  const { id } = useParams();
  const { classId } = useParams();
  const [taskData, setTaskData] = useState({})

  const handleSubmit = (event) =>
     {
        event.preventDefault();
        // Handle form submission logic here
        // For example, you can submit the task details to a server or display a success message
        console.log('Form submitted');
    };

    useEffect(() => {
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
  
      fetchTaskData();
    }, [id]);

    return (
        <TaskContainer maxWidth="sm">
            <TaskCard>
                <CardContent>
                    <TaskTitle>{taskData.title}</TaskTitle>
                    <TaskDescription>{taskData.description}</TaskDescription>
                </CardContent>
            </TaskCard>

            <TaskCard>
                <CardContent>
                    <Typography variant="h6">Silahkan Masukan Jawaban atau URL Tugas</Typography>
                    <TaskForm onSubmit={handleSubmit}>
                        <TaskInput
                            variant="outlined"
                            label="Jawaban atau URL Tugas"
                            multiline
                            rows={4}
                            fullWidth
                            required
                        />
                        <TaskButton variant="contained" color="primary" type="submit">
                            Submit Tugas
                        </TaskButton>
                    </TaskForm>
                </CardContent>
            </TaskCard>
        </TaskContainer>
    );
};

export default ClassTask;

// const taskData = {
//   title: 'Redesign User Interface (UI) Website Perusahaan',
//   description: `Tugas ini adalah merancang ulang tampilan User Interface (UI) dari website perusahaan ABC.
//     Perusahaan menginginkan tampilan yang lebih modern, responsif, dan menarik bagi pengunjung website. 
//     Pastikan untuk mempertimbangkan pengalaman pengguna (UX) agar navigasi dan interaksi dengan website menjadi lebih mudah dan intuitif. 
//     Anda juga dapat melampirkan prototipe atau wireframe sebagai panduan visual dalam tugas ini.`,
// };

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