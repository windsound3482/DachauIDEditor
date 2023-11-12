import { Component ,Input,Output, EventEmitter,ViewChild,TemplateRef} from '@angular/core';
import { DatabaseService } from '../database.service';
import { NetworkgraphService } from '../networkgraph.service';
import { ComfirmDeleteObjectDialogComponent } from '../comfirm-delete-object-dialog/comfirm-delete-object-dialog.component';
import { ConfirmDeleteRelationDialogComponent } from '../confirm-delete-relation-dialog/confirm-delete-relation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { MultiMediaList } from '../parameter';



@Component({
  selector: 'app-networkgraph',
  templateUrl: './networkgraph.component.html',
  styleUrls: ['./networkgraph.component.css']
})
export class NetworkgraphComponent {
  constructor(
    private service: DatabaseService,
    private networkservice:NetworkgraphService,
    public dialog: MatDialog
  ) {}
  @Input() graphID="Left"
  nodes=[]
  links=[]
  currentObject={type:"Person",id:null,data:""}

  @Input() set refreshWithType(data:any){
    this.refreshTheGraph(data);
    this.currentObject=data;
    
  }

  refreshTheGraph(object:any){
    this.service.listObject(object.type,object.id).then((data) => {
      
      this.networkservice.configureData({node:data.nodes,links:data.links,graphID:this.graphID},object.id) as any
      this.nodes=data.nodes?Object.assign(data.nodes):null;
      
      this.links=data.links?Object.assign(data.links):null;
      console.log(this.nodes)
      
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

  onNodeRightClick(node:any){
    const dialogRef = this.dialog.open(ComfirmDeleteObjectDialogComponent);
    let instance = dialogRef.componentInstance;
    instance.id = node.id.split("Node"+this.graphID)[1];
    instance.name = node.label;
    instance.type = node.type;
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result!=null){
        console.log(result)
        this.nodeChanged.emit(result.data)
      }
    });

  }

  onEdgeRightClick(link:any){
    const dialogRef = this.dialog.open(ConfirmDeleteRelationDialogComponent);
    let instance = dialogRef.componentInstance;
    instance.id = link.id.split("Link"+this.graphID)[1];
    
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result!=null){
        console.log(result)
        this.nodeChanged.emit(this.currentObject)
      }
    });

  }
  tooltip(node:any){
    if (node.type=='Picture'){
      return '<img  width=\'300\' src=\'api/multimedia/'+node.type+'/'+node.label+'\' alt=\' ' +node.label +' \' >'
    }
    
    return node.label
  }

  openFile(node:any){
    if (MultiMediaList.includes(node.type))
      window.open('api/multimedia/'+node.type+'/'+node.label)
  }
}


