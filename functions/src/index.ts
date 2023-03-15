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

export const getHostUsers = functions.https.onCall(async (data, context) => {
  const userRecords = await admin.auth().listUsers();
  const usersWithUserClaim = userRecords.users.filter((user) =>
    user.customClaims?.role === "host"
  );
  const usersData = usersWithUserClaim.map((user) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  }));

  return usersData;
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

export const setHostCustomClaim = functions.https.onCall(async (data, context) => {
  const userId = data.userId;

  try {
    // Add the custom claim to the user
    await admin.auth().setCustomUserClaims(userId, { host: true });

    // Return success message
    return { success: true };
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'An error occurred while adding custom claim');
  }
});