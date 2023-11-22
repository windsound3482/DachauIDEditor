import { Component ,Input,Output, EventEmitter,ViewChild,TemplateRef,HostListener} from '@angular/core';
import { DatabaseService } from '../database.service';
import { NetworkgraphService } from '../networkgraph.service';
import { ComfirmDeleteObjectDialogComponent } from '../comfirm-delete-object-dialog/comfirm-delete-object-dialog.component';
import { ConfirmDeleteRelationDialogComponent } from '../confirm-delete-relation-dialog/confirm-delete-relation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { MultiMediaList } from '../parameter';
import { AddObjectDialogComponent } from '../add-object-dialog/add-object-dialog.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
    public dialog: MatDialog,
    private _sanitizer:DomSanitizer
  ) {}
  @Input() graphID="Left"
  nodes=[]
  links=[]
  currentObject={type:"Person",id:null,data:""}

  @Input() set refreshWithType(data:any){
    this.refreshTheGraph(data);
    this.currentObject=data;
    if (MultiMediaList.includes(data.type) && (data.id=='' || !data.id)){
      this.service.getFileStructure(data.type).then((data) => {
        this.currentRoot=null;
        this.currentPath='';
      });
    }
    this.networkgraphView=[window.innerWidth/100*48,window.innerHeight/100*85-150-(this.MultiMediaContains()?250:0)]
    console.log('here')
    
  }

  ngOnInit() {
    this.networkgraphView = [window.innerWidth/100*48,window.innerHeight/100*85-150-(this.MultiMediaContains()?250:0)];
    
  }

  refreshTheGraph(object:any){
    this.service.listObject(object.type,object.id).then((data) => {
      
      this.networkservice.configureData({node:data.nodes,links:data.links,graphID:this.graphID},object.id) as any
      this.nodes=data.nodes?Object.assign(data.nodes):null;
      
      this.links=data.links?Object.assign(data.links):null;
      if (MultiMediaList.includes(object.type) )
        this.refreshFileMap()
      
      
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
    if (node.type=='Picture' || node.type=='pdf'){
      return `<img  height='100' src='api/multimediaThumbnail/${node.type}/${node.label}' alt='${node.label}' >`
    }
    
    return node.label
    // 
  }

  openFile(node:any){
    if (MultiMediaList.includes(node.type))
    {
      
      let path='multimedia/'+node.type+'/'+node.label
      let splitedPath = path.split("/");
      path=splitedPath.slice(0, splitedPath.length - 1).join("/");
      this.currentPath=splitedPath.slice(1, splitedPath.length - 1).join("/") + "/";
      console.log(this.map)
      console.log(path)
      this.currentRoot=this.map.find(o => o.id === path);
      this.canNavigateUp = true;
      this.updateFileElementQuery();
    }
   
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
   
    this.fileElements = this.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }

  navigateUp() {
   
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.map.find(o => o.id === this.currentRoot.parent);
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


  

  MultiMediaContains():boolean{

     return MultiMediaList.includes(this.currentObject.type)
  }

  checkoutFile(element: FileElement){
    let checkpath=(this.currentPath).split(this.currentObject.type+'/')[1]
    this.service.listObject(null,null,checkpath+element.name).then((data) => {
      console.log(data)
      if (data.result){
        this.nodeChanged.emit(data.node)
      }
      else{
        const dialogRef = this.dialog.open(AddObjectDialogComponent);
        
        let instance = dialogRef.componentInstance;
        instance.id=null;
        instance.path= checkpath.slice(0, -1)
        instance.name = element.name;
        instance.type = this.currentObject.type;
        instance.title = this.currentObject.type;
        instance.multimedia=true;
        instance.valueEditDisabled=true;
        instance.PathEditDisabled=true;
        dialogRef.afterClosed().subscribe(result => {
          if (result!=null){
            console.log(result)
            this.nodeChanged.emit(result.data)
          }
        });
      }
    })
  }

  deleteCurrentFile(element: FileElement){
    let checkpath=(this.currentPath).split(this.currentObject.type+'/')[1]
    const dialogRef = this.dialog.open(ComfirmDeleteObjectDialogComponent);
    let instance = dialogRef.componentInstance;
    instance.id = null;
    instance.name = checkpath+element.name;
    instance.type = this.currentObject.type;
    instance.multimedia = true
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result!=null){
        
        this.updateFileElementQuery();

        if (result.exist && this.currentObject.data==(checkpath+element.name))
          
          this.nodeChanged.emit(result.data)
        else
            this.nodeChanged.emit(this.currentObject)
        
      }
    });
  }

  refreshFileMap(){
    this.service.getFileStructure(this.currentObject.type).then((data) => {
      this.map=data;
      console.log(data)
      this.updateFileElementQuery();
    });
  }

  networkgraphView:any=[400,600]


  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.networkgraphView=[window.innerWidth/100*48,window.innerHeight/100*85-150-(this.MultiMediaContains()?250:0)]
  }



}


