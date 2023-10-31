import { Component ,Input,Output, EventEmitter} from '@angular/core';
import { DatabaseService } from '../database.service';
import { NetworkgraphService } from '../networkgraph.service';
import { DagreLayout } from '@swimlane/ngx-graph'



@Component({
  selector: 'app-networkgraph',
  templateUrl: './networkgraph.component.html',
  styleUrls: ['./networkgraph.component.css']
})
export class NetworkgraphComponent {
  constructor(
    private service: DatabaseService,
    private networkservice:NetworkgraphService
  ) {}
  @Input() graphID="Left"
  nodes=[]
  links=[]
  @Input() set refreshWithType(data:any){
    this.refreshTheGraph(data);
    
  }

  refreshTheGraph(data:any){
    this.service.listObject(data.type,data.id).then((data) => {
      console.log(data);
      this.networkservice.configureData({node:data.nodes,links:data.links,graphID:this.graphID})
      this.nodes=data.nodes?Object.assign(data.nodes):null;
      
      this.links=data.links?Object.assign(data.links):null;
    
      
    });
  }

  @Output() nodeChanged= new EventEmitter<any>();;
  onNodeClick(node:any){
    console.log(node)
    this.nodeChanged.emit(
      {
        type:node.type,
        data:node.label,
        id:node.id.split("Node"+this.graphID)[1]
      }
    )
  }
}


