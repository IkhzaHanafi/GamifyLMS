import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Fab, Menu, MenuItem, Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { app, firestore, auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

const FloatingButton = styled(Fab)`
  && {
    position: fixed;
    bottom: 100px;
    right: 24px;
    background-color: #3f51b5;
    color: #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 999;
  }
`;

const FloatingAddButton = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [createClassModalOpen, setCreateClassModalOpen] = useState(false);
    const [joinClassModalOpen, setJoinClassModalOpen] = useState(false);
    const [classCode, setClassCode] = useState('');
    const [className, setClassName] = useState('');
    const [classCounter, setClassCounter] = useState(0);

    useEffect(() => {
        const fetchClassCounter = async () => {
            try {
                const counterRef = doc(firestore, 'counters', 'classCounter');
                const counterSnap = await getDoc(counterRef);
                if (counterSnap.exists()) {
                    setClassCounter(counterSnap.data().value);
                } else {
                    await setDoc(counterRef, { value: 1 });
                    setClassCounter(1);
                }
            } catch (error) {
                console.error('Error fetching class counter:', error);
            }
        };

        fetchClassCounter();
    }, []);

    const handleButtonClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCreateClassModalOpen = () => {
        setCreateClassModalOpen(true);
        handleMenuClose();
    };

    const handleCreateClassModalClose = () => {
        setCreateClassModalOpen(false);
    };

    const handleJoinClassModalOpen = () => {
        setJoinClassModalOpen(true);
        handleMenuClose();
    };

    const handleJoinClassModalClose = () => {
        setJoinClassModalOpen(false);
    };

    const handleCreateClass = async () => {
        try {
            // Increment the class number counter by 1
            const incrementedClassCounter = classCounter + 1;
            const classNumber = incrementedClassCounter.toString().padStart(6, '0');

            // Update the class number counter in Firestore with the new value
            const counterRef = doc(firestore, 'counters', 'classCounter');
            await updateDoc(counterRef, { value: incrementedClassCounter });

            // Fetch the mentor's data from Firestore using their UID
            const mentorRef = doc(firestore, 'users', auth.currentUser.uid);
            const mentorSnapshot = await getDoc(mentorRef);

            if (mentorSnapshot.exists()) {
                const mentorData = mentorSnapshot.data();

                // Create a new class document in Firestore with the unique class ID and mentor's name
                const classData = {
                    className,
                    mentor: mentorData.namaLengkap,
                    mentorId: auth.currentUser.uid,
                    participants: [auth.currentUser.uid], // Add the mentor's name to the participants array
                };

                const classRef = doc(firestore, 'classes', `${classNumber}`); // Use the unique class ID with the incremented class number
                await setDoc(classRef, classData);

                alert('Successfully created the class!');
                handleCreateClassModalClose();
                window.location.reload();
            } else {
                console.log('Mentor data not found in Firestore!');
            }
        } catch (error) {
            console.error('Error creating class:', error);
            alert('An error occurred while creating the class. Please try again later.');
        }
    };

    const handleJoinClass = async () => {
        try {
            // Check if the class with the given code exists in Firestore
            const classRef = doc(firestore, 'classes', classCode);
            const classSnapshot = await getDoc(classRef);

            if (!classSnapshot.exists()) {
                alert('Class not found. Please check the class code.');
                return;
            }

            // Add the user to the list of participants in the class document
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                await updateDoc(classRef, {
                    participants: arrayUnion(userId),
                });
                alert('Successfully joined the class!');
            } else {
                alert('User not logged in. Please log in before joining a class.');
            }

            handleJoinClassModalClose();
            window.location.reload();
        } catch (error) {
            console.error('Error joining class:', error);
            alert('An error occurred while joining the class. Please try again later.');
        }
    };

    return (
        <>
            <FloatingButton onClick={handleButtonClick}>
                <AddIcon />
            </FloatingButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleJoinClassModalOpen}>
                    Join Class
                </MenuItem>
                <MenuItem onClick={handleCreateClassModalOpen}>
                    Create a Class
                </MenuItem>
            </Menu>

            {/* Create Class Modal */}
            <Dialog open={createClassModalOpen} onClose={handleCreateClassModalClose}>
                <DialogTitle>Buat Kelas</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Class Name"
                        fullWidth
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                    />
                    {/* Add more form fields as needed */}
                    <Button variant="contained" color="primary" style={{ marginTop: 10 }} onClick={handleCreateClass}>Buat</Button>
                </DialogContent>
            </Dialog>

            {/* Join Class Modal */}
            <Dialog open={joinClassModalOpen} onClose={handleJoinClassModalClose}>
                <DialogTitle>Join Kelas</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Class Code"
                        fullWidth
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                    />
                    {/* Add more form fields as needed */}
                    <Button variant="contained" color="primary" style={{ marginTop: 10 }} onClick={handleJoinClass}>Join</Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FloatingAddButton;
