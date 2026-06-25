import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const aggregateAnalytics = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp();
    }

    const db = admin.firestore();
    
    // Perform simple collections counting to avoid client-side iteration costs
    const usersSnapshot = await db.collection('users').count().get();
    const coursesSnapshot = await db.collection('courses').count().get();

    const data = {
      totalUsers: usersSnapshot.data().count,
      totalCourses: coursesSnapshot.data().count,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.doc('analytics/summary').set(data, { merge: true });
    console.log('Analytics aggregated successfully:', data);
  } catch (error) {
    console.error('Error aggregating analytics:', error);
  }
});
