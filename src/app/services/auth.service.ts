import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) { }

  initAuthListener() {
    this.auth.onAuthStateChanged( fuser => {
      console.log(fuser?.email);
      console.log(fuser?.uid);
    } );
  }

  crearUsuario( nombre: string, email: string, password: string ) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then( ({user}) => {
        const newUser = new Usuario(
          user.uid, nombre, user.email
        );

        //! Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore
        const userRef = collection(this.firestore, `${user.uid}/usuario`);

        return addDoc( userRef, { ...newUser } );

      } );
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
