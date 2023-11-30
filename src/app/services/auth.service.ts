import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  initAuthListener() {
    this.auth.onAuthStateChanged( fuser => {
      console.log(fuser?.email);
      console.log(fuser?.uid);
    } );
  }

  crearUsuario( nombre: string, email: string, password: string ) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  loginUsuario(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    const observable = new Observable( subscriber => {
      const unsubscribe = this.auth.onAuthStateChanged(subscriber);
      return { unsubscribe };
    } ).pipe(
      map(
        fuser => {
          return fuser != null
        }
    ));

    return observable;
  }
}
