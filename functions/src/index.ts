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



export const getUsersWithUserClaim = functions.https.onCall(async (data, context) => {

  const userRecords = await admin.auth().listUsers();
  const usersWithUserClaim = userRecords.users.filter((user) =>
    user.customClaims?.role === "user"
  );
  const usersData = usersWithUserClaim.map((user) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  }));

  return usersData;
});