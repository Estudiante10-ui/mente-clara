import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { where } from 'firebase/firestore';

export type GuidedSession = {
  id: string;
  title: string;
  subtitle?: string;
  minutes: number;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  category: 'Respiración' | 'Relajación' | 'Mindfulness' | 'Sueño';
  description: string;
};

@Injectable({ providedIn: 'root' })
export class SessionsService {
  private db = getFirestore();

  async listSessions(): Promise<GuidedSession[]> {
    const ref = collection(this.db, 'guided_sessions');
    const q = query(ref, orderBy('minutes', 'asc'));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        title: data.title,
        subtitle: data.subtitle ?? '',
        minutes: Number(data.minutes ?? 5),
        level: data.level ?? 'Básico',
        category: data.category ?? 'Mindfulness',
        description: data.description ?? '',
      };
    });
  }

  async getSession(id: string): Promise<GuidedSession | null> {
    const ref = doc(this.db, 'guided_sessions', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data() as any;
    return {
      id: snap.id,
      title: data.title,
      subtitle: data.subtitle ?? '',
      minutes: Number(data.minutes ?? 5),
      level: data.level ?? 'Básico',
      category: data.category ?? 'Mindfulness',
      description: data.description ?? '',
    };
  }

  async seedIfEmpty(): Promise<void> {
    const ref = collection(this.db, 'guided_sessions');
    const snap = await getDocs(ref);
    if (!snap.empty) return;

    const seeds = [
      {
        title: 'Respira en 4-4-6',
        subtitle: 'Baja la ansiedad en minutos',
        minutes: 5,
        level: 'Básico',
        category: 'Respiración',
        description:
          'Inhala 4 segundos, mantén 4 segundos y exhala 6 segundos. Repite por 5 minutos. Enfócate en la exhalación larga para relajar el sistema nervioso.',
      },
      {
        title: 'Relajación muscular progresiva',
        subtitle: 'Tensión → relajación',
        minutes: 8,
        level: 'Intermedio',
        category: 'Relajación',
        description:
          'Recorre el cuerpo por zonas: aprieta 5 segundos y suelta 10 segundos. Comienza por manos, brazos, rostro, hombros, torso, piernas.',
      },
      {
        title: 'Mindfulness: ancla en la respiración',
        subtitle: 'Observa sin juzgar',
        minutes: 10,
        level: 'Básico',
        category: 'Mindfulness',
        description:
          'Lleva tu atención al aire entrando y saliendo. Cuando aparezca un pensamiento, reconócelo y vuelve con amabilidad a la respiración.',
      },
      {
        title: 'Rutina para conciliar el sueño',
        subtitle: 'Cierra el día con calma',
        minutes: 7,
        level: 'Básico',
        category: 'Sueño',
        description:
          'Respira lento, relaja mandíbula y hombros. Visualiza un lugar seguro. Si aparece preocupación, anótala mentalmente para mañana y vuelve a respirar.',
      },
    ];

    for (const s of seeds) {
      await addDoc(ref, s);
    }
  }

  async markCompleted(sessionId: string): Promise<void> {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('No hay sesión iniciada');

    // Documento por usuario + sesión (id estable)
    const ref = doc(this.db, 'user_sessions', `${uid}_${sessionId}`);
    await setDoc(
      ref,
      {
        uid,
        sessionId,
        status: 'completed',
        completedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

    async listCompletedSessionIds(): Promise<Set<string>> {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      if (!uid) return new Set();

      const ref = collection(this.db, 'user_sessions');
      const q = query(ref, where('uid', '==', uid));
      const snap = await getDocs(q);

      return new Set(snap.docs.map(d => d.data()['sessionId']));
  }

    async isSessionCompleted(sessionId: string): Promise<boolean> {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    if (!uid) return false;

    const ref = doc(this.db, 'user_sessions', `${uid}_${sessionId}`);
    const snap = await getDoc(ref);
    return snap.exists();
  }

}
