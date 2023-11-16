import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { 
    
  } 

  async addObject(id:any,type:string,name:string,forced=false){
    const url: string = 'http://localhost:4200/api/Objects/addOrGetObject';
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

  async deleteObject(id:any,type:string){
    const url: string = 'http://localhost:4200/api/Objects/deleteObject';
    let response = await fetch(url,{
      method: 'POST',
      body: JSON.stringify({
        'id':id,
        "type":type,
      }),
      headers: { "Content-Type": "application/json" }
    });
    let data: any = await response.json();
    return data;
  }

  async deleteRelation(id:any){
    const url: string = 'http://localhost:4200/api/Relations/deleteRelation';
    let response = await fetch(url,{
      method: 'POST',
      body: JSON.stringify({
        'id':id
      }),
      headers: { "Content-Type": "application/json" }
    });
    let data: any = await response.json();
    return data;
  }

  async addRelation(aid:any,relation:string,bid:any,forced=false){
    const url: string = 'http://localhost:4200/api/Relations/addOrGetRelation';
    let response = await fetch(url,{
      method: 'POST',
      body: JSON.stringify({
        'aid':aid,
        "relation":relation,
        "bid":bid,
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

  async listObject(type:any,id:any){
    
    const url: string = 'http://localhost:4200/api/Objects';
    let response = await fetch(url,{
      method: 'POST',
      body: JSON.stringify({
        "type":type,
        "id":id
      }),
      headers: { "Content-Type": "application/json" }
    });
    let data: any = await response.json();
    return data;
    
  }

  async uploadFile(path:string,name:string,fileData:any){
    const url: string = 'http://localhost:4200/api/multimedia/upload';
    let response = await fetch(url,{
      method: 'POST',
      body: JSON.stringify({
        'path':path,
        "name":name,
        "fileData":fileData
      }),
      headers: { "Content-Type": "application/json" }
    });
    let data: any = await response.json();
    return data;
  }

  async getFileStructure(type:string){
    const url: string = 'http://localhost:4200/api/multimedia';
    let response = await fetch(url,{
      method: 'POST',
      body: JSON.stringify({
        'type':type
      }),
      headers: { "Content-Type": "application/json" }
    });
    let data: any = await response.json();
    return data;
  }

}
