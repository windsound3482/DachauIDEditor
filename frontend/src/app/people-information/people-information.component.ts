import { Component,Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormControl} from '@angular/forms'
import { AddObjectDialogComponent } from '../add-object-dialog/add-object-dialog.component';
import { ComfirmDeleteObjectDialogComponent } from '../comfirm-delete-object-dialog/comfirm-delete-object-dialog.component';
import { NetworkgraphComponent } from '../networkgraph/networkgraph.component';
import { FileserverService } from '../fileserver.service';
@Component({
  selector: 'app-people-information',
  templateUrl: './people-information.component.html',
  styleUrls: ['./people-information.component.css']
})
export class PeopleInformationComponent  {
  @Input() typeList=[{type:'Person'}];
  @Input() graphID="Left"
  @Output() refreshTypeListEvent = new EventEmitter<string>();
  @Output() onChangeObject = new EventEmitter<any>();
  @ViewChild(NetworkgraphComponent) 
  private networkComponent!: NetworkgraphComponent;

  

  currentObject={type:"Person",id:null,data:""}
  constructor(
      public dialog: MatDialog,
      private fileservice:FileserverService
    ) { }
  typeControlValue=new FormControl('Person');
  NotPropertyList=['Person']
  MultiMediaList=['Picture']
  
  prevMatSelectValue:any='Person'

  addObject(){
    const dialogRef = this.dialog.open(AddObjectDialogComponent);
    let instance = dialogRef.componentInstance;
    instance.id = this.currentObject.id;
    instance.name = this.currentObject.data;
    instance.type = this.currentObject.type;
    instance.title = this.currentObject.type;
    dialogRef.afterClosed().subscribe(result => {
      if (result!=null){
        console.log(result)
        this.currentObjectChange(result.data)
      }
    });
  }

  deleteObject(){
    const dialogRef = this.dialog.open(ComfirmDeleteObjectDialogComponent);
    let instance = dialogRef.componentInstance;
    instance.id = this.currentObject.id;
    instance.name = this.currentObject.data;
    instance.type = this.currentObject.type;
    dialogRef.afterClosed().subscribe(result => {
      if (result!=null){
        console.log(result)
        this.currentObjectChange(result.data)
      }
    });
  }

  refreshRelation(){
    this.networkComponent.refreshTheGraph(this.currentObject);
  }

  public onMatSelectOpen(form:any): void {
    this.prevMatSelectValue = this.typeControlValue.value;
  }

  typeControl(type:any){
    console.log(type)
    if (this.typeControlValue.value=="Add New"){
      this.typeControlValue.setValue(this.prevMatSelectValue);
      const dialogRef = this.dialog.open(AddObjectDialogComponent);
      let instance = dialogRef.componentInstance;
      instance.type = "";
      instance.title = "Property";
      instance.typeEditDisabled=false;
      dialogRef.afterClosed().subscribe(result => {
        if (result!=null){
          console.log(result)
          this.refreshTypeListEvent.emit(result.data.type);
          this.currentObjectChange(result.data)
          this.typeControlValue.setValue(result.data.type);
          
        }
      });
    }
    else{
      this.currentObjectChange({
        id:null,
        type:this.typeControlValue.value as string,
        data:""
      })
    }
  };

  currentObjectChange(newObject:any){
    this.currentObject=newObject;
    this.onChangeObject.emit(newObject);
    this.typeControlValue.setValue(newObject.type);
  }
  refreshType(){
    this.currentObjectChange({
      id:null,
      type:this.typeControlValue.value as string,
      data:""
    })
  }

  downloadCurrentObject(){
    let filename=".json"
    if (this.currentObject.data!="")
      filename=this.currentObject.data+filename
    else
      filename=this.currentObject.type+filename
    this.fileservice.downloadFile(JSON.stringify({
      nodes:this.networkComponent.nodes,
      links:this.networkComponent.links
    }),filename)
  }

  typelistcontains(type:any){
    return this.typeList.some(e => e.type === type)
  }

  multiMediaListContains(){
    return this.MultiMediaList.includes(this.typeControlValue.value as string)
  }

  uploadMultiMedia(file:any){
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      const dialogRef = this.dialog.open(AddObjectDialogComponent);
      let instance = dialogRef.componentInstance;
      instance.id=null;
      instance.name = file.files[0].name;
      instance.type = this.currentObject.type;
      instance.title = this.currentObject.type;
      instance.multimedia=true;
      instance.valueEditDisabled=true;
      instance.multiMediaFile=fileReader.result as string;
      dialogRef.afterClosed().subscribe(result => {
        if (result!=null){
          console.log(result)
          this.currentObjectChange(result.data)
        }
      });
    }
    fileReader.readAsDataURL(file.files[0]);
    
  }


  

}
