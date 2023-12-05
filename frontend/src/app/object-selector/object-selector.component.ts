import { Component,Input,Output,EventEmitter } from '@angular/core';
import { MultiMediaList } from '../parameter';
import { DatabaseService } from '../database.service';
import {MatDialog} from '@angular/material/dialog';
import { AddObjectDialogComponent } from '../add-object-dialog/add-object-dialog.component';
import { ComfirmDeleteObjectDialogComponent } from '../comfirm-delete-object-dialog/comfirm-delete-object-dialog.component';

export interface FileElement {
  id?: string;
  isFolder: boolean;
  name: string;
  parent: string;
}

@Component({
  selector: 'app-object-selector',
  templateUrl: './object-selector.component.html',
  styleUrls: ['./object-selector.component.css']
})
export class ObjectSelectorComponent {
  @Input() graphID="Left"
  currentObject={type:"Person",id:null,data:""}
  constructor(
    private service: DatabaseService,
    public dialog: MatDialog
  ) {}
  @Input() set refreshWithType(data:any){
    console.log(data)
    
    this.currentObject=data;
    if (MultiMediaList.includes(data.type)){
      if (data.id=='' || !data.id){
        this.currentRoot=null;
        this.currentPath='';
        this.canNavigateUp = false;
      }
    }
    this.refreshTheGraph(data)
    console.log('here')
    
  }

  objects=null

  refreshTheGraph(object:any){
    this.service.listObject(object.type,object.id).then((data) => {
      data.nodes=data.nodes.filter((item:any)=>
        item.id!=object.id
      );
      this.objects=data.nodes?Object.assign(data.nodes):null;
      
    });
    if (MultiMediaList.includes(object.type) == true )
      this.refreshFileMap(object)
  }
  @Output() nodeChanged= new EventEmitter<any>();

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

  openFile(node:any){
    if (MultiMediaList.includes(node.type))
    {
      
      let path='multimedia/'+node.type+'/'+node.data
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

  refreshFileMap(object:any){
    this.service.getFileStructure(object.type).then((data) => {
      this.map=data;
      console.log(data)
      this.updateFileElementQuery();
    });
  }


  MultiMediaContains():boolean{

    return MultiMediaList.includes(this.currentObject.type)
 }
}
