import { Component ,Input,Output, EventEmitter,ViewChild,TemplateRef} from '@angular/core';
import { DatabaseService } from '../database.service';
import { NetworkgraphService } from '../networkgraph.service';
import { ComfirmDeleteObjectDialogComponent } from '../comfirm-delete-object-dialog/comfirm-delete-object-dialog.component';
import { ConfirmDeleteRelationDialogComponent } from '../confirm-delete-relation-dialog/confirm-delete-relation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { MultiMediaList } from '../parameter';

export interface FileElement {
  id?: string;
  isFolder: boolean;
  name: string;
  parent: string;
}


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
      if (MultiMediaList.includes(object.type)){
        this.service.getFileStructure(object.type).then((data) => {
          this.map=data;
          this.currentRoot=null;
          this.updateFileElementQuery();
        });
      }
      
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


  //fileExplorer System

  private map:FileElement[] = [];

  currentRoot:any=null;
  canNavigateUp = false;
  public fileElements: FileElement[]=[];
  currentPath: string=''

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }

  queryInFolder(folderId: string) {
    const result: FileElement[] = [];
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(JSON.parse(JSON.stringify(element)));
      }
    });
    return result;
  }

  
  updateFileElementQuery() {
    console.log(this.currentRoot)
    this.fileElements = this.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }

  navigateUp() {
    console.log(this.currentPath)
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.map.find(o => o.id === this.currentRoot.parent);;
      this.updateFileElementQuery();
    }
    
    this.currentPath = this.popFromPath(this.currentPath);
    
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }


  openFile(node:any){
    if (MultiMediaList.includes(node.type))
      window.open('api/multimedia/'+node.type+'/'+node.label)
  }

  MultiMediaContains(){
    return MultiMediaList.includes(this.currentObject.type)
  }



}


