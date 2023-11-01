import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkgraphService {

  constructor() { }

  configureData(data:any,markedId:any){
    data.node.map((x:any)=>{
      
      x.data={}
      if (x.type=="Person"){
        x.color="blue";
        x.fontcolor="white";
      }
      else
      {
        x.fontcolor="#f2f2f2";
      }
      if (x.id==markedId)
        x.fontWeight='bold'
      else
        x.fontWeight='normal'
        x.id="Node"+data.graphID+x.id 
    });
    data.links.map((x:any)=>{
      x.id="Link"+data.graphID+x.id
      x.source="Node"+data.graphID+x.source
      x.target="Node"+data.graphID+x.target
      x.color="blue";
    });
    
  }
  
}
