import { CanActivateFn } from '@angular/router';
import { getAuth } from 'firebase/auth';

export const authGuard: CanActivateFn = () => {
  const user = getAuth().currentUser;
  return !!user;
};