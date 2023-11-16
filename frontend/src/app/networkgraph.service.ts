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

  outputData(nodes:any,links:any,graphID:any){
    nodes.map((node:any)=>{
      node.id=node.id.split("Node"+graphID)[1],
      node.type=node.type,
      node.value=node.label
      let listTodelete=['label','data','fontcolor','fontWeight','meta','dimension','position','transform']
      listTodelete.forEach(e => delete node[e]);
    })
    
    links.map((link:any)=>{
      link.aid=link.source.split("Node"+graphID)[1],
      link.relation=link.label,
      link.bid=link.target.split("Node"+graphID)[1],
      link.id=link.id.split("Link"+graphID)[1]
      let listTodelete=['source','target','label','color']
      listTodelete.forEach(e => delete link[e]);

    })
    

  }
  
}
