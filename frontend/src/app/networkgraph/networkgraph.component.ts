import { Component ,Input,Output, EventEmitter,ViewChild,TemplateRef,HostListener} from '@angular/core';
import { DatabaseService } from '../database.service';
import { NetworkgraphService } from '../networkgraph.service';
import { ComfirmDeleteObjectDialogComponent } from '../comfirm-delete-object-dialog/comfirm-delete-object-dialog.component';
import { ConfirmDeleteRelationDialogComponent } from '../confirm-delete-relation-dialog/confirm-delete-relation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { MultiMediaList } from '../parameter';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';




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
    console.log('here')
    
  }

  ngOnInit() {
    this.networkgraphView = [window.innerWidth/100*41,350];
    
  }

  refreshTheGraph(object:any){
    this.service.listObject(object.type,object.id).then((data) => {
      
      this.networkservice.configureData({node:data.nodes,links:data.links,graphID:this.graphID},object.id) as any
      this.nodes=data.nodes?Object.assign(data.nodes):null;
      
      this.links=data.links?Object.assign(data.links):null;
      
      
    });
  }

  @Output() nodeChanged= new EventEmitter<any>();;
  onNodeClick(node:any){
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
  
        this.nodeChanged.emit(this.currentObject)
      }
    });

  }
  tooltip(node:any){
    // if (node.type=='Picture' || node.type=='pdf'){
    //   return `<img  height='100' src='api/multimediaThumbnail/${node.type}/${node.label}' alt='${node.label}' >`
    // }
    
    return node.label
    // 
  }

  MultiMediaContains():boolean{

     return MultiMediaList.includes(this.currentObject.type)
  }

 

  networkgraphView:any=[400,600]


}


