import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase.ts';
import { Lead, LeadActivity, Post, SiteSettings } from '../types/index.ts';

export const firestoreService = {
  // Save or update lead in Firestore
  async saveLead(lead: Lead) {
    const path = `leads/${lead.id}`;
    try {
      await setDoc(doc(db, 'leads', lead.id), {
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email || '',
        configuration: lead.configuration,
        budget: lead.budget || '',
        message: lead.message || '',
        source: lead.source,
        utmSource: lead.utmSource || '',
        utmMedium: lead.utmMedium || '',
        utmCampaign: lead.utmCampaign || '',
        landingPage: lead.landingPage || '/',
        status: lead.status,
        consent: lead.consent ?? true,
        createdAt: lead.createdAt || new Date().toISOString(),
        updatedAt: lead.updatedAt || new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Save activity
  async saveActivity(activity: LeadActivity) {
    const path = `activities/${activity.id}`;
    try {
      await setDoc(doc(db, 'activities', activity.id), {
        id: activity.id,
        leadId: activity.leadId,
        type: activity.type,
        content: activity.content,
        createdAt: activity.createdAt || new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Real-time listener for leads
  subscribeToLeads(onUpdate: (leads: Lead[]) => void, onError?: (err: any) => void) {
    const path = 'leads';
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(100));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(d => d.data() as Lead);
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
        if (onError) onError(error);
      }
    );
  },

  // Save post
  async savePost(post: Post) {
    const path = `posts/${post.id}`;
    try {
      await setDoc(doc(db, 'posts', post.id), {
        ...post,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Save settings
  async saveSettings(settings: SiteSettings) {
    const path = 'settings/default';
    try {
      await setDoc(doc(db, 'settings', 'default'), {
        ...settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};
