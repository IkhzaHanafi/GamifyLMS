import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

// Function to calculate the Level based on Exp
const calculateLevel = (exp) => {
  const expThreshold = 500; // Change this to the desired threshold for leveling up (e.g., 100)
  return Math.floor(exp / expThreshold) + 1; // Level increases by 1 every expThreshold gained
};

// Function to update user's Level and Exp in Firestore
const updateExpAndLevel = async (userId, newExp) => {
  const userRef = doc(firestore, 'users', userId);

  try {
    // Update the user's Exp in Firestore
    await updateDoc(userRef, { exp: newExp });

    // Calculate the new Level based on the updated Exp
    const newLevel = calculateLevel(newExp);

    // Update the user's Level in Firestore
    await updateDoc(userRef, { level: newLevel });

    console.log('User Exp and Level updated successfully.');
  } catch (error) {
    console.error('Error updating user Exp and Level:', error);
  }
};

// Function to add Exp to the user and automatically update Level if needed
const addExpToUser = async (userId, expToAdd) => {
    try {
      const userRef = doc(firestore, 'users', userId); // Specify the user document ID using doc()
      const userSnapshot = await getDoc(userRef); // Use getDoc() instead of userRef.get()
      console.log(userSnapshot);
  
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const currentExp = userData.exp || 0;
        const newExp = currentExp + expToAdd;
  
        // Update the user's Exp and Level in Firestore
        await updateExpAndLevel(userId, newExp);
      } else {
        console.log('User not found in Firestore.');
      }
    } catch (error) {
      console.error('Error adding Exp to user:', error);
    }
  };

export default addExpToUser;
