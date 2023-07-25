import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';

const ParticipantList = styled(List)`
  && {
    width: 100%;
    max-width: 360px;
    background-color: #fff;
  }
`;

const ParticipantListItem = styled(ListItem)`
  && {
    cursor: default;

    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

const ClassParticipantTab = ({ classId, classMentor }) => {
  const [participants, setParticipants] = useState([]);
  const [participantDataArray, setParticipantDataArray] = useState([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const classDocRef = doc(firestore, 'classes', classId);
        const classDocSnap = await getDoc(classDocRef);

        if (classDocSnap.exists()) {
          const classData = classDocSnap.data();
          setParticipants(classData.participants || []);
          console.log(classData.participants);
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
    console.log(participants);
  }, [classId]);

  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        // Fetch user data based on participantId from "users" collection
        const usersCollectionRef = collection(firestore, 'users');
        const participantPromises = participants.map(async (participantId) => {
          const participantDocRef = doc(usersCollectionRef, participantId);
          const participantDocSnap = await getDoc(participantDocRef);
          return participantDocSnap.data();
        });

        const participantDataArray = await Promise.all(participantPromises);
        console.log(participantDataArray);
        setParticipantDataArray(participantDataArray);
      } catch (error) {
        console.error('Error fetching participant data:', error);
      }
    };

    fetchParticipantData();
  }, [participants]);

  return (
    <ParticipantList>
      {participantDataArray?.map((participantData) => (
        <React.Fragment key={participantData?.userId}>
          <ParticipantListItem>
            <ListItemText primary={participantData?.namaLengkap} secondary={participantData?.email} />
          </ParticipantListItem>
          <Divider component="li" />
        </React.Fragment>
      ))}
    </ParticipantList>
  );
};

export default ClassParticipantTab;
