import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase.ts';
import { Lead, LeadActivity, Post, SiteSettings } from '../types/index.ts';

export const firestoreService = {
  // --- LEADS ---
  async saveLead(lead: Lead): Promise<void> {
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

  async deleteLead(leadId: string): Promise<void> {
    const path = `leads/${leadId}`;
    try {
      await deleteDoc(doc(db, 'leads', leadId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async getLeads(): Promise<Lead[]> {
    const path = 'leads';
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(200));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Lead));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  subscribeToLeads(onUpdate: (leads: Lead[]) => void, onError?: (err: any) => void) {
    const path = 'leads';
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(200));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Lead));
        onUpdate(items);
      },
      (error) => {
        console.warn('Firestore leads subscription note:', error.message);
        if (onError) onError(error);
      }
    );
  },

  // --- ACTIVITIES ---
  async saveActivity(activity: LeadActivity): Promise<void> {
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

  async getActivities(leadId?: string): Promise<LeadActivity[]> {
    const path = 'activities';
    try {
      const q = query(collection(db, 'activities'), orderBy('createdAt', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as LeadActivity));
      return leadId ? all.filter(a => a.leadId === leadId) : all;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // --- SITE SETTINGS ---
  async saveSettings(settings: SiteSettings): Promise<void> {
    const path = 'settings/default';
    try {
      await setDoc(doc(db, 'settings', 'default'), {
        ...settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getSettings(): Promise<SiteSettings | null> {
    const path = 'settings/default';
    try {
      const snap = await getDoc(doc(db, 'settings', 'default'));
      if (snap.exists()) {
        return snap.data() as SiteSettings;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  subscribeToSettings(onUpdate: (settings: SiteSettings) => void) {
    return onSnapshot(
      doc(db, 'settings', 'default'),
      (snap) => {
        if (snap.exists()) {
          onUpdate(snap.data() as SiteSettings);
        }
      },
      (error) => {
        console.warn('Firestore settings subscription note:', error.message);
      }
    );
  },

  // --- POSTS ---
  async savePost(post: Post): Promise<void> {
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

  async deletePost(postId: string): Promise<void> {
    const path = `posts/${postId}`;
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async getPosts(): Promise<Post[]> {
    const path = 'posts';
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  subscribeToPosts(onUpdate: (posts: Post[]) => void) {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(100));
    return onSnapshot(
      q,
      (snapshot) => {
        const posts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post));
        onUpdate(posts);
      },
      (error) => {
        console.warn('Firestore posts subscription note:', error.message);
      }
    );
  }
};
