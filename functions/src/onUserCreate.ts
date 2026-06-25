import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    // Check if app is initialized
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    
    // Set custom claim default to user
    await admin.auth().setCustomUserClaims(user.uid, { role: 'user' });
    
    console.log(`Successfully assigned claim {role: 'user'} to user ${user.uid}`);
  } catch (error) {
    console.error('Error assigning custom claim:', error);
  }
});
