import { Injectable } from '@angular/core';
import {
  getFirestore, collection, addDoc, serverTimestamp,
  query, where, orderBy, getDocs, doc, getDoc, updateDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export type Appointment = {
  id: string;
  uid: string;
  email?: string;
  date: string;
  time: string;
  reason: string;
  mode: 'video' | 'llamada';
  notes?: string;
  status: 'pending' | 'confirmed' | 'canceled';
  createdAt?: any;
};

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private db = getFirestore();

  private getUser() {
    const user = getAuth().currentUser;
    if (!user) throw new Error('Debes iniciar sesión');
    return user;
  }

  async create(data: Omit<Appointment, 'id' | 'uid' | 'email' | 'status' | 'createdAt'>) {
    const user = this.getUser();
    const ref = collection(this.db, 'appointments');

    await addDoc(ref, {
      uid: user.uid,
      email: user.email ?? '',
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  }

  async listMine(): Promise<Appointment[]> {
    const user = this.getUser();
    const ref = collection(this.db, 'appointments');
    const q = query(ref, where('uid', '==', user.uid), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);

    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }

  async getById(id: string): Promise<Appointment | null> {
    const ref = doc(this.db, 'appointments', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as any) };
  }

  async cancel(id: string) {
    const ref = doc(this.db, 'appointments', id);
    await updateDoc(ref, { status: 'canceled' });
  }
}
