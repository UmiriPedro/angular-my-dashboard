import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import type { User, UserResponse, UsersResponse } from '@interfaces/req-response';
import { delay, map } from 'rxjs';

interface State {
  users: User[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject( HttpClient );

  // Con el numeral le digo que es privada y no tiene acceso desde el javascript
  // Con el private si tendría acceso en el javascript por más que sea private
  #state = signal<State>({
    loading: true,
    users: []
  });

  public users = computed( () => this.#state().users );
  public loading = computed( () => this.#state().loading );

  constructor() {
    this.http.get<UsersResponse>('https://reqres.in/api/users')
      .pipe( delay(1500) )
      .subscribe( resp => {
        this.#state.set({
          loading: false,
          users: resp.data
        });
    });
  }

  getUserById( id: string ) {
    return this.http.get<UserResponse>(`https://reqres.in/api/users/${ id }`)
      .pipe(
        delay(1500),
        map( resp => resp.data )
      );
  }
}
