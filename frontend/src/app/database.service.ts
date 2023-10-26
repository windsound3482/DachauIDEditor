import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { 
    
  } 

  async personList(){
    const url: string = 'http://localhost:4200/api';
    let response = await fetch(url);
    let data: any = await response.json();
    console.log(data)
    return data['data'];
  }
}
