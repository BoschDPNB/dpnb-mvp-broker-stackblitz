import { Injectable } from '@angular/core';
import { User } from './models/user.model';
import { Address } from './models/address.model';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  private users: User[] = [
   

  ];
  userSubject = new Subject<User[]>();

  emitUsers(){
    this.userSubject.next(this.users.slice());
  }

  addUser(user: User){
    this.users.push(user);
    this.emitUsers();
  }

  constructor(private httpClient: HttpClient) { }


  getUsers(){
    return this.users;
  }

  saveOneUserToServer(user: User) {
    let id = this.users.length; /*TO BE ERASED?????*/ 
    this.httpClient
      .post<User>('https://dpnb-broker.firebaseio.com/users.json', user)
      .subscribe(
        (val) => {
          user.id = val["name"];
        },
        error => {
          console.log('Erreur ! : ' + error);
        },
        () =>{
          console.log('Data saved');
        },
      );
  }

  getUsersFromServer(){
    this.users.splice(0, this.users.length);
    this.httpClient
      .get('https://dpnb-broker.firebaseio.com/users.json')
      .subscribe(
        (response: User[]) => {
          for(let obj in response){
            this.users.push({
              id: obj,
              username: response[obj]['username'],
              password: response[obj]['password'],
              company_name: response[obj]['company_name'],
              company_address: response[obj]['company_address'],
              machines: response[obj]['machines'],
              qualifications: response[obj]['qualifications'],
              role: response[obj]['role'],
              abilities: response[obj]['abilities']
            });
          }
          this.emitUsers();
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      )
  }
/*
  getOneUserFromServer(username: String) : User {
    let user = {username:"",
            password: "",
            company_name: "",
            company_address: {street:'', nb:0, postal_code:0, city:''},
            machines: [""],
            qualifications: [''],
            role: '',
            abilities: ['']
          } as User;
    this.httpClient
      .get('https://dpnb-broker.firebaseio.com/users.json?orderBy="username"&equalTo="coucou"')
      .subscribe(
        (response: User) => {
          console.log(response);
          user = {
            username: response['username'],
            password: response['password'],
            company_name: response['company_name'],
            company_address: response['company_address'],
            machines: response['machines'],
            qualifications: response['qualifications'],
            role: response['role'],
            abilities: response['abilities']
          } as User;   
          console.log(user);         
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      )
    console.log('return', user); 
    return user;
  }
  DOES NOT WORK WHILE THE USER OUTSIDE SUBSCIRBE IS NOT THE SMAE AS THE ONE INSIDE
  */

}
