import { auth  } from './firebase';

const checkAuthStatus = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        // User is authenticated, resolve with the user object
        resolve(user);
      } else {
        // User is not authenticated, reject with an error
        reject(new Error('User is not authenticated'));
      }
    });
  });
};

export default checkAuthStatus;
