import { User } from '../models/user.model';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function UserNameValidator (userArr: User[]): ValidatorFn {

  return (control: AbstractControl): {[key:string]:boolean}|null => {
    for(let us in userArr){
     if(control.value===userArr[us]['username']){
        return{'unvalid':true};
     }
    }
    return null;
  };
}
