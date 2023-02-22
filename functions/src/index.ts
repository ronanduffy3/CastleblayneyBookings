import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const newUserCreated = functions.auth.user().onCreate(async (user) => {
  const customClaims = {
    role: 'user',
  };

  try {
    await admin.auth().setCustomUserClaims(user.uid, customClaims);
    return console.log(`Custom claims added to user ${user.uid}`);
  } catch (error) {
    return console.error(error);
  }
});