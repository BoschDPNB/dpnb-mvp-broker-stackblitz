import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service'

@Injectable()
export class AuthGuardService {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean{
    return new Promise(
      (resolve, reject)=>{
        if(this.authService.getStatus()){
          resolve(true);
        }
        else{
          this.router.navigate(['/auth']);
          window.alert('You first need to log in');
          resolve(false);
        }
      }
    )
  }

}