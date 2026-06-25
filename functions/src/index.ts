import * as admin from 'firebase-admin';

// Initialize firebase admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

export { onUserCreate } from './onUserCreate';
export { onVideoFinalize } from './onVideoFinalize';
export { aggregateAnalytics } from './aggregateAnalytics';
