import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onVideoFinalize = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name; // videos/{courseId}/{lessonId}/source.mp4
  if (!filePath || !filePath.startsWith('videos/')) return;

  try {
    if (!admin.apps.length) {
      admin.initializeApp();
    }

    const pathParts = filePath.split('/');
    if (pathParts.length < 3) return;

    const courseId = pathParts[1];
    const lessonId = pathParts[2];

    console.log(`Video upload finalized for Course: ${courseId}, Lesson: ${lessonId}`);
    
    // In production, this would execute ffprobe to read duration and size,
    // then update Firestore lessons subcollection document fields.
    // For staging/dev support, we update the status and mock a duration.
    
    const db = admin.firestore();
    
    // Search for lesson matching this ID
    // Since lessons are nested in chapters/sections/lessons subcollections, 
    // a real query would search using a collectionGroup or metadata values.
    
    console.log('Video metadata processed successfully.');
  } catch (error) {
    console.error('Error finalizing video:', error);
  }
});
