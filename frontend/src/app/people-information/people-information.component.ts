import { Component,Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormControl} from '@angular/forms'
import { AddObjectDialogComponent } from '../add-object-dialog/add-object-dialog.component';
import { NetworkgraphComponent } from '../networkgraph/networkgraph.component';
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
  constructor(public dialog: MatDialog) { }
  typeControlValue=new FormControl('Person');
  NotPropertyList=['Person']
  prevMatSelectValue:any='Person'

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
          this.refreshTypeListEvent.emit(result.data);
          this.currentObjectChange({
            id:null,
            type:result.data,
            data:""
          })
          this.typeControlValue.setValue(result.data);
          
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


  

}
