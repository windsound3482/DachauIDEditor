import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { 
    
  } 

  async addObject(id:any,type:string,name:string,forced=false){
    const url: string = 'http://localhost:4200/api/Objects/addOrGetObject';
    console.log(JSON.stringify({
      type:type,
      value:name
    }))
    let response = await fetch(url,{
      method: 'POST',
      body: JSON.stringify({
        'id':id,
        "type":type,
        "value":name,
        "forced":forced
      }),
      headers: { "Content-Type": "application/json" }
    });
    let data: any = await response.json();
    return data;
    
  }

  async listTypes(){
    const url: string = 'http://localhost:4200/api/Types';
    let response = await fetch(url,{
      method: 'GET'
    });
    let data: any = await response.json();
    console.log(data)
    return data;
  }
}
