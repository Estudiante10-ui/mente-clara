import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export type ForumPost = {
  id: string;
  message: string;
  createdAt?: any;
};

@Injectable({ providedIn: 'root' })
export class ForumService {
  private db = getFirestore();

  async listPosts(): Promise<ForumPost[]> {
    const ref = collection(this.db, 'forum_posts');
    const q = query(ref, orderBy('createdAt', 'desc'), limit(50));
    const snap = await getDocs(q);

    return snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as any),
    }));
  }

  async createPost(message: string): Promise<void> {
    const auth = getAuth();
    const uid = auth.currentUser?.uid ?? null; // lo guardamos pero no lo mostramos

    const ref = collection(this.db, 'forum_posts');
    await addDoc(ref, {
      message: message.trim(),
      uid,
      createdAt: serverTimestamp(),
    });
  }
}
