import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkgraphService {

  constructor() { }

  configureData(data:any){
    data.node.map((x:any)=>{
      x.id="Node"+data.graphID+x.id
      if (x.type=="Person"){
        x.color="blue";
        x.fontcolor="white";
      }
      else
      {
        x.color="#f2f2f2";
      }
       
    });
    data.links.map((x:any)=>{
      x.id="Link"+data.graphID+x.id
      x.source="Node"+data.graphID+x.source
      x.target="Node"+data.graphID+x.target
      x.color="blue";
    });
  }
}
